<template>
  <div>
    <NavBar :links="navLinks">
      <template #nav-button="{ label }">
        <span v-if="label === 'Boutique'" style="font-weight: bold;">{{ label }}</span>
        <span v-else-if="label === 'Banque'">🏦 {{ label }}</span>
        <span v-else>{{ label }}</span>
      </template>
    </NavBar>

    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from "vue";
import NavBar from "@/components/NavBar.vue";

const navLinks = ref([
  { label: "Boutique", to: "/shop" },
  { label: "Banque", to: "/bank" }
]);

</script>

<style scoped></style>
