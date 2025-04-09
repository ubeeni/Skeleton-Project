<template>
  <div class="header titleBold24px">
    <div class="nav-left">
      <!-- 아이콘영역 -->
      <div class="titleBold30px">
        <RouterLink :to="{ name: 'home' }">🗓️ 스켈레톤프로젝트</RouterLink>
      </div>
      <!-- 내비게이션영역 -->
      <div class="nav-tabs">
        <RouterLink
          class="nav-tab"
          :class="{ 'active-tab': route.name === 'list' }"
          :to="{ name: 'list' }"
          >거래목록</RouterLink
        >
        <RouterLink
          class="nav-tab"
          :class="{ 'active-tab': route.name === 'report' }"
          :to="{ name: 'report' }"
          >소비리포트</RouterLink
        >
      </div>
    </div>
    <!-- 마이페이지영역 -->
    <div class="nav-right bodySemibold18px">
      <RouterLink :to="{ name: 'user', params: { id: route.params.id || '12CD' } }">
        <span class="username">{{ userName }}</span> 님
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, watchEffect } from 'vue'

const route = useRoute()
const userName = ref('')

watchEffect(async () => {
  const userId = route.params.id || '12CD'
  const res = await fetch(`http://localhost:3000/members/${userId}`)
  const data = await res.json()
  userName.value = data.name
})
</script>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5rem;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-light);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

/* 왼쪽 nav 구성 */
.nav-left {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

/* 버튼 스타일 */
.nav-tabs {
  display: flex;
  gap: 2.5rem;
}

.nav-tab {
  width: 8rem;
  text-align: center;
  padding: 0.75rem 0.5rem;
  transition: var(--transition);
}

.active-tab {
  color: var(--color-white);
  background-color: var(--color-primary);
  border-radius: 1.25rem;
}

/* 유저 영역 */
.nav-right {
  color: var(--color-semidark);
}

.username {
  text-decoration: underline;
}
</style>
