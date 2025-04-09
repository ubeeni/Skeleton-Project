<template>
  <div class="container">
    <!-- 좌측: 프로필 -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">프로필</h2>
        <router-link :to="`/user/${userId}/edit`" class="edit-link"> 수정 </router-link>
      </div>

      <div class="item">
        <span class="label">이름</span>
        <span class="value">{{ user?.name }}</span>
      </div>
    </section>

    <!-- 우측: 사용자 설정 -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">사용자 설정</h2>
        <router-link :to="`/user/${userId}/settings`" class="edit-link"> 수정 </router-link>
      </div>

      <div class="item">
        <span class="label">카테고리 기본값 설정</span>
        <span class="value">미분류</span>
      </div>
      <div class="item">
        <span class="label">기본 지출</span>
        <span class="value">스타벅스</span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const userId = route.params.id
const user = ref(null)

const fetchUser = async () => {
  const res = await axios.get(`http://localhost:3000/members/${userId}`)
  user.value = res.data
}

onMounted(fetchUser)
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
  padding: 40px;
  max-width: 1000px;
  margin: 0 auto;
  box-sizing: border-box;
}

.section {
  width: 45%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
}

.item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.label {
  width: 150px;
  font-weight: 600;
}

.value {
  flex: 1;
}

.edit-link {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.edit-link:hover {
  color: #2563eb;
}
</style>
