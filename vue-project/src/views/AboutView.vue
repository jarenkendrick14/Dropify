<template>
  <div class="about-view">
    <div class="about-content">
      <div class="image-container">
        <img src="/images/about-us-img.png" alt="About Us Image">
      </div>
      <div class="text-container">
        <h1>ABOUT US</h1>
        <p>
          Born from the creative fire of DJ, Aaron, Kendrick, Mika, and Kenneth, Dropify is more than just merch — it’s a movement. This final project blends streetwear grit with personal stories, turning everyday pieces into wearable statements. Locally made, proudly independent, and unapologetically bold, each item reflects the crew’s journey from concept to creation.

          Whether you're repping the team or just vibing with the design, Dropify is for those who build from the ground up — and wear it loud.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  height: 100vh;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.about-content {
  display: flex;
  gap: 60px;
  align-items: center;
  max-width: 1200px;
}
.image-container {
  flex: 1;
}
.image-container img {
  width: 100%;
  height: auto;
  display: block;
}
.text-container {
  flex: 1;
}
h1 {
  font-size: 3.5rem;
  margin-bottom: 25px;
}
p {
  line-height: 1.8;
  font-size: 1rem;
}
</style>
