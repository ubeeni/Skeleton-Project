<template>
  <div class="not-found-page">
    <span class="titleBold30px">잘못된 경로로 접근했습니다</span>
    <BtnLg text="메인페이지로 이동" @click="goToHome" color="var(--color-accent)" />
  </div>
</template>

<script setup>
import BtnLg from '@/components/button/BtnLg.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

function goToHome() {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.not-found-page {
  min-height: 40vh;
  height: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rem;
}

.not-found-page > span {
  color: var(--color-accent);
}
</style>
