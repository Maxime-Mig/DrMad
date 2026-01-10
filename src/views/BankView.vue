<template>
    <div class="bank-view">
        <NavBar :links="navLinks" />
        <div class="bank-container">
            <VerticalMenu :items="menuItems">
                <template #menu-title="{ label }">
                    <h3 style="text-decoration: underline;">{{ label }}</h3>
                </template>
            </VerticalMenu>

            <div class="bank-content">
                <!-- Passing slots to nested components via RouterView -->
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

// NavBar Logic
const navLinks = computed(() => {
    if (bankStore.accountNumberState === 1) {
        return [{ label: "Déconnexion", to: "/bank/logout" }]
    }
    return [{ label: "Mon compte", to: "/bank/account" }]
})

// VerticalMenu Logic
const menuItems = computed(() => {
    const isDisabled = bankStore.accountNumberState !== 1
    // If disabled, maybe links shouldn't work? 
    // "Ces boutons ne sont actifs que si l'utilisateur a fourni un n° de compte valide"
    // VerticalMenu doesn't natively support disabled state in my implementation.
    // I can check if I should render them or make them non-clickable.
    // Or I just conditional render the full list.

    if (isDisabled) {
        return [
            { type: "title", label: "Opérations" },
            { type: "title", label: "États" }
        ]
        // Or return nothing? Instructions say buttons are inactive.
    }

    return [
        { type: "title", label: "Opérations" },
        { type: "link", label: "Solde", to: "/bank/amount" },
        { type: "link", label: "Débit/Virement", to: "/bank/operation" },
        { type: "title", label: "États" },
        { type: "link", label: "Historique", to: "/bank/history" }
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
