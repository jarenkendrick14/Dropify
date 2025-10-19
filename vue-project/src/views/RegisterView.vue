<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
const username = ref('');
const password = ref('');

function handleRegister() {
  if (!username.value || !password.value) {
    alert('Please enter a username and password.');
    return;
  }
  authStore.register(username.value, password.value);
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
      <div class="login-header">
        <h1>CREATE ACCOUNT</h1>
        <div class="user-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
      </div>
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="username">USERNAME:</label>
          <!-- FIX: Added v-model to connect this input to the 'username' variable -->
          <input type="text" id="username" v-model="username" required>
        </div>
        <div class="input-group">
          <label for="password">PASSWORD:</label>
          <!-- FIX: Added v-model to connect this input to the 'password' variable -->
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">CREATE ACCOUNT</button>
      </form>
      <p class="create-account">ALREADY A MEMBER? <RouterLink to="/login">LOGIN</RouterLink></p>
    </div>
  </div>
</template>

<style scoped>
.input-group input {
  /* This overrides the global uppercase style from main.css */
  text-transform: none;
}


.login-view { display: flex; justify-content: center; align-items: center; flex-grow: 1; position: relative; overflow: hidden; }
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
button { background-color: #6c6c6c; color: var(--white); padding: 14px; font-size: 1rem; font-weight: bold; margin-top: 10px; border: none; cursor: pointer; }
.create-account { text-align: center; margin-top: 25px; font-size: 0.8rem; }
.create-account a { text-decoration: underline; color: var(--white); font-weight: bold; }
</style>