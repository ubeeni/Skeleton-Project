<template>
  <div class="content-columns">
    <!-- 프로필 -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">프로필</h2>
        <router-link :to="`/user/${userId}/edit`" class="edit-link">수정</router-link>
      </div>
      <div class="item">
        <span class="label">이름</span>
        <span class="value">{{ user?.name }}</span>
      </div>
    </section>

    <!-- 세로 구분선 -->
    <div class="divider"></div>

    <!-- 사용자 설정 -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">사용자 설정</h2>
        <router-link :to="`/user/${userId}/settings`" class="edit-link">수정</router-link>
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
.content-columns {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px;
}

/* 각 섹션 */
.section {
  width: 300px;
}

/* 세로줄 */
.divider {
  width: 1px;
  background-color: black;
  margin: 0 40px;
  align-self: stretch;
}

/* 제목 + 수정 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
}

.edit-link {
  font-size: 14px;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

/* 항목 */
.item {
  display: flex;
  margin-bottom: 12px;
}

.label {
  width: 120px;
  font-weight: bold;
  font-size: 14px;
}

.value {
  font-size: 14px;
}
</style>
