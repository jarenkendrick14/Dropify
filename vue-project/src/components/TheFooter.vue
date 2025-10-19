<template>
  <footer class="footer">
    <div class="footer-content">
      <span>WD - 303</span>
      <span>ALL RIGHTS RESERVED</span>
      <span>DROPIFY 2025</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
  background-color: var(--smoky-black);
  color: var(--selective-yellow);
  padding: 20px 40px; /* Increased from 15px */
}

.contact-theme .footer {
    background-color: var(--carmell-red);
    color: var(--white);
    border-top: 1px solid var(--white);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  font-size: 0.9rem; /* Increased from 0.8rem */
}
</style>