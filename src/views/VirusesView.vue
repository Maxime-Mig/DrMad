<template>
  <div>
    <h1>Les virus</h1>
    
    <span>Filtres :</span>
    <label for="filterpriceactive"> par prix</label><input type="checkbox" v-model="filterPriceActive" id="filterpriceactive">
    <label for="filternameactive"> par nom</label><input type="checkbox" v-model="filterNameActive" id="filternameactive">
    <label for="filterstockactive"> par stock</label><input type="checkbox" v-model="filterStockActive" id="filterstockactive">
    <hr/>

    <div>
      <label for="filterprice">Prix inférieur à : </label>
      <input type="number" v-model.number="priceFilter" id="filterprice">
      <br>
      <label for="filtername">Nom contient : </label>
      <input type="text" v-model="nameFilter" id="filtername">
      <br>
      <label for="filterstock">En stock : </label>
      <input type="checkbox" v-model="stockFilter" id="filterstock">
    </div>

    <CheckedList 
      :data="filterViruses" 
      :fields="['name', 'price']"
      :itemCheck="true"
      :checked="checked"
      :itemButton="{ show: true, text: 'Détail' }"
      :listButton="{ show: true, text: 'Afficher les virus selectionnés' }"
      @checked-changed="handleCheckedChanged" 
      @item-button-clicked="handleItemButtonClicked"
      @list-button-clicked="handleListButtonClicked"
    ></CheckedList>
  </div>
</template>

<script setup>
import {useShopStore} from "../stores/shop.js";
import {ref, computed, watch} from "vue";
import CheckedList from "/src/components/CheckedList.vue";

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

  return temp;
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

function handleItemButtonClicked(index) {
  const virus = filterViruses.value[index];
  alert(`Nom : ${virus.name}, en stock : ${virus.stock}, prix : ${virus.price}€`);
}

function handleListButtonClicked() {
    const selectedViruses = shopStore.viruses.filter(v => selected.value.includes(v._id));
  const names = selectedViruses.map(v => v.name).join(', ');
  alert(`Vous avez selectionné : ${names}`);
}
</script>