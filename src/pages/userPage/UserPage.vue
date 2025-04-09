<template>
  <div class="content-columns">
    <!-- 프로필 -->
    <section class="section">
      <div class="section-header">
        <span class="titleBold24px">프로필</span>
        <router-link :to="`/user/${userId}/edit`" class="bodyRegular16px">수정</router-link>
      </div>
      <div class="item">
        <span class="bodySemibold18px">이름</span>
        <span class="bodyRegular18px">{{ user?.name }}</span>
      </div>
    </section>

    <!-- 세로 구분선 -->
    <div class="divider"></div>

    <!-- 사용자 설정 -->
    <section class="section">
      <div class="section-header">
        <span class="titleBold24px">사용자 설정</span>
        <router-link :to="`/user/${userId}/settings`" class="bodyRegular16px">수정</router-link>
      </div>
      <div class="item">
        <span class="bodySemibold18px">카테고리 기본값</span>
        <span class="bodyRegular18px">
          <span :style="{ color: 'var(--color-income)' }">{{ user?.incomeDefault }}</span>
          <span> | </span>
          <span :style="{ color: 'var(--color-expense)' }">{{ user?.expenseDefault }}</span>
        </span>
      </div>

      <div class="item">
        <span class="bodySemibold18px">고정 수입/지출</span>
        <ul>
          <li v-for="item in quickOptions" :key="item.id" class="bodyRegular18px">
            {{ formatOption(item) }}
          </li>
        </ul>
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
const quickOptions = ref([])

const fetchQuickOptions = async () => {
  const res = await axios.get('http://localhost:3000/quickAddOptions')
  const userData = res.data.filter((item) => item.member_id === userId)
  quickOptions.value = [...userData]
}

const formatOption = (item) => {
  const dayText =
    item.day || (item.week ? `매주 ${item.week}` : '') || (item.month ? `매월 ${item.month}일` : '')
  return `${item.title} | ${dayText} | ${item.amount.toLocaleString()}원`
}

const fetchUser = async () => {
  const res = await axios.get(`http://localhost:3000/members/${userId}`)
  user.value = res.data
}

onMounted(async () => {
  fetchUser()
  fetchQuickOptions()
})
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
  background-color: var(--color-light);
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
