<template>
  <div class="basket-list">
    <h2>Votre Panier</h2>
    <CheckedList 
      :data="displayItems"
      :fields="['name', 'amount', 'price']"
      :itemButton="{ show: true, text: 'Supprimer' }"
      :listButton="{ show: true, text: 'Vider le panier' }"
      :itemCheck="false"
      :itemAmount="false"
      @item-button-clicked="handleItemDelete"
      @list-button-clicked="handleClearBasket"
    />
    <div class="basket-actions">
      <button @click="handleBuy" :disabled="displayItems.length === 0">Acheter</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop'
import ShopService from '@/services/shop.service'
import CheckedList from './CheckedList.vue'

const store = useShopStore()
const router = useRouter()

onMounted(async () => {
  await store.getAllViruses()
  await store.initBasket()
})

const displayItems = computed(() => {
  if (!store.basket || !store.basket.items) return []
  return store.basket.items.map(basketItem => {
    const virus = store.viruses.find(v => v._id === basketItem.item)
    return {
      _id: basketItem.item,
      name: virus ? virus.name : 'Unknown',
      amount: basketItem.amount,
      price: virus ? virus.price : 0
    }
  })
})

async function handleItemDelete(index) {
  const itemToDelete = displayItems.value[index]
  if (itemToDelete) {
    await store.removeBasketItem({ _id: itemToDelete._id })
  }
}

async function handleClearBasket() {
  await store.clearBasket()
}

async function handleBuy() {
  if (store.shopUser && store.basket) {
    const response = await ShopService.orderBasket(store.shopUser._id, store.basket)
    if (response.error === 0) {
      const uuid = response.data
      await store.clearBasket()
      router.push(`/shop/pay/${uuid}`)
    } else {
      console.error('Order failed:', response.data)
      alert("Erreur lors de la commande: " + response.data)
    }
  }
}
</script>

