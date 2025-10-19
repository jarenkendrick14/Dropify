<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const products = ref([]);
const editingProduct = ref(null);
const isModalOpen = ref(false);

// State for filtering
const searchTerm = ref('');
const sortBy = ref('-createdAt');
const category = ref(''); // State for category filter

let debounceTimer = null;

// The fetch function is now dynamic with category filtering
const fetchProducts = async () => {
  try {
    const params = new URLSearchParams();
    if (searchTerm.value) params.append('search', searchTerm.value);
    if (sortBy.value) params.append('sort', sortBy.value);
    if (category.value) params.append('category', category.value);
    
    // Pagination params
    params.append('page', page.value);
    params.append('limit', limit.value);

    const { data } = await axios.get(`http://localhost:5000/api/products?${params.toString()}`);
    
    products.value = data.products;
    page.value = data.page;
    totalPages.value = data.pages;

  } catch (error) {
    console.error("Failed to fetch products:", error);
    alert("Could not load products. Please check the console for errors.");
  }
};

// State for pagination
const page = ref(1);
const totalPages = ref(1);
const limit = ref(10);

const goToPage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    page.value = newPage;
  }
};

// Watchers to trigger re-fetching
// Combined watcher for instant-update filters
watch([sortBy, limit, category], () => {
  page.value = 1; // Reset to first page when filters change
  fetchProducts();
});

// Separate watcher for debounced search
watch(searchTerm, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    page.value = 1; // Reset to first page on new search
    fetchProducts();
  }, 300);
});

// Watcher for page changes
watch(page, () => {
  fetchProducts();
});

