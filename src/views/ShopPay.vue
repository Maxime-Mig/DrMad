<template>
  <div class="shop-pay">
    <h2>Paiement de la commande</h2>
    <div class="pay-form">
      <label for="uuid">UUID de la commande :</label>
      <input type="text" id="uuid" v-model="uuid" placeholder="Saisir l'UUID" />
      <button @click="handlePay" :disabled="!uuid">Payer</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop'
import ShopService from '@/services/shop.service'

const props = defineProps({
  orderUuid: {
    type: String,
    default: ''
  }
})

const uuid = ref(props.orderUuid)
const store = useShopStore()
const router = useRouter()

async function handlePay() {
  if (!store.shopUser) {
    alert("Veuillez vous connecter")
    return
  }
  
  const response = await ShopService.payOrder(store.shopUser._id, uuid.value)
  if (response.error === 0) {
    alert("Paiement validé !")
    router.push('/shop/orders')
  } else {
    alert("Erreur de paiement : " + response.data)
  }
}
</script>
