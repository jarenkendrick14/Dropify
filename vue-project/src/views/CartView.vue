<script setup>
import { useCartStore } from '../stores/cart';
import { RouterLink } from 'vue-router';

const cartStore = useCartStore();

let debounceTimer = null;

const handleQuantityInput = (productId, event) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    cartStore.updateQuantity(productId, event.target.value);
  }, 500); // 500ms delay before sending API request
};
</script>

<template>
  <div class="cart-view">
    <h1>IN YOUR SHOPPING BAG</h1>
    <div v-if="!cartStore.items || cartStore.items.length === 0" class="empty-cart-message">
      <p>Your shopping bag is empty.</p>
    </div>
    <div v-else class="cart-content">
      <div class="cart-items">
        <div class="cart-header">
          <span>PRODUCT</span>
          <span class="align-center">ITEM QUANTITY</span>
          <span class="align-right">TOTAL</span>
          <span></span>
        </div>
        <div v-for="item in cartStore.items" :key="item.product._id" class="cart-item">
          <div class="product-details">
            <img :src="item.product.image" :alt="item.product.name">
            <p>{{ item.product.name }}</p>
          </div>
          
          <div class="item-quantity">
            <button @click="cartStore.decreaseQuantity(item.product._id)">-</button>
            
            <input 
              type="number" 
              :value="item.quantity" 
              @input="handleQuantityInput(item.product._id, $event)"
              min="0"
              class="quantity-input"
            />
            
            <button @click="cartStore.increaseQuantity(item.product._id)">+</button>
          </div>

          <div class="item-total">
            <p>₱ {{ (item.product.price * item.quantity).toFixed(2) }}</p>
          </div>
          <div class="item-remove">
            <button @click="cartStore.removeFromCart(item.product._id)" class="remove-btn">✖</button>
          </div>
        </div>
      </div>
      <div class="cart-summary">
        <div class="summary-details">
          <h2 class="subtotal">SUBTOTAL: ₱ {{ cartStore.cartTotal.toFixed(2) }}</h2>
          <RouterLink to="/checkout" class="checkout-button">PROCEED TO CHECKOUT</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-view { width: 100%; max-width: 1200px; margin: 0 auto; padding: 60px 40px; }
h1 { font-size: 1.5rem; margin-bottom: 40px; }
.empty-cart-message { text-align: center; padding: 80px 0; font-size: 1.2rem; color: var(--gray); }
.cart-header, .cart-item { display: grid; grid-template-columns: 3fr 1fr 1fr 0.5fr; align-items: center; gap: 20px; }
.cart-header { padding-bottom: 10px; border-bottom: 1px solid var(--gray); font-size: 0.9rem; color: var(--gray); margin-bottom: 20px; }
.cart-item { padding: 20px 0; border-bottom: 1px solid #e0e0e0; }
.align-center { text-align: center; }
.align-right { text-align: right; }
.product-details { display: flex; align-items: center; gap: 20px; }
.product-details img { width: 80px; height: 80px; object-fit: cover; }
.item-quantity {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  width: fit-content;
  margin: 0 auto;
}
.quantity-input {
  width: 50px;
  text-align: center;
  border: none;
  font-size: 1rem;
  font-family: 'Share Tech Mono', monospace;
  -moz-appearance: textfield; /* For Firefox */
}
/* For Chrome, Safari, Edge, Opera */
.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.item-quantity button {
  background: none;
  border: none;
  font-size: 1.2rem;
  padding: 5px 10px;
  cursor: pointer;
  color: #555;
}
.item-total { text-align: right; font-weight: bold; }
.item-remove { text-align: right; }
.remove-btn { background: none; border: none; color: var(--gray); font-size: 1.2rem; cursor: pointer; }
.remove-btn:hover { color: red; }
.cart-summary { display: flex; justify-content: flex-end; margin-top: 40px; }
.summary-details { text-align: right; width: 100%; max-width: 350px; }
.subtotal { font-size: 1.3rem; margin-bottom: 20px; }
.checkout-button { width: 100%; display: inline-block; text-align: center; text-decoration: none; background-color: var(--smoky-black); color: var(--white); padding: 15px 30px; font-size: 1rem; cursor: pointer; border: none; }
</style>