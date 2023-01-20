import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js";
const app = {
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      user: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      axios
        .post(`${this.apiUrl}/admin/signin`, this.user)
        .then((res) => {
          // console.log(res.data)
          const { token, expired } = res.data;
          document.cookie = `userToken=${token}; expires=${new Date(expired)};`;
          window.location = "products.html";
        })
        .catch((error) => {
          // console.log(error.data);
          alert(error.data.message);
        });
    },
  },
};
createApp(app).mount("#app");
