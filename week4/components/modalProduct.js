export default {
  props: ["tempProduct"],
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "mandyapi",
    };
  },
  template: "#updateProduct",
  methods: {
    // 新增資料或更新
    updateProduct(effect) {
      let url = "";
      let type = "";
      if (effect === "new") {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
        type = "post";
      } else if (effect === "edit") {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        type = "put";
      }
      axios[type](url, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          // this.getProducts();
          this.$emit("getProducts");
          this.$emit("closeModal", "modal");
          // productModal.hide();
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },

    addImage() {
      this.tempProduct.imagesUrl
        ? this.tempProduct.imagesUrl.push("")
        : (this.tempProduct.imagesUrl = [""]);
    },
    removeImage(key) {
      this.tempProduct.imagesUrl.splice(key, 1);
    },
  },
};