// Modal and CRUD functions
const openCreateModal = () => {
  editingProduct.value = { name: '', price: 0, image: '', category: 'shirts' };
  isModalOpen.value = true;
};
const openEditModal = (product) => {
  editingProduct.value = { ...product };
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
  editingProduct.value = null;
};
const saveProduct = async () => {
  const config = {
    headers: { Authorization: `Bearer ${authStore.token}` },
  };
  try {
    if (editingProduct.value._id) {
      await axios.put(`http://localhost:5000/api/products/${editingProduct.value._id}`, editingProduct.value, config);
    } else {
      await axios.post('http://localhost:5000/api/products', editingProduct.value, config);
    }
    closeModal();
    fetchProducts(); // Refresh the list
  } catch (error) {
    console.error("Failed to save product:", error);
    alert("Error saving product. Check console for details.");
  }
};
const deleteProduct = async (productId) => {
  if (confirm('Are you sure you want to delete this product?')) {
    const config = {
      headers: { Authorization: `Bearer ${authStore.token}` },
    };
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`, config);
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Error deleting product. Check console for details.");
    }
  }
};

onMounted(fetchProducts);
</script>

<template>
  <div class="admin-dashboard">
    <div class="container">
      <div class="dashboard-header">
        <h1>Product Management</h1>
        <button @click="openCreateModal" class="create-btn">Create New Product</button>
      </div>

      <div class="filter-bar">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Search by product name..." 
          class="search-input"
        />
        <div class="select-group">
          <select v-model="category">
            <option value="">All Categories</option>
            <option value="shirts">Shirts</option>
            <option value="hoodies">Hoodies</option>
            <option value="caps">Caps</option>
          </select>
          <select v-model="sortBy">
            <option value="-createdAt">Sort by: Newest</option>
            <option value="createdAt">Sort by: Oldest</option>
            <option value="price">Sort by: Price (Low-High)</option>
            <option value="-price">Sort by: Price (High-Low)</option>
            <option value="name">Sort by: Name (A-Z)</option>
          </select>
          <select v-model="limit">
            <option value="10">Show: 10</option>
            <option value="25">Show: 25</option>
            <option value="50">Show: 50</option>
          </select>
        </div>
      </div>

      <table class="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <td>{{ product.name }}</td>
            <td>₱{{ product.price.toFixed(2) }}</td>
            <td>{{ product.category }}</td>
            <td class="actions">
              <button @click="openEditModal(product)">Edit</button>
              <button @click="deleteProduct(product._id)" class="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="products.length === 0" class="no-results">
        <p>No products found.</p>
      </div>

      <div v-if="totalPages > 1" class="pagination-controls">
        <button @click="goToPage(page - 1)" :disabled="page === 1">Previous</button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button @click="goToPage(page + 1)" :disabled="page === totalPages">Next</button>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ editingProduct._id ? 'Edit Product' : 'Create Product' }}</h2>
        <form @submit.prevent="saveProduct">
          <div class="form-group">
            <label>Name</label>
            <input v-model="editingProduct.name" required>
          </div>
          <div class="form-group">
            <label>Price</label>
            <input v-model.number="editingProduct.price" type="number" step="0.01" required>
          </div>
          <div class="form-group">
            <label>Image Path</label>
            <input v-model="editingProduct.image" required>
          </div>
          <div class="form-group">
            <label>Category</label>
            <select v-model="editingProduct.category" required>
              <option value="shirts">Shirts</option>
              <option value="hoodies">Hoodies</option>
              <option value="caps">Caps</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="submit">Save Product</button>
            <button type="button" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard { padding: 40px; background-color: #f4f7f6; flex-grow: 1; color: var(--smoky-black); }
.container { max-width: 1200px; margin: 0 auto; }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
h1, h2 { font-weight: normal; }
.filter-bar { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
.select-group { display: flex; gap: 20px; }
.search-input, .filter-bar select { padding: 12px; font-size: 1rem; border: 1px solid #ccc; border-radius: 4px; font-family: 'Share Tech Mono', monospace; text-transform: uppercase; }
.search-input { flex-grow: 1; }
.create-btn { background-color: var(--smoky-black); color: var(--white); padding: 12px 20px; font-size: 0.9rem; letter-spacing: 1px; border: none; cursor: pointer; transition: all 0.2s ease-in-out; }
.create-btn:hover { background-color: #333; }
.product-table { width: 100%; border-collapse: collapse; background-color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.product-table th, .product-table td { border-bottom: 1px solid #eee; padding: 16px; text-align: left; }
.product-table th { background-color: #f8f9fa; font-weight: bold; }
.actions button { padding: 6px 12px; font-size: 0.8rem; margin-right: 8px; color: var(--white); border: none; cursor: pointer; transition: all 0.2s ease-in-out; }
.actions button:first-of-type { background-color: #4A90E2; }
.actions button:first-of-type:hover { background-color: #357ABD; }
.actions .delete-btn { background-color: #D0021B; }
.actions .delete-btn:hover { background-color: #A00114; }
.no-results { text-align: center; padding: 40px; background-color: #fff; margin-top: 1px; }
.pagination-controls { display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 30px; }
.pagination-controls button { padding: 8px 16px; background-color: var(--smoky-black); color: white; border: none; cursor: pointer; }
.pagination-controls button:disabled { background-color: #ccc; cursor: not-allowed; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 100; }
.modal-content { background-color: white; padding: 30px 40px; border-radius: 4px; width: 100%; max-width: 500px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: bold; font-size: 0.9rem; }
.form-group input, .form-group select { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
.modal-actions { margin-top: 30px; display: flex; justify-content: flex-end; gap: 15px; }
.modal-actions button { padding: 10px 20px; font-size: 0.9rem; font-weight: bold; letter-spacing: 1px; border: none; cursor: pointer; transition: all 0.2s ease-in-out; }
.modal-actions button[type="submit"] { background-color: #28a745; color: white; }
.modal-actions button[type="submit"]:hover { background-color: #218838; }
.modal-actions button[type="button"] { background-color: #6c757d; color: white; }
.modal-actions button[type="button"]:hover { background-color: #5a6268; }
</style>