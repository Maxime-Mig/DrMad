<template>
  <table>
    <tr v-for="(item, index) in data" :key="index">
      <td v-if="itemCheck">
        <input 
          type="checkbox" 
          :value="item[fields[0]]" 
          :checked="checked[index]"
          @change="$emit('checked-changed', {index: index, value: $event.target.checked})"
        >
      </td>
      <td v-for="(field, fieldIndex) in fields" :key="fieldIndex">{{ item[field] }}</td>
      <td v-if="itemButton.show">
        <input 
          v-if="itemAmount" 
          type="number" 
          v-model.number="amounts[index]" 
          min="1"
          style="width: 50px; margin-right: 5px;"
        />
        <button @click="handleItemClick(index)">{{ itemButton.text }}</button>
      </td>
    </tr>
  </table>
  <div v-if="listButton.show">
    <button @click="handleListClick()">{{ listButton.text }}</button>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, ref } from "vue";

const emit = defineEmits(['checked-changed', 'item-button-clicked', 'list-button-clicked'])

const props = defineProps({
  data: Array,
  fields: Array,
  itemCheck: Boolean,
  checked: Array,
  itemButton: Object,
  listButton: Object,
  itemAmount: Boolean
})

const amounts = ref({});

function handleItemClick(index) {
  if (props.itemAmount) {
    emit('item-button-clicked', { index, amount: amounts.value[index] || 1 });
  } else {
    emit('item-button-clicked', index);
  }
}

function handleListClick() {
  const payload = [];
  if (props.checked) {
    props.data.forEach((_, index) => {
      if (props.checked[index]) {
        if (props.itemAmount) {
          payload.push({ index, amount: amounts.value[index] || 1 });
        } else {
          payload.push({ index });
        }
      }
    });
  }
  emit('list-button-clicked', payload);
}
</script>