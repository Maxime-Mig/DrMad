import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

import ShopService from '@/services/shop.service'

export const useShopStore = defineStore('shop', () => {

  const viruses = ref([])
  const shopUser = ref(null)

  const basket = ref({ items: [] })

  async function saveBasket() {
    if (shopUser.value) {
      await ShopService.updateBasket(shopUser.value._id, basket.value)
    }
  }

  async function initBasket() {
    if (shopUser.value) {
      let basketResponse = await ShopService.getBasket(shopUser.value._id)
      if (basketResponse.error === 0) {
        basket.value = basketResponse.data
      }
    }
  }

  async function shopLogin(data) {
    console.log('login');
    let response = await ShopService.shopLogin(data)
    if (response.error === 0) {
      shopUser.value = response.data
      await initBasket()
    }
    else {
      console.log(response.data)
    }
  }

  async function getAllViruses() {
    console.log('récupération des viruses');
    let response = await ShopService.getAllViruses()
    if (response.error === 0) {
      viruses.value = response.data
    }
    else {
      console.log(response.data)
    }
  }

  async function updateBasketItem(item, amount = 1) {
    const itemId = item._id
    const existingItem = basket.value.items.find(e => e.item === itemId)

    if (existingItem) {
      existingItem.amount += amount

      if (existingItem.amount <= 0) {
        removeBasketItem(item)
      }

    } else {
      if (amount > 0) {
        basket.value.items.push({ item: itemId, amount: amount })
      }
    }
    await saveBasket()
  }

  async function removeBasketItem(item) {
    const itemId = item._id
    const index = basket.value.items.findIndex(e => e.item === itemId)
    if (index !== -1) {
      basket.value.items.splice(index, 1)
    }
    await saveBasket()
  }

  async function clearBasket() {
    basket.value.items = []
    await saveBasket()
  }

  return { viruses, shopUser, basket, shopLogin, getAllViruses, initBasket, updateBasketItem, removeBasketItem, clearBasket }
})
