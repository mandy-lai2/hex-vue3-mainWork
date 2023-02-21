<template>
  <div class="container text-center">
    <h3>後台頁面</h3>
    <nav class="navbar navbar-expand-lg bg-light mb-5">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">往前台</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <router-link class="nav-link" to="/admin/products"
              >後台產品管理</router-link>
            <router-link class="nav-link" to="/admin/orders"
              >後台訂單管理</router-link>
              <a href="#" class="nav-link ms-2" @click.prevent="logout">登出</a>
          </div>
        </div>
      </div>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
const { VITE_API } = import.meta.env
export default {
  data () {
    return {}
  },
  methods: {
    checkUser () {
      this.$http
        .post(`${VITE_API}/api/user/check`)
        .then((res) => {
          console.log(res.data)
        })
        .catch((error) => {
          if (!error.response.data.success) {
            this.$router.push('/login')
          }
        })
    },
    logout () {
      document.cookie = `userToken=; expires=${new Date()};`
      this.$router.push('/login')
    }
  },
  mounted () {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)userToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    this.$http.defaults.headers.common.Authorization = token
    this.checkUser()
  }
}
</script>
