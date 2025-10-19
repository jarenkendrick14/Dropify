<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const orders = ref([]);
const isLoading = ref(true);
const selectedOrder = ref(null);
const isModalOpen = ref(false);

const searchTerm = ref('');
const sortBy = ref('-createdAt');
let debounceTimer = null;

const fetchOrders = async () => {
  isLoading.value = true;
  try {
    const params = new URLSearchParams();
    if (searchTerm.value) params.append('search', searchTerm.value);
    if (sortBy.value) params.append('sort', sortBy.value);

    const config = { 
      headers: { Authorization: `Bearer ${authStore.token}` },
      params: params
    };
    const { data } = await axios.get('http://localhost:5000/api/orders', config);
    orders.value = data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  } finally {
    isLoading.value = false;
  }
};

watch(sortBy, fetchOrders);
watch(searchTerm, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchOrders, 300);
});

const viewOrderDetails = (order) => {
  selectedOrder.value = { ...order, status: order.status };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedOrder.value = null;
};

const updateStatus = async () => {
  if (!selectedOrder.value) return;
  try {
    const config = { headers: { Authorization: `Bearer ${authStore.token}` } };
    await axios.put(
      `http://localhost:5000/api/orders/${selectedOrder.value._id}/status`,
      { status: selectedOrder.value.status },
      config
    );
    closeModal();
    fetchOrders();
  } catch (error) {
    console.error("Failed to update status:", error);
    alert("Failed to update order status.");
  }
};

const deleteOrder = async (orderId) => {
  if (confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')) {
    try {
      const config = { headers: { Authorization: `Bearer ${authStore.token}` } };
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, config);
      closeModal();
      fetchOrders();
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert('Failed to delete order.');
    }
  }
};

const formatDate = (dateString) => new Date(dateString).toLocaleString();

onMounted(fetchOrders);
</script>

<template>
  <div class="order-management">
    <div class="container">
      <h1>Order Management</h1>
      
      <div class="filter-bar">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Search by customer username..." 
          class="search-input"
        />
        <select v-model="sortBy" class="sort-select">
          <option value="-createdAt">Sort by: Newest Order</option>
          <option value="createdAt">Sort by: Oldest Order</option>
          <option value="-totalPrice">Sort by: Total (High-Low)</option>
          <option value="totalPrice">Sort by: Total (Low-High)</option>
        </select>
      </div>

      <div v-if="isLoading" class="loading-state"><p>Loading Orders...</p></div>
      <table v-else class="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id">
            <td>{{ order._id.substring(0, 8) }}...</td>
            <td>{{ order.user?.username || 'N/A' }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>₱{{ order.totalPrice.toFixed(2) }}</td>
            <td><span :class="['status-tag', order.status.toLowerCase()]">{{ order.status }}</span></td>
            <td class="actions">
              <button @click="viewOrderDetails(order)" class="details-btn">Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Order Details Modal -->
    <div v-if="isModalOpen && selectedOrder" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button @click="closeModal" class="close-btn-modal">✖</button>
        <h2>Order Details (ID: {{ selectedOrder._id.substring(0, 8) }}...)</h2>
        <div class="order-details-grid">
          <div>
            <strong>Customer:</strong> {{ selectedOrder.user?.username }}<br>
            <strong>Date:</strong> {{ formatDate(selectedOrder.createdAt) }}<br>
            <strong>Total:</strong> ₱{{ selectedOrder.totalPrice.toFixed(2) }}
          </div>
          <div>
            <strong>Shipping To:</strong><br>
            {{ selectedOrder.shippingAddress.name }}<br>
            {{ selectedOrder.shippingAddress.address }}<br>
            {{ selectedOrder.shippingAddress.city }}, {{ selectedOrder.shippingAddress.postalCode }}<br>
            {{ selectedOrder.shippingAddress.email }}
          </div>
        </div>
        <h3>Items Ordered</h3>
        <ul class="item-list">
          <li v-for="item in selectedOrder.orderItems" :key="item._id">
            <span>{{ item.name }} (x{{ item.quantity }})</span>
            <span>₱{{ (item.price * item.quantity).toFixed(2) }}</span>
          </li>
        </ul>
        <div class="modal-actions">
          <div class="status-update">
            <label for="order-status">Update Status:</label>
            <select v-model="selectedOrder.status" id="order-status">
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            <button @click="updateStatus" class="save-btn">Save Status</button>
          </div>
          <button @click="deleteOrder(selectedOrder._id)" class="delete-btn-modal">
            Delete Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main page styles */
.order-management { padding: 40px; background-color: #f4f7f6; flex-grow: 1; color: var(--smoky-black); }
.container { max-width: 1200px; margin: 0 auto; }
h1 { margin-bottom: 20px; font-weight: normal; border-bottom: 1px solid #e0e0e0; padding-bottom: 20px; }
.loading-state { text-align: center; padding: 40px; font-size: 1.2rem; }

/* Filter Bar Styles */
.filter-bar { display: flex; gap: 20px; margin-bottom: 20px; }
.search-input, .sort-select { padding: 12px; font-size: 1rem; border: 1px solid #ccc; border-radius: 4px; font-family: 'Share Tech Mono', monospace; text-transform: uppercase; }
.search-input { flex-grow: 1; }

/* Table Styles */
.order-table { width: 100%; border-collapse: collapse; background-color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.order-table th, .order-table td { border-bottom: 1px solid #eee; padding: 16px; text-align: left; vertical-align: middle; }
.order-table th { background-color: #f8f9fa; font-weight: bold; }
.status-tag { padding: 5px 10px; border-radius: 4px; color: white; font-weight: bold; font-size: 0.8rem; letter-spacing: 1px; }
.status-tag.processing { background-color: #4A90E2; }
.status-tag.shipped { background-color: #f5a623; }
.status-tag.delivered { background-color: #28a745; }
.status-tag.cancelled { background-color: #D0021B; }

/* --- BUTTON STYLES FIX --- */

/* Base style for all buttons in the "actions" column */
.actions button {
  padding: 8px 15px;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 1px;
  color: var(--white);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.details-btn {
  background-color: #6c757d;
}
.details-btn:hover {
  background-color: #5a6268;
}

/* Modal Styles */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 100; }
.modal-content { position: relative; background-color: white; padding: 30px 40px; border-radius: 8px; width: 100%; max-width: 700px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
.close-btn-modal { position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #aaa; }
.order-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; padding-bottom: 20px; border-bottom: 1px solid #eee; line-height: 1.6; }
.item-list { list-style: none; padding: 0; margin-bottom: 20px; }
.item-list li { display: flex; justify-content: space-between; padding: 8px 0; }

/* Modal Actions section at the bottom */
.modal-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.status-update {
  display: flex;
  align-items: center;
  gap: 10px;
}
.status-update select {
  padding: 10px;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Base style for buttons inside the modal actions */
.modal-actions button {
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: bold;
  letter-spacing: 1px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

/* "Save Status" button */
.save-btn {
  background-color: #28a745; /* Green */
  color: white;
}
.save-btn:hover {
  background-color: #218838;
}

/* "Delete Order" button */
.delete-btn-modal {
  background-color: #D0021B; /* Red */
  color: white;
}
.delete-btn-modal:hover {
  background-color: #A00114;
}
</style>