<template>
  <div class="wrapper">
    <h2 class="title">사용자 설정</h2>

    <div class="section">
      <label class="label">카테고리 기본값</label>
      <div class="category-selects">
        <div>
          <p class="select-label">수입 카테고리</p>
          <select v-model="selectedIncome" class="select" @change="updateDefault('income')">
            <option v-for="cat in incomeCategories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        <div>
          <p class="select-label">지출 카테고리</p>
          <select v-model="selectedExpense" class="select" @change="updateDefault('expense')">
            <option v-for="cat in expenseCategories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="section">
      <label class="label">기본 지출 (최대 5개)</label>
      <ul>
        <li v-for="item in limitedQuickOptions" :key="item.id" class="item">
          {{ formatOption(item) }}
        </li>
      </ul>
    </div>

    <div class="button-group">
      <button class="btn add" @click="showModal = true">추가</button>
      <button class="btn cancel" @click="router.back()">취소</button>
    </div>

    <AddQuickOptionModal
      v-if="showModal"
      :categories="categories"
      @close="showModal = false"
      @refresh="fetchQuickOptions"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import AddQuickOptionModal from '@/pages/userPage/AddQuickOptionModal.vue'
const showModal = ref(false)

const route = useRoute()
const router = useRouter()
const userId = route.params.id

const quickOptions = ref([])
const categories = ref([])

const selectedIncome = ref('')
const selectedExpense = ref('')

const user = ref(null)

const fetchUser = async () => {
  const res = await axios.get(`http://localhost:3000/members/${userId}`)
  user.value = res.data

  // name 값을 id로 매핑해서 select 초기화
  selectedIncome.value =
    categories.value.find((c) => c.name === res.data.incomeDefault && c.type === 'Income')?.id || ''

  selectedExpense.value =
    categories.value.find((c) => c.name === res.data.expenseDefault && c.type === 'Expense')?.id ||
    ''
}

const findCategoryNameById = (id) => {
  return categories.value.find((c) => c.id === id)?.name || ''
}

const updateDefault = async (type) => {
  if (!user.value) return

  const payload =
    type === 'income'
      ? { incomeDefault: findCategoryNameById(selectedIncome.value) }
      : { expenseDefault: findCategoryNameById(selectedExpense.value) }

  await axios.patch(`http://localhost:3000/members/${userId}`, payload)
}

const fetchQuickOptions = async () => {
  const res = await axios.get('http://localhost:3000/quickAddOptions')
  quickOptions.value = res.data.filter((item) => item.member_id === userId)
}

const fetchCategories = async () => {
  const res = await axios.get('http://localhost:3000/categories')
  categories.value = res.data

  // 기본값 설정
  selectedIncome.value = categories.value.find((c) => c.type === 'Income')?.id || ''
  selectedExpense.value = categories.value.find((c) => c.type === 'Expense')?.id || ''
}

const incomeCategories = computed(() => categories.value.filter((c) => c.type === 'Income'))
const expenseCategories = computed(() => categories.value.filter((c) => c.type === 'Expense'))

const formatOption = (item) => {
  const dayText = item.day || item.week || (item.month ? `매월 ${item.month}일` : '')
  const memoText = item.memo ? ` | ${item.memo}` : ''
  return `${item.title} | ${dayText} | ${item.amout.toLocaleString()}원${memoText}`
}

onMounted(async () => {
  await fetchCategories() // ❗ 먼저 카테고리 정보를 받아야 name → id 매핑이 가능
  await fetchUser()
  fetchQuickOptions()
})

const limitedQuickOptions = computed(() => quickOptions.value.slice(0, 5))
</script>

<style scoped>
.wrapper {
  padding: 40px;
  max-width: 640px;
  margin: 0 auto;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 32px;
}

.section {
  margin-bottom: 36px;
}

.label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.category-selects {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.select-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.select {
  padding: 10px;
  width: 220px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 14px;
}

.item {
  margin-bottom: 10px;
  line-height: 1.6;
  font-size: 15px;
}

.button-group {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
}

.btn {
  width: 60%;
  padding: 14px 0;
  border-radius: 12px;
  font-weight: bold;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.cancel {
  background-color: #ccc;
  color: white;
}

.add {
  background-color: #8b5cf6;
  color: white;
}
</style>
