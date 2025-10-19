import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '../router'
import axios from 'axios'
import { useCartStore } from './cart'
import { useNotificationStore } from './notification'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.isAdmin === true)

  async function login(username, password, isAdminLogin = false) {
    const notificationStore = useNotificationStore();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      
      if (isAdminLogin && !data.isAdmin) {
        notificationStore.showNotification('Login failed: You do not have admin privileges.', 'error');
        return;
      }
      
      token.value = data.token;
      user.value = { id: data._id, username: data.username, isAdmin: data.isAdmin };
      
      const cartStore = useCartStore();
      await cartStore.fetchCart();

      notificationStore.showNotification(`Welcome back, ${data.username}!`);

      if (data.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error) {
      notificationStore.showNotification('Login failed: Invalid username or password.', 'error');
    }
  }

  async function register(username, password) {
    const notificationStore = useNotificationStore();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { username, password });
      
      token.value = data.token;
      user.value = { id: data._id, username: data.username, isAdmin: data.isAdmin };

      const cartStore = useCartStore();
      await cartStore.fetchCart();

      notificationStore.showNotification(`Account created! Welcome, ${data.username}!`);

      router.push('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Please try again.';
      notificationStore.showNotification(`Registration failed: ${message}`, 'error');
    }
  }


  function logout() {

    user.value = null;
    token.value = null;
    router.push('/login');
  }

  return { user, token, isLoggedIn, isAdmin, login, register, logout }
}, {
  persist: true,
})