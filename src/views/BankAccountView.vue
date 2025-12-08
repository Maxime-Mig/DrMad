<template>
  <div>
    <h1>Bank Account</h1>

    <span>Account number</span><input v-model="number">
    <button @click="resetAccount">Reset</button>

    <button @click="bankStore.getAccountAmount(number)" :disabled="!isValidNumber">Get account amount</button>
    <button @click="bankStore.getAccountTransactions(number)" :disabled="!isValidNumber">Get account transactions</button>

    <div v-if="bankStore.accountNumberState === 1">
      <p v-if="bankStore.accountAmount">{{bankStore.accountAmount}}</p>
      <p>passed transactions:</p>
      <ul v-if="bankStore.accountTransactions.length > 0">
        <li v-for="(transaction, index) in bankStore.accountTransactions" :key="index">{{new Date(transaction.date.$date).toLocaleString()}} : {{transaction.amount}}</li>
      </ul>
    </div>
    <p v-else-if="bankStore.accountNumberState === -1">Numéro de compte erroné</p>

  </div>
</template>

<script setup>

  import {computed, ref} from "vue";
  import {useBankStore} from "@/stores/bank.js";

  const number = ref('')
  const bankStore = useBankStore()
  const isValidNumber = computed(() => {
    const regex = /^[A-Za-z0-9]{22}\-[0-9]{7}$/;
    return regex.test(number.value);
  });

  function resetAccount() {
    number.value = '';
    bankStore.accountNumberState = 0;
  }

</script>


