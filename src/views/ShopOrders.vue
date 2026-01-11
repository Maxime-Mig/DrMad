<template>
    <div class="shop-orders">
        <h2>Mes Commandes</h2>
        <div v-if="orders.length === 0">
            Aucune commande passée.
        </div>
        <table v-else>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order.uuid">
                    <td>{{ formatDate(order.date) }}</td>
                    <td>{{ order.total }}€</td>
                    <td>{{ order.status }}</td>
                    <td>
                        <div v-if="order.status === 'waiting_payment'" class="actions">
                            <button @click="handlePay(order.uuid)">Payer</button>
                            <button @click="handleCancel(order.uuid)">Annuler</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop'

const store = useShopStore()
const router = useRouter()

const orders = computed(() => {
    return store.shopUser && store.shopUser.orders ? store.shopUser.orders : []
})

onMounted(async () => {
    if (store.shopUser) {
        await store.getAllOrders()
    }
})

function formatDate(dateString) {
    if (!dateString) return ''
    let date = dateString
    if (dateString.$date) {
        date = dateString.$date
    }
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString()
}

function handlePay(uuid) {
    router.push(`/shop/pay/${uuid}`)
}

async function handleCancel(uuid) {
    if (confirm("Voulez-vous vraiment annuler cette commande ?")) {
        await store.cancelOrder(uuid)
    }
}
</script>

<style scoped>
.shop-orders {
    padding: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

th,
td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
}

th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #333;
}

tr:hover {
    background-color: #f5f5f5;
}

.actions button {
    margin-right: 10px;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background-color 0.2s;
}

.actions button:first-of-type {
    background-color: #4CAF50;
    color: white;
}

.actions button:first-of-type:hover {
    background-color: #45a049;
}

.actions button:last-of-type {
    background-color: #f44336;
    color: white;
}

.actions button:last-of-type:hover {
    background-color: #d32f2f;
}
</style>
