<template>
  <div class="contact-view">
    <div class="contact-content">
      <form class="contact-form">
        <h2>SEND US A MESSAGE</h2>
        <input type="text" id="name" placeholder="Name">
        <input type="email" id="email" placeholder="Email">
        <textarea id="message" rows="10" placeholder="Message"></textarea>
        <button type="submit">SUBMIT</button>
      </form>
      <div class="contact-info">
        <div>
          <h3>OUR ADDRESS</h3>
          <p>#1 Holy Angel Avenue<br>Sto. Rosario<br>Angeles City<br>Philippines 2009</p>
        </div>
        <div>
          <h3>OUR SOCIAL</h3>
          <div class="social-icons">
            <a href="#" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/></svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 3.25c-3.728 0-6.75 3.022-6.75 6.75s3.022 6.75 6.75 6.75 6.75-3.022 6.75-6.75-3.022-6.75-6.75-6.75zm0 1.75c2.757 0 5 2.243 5 5s-2.243 5-5 5-5-2.243-5-5 2.243-5 5-5zm5.333-2.917c-.96 0-1.75.773-1.75 1.75s.79 1.75 1.75 1.75 1.75-.773 1.75-1.75-.79-1.75-1.75-1.75z"/></svg>
            </a>
            <a href="#" aria-label="Github">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.522 0-10-4.477-10-10 0-4.839 3.438-8.816 8.21-9.845.6.111.82.38.82.837v1.488c-3.14.688-3.8-1.503-3.8-1.503-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .459.217.729.823.619 4.773-1.029 8.21-4.997 8.21-9.836 0-5.523-4.478-10-10-10z"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h3>EMAIL US</h3>
          <p>ken@dropify.com<br>mika@dropify.com<br>dj@dropify.com<br>jaren@dropify.com<br>aaron@dropify.com</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-view {
  color: var(--smoky-black);
  padding: 120px 40px 80px;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.contact-content {
  display: flex;
  gap: 100px;
  max-width: 1200px;
  width: 100%;
}
.contact-form {
  flex: 1.5;
  display: flex;
  flex-direction: column;
}
.contact-form h2 {
  font-size: 1rem;
  margin-bottom: 20px;
  font-weight: normal;
}
.contact-form input, .contact-form textarea {
  background-color: #757575; /* A slightly different gray to stand out */
  border: none;
  color: var(--white);
  padding: 15px;
  margin-bottom: 20px;
  font-size: 1rem;
  border-radius: 3px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
}
.contact-form input::placeholder, .contact-form textarea::placeholder {
  color: #dcdcdc;
  opacity: 1;
}
.contact-form button {
  align-self: flex-start;
  padding: 12px 35px;
  background-color: #e0e0e0;
  color: var(--smoky-black);
  font-size: 1rem;
  border-radius: 3px;
}
.contact-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding-top: 45px; /* Align with the top of the form fields */
}
.contact-info h3 {
  margin-bottom: 15px;
  font-size: 1.1rem;
  font-weight: normal;
}
.contact-info p {
  line-height: 1.8;
  font-size: 0.9rem;
}
.social-icons {
  display: flex;
  gap: 15px;
}
.social-icons a {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--smoky-black);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
}
.social-icons svg {
  width: 24px;
  height: 24px;
}
</style>