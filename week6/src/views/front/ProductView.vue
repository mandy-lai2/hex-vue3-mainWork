<template>
  <div class="row">
    <div class="col-sm-6">
      <img class="img-fluid" :src="tempProduct.imageUrl" alt="" />
    </div>
    <div class="col-sm-6" text-start>
      <span class="badge bg-primary rounded-pill">{{ tempProduct.category }}</span>
      <p>商品描述：{{ tempProduct.description }}</p>
      <p>商品內容：{{ tempProduct.content }}</p>
      <div class="h5" v-if="tempProduct.price === tempProduct.origin_price">
        {{ tempProduct.price }} 元
      </div>
      <div v-else>
        <del class="h6">原價 {{ tempProduct.origin_price }} 元</del>
        <div class="h5">現在只要 {{ tempProduct.price }} 元</div>
      </div>
      <div>
        <div class="input-group">
          <input
            type="number"
            class="form-control"
            min="1"
            v-model.number="qty"
          />
          <button type="button" class="btn btn-primary" @click="addCart">
            加入購物車
          </button>
        </div>
      </div>
    </div>
    <!-- col-sm-6 end -->
  </div>
</template>
<script>
const { VITE_API, VITE_APIPATH } = import.meta.env
export default {
  data () {
    return {
      tempProduct: {},
      qty: 1
    }
  },
  methods: {
    getProduct () {
      const id = this.$route.params.id
      console.log(id)
      this.$http
        .get(`${VITE_API}/api/${VITE_APIPATH}/product/${id}`)
        .then((res) => {
          this.tempProduct = res.data.product
          console.log('單一產品:', this.tempProduct)
          // this.$refs.productModal.openModal()
          // this.loadingId = ''
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    addCart (id) {
      // this.loadingId = id
      // this.isButton = true
      const data = {
        product_id: this.tempProduct.id,
        qty: this.qty
      }
      console.log(data)
      this.$http
        .post(`${VITE_API}/api/${VITE_APIPATH}/cart`, { data })
        .then((res) => {
          // this.loadingId = ''
          alert(res.data.message)
          // this.isButton = false
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    }

  },
  mounted () {
    this.getProduct()
  }
}
</script>
