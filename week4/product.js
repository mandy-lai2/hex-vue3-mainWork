import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';
let productModal = '';
let delCheckModal = '';
const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'mandyapi',
      products: [],
      tempProduct: {},
      pagination: {},
      imgUrl:'imgurl',
      inputImg:""
    };
  },
  methods: {
    checkUser() {
      axios
        .post(`${this.apiUrl}/api/user/check`)
        .then((res) => {
          this.getProducts();
        })
        .catch((error) => {
          alert(error.data.message);
          window.location = 'login.html';
        });
    },
    getProducts(page = 1) {
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`)
        .then((res) => {
          const { pagination, products } = res.data;
          this.products = products;
          this.pagination = pagination;
        })
        .catch((error) => {
          console.log(error.data.message);
        });
    },
    // 開啟modal
    OpenModal(effect, product) {
      if (effect === 'new') {
        this.tempProduct = { imagesUrl: [] };
        productModal.show();
      } else if (effect === 'edit') {
        this.tempProduct = { ...product };
        productModal.show();
      } else if (effect === 'del') {
        this.tempProduct = { ...product };
        delCheckModal.show();
      }
    },
    imgUpload(e){
      const file= e.target.files[0];
      // console.log(file);
      const formData = new FormData();
      formData.append('file-to-upload', file);
      // console.dir(formData);
      // console.log(formData.get('file-to-upload'));
      axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/upload`, formData)
      .then((res)=>{
        // console.log(res.data);
        alert(`${res.data.success? '圖片上傳成功' : '失敗'}`);
        this.imgUrl=res.data.imageUrl;
        this.inputImg="";
      }).catch((err)=>{
        console.log(err.response.message);
      })
    }
   
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common['Authorization'] = token;
    this.checkUser();
    // productModal = new bootstrap.Modal(document.querySelector('#modal'));
    // delCheckModal = new bootstrap.Modal(
    //   document.querySelector('#delCheckModal')
    // );
  },
});

app.component('pagination', {
  props: ['pages'],
  template: '#pagination',
  methods: {
    emitPage(page) {
      this.$emit('emitPages', page);
    },
  },
});
app.component('modalProduct',{
  props:['tempProduct'],
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'mandyapi',
    }
  },
  template: '#updateProduct',
  mounted() {
    productModal = new bootstrap.Modal(document.querySelector('#modal'));
  },
  methods: {
    // 新增資料或更新
    updateProduct(effect) {
      let url = '';
      let type = '';
      if (effect === 'new') {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
        type = 'post';
      } else if (effect === 'edit') {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        type = 'put';
      }
      axios[type](url, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          // this.getProducts();
          this.$emit('getProducts')
        })
        .catch((error) => {
          alert(error.data.message);
        });

      productModal.hide();
    },

    addImage() {
      this.tempProduct.imagesUrl
        ? this.tempProduct.imagesUrl.push('')
        : (this.tempProduct.imagesUrl = ['']);
    },
    removeImage(key) {
      this.tempProduct.imagesUrl.splice(key, 1);
    },

  },
})
app.component('delProduct',{
  props:['tempProduct'],
  template:'#deleteProduct',
  mounted() {
    delCheckModal = new bootstrap.Modal(document.querySelector('#delCheckModal'));
  },
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'mandyapi',
    }
  },
  methods: {
     // 刪除商品
     delProduct() {
      axios
        .delete(
          `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
        )
        .then((res) => {
          delCheckModal.hide();
          alert(res.data.message);
          this.$emit('getProducts')
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
  },
})

app.mount('#app');
