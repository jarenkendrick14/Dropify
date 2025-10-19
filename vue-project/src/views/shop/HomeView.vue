<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import axios from 'axios';
import ProductCard from '../components/ProductCard.vue';

const featuredProducts = ref([]);

const fetchFeaturedProducts = async () => {
  try {
    const { data } = await axios.get('http://localhost:5000/api/products');
    featuredProducts.value = data.products.slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
  }
};

onMounted(() => {
  fetchFeaturedProducts();
});
</script>

<template>
  <div class="home-page-container">
    <section class="home-hero">
      <div class="hero-content">
        <h1 class="brand-title">
          <RouterLink to="/shop">DROPIFY</RouterLink>
        </h1>
      </div>
    </section>

    <section class="featured-products-section">
      <div class="container">
        <h2 class="section-title">FEATURED DROPS</h2>
        
        <TransitionGroup tag="div" name="stagger" class="product-grid" appear>
          <ProductCard 
            v-for="(product, index) in featuredProducts" 
            :key="product._id" 
            :product="product"
            :style="{ transitionDelay: `${index * 50}ms` }"
          />
        </TransitionGroup>

        <div class="section-cta">
          <RouterLink to="/shop" class="cta-button">VIEW ALL MERCH</RouterLink>
        </div>
      </div>
    </section>

    <section class="brand-mission-section">
      <div class="mission-container">
        <h2 class="section-title-light">OUR PHILOSOPHY</h2>
        <p class="mission-statement">
          "WE DON'T JUST PRINT ON FABRIC. WE AMPLIFY THE VOICES OF CREATORS. EACH DROP IS A COLLABORATION, A STORY, AND A PIECE OF THE CULTURE YOU HELP BUILD."
        </p>
        <div class="section-cta mission-cta">
          <RouterLink to="/about" class="cta-button-outline">LEARN MORE ABOUT US</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Styles for the stagger animation */
.stagger-enter-active,
.stagger-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.stagger-enter-from,
.stagger-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.home-page-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.home-hero {
  margin-top: -95px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-image: url('/images/hero-background.jpg'); 
  background-color: #1a1a1a; 
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  filter: grayscale(100%);
  color: white;
}
.hero-content { text-align: center; }
.brand-title {
  font-size: clamp(2.5rem, 5vw, 6rem); 
  font-weight: bold;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
  animation: fadeIn 1.5s ease-in-out;
}
.brand-title a {
  color: inherit;
  text-decoration: none;
  display: inline-block;
  transition: transform 0.3s ease;
}
.brand-title a:hover { transform: scale(1.03); }
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}
.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: normal;
  margin-bottom: 50px;
  letter-spacing: 2px;
}
.section-cta {
  text-align: center;
  margin-top: 50px;
}
.cta-button, .cta-button-outline {
  display: inline-block;
  padding: 15px 40px;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}
.cta-button {
  background-color: var(--smoky-black);
  color: var(--white);
}
.cta-button:hover {
  background-color: #333;
}
.featured-products-section {
  padding: 80px 0;
  background-color: var(--white);
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}
@media (max-width: 992px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 576px) {
  .product-grid { grid-template-columns: 1fr; }
}
.brand-mission-section {
  padding: 100px 40px;
  background-color: var(--smoky-black);
  color: var(--white);
}
.mission-container {
  max-width: 900px;
  margin: 0 auto;
}
.section-title-light {
  font-size: 1.5rem;
  font-weight: normal;
  margin-bottom: 40px;
  letter-spacing: 2px;
  text-align: left; 
}
.mission-statement {
  font-size: 1.8rem;
  line-height: 1.7;
  text-align: left;
  font-style: normal;
}
.section-cta.mission-cta {
  text-align: left;
}
.cta-button-outline {
  border: 2px solid var(--white);
  color: var(--white);
}
.cta-button-outline:hover {
  background-color: var(--white);
  color: var(--smoky-black);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>