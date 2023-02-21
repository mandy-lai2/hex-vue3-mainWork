<template>
<div class="container text-center">
  <h3>前台頁面</h3>
  <nav class="navbar navbar-expand-lg bg-light mb-5">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">Home</router-link>
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
          <router-link class="nav-link" to="/about">關於我們</router-link>
          <router-link class="nav-link" to="/products">我的產品</router-link>
          <router-link class="nav-link" to="/carts">購物車</router-link>
  <router-link class="nav-link" to="/admin/products">後台</router-link>
        </div>
      </div>
    </div>
  </nav>
  <router-view></router-view>
  </div>
</template>
