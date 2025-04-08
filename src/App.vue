<template>
  <header><Header /></header>

  <main>
    <RouterView />
    <Floating />
  </main>
  <!-- <footer><Footer /></footer> -->
</template>
<script setup>
import Floating from './components/layout/Floating.vue'
import Header from './components/layout/Header.vue'
// import Footer from './components/layout/Footer.vue'
</script>
<style scoped>
header {
  width: 100vw;
  margin: auto;
}
main {
  width: 60vw;
  margin: 8rem auto;
  min-height: 60vh;
}
/* footer {
  width: 100vw;
  margin: 0 auto;
} */
</style>
