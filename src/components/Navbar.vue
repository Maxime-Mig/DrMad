<template>
  <div class="navbar">
    <button v-for="(link, index) in links" :key="index" @click="goTo(link.to)">
      <slot name="nav-button" :label="link.label" :link="link">
        {{ link.label }}
      </slot>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  links: {
    type: Array, // [{ label: text, to: route, ... }]
    required: true
  }
})

const router = useRouter()

function goTo(dest) {
  if (dest) {
    router.push(dest)
  }
}
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
}

button {
  margin-right: 10px;
  cursor: pointer;
}
</style>