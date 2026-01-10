<template>
    <div>
        <h2>Déconnexion du compte...</h2>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBankStore } from "@/stores/bank.js"

const router = useRouter()
const bankStore = useBankStore()

onMounted(() => {
    setTimeout(() => {
        bankStore.accountNumberState = 0
        bankStore.accountAmount = 0
        bankStore.accountTransactions = []
        bankStore.accountId = null
        router.push('/bank/home')
    }, 1000)
})
</script>
