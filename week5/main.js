const { createApp } = Vue;
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'mandyapi';

VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 輸入文字時，就立即進行驗證
});

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
      cart: {},
      loadingId: '',
      loader:"",
      user:{
        email:'',
        name:'',
        tel:'',
        address:'',
        message:''
      },
      isOpen:true,
      isButton:false
    };
  },
  methods: {
    getProducts() {
      axios
        .get(`${apiUrl}/api/${apiPath}/products/all`)
        .then((res) => {
          this.products = res.data.products;
          // console.log('全部產品:', this.products);
          this.loader.hide();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getProduct(id) {
      this.loadingId = id;
      this.isButton=true;
      axios
        .get(`${apiUrl}/api/${apiPath}/product/${id}`)
        .then((res) => {
          this.tempProduct = res.data.product;
          // console.log('單一產品:', this.tempProduct);
          this.$refs.productModal.openModal();
          this.loadingId = '';
          this.isButton=false;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    addCart(product_id, qty = 1) {
      this.loadingId = product_id;
      this.isButton=true;
      const data = {
        product_id,
        qty,
      };
      axios
        .post(`${apiUrl}/api/${apiPath}/cart`, { data })
        .then((res) => {
          // alert(res.data.message);
          this.getCart();
          this.loadingId = '';
          
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getCart() {
      axios
        .get(`${apiUrl}/api/${apiPath}/cart`)
        .then((res) => {
          // console.log('購物車:', res.data.data);
          this.cart = res.data.data;
          if(this.cart.carts.length){
            this.isOpen=false;
          }else{
            this.isOpen=true;
          }
          this.isButton=false;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    updateCart(id, product_id, qty) {
      if(qty < 0) qty=0;
      const data = {
        product_id,
        qty,
      };
      // console.log(id, product_id, qty);
      axios
        .put(`${apiUrl}/api/${apiPath}/cart/${id}`, { data })
        .then((res) => {
          alert(res.data.message);
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    delCart(id) {
      this.loadingId = id;
      this.isButton=true;
      axios
        .delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
        .then((res) => {
          alert(res.data.message);
          this.getCart();
          this.loadingId = '';
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    delAllCarts() {
      this.loader=this.$loading.show();
      
      axios
        .delete(`${apiUrl}/api/${apiPath}/carts`)
        .then((res) => {
          // alert(res.data.message);
          this.loader.hide();
          this.getCart();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '須為正確的手機號碼格式'
    },
    onSubmit(){
      // console.log(this.user);
      this.$refs.form.resetForm();
      this.delAllCarts();
      alert('成功送出')
    }
  },
  mounted() {
    this.getProducts();
    this.getCart();
    this.loader=this.$loading.show();
  },
});

app.component('userProductModal', {
  props: ['product'],
  data() {
    return {
      productModal: '',
      qty: 1,
    };
  },
  template: '#userProductModal',
  methods: {
    openModal() {
      this.productModal.show();
    },
    modalAddCart() {
      this.$emit('addCart', this.product.id, this.qty);
      this.productModal.hide();
      this.qty = 1
    },
  },
  mounted() {
    this.productModal = new bootstrap.Modal(this.$refs.modal);
  },
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.use(VueLoading.LoadingPlugin);
app.mount('#app');
