// 產品資料格式
// products: [
//   {
//     category: "甜甜圈",
//     content: "尺寸：14x14cm",
//     description: "濃郁的草莓風味，中心填入滑順不膩口的卡士達內餡，帶來滿滿幸福感！",
//     id: "-L9tH8jxVb2Ka_DYPwng",
//     is_enabled: 1,
//     origin_price: 150,
//     price: 99,
//     title: "草莓莓果夾心圈",
//     unit: "個",
//     num: 10,
//     imageUrl: "https://images.unsplash.com/photo-1583182332473-b31ba08929c8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NzR8fGRvbnV0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60",
//     imagesUrl: [
//       "https://images.unsplash.com/photo-1626094309830-abbb0c99da4a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2832&q=80",
//       "https://images.unsplash.com/photo-1559656914-a30970c1affd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTY0fHxkb251dHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"
//     ]
//   }
// ]
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';
let productModal = '';
let delCheckModal = '';
const app = {
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'mandyapi',
      products: [],
      tempProduct: {},
      // 雙向綁定時，物件裡的屬性可不寫，當input輸入時資料會自動加入
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
    getProducts() {
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((error) => {
          console.log(error.data.message);
        });
    },
    // newProduct(){
    //   this.tempProduct={"imagesUrl": []}
    //   productModal.show();
    // },
    // editProduct(product){
    //   this.tempProduct={...product};
    //   productModal.show();
    // },
    // deleteCheck(product){
    //   this.tempProduct={...product};
    //   delCheckModal.show();
    // },

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
    // 新增資料或更新
    updateProduct(effect) {
      let url = '';
      let type = '';
      if (effect === 'new') {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
        type = 'post';
        // axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/product`,{data: this.tempProduct})
        // .then((res)=>{
        //   alert(res.data.message);
        //   this.getProducts();
        // })
        // .catch(error=>{
        //   alert(error.data.message);
        // })
      } else if (effect === 'edit') {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        type = 'put';
        // axios.put(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`,{data: this.tempProduct})
        // .then((res)=>{
        //   alert(res.data.message);
        //   this.getProducts();
        // })
        // .catch(error=>{
        //   alert(error.data.message);
        // })
      }
      axios[type](url, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          this.getProducts();
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

    // 刪除商品
    delProduct() {
      axios
        .delete(
          `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
        )
        .then((res) => {
          this.getProducts();
          delCheckModal.hide();
          alert(res.data.message);
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common['Authorization'] = token;
    this.checkUser();
    productModal = new bootstrap.Modal(document.querySelector('#modal'));
    delCheckModal = new bootstrap.Modal(
      document.querySelector('#delCheckModal')
    );
  },
};
createApp(app).mount('#app');
