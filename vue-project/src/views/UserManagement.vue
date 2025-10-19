<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const users = ref([]);
const isLoading = ref(true);

// State for filtering
const searchTerm = ref('');
const sortBy = ref('-createdAt');
let debounceTimer = null;

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const params = new URLSearchParams();
    if (searchTerm.value) params.append('search', searchTerm.value);
    if (sortBy.value) params.append('sort', sortBy.value);

    const config = { 
      headers: { Authorization: `Bearer ${authStore.token}` },
      params: params
    };
    const { data } = await axios.get('http://localhost:5000/api/users', config);
    users.value = data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
  } finally {
    isLoading.value = false;
  }
};

// Watchers to re-fetch on filter change
watch(sortBy, fetchUsers);
watch(searchTerm, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchUsers, 300);
});

// Helper to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleString();
};

const toggleAdminStatus = async (user) => {
  if (user._id === authStore.user.id) {
    alert("You cannot change your own admin status.");
    return;
  }

  const newStatus = !user.isAdmin;
  if (confirm(`Are you sure you want to ${newStatus ? 'promote' : 'demote'} ${user.username}?`)) {
    try {
      const config = { headers: { Authorization: `Bearer ${authStore.token}` } };
      await axios.put(`http://localhost:5000/api/users/${user._id}`, { isAdmin: newStatus }, config);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user role:", error);
      alert('Failed to update role.');
    }
  }
};

const deleteUser = async (user) => {
  if (user._id === authStore.user.id) {
    alert("You cannot delete your own account.");
    return;
  }
  if (confirm(`Are you sure you want to permanently delete the user ${user.username}? This action cannot be undone.`)) {
    try {
      const config = { headers: { Authorization: `Bearer ${authStore.token}` } };
      await axios.delete(`http://localhost:5000/api/users/${user._id}`, config);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert('Failed to delete user.');
    }
  }
};

onMounted(fetchUsers);
</script>

<template>
  <div class="user-management">
    <div class="container">
      <h1>User Management</h1>

      <div class="filter-bar">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Search by username..." 
          class="search-input"
        />
        <select v-model="sortBy" class="sort-select">
          <option value="-createdAt">Sort by: Newest Member</option>
          <option value="createdAt">Sort by: Oldest Member</option>
          <option value="-lastLogin">Sort by: Last Login</option>
          <option value="username">Sort by: Username (A-Z)</option>
        </select>
      </div>

      <div v-if="isLoading" class="loading-state"><p>Loading Users...</p></div>
      <table v-else class="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Member Since</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user.username }}</td>
            <td>
              <span :class="['role-tag', user.isAdmin ? 'admin' : 'user']">
                {{ user.isAdmin ? 'Admin' : 'User' }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>{{ formatDate(user.lastLogin) }}</td>
            <td class="actions">
              <button @click="toggleAdminStatus(user)" class="role-btn">
                {{ user.isAdmin ? 'Demote' : 'Promote' }}
              </button>
              <button @click="deleteUser(user)" class="delete-btn">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.user-management {
  padding: 40px;
  background-color: #f4f7f6;
  flex-grow: 1;
  color: var(--smoky-black);
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
h1 {
  margin-bottom: 30px;
  font-weight: normal;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}
.filter-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.search-input, .sort-select {
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.search-input { 
  flex-grow: 1; 
}
.sort-select {
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
}
.loading-state {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.user-table th, .user-table td {
  border-bottom: 1px solid #eee;
  padding: 16px;
  text-align: left;
  vertical-align: middle;
}
.user-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}
.role-tag {
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8rem;
  letter-spacing: 1px;
}
.role-tag.admin {
  background-color: var(--selective-yellow);
  color: var(--smoky-black);
}
.role-tag.user {
  background-color: #6c757d;
  color: white;
}
.actions button {
  padding: 8px 15px;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 1px;
  margin-right: 8px;
  color: var(--white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.role-btn {
  background-color: #4A90E2;
}
.role-btn:hover {
  background-color: #357ABD;
}
.delete-btn {
  background-color: #D0021B;
}
.delete-btn:hover {
  background-color: #A00114;
}
</style>