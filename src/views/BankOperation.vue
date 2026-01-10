<template>
    <div>
        <slot name="operation-title" label="Débit / Virement">
            <h2>Débit / Virement</h2>
        </slot>

        <div>
            <label>Montant: </label>
            <input type="number" v-model="amount">
        </div>

        <div>
            <label>
                <input type="checkbox" v-model="isTransfer">
                Destinataire
            </label>
        </div>

        <div v-if="isTransfer">
            <label>N° Compte Destinataire: </label>
            <input type="text" v-model="destNumber">
        </div>

        <button @click="validate">Valider</button>

        <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBankStore } from "@/stores/bank.js"
import BankService from "@/services/bankaccount.service.js"

const bankStore = useBankStore()
const amount = ref(0)
const isTransfer = ref(false)
const destNumber = ref('')
const successMessage = ref('')

async function validate() {
    // Assuming bankStore has some way to know current account ID
    // But wait, bankStore in `getAccountAmount` only got the amount.
    // I need the ACCOUNT ID for `createWithdraw/Payment` calls which expect `idAccount`.
    // localsource `getAccountAmount` returns `data: amount`. `getAccountTransactions` returns `data: [...]` (where transactions have `account` id).
    // But I don't have the current account ID stored in `bankStore`!
    // I need to fix `bankStore` and `localsource.service.js` (or `bankaccount.service.js`) to retrieve account ID.

    // Quick fix: Retrieve account ID via `getAccount` (which I need to implement properly)
    // OR: modify `getAccountAmount` to return `{ amount: ..., id: ... }`.
    // Let's modify `localsource.service.js` `getAccountAmount` to return object with id?
    // Use `getAccount(data)` from instructions which returns "copie de l'objet".
    // I skipped implementing `getAccount` in `localsource` in previous step (I only did withdraw/payment).
    // I MUST Fix `localsource` and `bankStore` to have the Account ID.

    // For now, I will write this component assuming I have `bankStore.accountId`.

    let result;
    if (isTransfer.value) {
        result = await BankService.createPayment({
            amount: amount.value,
            idAccount: bankStore.accountId,
            destNumber: destNumber.value
        })
    } else {
        result = await BankService.createWithdraw({
            amount: amount.value,
            idAccount: bankStore.accountId
        })
    }

    if (result.error === 0) {
        successMessage.value = `L'opération est validée avec le n° : ${result.data.uuid}. Vous pouvez la retrouver dans l'historique`
        setTimeout(() => { successMessage.value = '' }, 5000)
        // Update balance
        bankStore.accountAmount = result.data.amount
    } else {
        alert("Erreur: " + result.data)
    }
}
</script>
