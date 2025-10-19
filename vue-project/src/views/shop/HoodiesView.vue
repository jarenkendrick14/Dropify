<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import ProductCard from '../../components/ProductCard.vue';

const hoodies = ref([]);
const searchTerm = ref('');
const sortBy = ref('-createdAt');
const isLoading = ref(true);
let debounceTimer = null;

const fetchHoodies = async () => {
  isLoading.value = true;
  try {
    const params = new URLSearchParams();
    params.append('category', 'hoodies');
    if (searchTerm.value) {
      params.append('search', searchTerm.value);
    }
    if (sortBy.value) {
      params.append('sort', sortBy.value);
    }
    
    const { data } = await axios.get(`http://localhost:5000/api/products?${params.toString()}`);
    hoodies.value = data.products;
  } catch (error) {
    console.error('Failed to fetch hoodies:', error);
  } finally {
    isLoading.value = false;
  }
};

watch(searchTerm, () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchHoodies, 300);
});

watch(sortBy, fetchHoodies);

onMounted(fetchHoodies);
</script>

<template>
  <div class="shop-page">
    <div class="filter-bar">
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Search hoodies..."
          class="search-input"
        />
      </div>
      <div class="sort-container">
        <label for="sort-by">Sort By:</label>
        <select v-model="sortBy" id="sort-by" class="sort-select">
          <option value="-createdAt">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <p>Loading Products...</p>
    </div>
    <div v-else>
      <TransitionGroup tag="div" name="stagger" class="product-grid" appear>
        <ProductCard 
          v-for="(hoodie, index) in hoodies" 
          :key="hoodie._id" 
          :product="hoodie"
          :style="{ transitionDelay: `${index * 50}ms` }"
        />
      </TransitionGroup>
      
      <div v-if="hoodies.length === 0" class="no-results">
        <p>No products found matching your criteria.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stagger-enter-active,
.stagger-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.stagger-enter-from,
.stagger-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.filter-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; gap: 20px; flex-wrap: wrap; }
.search-input { padding: 10px 15px; width: 300px; border: 1px solid #ccc; font-family: 'Share Tech Mono', monospace; text-transform: uppercase; }
.sort-container { display: flex; align-items: center; gap: 10px; }
.sort-select { padding: 10px; border: 1px solid #ccc; background-color: white; font-family: 'Share Tech Mono', monospace; text-transform: uppercase; }
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 40px;
}
.no-results, .loading-state {
  text-align: center;
  padding: 50px;
  color: var(--gray);
  font-size: 1.2rem;
}
</style>