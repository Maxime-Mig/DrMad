<template>
    <div class="vertical-menu">
        <div v-for="(item, index) in items" :key="index">
            <div v-if="item.type === 'title'">
                <slot name="menu-title" :label="item.label">{{ item.label }}</slot>
            </div>
            <div v-else-if="item.type === 'link'">
                <span @click="goTo(item.to, item.disabled)">
                    <slot name="menu-link" :label="item.label">
                        <button :disabled="item.disabled">{{ item.label }}</button>
                    </slot>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
    items: {
        type: Array, // [{ type: "title"|"link", label: "", to: "" }]
        required: true
    }
})

const router = useRouter()

function goTo(dest, disabled) {
    if (dest && !disabled) {
        router.push(dest)
    }
}
</script>

<style scoped>
.vertical-menu {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
