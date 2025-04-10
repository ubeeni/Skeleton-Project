<template>
  <div class="header">
    <img :src="backButton" alt="back" @click="handlePrev" />
    <div class="titleBold14px">
      <RouterLink :to="{ name: 'home' }">🗓️ 스켈레톤프로젝트</RouterLink>
    </div>
    <img :src="isMenuOpen ? menuOpenButton : menuButton" alt="menu" @click="toggleMenu" />
  </div>

  <transition name="fade-slide">
    <div v-if="isMenuOpen" class="menu titleBold14px">
      <RouterLink
        :to="{ name: 'home' }"
        class="menu-item"
        :class="{ 'active-item': route.name === 'home' }"
        @click="closeMenu"
        >홈페이지</RouterLink
      >
      <RouterLink
        class="menu-item"
        :class="{ 'active-item': route.name === 'list' }"
        :to="{ name: 'list' }"
        @click="closeMenu"
        >거래목록</RouterLink
      >
      <RouterLink
        class="menu-item"
        :class="{ 'active-item': route.name === 'report' }"
        :to="{ name: 'report' }"
        @click="closeMenu"
        >소비리포트</RouterLink
      >
      <RouterLink
        class="menu-item"
        :class="{ 'active-item': route.name === 'user' }"
        :to="{ name: 'user', params: { id: route.params.id || '12CD' } }"
        @click="closeMenu"
      >
        <span class="username">{{ userName }}</span> 님
      </RouterLink>
    </div>
  </transition>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, watchEffect } from 'vue'
import backButton from '@/assets/icons/IconArrowBack.svg'
import menuButton from '@/assets/icons/IconMenu.svg'
import menuOpenButton from '@/assets/icons/IconMenuOpen.svg'

const route = useRoute()
const userName = ref('')

watchEffect(async () => {
  const userId = route.params.id || '12CD'
  const res = await fetch(`http://localhost:3000/members/${userId}`)
  const data = await res.json()
  userName.value = data.name
})

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
const closeMenu = () => {
  isMenuOpen.value = false
}

const handlePrev = () => {
  if (route.name !== 'home') {
    window.history.back()
  }
}
</script>

<style scoped>
.header {
  height: 3.75rem;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-light);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.header img {
  width: 2.25rem;
  height: 2.25rem;
}

/* 드롭다운 메뉴 */
.menu {
  position: absolute;
  top: 3.75rem;
  right: 0;
  width: 100vw;
  background-color: var(--color-secondary);
  box-shadow: var(--boxshadow-light);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 2.5rem;
  z-index: 99;
}

.menu-item {
  border-bottom: 1px solid var(--color-dark);
  width: 100%;
  padding: 0.5rem 0;
  text-align: end;
}

.active-item {
  color: var(--color-primary);
}

/* transition 효과 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: var(--transition);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
