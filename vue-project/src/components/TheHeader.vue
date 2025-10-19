<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';

const cartStore = useCartStore();
const authStore = useAuthStore();

const props = defineProps({
  mode: {
    type: String,
    default: 'default' // 'default', 'shop', or 'admin'
  },
  darkText: {
    type: Boolean,
    default: false
  },
  scrolled: {
    type: Boolean,
    default: false
  }
});

const headerClasses = computed(() => {
  return {
    'is-shop-or-admin': props.mode === 'shop' || props.mode === 'admin',
    'is-dark-theme': props.darkText,
    'is-scrolled': props.scrolled && props.mode === 'default' && !props.darkText,
  };
});
</script>

<template>
  <header class="the-header" :class="headerClasses">
    <nav class="nav-full">
      <div class="left-section">
        <RouterLink to="/" class="logo">DROPIFY</RouterLink>
        <span v-if="mode === 'admin'" class="admin-tag">Admin Panel</span>
      </div>
      
      <div class="right-section">
        <div v-if="authStore.user" class="welcome-message">
          Welcome back, <span class="username">{{ authStore.user.username }}</span>!
        </div>

        <!-- Default Nav Links -->
        <div v-if="mode === 'default'" class="nav-links">
          <RouterLink to="/">HOME</RouterLink>
          <RouterLink to="/contact">CONTACT US</RouterLink>
          <RouterLink to="/about">ABOUT</RouterLink>
          <RouterLink to="/shop">MERCH</RouterLink>
          <RouterLink v-if="authStore.isAdmin" to="/admin">ADMIN</RouterLink>
          <a href="#" @click.prevent="authStore.logout()" class="logout-link">LOGOUT</a>
        </div>
        
        <!-- Shop Nav Links -->
        <div v-if="mode === 'shop'" class="nav-links">
          <RouterLink to="/">HOME</RouterLink>
          <RouterLink to="/shop/shirts">Shirts</RouterLink>
          <RouterLink to="/shop/hoodies">Hoodies</RouterLink>
          <RouterLink to="/shop/caps">Caps</RouterLink>
          <RouterLink v-if="authStore.isAdmin" to="/admin">ADMIN</RouterLink>
          <a href="#" @click.prevent="authStore.logout()" class="logout-link">LOGOUT</a>
        </div>
        
        <!-- Admin Nav Links -->
        <div v-if="mode === 'admin'" class="nav-links">
          <RouterLink to="/admin" class="nav-link">Products</RouterLink>
          <RouterLink to="/admin/users" class="nav-link">Users</RouterLink>
          <RouterLink to="/admin/orders" class="nav-link">Orders</RouterLink>
          <RouterLink to="/shop" class="nav-link">View Site</RouterLink>
          <a href="#" @click.prevent="authStore.logout()" class="logout-link">LOGOUT</a>
        </div>
        
        <!-- Cart Icon -->
        <RouterLink v-if="mode !== 'admin'" to="/cart" class="icon-link">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span v-if="cartStore.totalItems > 0" class="cart-badge">
            {{ cartStore.totalItems }}
          </span>
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.the-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background-color: transparent;
  color: var(--white);
  border-bottom: 1px solid transparent;
  transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease;
}
.the-header.is-shop-or-admin {
  background-color: var(--smoky-black);
  color: var(--white);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}
.the-header.is-shop-or-admin .welcome-message {
  color: var(--gray);
}
.the-header.is-scrolled,
.the-header.is-dark-theme {
  background-color: var(--white);
  color: var(--smoky-black);
  border-bottom-color: #eee;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.the-header.is-scrolled .welcome-message,
.the-header.is-dark-theme .welcome-message {
  color: var(--gray);
}
.the-header:not(.is-shop-or-admin):not(.is-dark-theme):not(.is-scrolled) {
  position: absolute;
}
.nav-full { display: flex; justify-content: space-between; align-items: center; padding: 25px 40px; max-width: 1400px; margin: 0 auto; }
.left-section, .right-section { display: flex; align-items: center; gap: 30px; }
.logo { font-size: 1.8rem; font-weight: bold; }
a { text-decoration: none; color: inherit; }
.welcome-message { font-size: 0.9rem; text-transform: none; white-space: nowrap; }
.welcome-message .username { font-weight: bold; }
.nav-links { display: flex; align-items: center; gap: 30px; }
.nav-links a { font-size: 1rem; font-weight: 500; text-transform: uppercase; cursor: pointer; transition: color 0.2s ease; }

/* --- THIS IS THE FIX --- */
/* Use 'router-link-exact-active' for precise matching */
.nav-links a:hover,
.nav-links .router-link-exact-active {
  color: var(--selective-yellow);
}

.icon-link { position: relative; display: flex; align-items: center; transition: color 0.2s ease; }
.icon-link:hover { color: var(--selective-yellow); }
.admin-tag { background-color: var(--selective-yellow); color: var(--smoky-black); padding: 4px 8px; font-size: 0.8rem; font-weight: bold; border-radius: 4px; }
.cart-badge { position: absolute; top: -8px; right: -10px; background-color: var(--selective-yellow); color: var(--smoky-black); border-radius: 50%; width: 20px; height: 20px; display: flex; justify-content: center; align-items: center; font-size: 0.75rem; font-weight: bold; }
</style>