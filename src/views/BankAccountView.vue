<template>
  <div>
    <h1>Bank Account</h1>

    <span>Account number</span><input v-model="number">

    <button @click="login">Valider</button>
    <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>



  </div>
</template>

<script setup>

import { computed, ref } from "vue";
import { useBankStore } from "@/stores/bank.js";
import { useRouter } from "vue-router";

const number = ref('')
const bankStore = useBankStore()
const isValidNumber = computed(() => {
  const regex = /^[A-Za-z0-9]{22}\-[0-9]{7}$/;
  return regex.test(number.value);
});

const router = useRouter()

const errorMsg = ref('')

async function login() {
  console.log("Login clicked with number:", number.value);
  errorMsg.value = ''

  if (!isValidNumber.value) {
    console.log("Invalid number format");
    errorMsg.value = "Format invalide (Ex: FRDRMAD578901234567890-0000666)"
    alert("Numéro non valide") // Keep alert as requested
    return
  }

  console.log("Calling fetchAccount...");
  console.log("Store keys:", Object.keys(bankStore)); // Debug keys
  await bankStore.fetchAccount(number.value)
  console.log("Account State:", bankStore.accountNumberState);

  if (bankStore.accountNumberState === 1) {
    router.push('/bank/amount')
  } else {
    errorMsg.value = "Compte introuvable"
    alert("Compte introuvable")
  }
}

function formatDate(dateString) {
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${month}/${day}/${year} at ${hours}:${minutes}:${seconds}`;
}

</script>
