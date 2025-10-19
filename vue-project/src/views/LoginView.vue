<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
const username = ref('');
const password = ref('');
const isUserLogin = ref(true); 

function handleLogin() {

  authStore.login(username.value, password.value, !isUserLogin.value);
}
</script>

<template>
  <div class="login-view">
    <div class="background-panels">
      <div class="panel panel-1"></div>
      <div class="panel panel-2"></div>
      <div class="panel panel-3"></div>
    </div>

    <div class="login-box">
      <!-- NEW: Tab Navigation -->
      <div class="login-tabs">
        <button @click="isUserLogin = true" :class="{ active: isUserLogin }">User Login</button>
        <button @click="isUserLogin = false" :class="{ active: !isUserLogin }">Admin Login</button>
      </div>

      <div class="login-header">
        <h1>{{ isUserLogin ? 'DROPIFY' : 'ADMIN PANEL' }}</h1>
        <div class="user-icon">
          <!-- Icon can be changed for admin if desired, but this is fine -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">USERNAME:</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="input-group">
          <label for="password">PASSWORD:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">LOGIN</button>
      </form>
      <p v-if="isUserLogin" class="create-account">
        NOT A MEMBER? <RouterLink to="/register">CREATE ACCOUNT</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* --- THIS IS THE FIX --- */
.input-group input {
  /* This overrides the global uppercase style from main.css */
  text-transform: none; 
}
/* --- END OF FIX --- */

.login-view { display: flex; justify-content: center; align-items: center; flex-grow: 1; position: relative; overflow: hidden; }
.login-tabs { display: flex; margin-bottom: 20px; border-bottom: 1px solid #444; }
.login-tabs button { flex: 1; padding: 15px; background-color: transparent; color: #888; font-size: 1rem; font-weight: bold; border-bottom: 3px solid transparent; }
.login-tabs button.active { color: var(--white); border-bottom-color: var(--selective-yellow); }
.background-panels { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; z-index: 1; filter: grayscale(0.8); }
.panel { flex: 1; background-position: center; background-repeat: no-repeat; background-size: cover;  }
.panel-1 { background-image: url('/images/login-bg-1.png'); }
.panel-2 { background-image: url('/images/login-bg-2.png'); }
.panel-3 { background-image: url('/images/login-bg-3.png'); }
.login-box { position: relative; z-index: 2; background-color: rgba(30, 30, 30, 0.85); color: var(--white); padding: 40px; width: 100%; max-width: 420px; }
.login-header { text-align: center; margin-bottom: 30px; }
.login-header h1 { font-size: 2.5rem; letter-spacing: 2px; margin-bottom: 10px; }
.user-icon svg { width: 30px; height: 30px; }
form { display: flex; flex-direction: column; gap: 20px; }
.input-group label { font-size: 0.9rem; margin-bottom: 8px; }
.input-group input { background-color: transparent; border: 1px solid var(--white); padding: 12px; color: var(--white); font-size: 1rem; }
button[type="submit"] { background-color: #6c6c6c; color: var(--white); padding: 14px; font-size: 1rem; font-weight: bold; margin-top: 10px; border: none; cursor: pointer; }
.create-account { text-align: center; margin-top: 25px; font-size: 0.8rem; }
.create-account a { text-decoration: underline; color: var(--white); font-weight: bold; }
</style>