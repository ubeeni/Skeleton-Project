<template>
  <div class="wrapper">
    <!-- 왼쪽 패널 -->
    <div class="left-panel">
      <h2 class="title">사용자 설정</h2>
      <div class="select-group">
        <label class="select-label">수입</label>
        <select v-model="selectedIncome" class="select">
          <option v-for="cat in incomeCategories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
      <div class="select-group">
        <label class="select-label">지출</label>
        <select v-model="selectedExpense" class="select">
          <option v-for="cat in expenseCategories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- 오른쪽 패널 -->
    <div class="right-panel">
      <div class="right-header">
        <label class="title">고정 수입/지출</label>
        <button class="add-yellow" @click="showAddModal = true">추가</button>
      </div>
      <ul>
        <li
          v-for="item in limitedQuickOptions"
          :key="item.id"
          class="item"
          @click="openEditModal(item)"
        >
          {{ formatOption(item) }}
        </li>
      </ul>
    </div>
  </div>

  <!-- 버튼 -->
  <div class="button-group">
    <button class="btn save" @click="saveDefaults">저장</button>
    <button class="btn cancel" @click="cancelAndRedirect">취소</button>
  </div>

  <!-- 모달 -->
  <AddQuickOptionModal
    v-if="showAddModal"
    :categories="categories"
    @close="showAddModal = false"
    @refresh="fetchQuickOptions"
  />

  <EditQuickOptionModal
    v-if="showEditModal"
    :option="selectedOption"
    :categories="categories"
    @close="
      () => {
        showEditModal = false
        selectedOption = null
      }
    "
    @refresh="fetchQuickOptions"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import AddQuickOptionModal from '@/pages/userPage/AddQuickOptionModal.vue'
import EditQuickOptionModal from '@/pages/userPage/EditQuickOptionModal.vue'

const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedOption = ref(null)

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

  selectedIncome.value =
    categories.value.find((c) => c.name === res.data.incomeDefault && c.type === 'Income')?.id || ''

  selectedExpense.value =
    categories.value.find((c) => c.name === res.data.expenseDefault && c.type === 'Expense')?.id ||
    ''
}

const findCategoryNameById = (id) => {
  return categories.value.find((c) => c.id === id)?.name || ''
}

const saveDefaults = async () => {
  if (!user.value) return

  const payload = {
    incomeDefault: findCategoryNameById(selectedIncome.value),
    expenseDefault: findCategoryNameById(selectedExpense.value),
  }

  await axios.patch(`http://localhost:3000/members/${userId}`, payload)
  alert('저장되었습니다!')

  router.push(`/user/${userId}`)
}

const cancelAndRedirect = () => {
  const confirmCancel = confirm('수정 내용이 반영되지 않습니다. 정말 취소하시겠어요?')
  if (confirmCancel) {
    router.push(`/user/${userId}`)
  }
}

const fetchQuickOptions = async () => {
  const res = await axios.get('http://localhost:3000/quickAddOptions')
  quickOptions.value = res.data.filter((item) => item.member_id === userId)
}

const fetchCategories = async () => {
  const res = await axios.get('http://localhost:3000/categories')
  categories.value = res.data

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

const openEditModal = (item) => {
  selectedOption.value = item
  showEditModal.value = true
}

const limitedQuickOptions = computed(() => quickOptions.value.slice(0, 5))

onMounted(async () => {
  await fetchCategories()
  await fetchUser()
  fetchQuickOptions()
})
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  gap: 60px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.left-panel,
.right-panel {
  flex: 1;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
}

.select-group {
  margin-bottom: 24px;
}

.select-label {
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
}

.select {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 12px;
}

.right-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.add-yellow {
  background-color: #fde047;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}

.item {
  margin-bottom: 8px;
  font-size: 15px;
  cursor: pointer;
}

.button-group {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.btn {
  width: 300px;
  padding: 16px 0;
  font-size: 16px;
  font-weight: bold;
  border-radius: 16px;
  border: none;
  cursor: pointer;
}

.save {
  background-color: #8b5cf6;
  color: white;
}

.cancel {
  background-color: #ccc;
  color: white;
}
</style>
