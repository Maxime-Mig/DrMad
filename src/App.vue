<template>
  <div>
    <NavBar :titles="title" @menu-clicked="goTo" />
  </div>
  <h1>Welcome to DrMad app</h1>
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from "vue";
import { useShopStore } from "@/stores/shop.js";
import NavBar from "@/components/NavBar.vue";
import { useRouter } from "vue-router";

const router = useRouter()
const shopStore = useShopStore()
const title = [{ text: "Shop Login", color: "blue" }, { text: "Viruses", color: "green" }, { text: "Compte bancaire", color: "red" }]

// Dès que l'appli est lancée, on va chercher la liste des virus pour la stocker dans le store
onMounted(() => {
  shopStore.getAllViruses()
})

function goTo(linkIndex) {
  if (linkIndex === 0) {
    router.push('/shop/login')
  } else if (linkIndex === 1) {
    router.push('/shop/items')
  } else if (linkIndex === 2) {
    router.push('/bank/account')
  }
}
</script>

<style scoped></style>
