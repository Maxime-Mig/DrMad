<template>
  <div>
    <NavBar :titles="navItems" @menu-clicked="goTo" />
  </div>
  <h1>Welcome to DrMad app</h1>
  <router-view></router-view>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useShopStore } from "@/stores/shop.js";
import NavBar from "@/components/NavBar.vue";
import { useRouter } from "vue-router";

const router = useRouter()
const shopStore = useShopStore()

const navItems = computed(() => {
  const items = [];
  if (!shopStore.shopUser) {
    items.push({ text: "Login", color: "blue", path: "/shop/login" });
  } else {
    items.push({ text: "Logout", color: "red", action: logout });
    items.push({ text: "Acheter", color: "green", path: "/shop/buy" });
    items.push({ text: "Payer", color: "blue", path: "/shop/pay" });
    items.push({ text: "Mes commandes", color: "orange", path: "/shop/orders" });
  }
  return items;
})

function logout() {
  shopStore.shopUser = null;
  router.push('/shop');
}

function goTo(index) {
  const item = navItems.value[index];
  if (item.action) {
    item.action();
  } else if (item.path) {
    router.push(item.path);
  }
}
</script>

<style scoped></style>
