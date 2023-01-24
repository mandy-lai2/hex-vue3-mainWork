export default {
  props: ["tempProduct"],
  template: "#deleteProduct",
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "mandyapi",
    };
  },
  methods: {
    // 刪除商品
    delProduct() {
      axios
        .delete(
          `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
        )
        .then((res) => {
          // delCheckModal.hide();
          alert(res.data.message);
          this.$emit("getProducts");
          this.$emit("closeModal", "delModal");
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
  },
};
