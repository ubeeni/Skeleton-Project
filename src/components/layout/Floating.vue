<template>
  <div class="floating-wrapper">
    <BtnCircle :color="'var(--color-primary)'" :icon="IconAdd" @click="moveToAdd"></BtnCircle>
    <BtnCircle :color="'var(--color-secondary)'" :icon="IconTop" @click="scrollToTop"></BtnCircle>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BtnCircle from '../button/BtnCircle.vue'
import IconAdd from '@/assets/icons/IconAdd.svg'
import IconTop from '@/assets/icons/IconTop.svg'

const router = useRouter()

// 추가 버튼
function moveToAdd() {
  router.push({ name: 'detail', params: { action: 'add' } })
}

// 상단이동 버튼
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<style scoped>
.floating-wrapper {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 1000;
}
</style>
