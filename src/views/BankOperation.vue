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

const bankStore = useBankStore()
const amount = ref(0)
const isTransfer = ref(false)
const destNumber = ref('')
const successMessage = ref('')

async function validate() {
    let result;
    if (isTransfer.value) {
        result = await bankStore.createPayment(amount.value, destNumber.value)
    } else {
        result = await bankStore.createWithdraw(amount.value)
    }

    if (result.error === 0) {
        successMessage.value = `L'opération est validée avec le n° : ${result.data.uuid}. Vous pouvez la retrouver dans l'historique`
        setTimeout(() => { successMessage.value = '' }, 5000)
    } else {
        alert("Erreur: " + result.data)
    }
}
</script>
