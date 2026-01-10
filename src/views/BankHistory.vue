<template>
    <div>
        <slot name="history-title" label="Opérations passées">
            <h2>Opérations passées</h2>
        </slot>

        <div>
            <label>
                <input type="checkbox" v-model="filterActive"> Filtrer par période
            </label>
        </div>

        <div v-if="filterActive">
            <label>Du: <input type="date" v-model="dateFrom" @change="checkDates"></label>
            <label>Au: <input type="date" v-model="dateTo" @change="checkDates"></label>
        </div>

        <DataTable :headers="headers" :items="filteredTransactions" itemCheck itemButton tableButton
            @itemClicked="showDetails" @tableClicked="showMultipleDetails">
            <template #item-button>Détails</template>
            <template #table-button>Voir</template>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBankStore } from "@/stores/bank.js"
import DataTable from "@/components/DataTable.vue"

const bankStore = useBankStore()
const filterActive = ref(false)
const dateFrom = ref('')
const dateTo = ref('')

onMounted(async () => {
    if (bankStore.account && bankStore.account.number) {
        await bankStore.getAccountTransactions(bankStore.account.number)
    }
})

const headers = [
    { label: "Montant", name: "amountDisplay" },
    { label: "Date", name: "dateDisplay" },
    { label: "Type", name: "typeDisplay" }
]

function checkDates() {
    // Validation logic (clear invalid dates)
    if (dateFrom.value && dateTo.value) {
        if (new Date(dateFrom.value) > new Date(dateTo.value)) {
            dateTo.value = "" // Invalid
        }
    }
}

const filteredTransactions = computed(() => {
    let txs = bankStore.accountTransactions.map(t => {
        // Enhance transaction object for display
        let d = new Date(t.date.$date)
        return {
            ...t,
            amountDisplay: t.amount + ' €',
            dateDisplay: d.toLocaleDateString() + ' ' + d.toLocaleTimeString(),
            typeDisplay: t.amount < 0 ? 'S' : 'D',
            rawDate: d
        }
    })

    // Sort chrono desc
    txs.sort((a, b) => b.rawDate - a.rawDate)

    if (!filterActive.value) return txs

    let start = dateFrom.value ? new Date(dateFrom.value) : null
    let end = dateTo.value ? new Date(dateTo.value) : null
    // Make end date inclusive of the day
    if (end) end.setHours(23, 59, 59)

    return txs.filter(t => {
        if (start && t.rawDate < start) return false
        if (end && t.rawDate > end) return false
        return true
    })
})

function showDetails(item) {
    alert("Transaction UUID: " + item.uuid)
}

function showMultipleDetails(items) {
    let uuids = items.map(i => i.uuid).join('\n')
    alert("Selected UUIDs:\n" + uuids)
}
</script>
