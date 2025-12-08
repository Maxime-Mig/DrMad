<template>
  <div class="shop-buy">
    <div class="left-panel">
      <ItemsList />
    </div>
    <div class="right-panel">
      <BasketList />
    </div>
  </div>
</template>

<script setup>
import CheckedList from '@/components/CheckedList.vue'
</script>

<style scoped>
.shop-buy {
  display: flex;
  gap: 2rem;
}
.left-panel {
  flex: 1;
}
.right-panel {
  flex: 1;
}
</style>
