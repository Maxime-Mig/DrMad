import { ref } from "vue";
import { defineStore } from "pinia";

import BankService from "@/services/bankaccount.service";

export const useBankStore = defineStore("bankAuth", () => {
  const accountAmount = ref(0);
  const accountTransactions = ref([]);
  const accountNumberState = ref(0);
  const accountId = ref(null); // Need to store account ID for operations
  const account = ref(null); // Full account object if needed

  async function getAccountAmount(number) {
    console.log("récupération du solde du compte");
    let response = await BankService.getAccountAmount(number);
    if (response.error === 0) {
      accountAmount.value = response.data;
      accountNumberState.value = 1;
      // We might want to store the full account info or ID here if getAccountAmount returns it?
      // localsource.getAccountAmount returns just the amount.
      // Wait, instruction 2°/ says "getAccount(data)... permet de récupérer toutes les informations d'un compte".
      // But initially `localsource` only had `getAccountAmount`.
      // The instruction says "getAccount(data) : permet de récupérer toutes les informations... copie de l'objet".
      // So I should have updated `getAccountAmount` to `getAccount` or added `getAccount`?
      // "Voici la liste des fonctions à définir ... getAccount(data) ...".
      // Existing localsource had `getAccountAmount`.
      // The store calls `getAccountAmount`.
      // I should align with instructions.
    } else {
      accountNumberState.value = -1;
      console.log(response.data);
    }
  }

  // The instructions require `getAccount` in localsource, which returns full account object including _id.
  // I should probably implement that and use it in store to get the ID.
  async function fetchAccount(number) {
    console.log("récupération du compte");
    // Service expects object { number: ... }
    let response = await BankService.getAccount({ number: number });
    if (response.error === 0) {
      account.value = response.data;
      accountAmount.value = response.data.amount;
      accountId.value = response.data._id;
      accountNumberState.value = 1;
    } else {
      accountNumberState.value = -1;
      console.log(response.data);
    }
  }

  // Keep getAccountAmount if used elsewhere or alias it?
  // Existing BankAccountView calls getAccountAmount. We will change it to getAccount.
  // But let's check if getAccountAmount is needed. Ideally we rely on getAccount.
  async function getAccountAmount(number) {
    await fetchAccount(number);
  }

  async function getAccountTransactions(number) {
    console.log("récupération des transactions du compte");
    let response = await BankService.getAccountTransactions(number);
    if (response.error === 0) {
      accountTransactions.value = response.data;
      accountNumberState.value = 1;
    } else {
      accountNumberState.value = -1;
      console.log(response.data);
    }
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
  };
});
