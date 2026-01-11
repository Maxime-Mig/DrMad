<template>
    <div class="shop-pay">
        <h2>Paiement de la commande</h2>
        <div v-if="order">
            <p>UUID Commande: {{ order.uuid }}</p>
            <p>
                <span>Total à payer: {{ order.total }} €</span>
                <span style="margin-left: 20px; font-style: italic;">Date: {{ new Date(order.date.$date || order.date).toLocaleDateString()
                    }}</span>
            </p>

            <div>
                <label>UUID Transaction Bancaire: </label>
                <input type="text" v-model="transactionUuid">
            </div>

            <button @click="payOrder">Payer</button>
            <button @click="cancelOrder">Annuler</button>
        </div>
        <div v-else>
            <p>Chargement de la commande...</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop'

const props = defineProps({
    orderUuid: {
        type: String,
        default: ''
    }
})

const router = useRouter()
const shopStore = useShopStore()
const order = ref(null)
const transactionUuid = ref('')

onMounted(async () => {
    if (!shopStore.shopUser) {
        router.push('/shop/login')
        return
    }
    let res = await shopStore.getOrder(props.orderUuid)
    if (res.error === 0) {
        order.value = res.data
    } else {
        alert("Erreur chargement commande: " + res.data)
    }
})

async function payOrder() {
    if (!transactionUuid.value) {
        alert("Veuillez saisir l'UUID de la transaction bancaire")
        return
    }
    let res = await shopStore.payOrder(props.orderUuid, transactionUuid.value)
    if (res.error === 0) {
        alert("Commande payée !")
        router.push('/shop/orders')
    } else {
        alert("Erreur: " + res.data)
    }
}

async function cancelOrder() {
    router.push('/shop')
}
</script>

<style scoped>
.shop-pay {
    padding: 20px;
}
</style>
