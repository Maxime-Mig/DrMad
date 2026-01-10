<template>
  <div class="items-list">
    <h1>Les virus</h1>

    <div>
      <span>Filtres :</span>
      <label for="filterpriceactive"> par prix</label><input type="checkbox" v-model="filterPriceActive"
        id="filterpriceactive">
      <label for="filternameactive"> par nom</label><input type="checkbox" v-model="filterNameActive"
        id="filternameactive">
      <label for="filterstockactive"> par stock</label><input type="checkbox" v-model="filterStockActive"
        id="filterstockactive">
      <hr />
    </div>

    <div>
      <div v-if="filterPriceActive">
        <label for="filterprice">Prix inférieur à : </label>
        <input type="number" v-model.number="priceFilter" id="filterprice">
      </div>
      <br v-if="filterPriceActive" />

      <div v-if="filterNameActive">
        <label for="filtername">Nom contient : </label>
        <input type="text" v-model="nameFilter" id="filtername">
      </div>
      <br v-if="filterNameActive" />

      <div v-if="filterStockActive">
        <label for="filterstock">En stock : </label>
        <input type="checkbox" v-model="stockFilter" id="filterstock">
      </div>
    </div>

    <CheckedList :data="filterViruses" :fields="['name', 'price', 'promotionDisplay']" :itemCheck="true"
      :checked="checked" :itemButton="{ show: true, text: 'Ajouter au panier' }"
      :listButton="{ show: true, text: 'Ajouter les virus selectionnés au panier' }" :itemAmount="true"
      @checked-changed="handleCheckedChanged" @item-button-clicked="handleItemButtonClicked"
      @list-button-clicked="handleListButtonClicked"></CheckedList>
  </div>
</template>

<script setup>
import { useShopStore } from "../stores/shop.js";
import { ref, computed, watch } from "vue";
import CheckedList from "./CheckedList.vue";

const filterPriceActive = ref(false)
const filterNameActive = ref(false)
const filterStockActive = ref(false)

const shopStore = useShopStore()
const priceFilter = ref(0)
const nameFilter = ref('')
const stockFilter = ref(true)

const filterViruses = computed(() => {
  let temp = shopStore.viruses;

  if (filterPriceActive.value) {
    const numericPrice = Number(priceFilter.value);
    if (!isNaN(numericPrice) && numericPrice > 0) {
      temp = temp.filter(v => v.price < numericPrice);
    }
  }

  if (filterNameActive.value && nameFilter.value.length > 0) {
    temp = temp.filter(v => v.name.toLowerCase().includes(nameFilter.value.toLowerCase()));
  }

  if (filterStockActive.value && stockFilter.value) {
    temp = temp.filter(v => v.stock > 0);
  }

  // Transform features for display
  return temp.map(v => {
    let promoDisplay = ""
    if (v.promotion && v.promotion.length > 0) {
      promoDisplay = v.promotion.map(p => `Qte: ${p.amount}, Remise: ${p.discount}%`).join(' ; ')
    }
    return {
      ...v,
      promotionDisplay: promoDisplay
    }
  });
})

const selected = ref([]) // tableau d'IDs

const filteredVirusIds = computed(() => filterViruses.value.map(v => v._id));

// Nettoyer selected quand le filtre change
watch(filteredVirusIds, (newIds) => {
  selected.value = selected.value.filter(id => newIds.includes(id));
}, { immediate: false });

const checked = computed(() => {
  return filterViruses.value.map(v => selected.value.includes(v._id));
})

const handleCheckedChanged = (payload) => {
  const virus = filterViruses.value[payload.index];
  const id = virus._id;

  if (payload.value) {
    if (!selected.value.includes(id)) {
      selected.value = [...selected.value, id];
    }
  } else {
    selected.value = selected.value.filter(x => x !== id);
  }
};

async function addToBasket(virus, amount) {
  await shopStore.updateBasketItem(virus, amount);
}

function handleItemButtonClicked(payload) {
  // payload is { index, amount }
  const virus = filterViruses.value[payload.index];
  addToBasket(virus, payload.amount);
}

function handleListButtonClicked(payload) {
  // payload is array of { index, amount }
  payload.forEach(itemPayload => {
    const virus = filterViruses.value[itemPayload.index];
    addToBasket(virus, itemPayload.amount);
  });
  // Deselection des items
  selected.value = [];
}
</script>

<style scoped>
.items-list {
  padding: 1rem;
}
</style>
