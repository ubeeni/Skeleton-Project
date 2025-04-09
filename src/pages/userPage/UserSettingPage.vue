<template>
  <div class="wrapper">
    <span class="titleBold24px">사용자 설정</span>
    <div class="content">
      <!-- 왼쪽 패널 -->
      <div class="left-panel">
        <div class="left-header">
          <span class="bodySemibold18px">카테고리 기본값</span>
        </div>
        <div class="select-group">
          <span class="bodySemibold18px">수입</span>
          <SelectMed
            v-model="selectedIncome"
            :options="incomeCategories.map((cat) => ({ label: cat.name, value: cat.id }))"
            placeholder="수입 카테고리 선택"
          />
        </div>
        <div class="select-group">
          <span class="bodySemibold18px">지출</span>
          <SelectMed
            v-model="selectedExpense"
            :options="expenseCategories.map((cat) => ({ label: cat.name, value: cat.id }))"
            placeholder="지출 카테고리 선택"
          />
        </div>
      </div>
      <div class="divider"></div>
      <!-- 오른쪽 패널 -->
      <div class="right-panel">
        <div class="right-header">
          <span class="bodySemibold18px">고정 수입/지출</span>
          <BtnXs :color="'var(--color-secondary)'" :text="`추가`" @click="showAddModal = true" />
        </div>
        <ul>
          <li
            v-for="item in quickOptions"
            :key="item.id"
            class="item bodyRegular16px"
            @click="openEditModal(item)"
          >
            {{ formatOption(item) }}
          </li>
        </ul>
      </div>
    </div>

    <!-- 버튼 -->
    <div class="button-group">
      <BtnLg :color="'var(--color-primary)'" :text="`저장`" @click="saveDefaults" />
      <BtnLg :color="'var(--color-light)'" :text="`취소`" @click="cancelAndRedirect" />
    </div>
  </div>

  <!-- 모달 -->
  <AddQuickOptionModal
    v-if="showAddModal"
    :categories="categories"
    :currentCount="quickOptions.length"
    @close="showAddModal = false"
    @add="handleAddOption"
  />

  <EditQuickOptionModal
    v-if="showEditModal"
    :option="selectedOption"
    :categories="categories"
    @update="handleUpdateOption"
    @delete="handleDeleteOption"
    @close="
      () => {
        showEditModal = false
        selectedOption = null
      }
    "
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import AddQuickOptionModal from '@/pages/userPage/_components/AddQuickOptionModal.vue'
import EditQuickOptionModal from '@/pages/userPage/_components/EditQuickOptionModal.vue'
import SelectMed from '@/components/input/SelectMed.vue'
import BtnLg from '@/components/button/BtnLg.vue'
import BtnXs from '@/components/button/BtnXs.vue'

// 라우터 및 경로
const route = useRoute()
const router = useRouter()
const userId = route.params.id

// 상태 변수
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedOption = ref(null)

// 사용자 정보 및 선택된 카테고리
const user = ref(null)
const selectedIncome = ref('')
const selectedExpense = ref('')

// 데이터 목록
const categories = ref([])
const quickOptions = ref([])

// 카테고리 필터링
const incomeCategories = computed(() => categories.value.filter((c) => c.type === 'Income'))
const expenseCategories = computed(() => categories.value.filter((c) => c.type === 'Expense'))

// 유저 데이터 가져오기
const fetchUser = async () => {
  const res = await axios.get(`http://localhost:3000/members/${userId}`)
  user.value = res.data

  selectedIncome.value =
    categories.value.find((c) => c.name === res.data.incomeDefault && c.type === 'Income')?.id || ''

  selectedExpense.value =
    categories.value.find((c) => c.name === res.data.expenseDefault && c.type === 'Expense')?.id ||
    ''
}

// 카테고리 가져오기
const fetchCategories = async () => {
  const res = await axios.get('http://localhost:3000/categories')
  categories.value = res.data

  selectedIncome.value = categories.value.find((c) => c.type === 'Income')?.id || ''
  selectedExpense.value = categories.value.find((c) => c.type === 'Expense')?.id || ''
}

// 고정지출 옵션 가져오기
const fetchQuickOptions = async () => {
  const res = await axios.get('http://localhost:3000/quickAddOptions')
  const userData = res.data.filter((item) => item.member_id === userId)
  quickOptions.value = [...userData]
}

// 항목 포맷
const formatOption = (item) => {
  const dayText =
    item.day || (item.week ? `매주 ${item.week}` : '') || (item.month ? `매월 ${item.month}일` : '')
  const memoText = item.memo ? ` | ${item.memo}` : ''
  return `${item.title} | ${dayText} | ${item.amount.toLocaleString()}원${memoText}`
}

// 추가/수정/삭제 핸들러
const handleAddOption = (newOption) => {
  newOption.id = Date.now().toString()
  newOption.member_id = userId
  quickOptions.value.push(newOption)
}

const handleUpdateOption = (updatedItem) => {
  const idx = quickOptions.value.findIndex((opt) => opt.id === updatedItem.id)
  if (idx !== -1) quickOptions.value[idx] = { ...updatedItem }
}

const handleDeleteOption = (id) => {
  quickOptions.value = quickOptions.value.filter((item) => item.id !== id)
}

// 저장
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

  const existing = await axios.get(`http://localhost:3000/quickAddOptions?member_id=${userId}`)

  const toAdd = quickOptions.value.filter((item) => !existing.data.some((e) => e.id === item.id))

  const toUpdate = quickOptions.value.filter((item) => {
    const original = existing.data.find((e) => e.id === item.id)
    return original && JSON.stringify(original) !== JSON.stringify(item)
  })

  const toDelete = existing.data.filter((item) => !quickOptions.value.some((e) => e.id === item.id))

  await Promise.all([
    ...toAdd.map((item) => axios.post(`http://localhost:3000/quickAddOptions`, item)),
    ...toUpdate.map((item) => axios.put(`http://localhost:3000/quickAddOptions/${item.id}`, item)),
    ...toDelete.map((item) => axios.delete(`http://localhost:3000/quickAddOptions/${item.id}`)),
  ])

  alert('저장되었습니다!')
  router.push(`/user/${userId}`)
}

// 취소
const cancelAndRedirect = () => {
  const confirmCancel = confirm('수정 내용이 반영되지 않습니다. 정말 취소하시겠어요?')
  if (confirmCancel) {
    router.push(`/user/${userId}`)
  }
}

// 수정 모달 열기
const openEditModal = (item) => {
  selectedOption.value = item
  showEditModal.value = true
}

onMounted(async () => {
  await fetchCategories()
  await fetchUser()
  fetchQuickOptions()
})
</script>

<style scoped>
/* 동일한 스타일 유지 */
.wrapper {
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
}

.content {
  margin-top: 1.25rem;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.divider {
  width: 1px;
  background-color: var(--color-light);
  height: 15rem;
}

.left-panel,
.right-panel {
  flex: 1;
}

.select-group {
  margin-bottom: 24px;
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.right-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.left-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  height: 35.5px;
}

.item {
  margin-bottom: 1rem;
  cursor: pointer;
}

.button-group {
  margin-top: 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
