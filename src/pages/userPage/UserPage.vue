<template>
  <div class="wrapper">
    <div class="block">
      <div class="header-row">
        <span class="titleBold24px">프로필</span>
        <span class="edit">
          <router-link :to="`/user/${userId}/edit`" class="bodyRegular16px">수정</router-link></span
        >
      </div>
      <div class="item">
        <span class="bodySemibold18px">이름</span>
        <span class="bodyRegular18px">{{ user?.name }}</span>
      </div>
    </div>

    <div class="horizontal-divider"></div>

    <div class="block">
      <div class="header-row">
        <span class="titleBold24px">사용자 설정</span
        ><span class="edit">
          <router-link :to="`/user/${userId}/settings`" class="bodyRegular16px"
            >수정</router-link
          ></span
        >
      </div>

      <div class="item horizontal">
        <span class="bodySemibold18px">카테고리 기본값</span>
        &nbsp;
        <div class="bodyRegular18px right-align">
          <div>
            수입: <span :style="{ color: 'var(--color-income)' }">{{ user?.incomeDefault }}</span>
          </div>

          <div>
            지출: <span :style="{ color: 'var(--color-expense)' }">{{ user?.expenseDefault }}</span>
          </div>
        </div>
      </div>

      <div class="item vertical">
        <span class="bodySemibold18px">고정 수입/지출</span>
        &nbsp;
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

// 상태 변수
const route = useRoute()
const userId = route.params.id
const user = ref(null)
const quickOptions = ref([])
const categories = ref([])

// 데이터 패칭
const fetchUser = async () => {
  const res = await axios.get(`http://localhost:3000/members/${userId}`)
  user.value = res.data
}

const fetchQuickOptions = async () => {
  const res = await axios.get('http://localhost:3000/quickAddOptions')
  quickOptions.value = res.data.filter((item) => item.member_id === userId)
}

const fetchCategories = async () => {
  const res = await axios.get('http://localhost:3000/categories')
  categories.value = res.data
}

// 데이터 포맷팅
const formatOption = (item) => {
  const dayText =
    item.day ||
    (item.week ? `매주 ${item.week}` : '') ||
    (item.month ? `매월 ${item.month}일` : '') ||
    '반복 없음'

  const category = categories.value.find((c) => c.id === item.category_id)
  const categoryName = category ? category.name : '(알 수 없음)'
  const memoText = item.memo ? ` | ${item.memo}` : ''

  return `${item.title} | ${categoryName} | ${dayText} | ${item.amount.toLocaleString()}원${memoText}`
}

onMounted(async () => {
  fetchUser()
  fetchQuickOptions()
  fetchCategories()
})
</script>

<style scoped>
/* 레이아웃 */
.wrapper {
  max-width: 48rem;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.block {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-row > .edit {
  color: var(--color-semidark);
}

.horizontal-divider {
  height: 0.0625rem;
  width: 100%;
  background-color: var(--color-light);
}

/* 항목 영역 */
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
.item.horizontal {
  display: flex;
  align-items: start;
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

.right-align {
  align-self: flex-end;
}

.item .horizontal {
  display: flex;

  align-items: start;
}

/* 반응형 */
@media screen and (max-width: 767px) {
  .wrapper {
    max-width: 48rem;
    width: 100%;
    margin: 0 auto;
    padding: 0;
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
}
</style>
