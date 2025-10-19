import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const isVisible = ref(false)
  const message = ref('')
  const type = ref('success') // 'success' or 'error'

  let timeoutId = null

  function showNotification(newMessage, newType = 'success') {
    // If a notification is already showing, clear its timer
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    message.value = newMessage
    type.value = newType
    isVisible.value = true

    // Automatically hide the notification after 3 seconds
    timeoutId = setTimeout(() => {
      hideNotification()
    }, 3000)
  }

  function hideNotification() {
    isVisible.value = false
    timeoutId = null
  }

  return { isVisible, message, type, showNotification, hideNotification }
})