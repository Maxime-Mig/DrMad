<template>
    <div>
        <h3>Solde du compte</h3>
        <slot name="account-amount" :amount="bankStore.accountAmount">
            {{ bankStore.accountAmount }}
        </slot>
    </div>
</template>

<script setup>
import { useBankStore } from "@/stores/bank.js"

const bankStore = useBankStore()
</script>
