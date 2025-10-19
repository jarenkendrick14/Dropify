<script setup>
import { useNotificationStore } from '../stores/notification';
const notificationStore = useNotificationStore();
</script>

<template>
  <!-- Use a <Transition> for a smooth fade-in/fade-out effect -->
  <Transition name="fade">
    <div 
      v-if="notificationStore.isVisible" 
      class="notification-toast"
      :class="notificationStore.type"
      @click="notificationStore.hideNotification"
    >
      {{ notificationStore.message }}
    </div>
  </Transition>
</template>

<style scoped>
.notification-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  color: var(--white);
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
}

/* Style for success messages */
.notification-toast.success {
  background-color: #28a745; /* Green */
}

/* Style for error messages */
.notification-toast.error {
  background-color: #dc3545; /* Red */
}

/* Vue Transition classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>