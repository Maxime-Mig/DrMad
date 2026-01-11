<template>
    <div class="bank-view">
        <NavBar :links="navLinks" />

        <h1>Banque</h1>
        <hr>

        <div class="bank-container">
            <VerticalMenu :items="menuItems">
                <template #menu-title="{ label }">
                    <h3 style="text-decoration: underline;">{{ label }}</h3>
                </template>
            </VerticalMenu>

            <div class="bank-content">
                <router-view name="bankmain" v-slot="{ Component }">
                    <component :is="Component">
                        <template #account-amount="{ amount }">
                            <input type="text" readonly :value="amount + ' €'"
                                :class="{ 'amount-pos': amount >= 0, 'amount-neg': amount < 0 }">
                        </template>
                        <template #operation-title="{ label }">
                            <h2>{{ label || 'Débit / Virement' }} (BankView)</h2>
                        </template>
                        <template #history-title="{ label }">
                            <h2>{{ label || 'Historique' }} (BankView)</h2>
                        </template>
                    </component>
                </router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue"
import NavBar from "@/components/NavBar.vue"
import VerticalMenu from "@/components/VerticalMenu.vue"
import { useBankStore } from "@/stores/bank.js"

const bankStore = useBankStore()

// NavBar 
const navLinks = computed(() => {
    if (bankStore.accountNumberState === 1) {
        return [{ label: "Déconnexion", to: "/bank/logout" }]
    }
    return [{ label: "Mon compte", to: "/bank/account" }]
})

// VerticalMenu 
const menuItems = computed(() => {
    const isDisabled = bankStore.accountNumberState !== 1

    return [
        { type: "title", label: "Opérations" },
        { type: "link", label: "Solde", to: "/bank/amount", disabled: isDisabled },
        { type: "link", label: "Débit/Virement", to: "/bank/operation", disabled: isDisabled },
        { type: "title", label: "États" },
        { type: "link", label: "Historique", to: "/bank/history", disabled: isDisabled }
    ]
})

</script>

<style scoped>
.bank-container {
    display: flex;
    gap: 20px;
}

.bank-content {
    flex: 1;
    padding: 20px;
    border: 1px solid #eee;
}

:deep(.amount-pos) {
    color: green;
    font-weight: bold;
}

:deep(.amount-neg) {
    color: red;
    font-weight: bold;
}
</style>
