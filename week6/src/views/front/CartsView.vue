<template>
  <div v-if="cart.final_total">
    <div class="text-end">
      <button
        class="btn btn-outline-danger"
        type="button"
        @click="delAllCarts"
        :class="{ disabled: isButton }"
      >
        清空購物車
      </button>
    </div>
    <table class="table align-middle">
      <thead>
        <tr>
          <th></th>
          <th>品名</th>
          <th style="width: 150px">數量/單位</th>
          <th>單價</th>
          <th style="width: 130px"></th>
        </tr>
      </thead>
      <tbody>
        <template v-if="cart.carts">
          <tr v-for="item in cart.carts" :key="item.id">
            <td>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="delCart(item.id)"
                :class="{ disabled: isButton }"
              >
                <i
                  class="fas fa-spinner fa-pulse"
                  v-if="loadingId === item.id"
                ></i>
                x
              </button>
            </td>
            <td>
              {{ item.product.title }}
              <div class="text-success" v-if="item.coupon">已套用優惠券</div>
            </td>
            <td>
              <div class="input-group input-group-sm">
                <div class="input-group mb-3">
                  <input
                    min="1"
                    type="number"
                    class="form-control"
                    v-model.number="item.qty"
                    @change="updateCart(item.id, item.product.id, item.qty)"
                  />
                  <span class="input-group-text" id="basic-addon2">{{
                    item.product.unit
                  }}</span>
                </div>
              </div>
            </td>
            <td>{{ item.product.price }}</td>
            <td class="text-end">
              <small class="text-success">折扣價：</small>
              {{ item.final_total }}
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4" class="text-end">總計</td>
          <td class="text-end">{{ cart.total }}</td>
        </tr>
        <tr>
          <td colspan="4" class="text-end text-success">折扣價</td>
          <td class="text-end text-success">{{ cart.final_total }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
  <div v-else>
    <h3 class="text-success mt-4">目前購物車沒有商品喔!</h3>
  </div>

  <!-- 表單 -->
  <div class="my-5 row justify-content-center">
          <v-form ref="form" class="col-md-6 text-start" v-slot="{ errors }"  @submit="onSubmit">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <v-field
                id="email"
                name="email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors['email'] }"
                placeholder="請輸入 Email" rules="email|required"
                v-model="user.email"
              ></v-field>
              <error-message
                name="email"
                class="invalid-feedback"
              ></error-message>
            </div>

            <div class="mb-3">
              <label for="name" class="form-label">收件人姓名</label>
              <v-field
                id="name"
                name="姓名"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['姓名'] }"
                placeholder="請輸入姓名"
                rules="required"
                v-model="user.name"
              ></v-field>
              <error-message
                name="姓名"
                class="invalid-feedback"
              ></error-message>
            </div>

            <div class="mb-3">
              <label for="tel" class="form-label">收件人電話</label>
              <v-field
                id="tel"
                name="電話"
                type="tel"
                class="form-control"
                :class="{ 'is-invalid': errors['電話'] }"
                placeholder="請輸入電話"
                :rules="isPhone"
                v-model="user.tel"
              ></v-field>
              <error-message
                name="電話"
                class="invalid-feedback"
              ></error-message>
            </div>

            <div class="mb-3">
              <label for="address" class="form-label">收件人地址</label>
              <v-field
                id="address"
                name="地址"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors['地址'] }"
                placeholder="請輸入地址"
                rules="required"
                v-model="user.address"
              ></v-field>
              <error-message
                name="地址"
                class="invalid-feedback"
              ></error-message>
            </div>
            <div class="mb-3">
              <label for="message" class="form-label">留言</label>
              <v-field
                as="textarea"
                id="message"
                name="留言"
                class="form-control"
                cols="30"
                rows="10"
                v-model="user.message"
              ></v-field>

            </div>
            <div class="text-end">
              <button type="submit" class="btn btn-danger" :class="{disabled: isOpen}">送出訂單</button>
            </div>
          </v-form>
        </div>
</template>
<script>
const { VITE_API, VITE_APIPATH } = import.meta.env
export default {
  data () {
    return {
      cart: {},
      loadingId: '',
      user: {
        email: '',
        name: '',
        tel: '',
        address: '',
        message: ''
      },
      isOpen: true,
      isButton: false
    }
  },
  methods: {
    getCart () {
      this.$http
        .get(`${VITE_API}/api/${VITE_APIPATH}/cart`)
        .then((res) => {
          // console.log('購物車:', res.data.data);
          this.cart = res.data.data
          if (this.cart.carts.length) {
            this.isOpen = false
          } else {
            this.isOpen = true
          }
          this.isButton = false
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    updateCart (id, productId, qty) {
      if (qty < 0) qty = 0
      const data = {
        product_id: productId,
        qty
      }
      // console.log(id, product_id, qty);
      this.$http
        .put(`${VITE_API}/api/${VITE_APIPATH}/cart/${id}`, { data })
        .then((res) => {
          alert(res.data.message)
          this.getCart()
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    delCart (id) {
      this.loadingId = id
      this.isButton = true
      this.$http
        .delete(`${VITE_API}/api/${VITE_APIPATH}/cart/${id}`)
        .then((res) => {
          alert(res.data.message)
          this.getCart()
          this.loadingId = ''
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    delAllCarts () {
      // this.loader = this.$loading.show()
      this.isButton = true
      this.$http
        .delete(`${VITE_API}/api/${VITE_APIPATH}/carts`)
        .then((res) => {
          // alert(res.data.message);
          // this.loader.hide()
          this.isButton = false
          this.getCart()
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    isPhone (value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '須為正確的手機號碼格式'
    },
    onSubmit () {
      console.log(this.user)
      this.$refs.form.resetForm()
      this.delAllCarts()
      alert('成功送出')
    }
  },
  mounted () {
    this.getCart()
    // console.log(VeeValidate)
  }
}
</script>
