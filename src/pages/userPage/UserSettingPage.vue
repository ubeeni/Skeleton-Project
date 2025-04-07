<template>
  <div class="wrapper">
    <h2 class="title">사용자 설정</h2>

    <div class="section">
      <label class="label">카테고리 기본값</label>
      <div class="category-selects">
        <div>
          <p class="select-label">수입 카테고리</p>
          <select v-model="selectedIncome" class="select">
            <option v-for="cat in incomeCategories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        <div>
          <p class="select-label">지출 카테고리</p>
          <select v-model="selectedExpense" class="select">
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
      <button class="btn cancel" @click="router.back()">취소</button>
      <button class="btn add" @click="showModal = true">추가</button>
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
  return `${item.memo} | ${item.cycle} | ${item.amout.toLocaleString()}원 | ${dayText}`
}

onMounted(() => {
  fetchQuickOptions()
  fetchCategories()
})

const limitedQuickOptions = computed(() => quickOptions.value.slice(0, 5))
</script>

<style scoped>
.wrapper {
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
}
.section {
  margin-bottom: 32px;
}
.label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
}
.category-selects {
  display: flex;
  gap: 20px;
}
.select-label {
  margin-bottom: 4px;
}
.select {
  padding: 8px;
  width: 180px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.item {
  margin-bottom: 8px;
}
.button-group {
  display: flex;
  gap: 12px;
}
.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
.cancel {
  background-color: #ccc;
  color: white;
}
.add {
  background-color: #a855f7;
  color: white;
}
</style>
