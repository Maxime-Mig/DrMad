import { ref } from 'vue'
import { defineStore } from 'pinia'

import BankService from '@/services/bankaccount.service'

export const useBankStore = defineStore('bank', () => {

  const accountAmount = ref(0)
  const accountTransactions = ref([])
  const accountNumberState = ref(0)

  async function getAccountAmount(number) {
    console.log('récupération du solde du compte');
    let response = await BankService.getAccountAmount(number)
    if (response.error === 0) {
      accountAmount.value = response.data
      accountNumberState.value = 1
    }
    else {
      accountNumberState.value = -1
      console.log(response.data)
    }
  }

  async function getAccountTransactions(number) {
    console.log('récupération des transactions du compte');
    let response = await BankService.getAccountTransactions(number)
    if (response.error === 0) {
      accountTransactions.value = response.data
      accountNumberState.value = 1
    }
    else {
      accountNumberState.value = -1
      console.log(response.data)
    }
  }

  return {accountAmount, accountTransactions, accountNumberState, getAccountAmount, getAccountTransactions}
})

