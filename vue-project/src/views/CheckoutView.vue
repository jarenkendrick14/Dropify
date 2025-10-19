<script setup>
import { ref } from 'vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { useRouter } from 'vue-router';
import axios from 'axios';

const cartStore = useCartStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const router = useRouter();

const form = ref({
  name: authStore.user?.username || '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
});

const isLoading = ref(false);

async function placeOrder() {
  if (cartStore.items.length === 0) {
    notificationStore.showNotification('Your cart is empty.', 'error');
    router.push('/shop'); // Redirect to shop if cart is empty
    return;
  }
  
  isLoading.value = true;

  const orderData = {
    orderItems: cartStore.items.map(item => ({
      _id: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      image: item.product.image,
      price: item.product.price,
    })),
    shippingAddress: {
      name: form.value.name,
      email: form.value.email,
      address: form.value.address,
      city: form.value.city,
      postalCode: form.value.postalCode,
    },
    totalPrice: cartStore.cartTotal,
  };

  try {
    const config = { headers: { Authorization: `Bearer ${authStore.token}` } };
    const { data: createdOrder } = await axios.post('http://localhost:5000/api/orders', orderData, config);

    notificationStore.showNotification('Thank you for your order! It has been placed successfully.');
    
    // The backend now clears the DB cart, so we just clear the local state
    // We can fetch the (now empty) cart to be perfectly in sync
    await cartStore.fetchCart();

    // Optionally, redirect to an order success page in the future
    // For now, redirect home
    router.push({ name: 'home' });

  } catch (error) {
    console.error("Failed to place order:", error);
    notificationStore.showNotification(error.response?.data?.message || 'Failed to place order. Please try again.', 'error');
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="checkout-view">
    <h1>CHECKOUT</h1>
    <div class="checkout-layout">
      
      <div class="shipping-details">
        <h2>SHIPPING DETAILS</h2>
        <form @submit.prevent="placeOrder" id="checkout-form">
          <div class="form-group">
            <label for="name">FULL NAME</label>
            <input type="text" id="name" v-model="form.name" required>
          </div>
          <div class="form-group">
            <label for="email">EMAIL ADDRESS</label>
            <input type="email" id="email" v-model="form.email" required>
          </div>
          <div class="form-group">
            <label for="address">STREET ADDRESS</label>
            <input type="text" id="address" v-model="form.address" required>
          </div>
          <div class="form-group">
            <label for="city">CITY</label>
            <input type="text" id="city" v-model="form.city" required>
          </div>
          <div class="form-group">
            <label for="postal-code">POSTAL CODE</label>
            <input type="text" id="postal-code" v-model="form.postalCode" required>
          </div>
        </form>
      </div>

      <div class="order-summary">
        <h2>YOUR ORDER</h2>
        <div class="summary-items">
          <div v-for="item in cartStore.items" :key="item.product._id" class="summary-item">
            <span>{{ item.product.name }} (x{{ item.quantity }})</span>
            <span>₱ {{ (item.product.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
        <div class="summary-total">
          <strong>TOTAL</strong>
          <strong>₱ {{ cartStore.cartTotal.toFixed(2) }}</strong>
        </div>
        <button type="submit" form="checkout-form" class="place-order-button" :disabled="isLoading">
          {{ isLoading ? 'PLACING ORDER...' : 'PLACE ORDER' }}
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.checkout-view {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 40px;
  flex-grow: 1;
}
h1, h2 {
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 30px;
}
.checkout-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 60px;
}
.form-group {
  margin-bottom: 25px;
}
.form-group label {
  display: block;
  margin-bottom: 10px;
  font-size: 0.8rem;
}
.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  font-size: 1rem;
}
.order-summary {
  background-color: #f9f9f9;
  padding: 30px;
}
.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  gap: 15px;
}
.summary-item span:first-child {
  word-break: break-word; 
}
.summary-item span:last-child {
  white-space: nowrap; 
  text-align: right;
}
.summary-total {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  font-size: 1.2rem;
  font-weight: bold;
}
.place-order-button {
  width: 100%;
  background-color: var(--smoky-black);
  color: var(--white);
  padding: 18px 30px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.2s;
}
.place-order-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>