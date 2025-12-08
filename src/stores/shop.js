import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

import ShopService from '@/services/shop.service'

export const useShopStore = defineStore('shop', () => {

  const viruses = ref([])
  const shopUser = ref(null)

  const basket = ref({ items: [] })

  // Watch basket changes to update backend
  watch(basket, async (newBasket) => {
    if (shopUser.value) {
      console.log('saving basket...', newBasket)
      await ShopService.updateBasket(shopUser.value._id, newBasket)
    }
  }, { deep: true })

  async function shopLogin(data) {
    console.log('login');
    let response = await ShopService.shopLogin(data)
    if (response.error === 0) {
      shopUser.value = response.data

      // Load basket
      let basketResponse = await ShopService.getBasket(shopUser.value._id)
      if (basketResponse.error === 0) {
        basket.value = basketResponse.data
      }
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

  return { viruses, shopUser, basket, shopLogin, getAllViruses }
})
