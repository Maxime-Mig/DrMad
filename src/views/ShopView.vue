<template>
  <div>
    <h1>Boutique</h1>
    <NavBar :links="navItems">
      <template #nav-button="{ label, link }">
        <span :style="{ color: link.color }">{{ label }}</span>
      </template>
    </NavBar>
    <router-view name="shopmain"></router-view>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useShopStore } from "@/stores/shop.js";
import NavBar from "@/components/NavBar.vue";

const shopStore = useShopStore()

const navItems = computed(() => {
  const items = [];
  if (!shopStore.shopUser) {
    items.push({ label: "Login", color: "blue", to: "/shop/login" });
  } else {
    items.push({ label: "Logout", color: "red", to: "/shop/logout" });
    items.push({ label: "Acheter", color: "green", to: "/shop/buy" });
    items.push({ label: "Payer", color: "blue", to: "/shop/pay" });
    items.push({ label: "Mes commandes", color: "orange", to: "/shop/orders" });
  }
  return items;
})
</script>