<template>
    <div>
        <h2>Déconnexion en cours...</h2>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from "@/stores/shop.js"

const router = useRouter()
const shopStore = useShopStore()

onMounted(() => {
    setTimeout(() => {
        shopStore.shopUser = null
        router.push('/shop')
    }, 1000)
})
</script>
