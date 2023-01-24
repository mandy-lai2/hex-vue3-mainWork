import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js";
import pagination from "./components/pagination.js";
import modalProduct from "./components/modalProduct.js";
import delProduct from "./components/delProduct.js";
let productModal = "";
let delCheckModal = "";
const app = createApp({
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "mandyapi",
      products: [],
      tempProduct: {},
      pagination: {},
      imgUrl: "imgurl",
      inputImg: "",
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
          window.location = "login.html";
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
      if (effect === "new") {
        this.tempProduct = { imagesUrl: [] };
        productModal.show();
      } else if (effect === "edit") {
        this.tempProduct = { ...product };
        productModal.show();
      } else if (effect === "del") {
        this.tempProduct = { ...product };
        delCheckModal.show();
      }
    },
    //關閉modal
    closeModal(modal) {
      if (modal === "modal") {
        productModal.hide();
      } else if (modal === "delModal") {
        delCheckModal.hide();
      }
    },
    imgUpload(e) {
      const file = e.target.files[0];
      // console.log(file);
      const formData = new FormData();
      formData.append("file-to-upload", file);
      // console.dir(formData);
      // console.log(formData.get('file-to-upload'));
      axios
        .post(`${this.apiUrl}/api/${this.apiPath}/admin/upload`, formData)
        .then((res) => {
          // console.log(res.data);
          alert(`${res.data.success ? "圖片上傳成功" : "失敗"}`);
          this.imgUrl = res.data.imageUrl;
          this.inputImg = "";
        })
        .catch((err) => {
          console.log(err.response.message);
        });
    },
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.checkUser();
    productModal = new bootstrap.Modal(document.querySelector("#modal"));
    delCheckModal = new bootstrap.Modal(
      document.querySelector("#delCheckModal")
    );
  },
  components: {
    pagination,
    modalProduct,
    delProduct,
  },
});
app.mount("#app");
