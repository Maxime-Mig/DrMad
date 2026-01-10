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
  return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString()
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
