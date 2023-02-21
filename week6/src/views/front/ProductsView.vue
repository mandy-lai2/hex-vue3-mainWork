<template>
  <table class="table align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td style="width: 200px">
                  <div
                    style="
                      height: 100px;
                      background-size: cover;
                      background-position: center;
                    "
                    :style="{backgroundImage: `url(${product.imageUrl})`}"
                  ></div>
                </td>
                <td>{{ product.title}}</td>
                <td>
                  <div class="h5" v-if="product.price === product.origin_price">{{ product.price }} 元</div>
                  <div v-else>
                    <del class="h6">原價 {{ product.origin_price }} 元</del>
                    <div class="h5">現在只要 {{ product.price }} 元</div>
                  </div>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <!-- <button type="button" class="btn btn-outline-secondary" @click="getProduct(product.id)" :class="{disabled: isButton}">
                      <i class="fas fa-spinner fa-pulse" v-if="loadingId === product.id"></i>
                      查看更多
                    </button> -->
                    <router-link :to="`/product/${product.id}`" class="btn btn-outline-secondary">查看更多</router-link>
                    <button type="button" class="btn btn-outline-danger" @click="addCart(product.id)" :class="{disabled: isButton}">
                      <i class="fas fa-spinner fa-pulse"  v-if="loadingId === product.id"></i>
                      加到購物車
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
</template>
<script>
const { VITE_API, VITE_APIPATH } = import.meta.env
export default {
  data () {
    return {
      products: [],
      cart: {},
      loadingId: '',
      isButton: false

    }
  },
  methods: {
    getProducts () {
      this.$http.get(`${VITE_API}/api/${VITE_APIPATH}/products/all`)
        .then((res) => {
          this.products = res.data.products
          // console.log('全部產品:', this.products);
          // this.loader.hide();
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    addCart (id, qty = 1) {
      this.loadingId = id
      this.isButton = true
      const data = {
        product_id: id,
        qty
      }
      this.$http
        .post(`${VITE_API}/api/${VITE_APIPATH}/cart`, { data })
        .then((res) => {
          this.loadingId = ''
          alert(res.data.message)
          this.isButton = false
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    }

  },
  mounted () {
    this.getProducts()
  }
}
</script>
