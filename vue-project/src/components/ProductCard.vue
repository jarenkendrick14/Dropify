<script setup>
import { useCartStore } from '../stores/cart';
import { useNotificationStore } from '../stores/notification';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore();
const notificationStore = useNotificationStore();

function addItemToCart() {
  cartStore.addToCart(props.product);
  notificationStore.showNotification(`'${props.product.name}' was added to cart!`);
}
</script>

<template>
  <div class="product-card">
    <!-- The image is now wrapped in a container to handle the zoom effect -->
    <div class="image-container">
      <img :src="product.image" :alt="product.name" class="product-image">
    </div>
    
    <div class="product-info">
      <p class="product-name">{{ product.name }}</p>
      <p class="product-price">₱ {{ product.price.toFixed(2) }}</p>
    </div>
    
    <!-- The button is now outside the info div for easier positioning -->
    <button @click="addItemToCart" class="add-to-cart-btn">ADD TO CART</button>
  </div>
</template>

<style scoped>
/* --- THIS IS WHERE THE MAGIC HAPPENS --- */

.product-card {
  position: relative; /* Crucial for positioning the button */
  display: flex;
  flex-direction: column;
  text-align: center;
  overflow: hidden; /* Hides the button when it's outside the card */
  border: 1px solid #eee;
  transition: box-shadow 0.3s ease; /* Smooth transition for the shadow */
}

/* Add the shadow on hover */
.product-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.image-container {
  overflow: hidden; /* Hides the parts of the image that zoom out */
  width: 100%;
  aspect-ratio: 1 / 1; /* Ensures a perfect square */
  background-color: #f0f0f0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease; /* Smooth transition for the zoom */
}

/* The zoom effect on the image */
.product-card:hover .product-image {
  transform: scale(1.05); /* Zoom in by 5% */
}

.product-info {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-name {
  font-size: 1rem;
  margin-bottom: 8px;
  flex-grow: 1;
}

.product-price {
  font-size: 1rem;
  color: var(--gray);
}

/* The "ADD TO CART" button styling */
.add-to-cart-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  
  background-color: var(--smoky-black);
  color: var(--white);
  padding: 15px;
  font-weight: bold;
  letter-spacing: 1px;
  
  /* Start with the button hidden below the card */
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

/* Slide the button up into view on hover */
.product-card:hover .add-to-cart-btn {
  transform: translateY(0);
}
</style>