<template>
  <div class="wrapper">
    <div class="block">
      <div class="header-row">
        <span class="titleBold24px">프로필</span>
        <router-link :to="`/user/${userId}/edit`" class="bodyRegular16px">수정</router-link>
      </div>
      <div class="item">
        <span class="bodySemibold18px">이름</span>
        <span class="bodyRegular18px">{{ user?.name }}</span>
      </div>
    </div>

    <div class="horizontal-divider"></div>

    <div class="block">
      <div class="header-row">
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

      <div class="item vertical">
        <span class="bodySemibold18px">고정 수입/지출</span>
        <ul class="option-list">
          <li v-for="item in quickOptions" :key="item.id" class="bodyRegular18px">
            {{ formatOption(item) }}
          </li>
        </ul>
      </div>
    </div>
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
.wrapper {
  max-width: 48rem;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.block {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.item.vertical {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.option-list {
  padding: 0;
  margin: 0;
  align-self: flex-end;
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.horizontal-divider {
  height: 1px;
  width: 100%;
  background-color: var(--color-light);
  margin: 1rem 0;
}
</style>
