<template>
  <div>
    <h1>Login</h1>

    <span>login</span><input v-model="login">
    <span>password</span><input v-model="password">
    <button @click="handleLogin">Login</button>
    <p v-if="errorMessage" style="color:red">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useShopStore } from "@/stores/shop.js";

const login = ref("");
const password = ref("");
const errorMessage = ref("");
const shopStore = useShopStore();
const router = useRouter();

async function handleLogin() {
  errorMessage.value = "";
  await shopStore.shopLogin({ login: login.value, password: password.value });
  console.log(shopStore.shopUser);
  if (!!shopStore.shopUser) {
    router.push("/shop/buy");
  } else {
    errorMessage.value = "Login ou mot de passe incorrect";
  }
}
</script>
