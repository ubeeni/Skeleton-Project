<template>
  <header>
    <h1>Header</h1>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to=" /list">List Page</router-link></li>
        <li><router-link to="/report">Report Page</router-link></li>
        <li><router-link to="/user">User Page</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5rem;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-light);
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
  transition: all 0.2s ease-in-out;
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
