<template>
  <table>
    <tr v-for="(item, index) in data" :key="item.id">
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
        <button @click="$emit('item-button-clicked', index)">{{ itemButton.text }}</button>
      </td>
    </tr>
  </table>
  <div v-if="listButton.show">
    <button @click="$emit('list-button-clicked')">{{ listButton.text }}</button>
  </div>
</template>

<script setup>
import {defineEmits} from "vue";

defineEmits(['checked-changed', 'item-button-clicked', 'list-button-clicked'])

defineProps({
  data: Array,
  fields: Array,
  itemCheck: Boolean,
  checked: Array,
  itemButton: Object,
  listButton: Object,
})
</script>