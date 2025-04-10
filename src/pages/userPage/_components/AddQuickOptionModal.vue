<template>
  <div class="modal">
    <div class="modal-box">
      <h3 class="titleBold24px">고정 수입/지출 추가</h3>
      <div class="input-group">
        <div class="form-row-dual">
          <BtnDual
            :is-income-active="newItem.type === 'Income'"
            :is-expense-active="newItem.type === 'Expense'"
            @clickIncome="newItem.type = 'Income'"
            @clickExpense="newItem.type = 'Expense'"
          />
          <InputMed
            v-model.number="newItem.amount"
            type="number"
            :class="{ error: (!newItem.amount || newItem.amount <= 0) && triedSubmit }"
            placeholder="금액을 입력하세요(단위: 원)"
          />
          <span class="bodySemibold18px"> 원</span>
        </div>
        <!-- 거래명 -->
        <div class="form-row">
          <span class="bodySemibold18px">거래명</span>
          <InputLg
            v-model="newItem.title"
            :class="{ error: !newItem.title && triedSubmit }"
            placeholder="거래명을 입력하세요"
          />
        </div>

        <!-- 카테고리 드롭다운 -->
        <div class="form-row">
          <span class="bodySemibold18px">카테고리</span>
          <SelectLg
            v-model="newItem.category_id"
            :options="filteredCategories.map((cat) => ({ label: cat.name, value: cat.id }))"
            placeholder="카테고리 선택"
          />
        </div>

        <!-- 반복주기 + 상세 입력 -->
        <div class="form-row">
          <span class="bodySemibold18px">반복주기</span>
          <div class="select-group">
            <SelectMed
              v-model="newItem.cycle"
              :options="cycleOptions"
              placeholder="반복주기 선택"
            />
            <SelectMed
              v-if="newItem.cycle === 'weekly'"
              :options="weeklyOptions"
              v-model="newItem.week"
              :class="{ error: (!newItem.week || newItem.week === '') && triedSubmit }"
              placeholder="요일 선택"
            />

            <InputMed
              v-if="newItem.cycle === 'monthly'"
              v-model="newItem.month"
              :class="{
                error: (!newItem.month || newItem.month < 1 || newItem.month > 31) && triedSubmit,
              }"
              placeholder="1 ~ 31일까지 입력 가능합니다."
              type="number"
            />
            <InputMed v-if="newItem.cycle === 'daily'" value="매일" disabled />
            <InputMed v-if="newItem.cycle === 'onetime'" value="반복 없음" disabled />
          </div>
        </div>

        <!-- 메모 -->
        <div class="form-row">
          <span class="bodySemibold18px">메모</span>
          <InputLg v-model="newItem.memo" placeholder="추가 정보를 입력하세요" />
        </div>
      </div>

      <div class="button-group">
        <BtnLg :color="'var(--color-primary)'" :text="`추가`" @click="submit" />
        <BtnLg :color="'var(--color-light)'" :text="`취소`" @click="$emit('close')" />
      </div>
    </div>
  </div>
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

const route = useRoute()
const router = useRouter()
const userId = route.params.id

const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedOption = ref(null)
const originalQuickOptions = ref([])

const user = ref(null)
const selectedIncome = ref('')
const selectedExpense = ref('')

const categories = ref([])
const quickOptions = ref([])

const incomeCategories = computed(() => categories.value.filter((c) => c.type === 'Income'))
const expenseCategories = computed(() => categories.value.filter((c) => c.type === 'Expense'))

const fetchUser = async () => {
  const res = await axios.get(`http://localhost:3000/members/${userId}`)
  user.value = res.data

  selectedIncome.value =
    categories.value.find((c) => c.name === res.data.incomeDefault && c.type === 'Income')?.id || ''

  selectedExpense.value =
    categories.value.find((c) => c.name === res.data.expenseDefault && c.type === 'Expense')?.id ||
    ''
}

const fetchCategories = async () => {
  const res = await axios.get('http://localhost:3000/categories')
  categories.value = res.data

  selectedIncome.value = categories.value.find((c) => c.type === 'Income')?.id || ''
  selectedExpense.value = categories.value.find((c) => c.type === 'Expense')?.id || ''
}

const fetchQuickOptions = async () => {
  const res = await axios.get('http://localhost:3000/quickAddOptions')
  const userData = res.data.filter((item) => item.member_id === userId)
  quickOptions.value = JSON.parse(JSON.stringify(userData))
  originalQuickOptions.value = JSON.parse(JSON.stringify(userData))
}

const findCategoryNameById = (id) => {
  return categories.value.find((c) => c.id === id)?.name || ''
}

const defaultChanged = computed(() => {
  const incomeName = findCategoryNameById(selectedIncome.value)
  const expenseName = findCategoryNameById(selectedExpense.value)
  return incomeName !== user.value.incomeDefault || expenseName !== user.value.expenseDefault
})

const quickOptionsChanged = computed(() => {
  return JSON.stringify(quickOptions.value) !== JSON.stringify(originalQuickOptions.value)
})

const hasUnsavedChanges = computed(() => {
  return defaultChanged.value || quickOptionsChanged.value
})

const formatOption = (item) => {
  const dayText =
    item.day ||
    (item.week ? `\uB9E4\uC8FC ${item.week}` : '') ||
    (item.month ? `\uB9E4\uC6D4 ${item.month}\uC77C` : '') ||
    `\uBC18\uBCF5 \uC5C6\uC74C`
  return `${item.title} | ${dayText} | ${item.amount.toLocaleString()}\uC6D0`
}

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
  originalQuickOptions.value = JSON.parse(JSON.stringify(quickOptions.value))
  router.push(`/user/${userId}`)
}

const cancelAndRedirect = () => {
  const confirmCancel = confirm('수정 내용이 반영되지 않습니다. 정말 취소하시겠어요?')
  if (confirmCancel) {
    router.push(`/user/${userId}`)
  }
}

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
.modal {
  position: fixed;
  inset: 0;
  background-color: var(--color-light2);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: auto;
  z-index: 1000;
}

.modal-box {
  background: var(--color-white);
  padding: 3rem 3rem;
  border-radius: 1.25rem;
  box-shadow: var(--boxshadow-light);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h3 {
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-row span {
  width: 5rem;
}

.form-row-dual {
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 2rem;
}

/* input,
select {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 14px;
}*/

input.error,
select.error {
  border: 1px solid red;
}

.select-group {
  width: 100%;
  display: flex;
  justify-content: right;
  gap: 2.5rem;
}

/* .toggle-group {
  display: flex;
  gap: 12px;
  flex: 1;
}

.toggle-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  background-color: var(--color-light);
  color: var(--color-white);
  cursor: pointer;
}

.toggle-btn.active.income {
  background-color: var(--color-income);
  color: var(--color-white);
}

.toggle-btn.active.expense {
  background-color: var(--color-expense);
  color: var(--color-white);
} */

.button-group {
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* .button-group button {
  padding: 14px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
} */
</style>
