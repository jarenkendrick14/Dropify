<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'
import TheHeader from './components/TheHeader.vue';
import TheFooter from './components/TheFooter.vue'
import Notification from './components/Notification.vue';

const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()

const scrolled = ref(false)
const handleScroll = () => { scrolled.value = window.scrollY > 50; };

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  if (authStore.isLoggedIn) {
    cartStore.fetchCart();
  }
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const isAuthPage = computed(() => route.name === 'login' || route.name === 'register');

// We use the route key to help Vue's transition component
// differentiate between pages and trigger the animation.
const routeKey = computed(() => route.path);

// --- Header logic (unchanged) ---
const isShopPage = computed(() => route.path.startsWith('/shop'));
const isAdminPage = computed(() => route.path.startsWith('/admin'));
const hasLightBackground = computed(() => {
  const lightBgPaths = ['/about', '/contact', '/cart', '/checkout'];
  return lightBgPaths.includes(route.path);
});
const headerMode = computed(() => {
  if (isAdminPage.value) return 'admin';
  if (isShopPage.value) return 'shop';
  return 'default';
});
</script>

<template>
  <div class="app-container">
    <TheHeader 
      v-if="!isAuthPage"
      :mode="headerMode" 
      :dark-text="hasLightBackground" 
      :scrolled="scrolled" 
    />
    
    <main>
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="routeKey" />
        </Transition>
      </RouterView>
    </main>
    
    <TheFooter v-if="!isAuthPage && !isAdminPage" />
    <Notification />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding-top: 95px;
}

/* On login/register pages, remove the padding. */
.app-container:has(main > .login-view),
.app-container:has(main > .register-view) {
  main {
    padding-top: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>