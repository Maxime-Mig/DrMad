import { ref } from "vue";
import { defineStore } from "pinia";

import BankService from "@/services/bankaccount.service";

export const useBankStore = defineStore("bankAuth", () => {
  const accountAmount = ref(0);
  const accountTransactions = ref([]);
  const accountNumberState = ref(0);
  const accountId = ref(null);
  const account = ref(null);

  async function getAccountAmount(number) {
    console.log("récupération du solde du compte");
    let response = await BankService.getAccountAmount(number);
    if (response.error === 0) {
      accountAmount.value = response.data;
      accountNumberState.value = 1;
    } else {
      accountNumberState.value = -1;
      console.log(response.data);
    }
  }

  async function fetchAccount(number) {
    console.log("récupération du compte");
    let response = await BankService.getAccount({ number: number });
    if (response.error === 0) {
      account.value = response.data;
      accountAmount.value = response.data.amount;
      accountId.value = response.data._id;
      accountNumberState.value = 1;
    } else {
      accountNumberState.value = -1;
      account.value = null;
      console.log(response.data);
    }
  }

  async function getAccountAmount(number) {
    if (!account.value || account.value.number !== number) {
      await fetchAccount(number);
    }
  }

  async function getAccountTransactions(number) {
    console.log("récupération des transactions du compte");
    let num = number || (account.value ? account.value.number : null);
    if (!num) return;

    let response = await BankService.getAccountTransactions(num);
    if (response.error === 0) {
      accountTransactions.value = response.data;
      accountNumberState.value = 1;
    } else {
      console.log(response.data);
    }
  }

  async function createWithdraw(amount) {
    if (!accountId.value) return { error: 1, data: "Compte non chargé" };

    let response = await BankService.createWithdraw({
      amount: amount,
      idAccount: accountId.value
    });

    if (response.error === 0) {
      if (account.value) {
        account.value.amount = response.data.amount;
        accountAmount.value = response.data.amount;
      }
    }
    return response;
  }

  async function createPayment(amount, destNumber) {
    if (!accountId.value) return { error: 1, data: "Compte non chargé" };

    let response = await BankService.createPayment({
      amount: amount,
      idAccount: accountId.value,
      destNumber: destNumber
    });

    if (response.error === 0) {
      if (account.value) {
        account.value.amount = response.data.amount;
        accountAmount.value = response.data.amount;
      }
    }
    return response;
  }

  function logout() {
    account.value = null;
    accountAmount.value = 0;
    accountId.value = null;
    accountTransactions.value = [];
    accountNumberState.value = 0;
  }

  return {
    accountAmount,
    accountTransactions,
    accountNumberState,
    accountId,
    account,
    fetchAccount,
    getAccountAmount,
    getAccountTransactions,
    createWithdraw,
    createPayment,
    logout
  };
});
