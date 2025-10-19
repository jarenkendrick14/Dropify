<script setup>
import TheHeader from '../../components/TheHeader.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="admin-layout">
    <!-- This layout ALWAYS shows the header in 'admin' mode -->
    <TheHeader mode="admin" />
    
    <!-- Admin child pages (Products, Users, etc.) will be rendered here -->
    <RouterView />
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>