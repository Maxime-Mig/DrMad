<template>
    <div class="data-table">
        <table>
            <thead>
                <tr>
                    <!-- Checkbox column header -->
                    <th v-if="itemCheck">select.</th>
                    <!-- Data columns headers -->
                    <th v-for="(header, index) in headers" :key="index">
                        {{ header.label }}
                    </th>
                    <!-- Action column header -->
                    <th v-if="itemButton">actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in items" :key="index">
                    <!-- Checkbox cell -->
                    <td v-if="itemCheck">
                        <input type="checkbox" v-model="selectedItems" :value="item">
                    </td>
                    <!-- Data cells -->
                    <td v-for="(header, hIndex) in headers" :key="hIndex">
                        {{ item[header.name] }}
                    </td>
                    <!-- Action cell -->
                    <td v-if="itemButton">
                        <button @click="$emit('itemClicked', item)">
                            <slot name="item-button">Select</slot>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="tableButton" class="table-actions">
            <button @click="$emit('tableClicked', selectedItems)">
                <slot name="table-button">Action</slot>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    headers: {
        type: Array, // [{ label: "", name: "" }]
        required: true
    },
    items: {
        type: Array, // [{ col1: val, ... }]
        required: true
    },
    itemCheck: Boolean,
    itemButton: Boolean,
    tableButton: Boolean
})

const emit = defineEmits(['itemClicked', 'tableClicked'])

const selectedItems = ref([])

</script>

<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

.table-actions {
    margin-top: 10px;
}
</style>
