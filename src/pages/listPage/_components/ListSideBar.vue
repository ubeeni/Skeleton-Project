<template>
  <div class="sidebar-wrapper">
    <!-- 월 이동 -->
    <div class="month-nav">
      <img :src="backButton" alt="back" @click="handlePrev" />
      <span class="titleBold24px"> {{ rangeText }} </span>
      <img :src="forwardButton" alt="forward" @click="handleNext" />
    </div>

    <!-- 수입/지출/총합 요약 -->
    <div class="summary">
      <div class="bodyRegular16px">
        💰 수입:
        <span style="color: var(--color-dark)"> {{ totalIncome.toLocaleString() }}원 </span>
      </div>
      <div class="bodyRegular16px">
        💸 지출:
        <span style="color: var(--color-dark)"> {{ totalExpense.toLocaleString() }}원 </span>
      </div>
      <div class="bodySemibold18px" style="margin-top: 0.5rem">
        총합:
        <span :class="totalColorClass">
          {{ netTotal.toLocaleString() }}
        </span>
        원
      </div>
      <div class="total-line"></div>
      
    </div>

    <div class="sideBar-bottom">

      <!--초기화 버튼-->
      <div class="reset-container">
        <div class="reset-img">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9.825 20.7001C8.10833 20.2167 6.70833 19.2709 5.625 17.8625C4.54167 16.4542 4 14.8334 4 13C4 12.05 4.15833 11.1459 4.475 10.2875C4.79167 9.42922 5.24167 8.64172 5.825 7.92505C6.00833 7.72505 6.23333 7.62088 6.5 7.61255C6.76667 7.60422 7.00833 7.70838 7.225 7.92505C7.40833 8.10838 7.50417 8.33338 7.5125 8.60005C7.52083 8.86672 7.43333 9.11672 7.25 9.35005C6.85 9.86672 6.54167 10.4334 6.325 11.05C6.10833 11.6667 6 12.3167 6 13C6 14.35 6.39583 15.5542 7.1875 16.6125C7.97917 17.6709 9 18.3917 10.25 18.7751C10.4667 18.8417 10.6458 18.9667 10.7875 19.1501C10.9292 19.3334 11 19.5334 11 19.75C11 20.0834 10.8833 20.3459 10.65 20.5375C10.4167 20.7292 10.1417 20.7834 9.825 20.7001ZM14.175 20.7001C13.8583 20.7834 13.5833 20.725 13.35 20.5251C13.1167 20.3251 13 20.0584 13 19.725C13 19.5251 13.0708 19.3334 13.2125 19.1501C13.3542 18.9667 13.5333 18.8417 13.75 18.7751C15 18.3751 16.0208 17.6501 16.8125 16.6C17.6042 15.55 18 14.35 18 13C18 11.3334 17.4167 9.91672 16.25 8.75005C15.0833 7.58338 13.6667 7.00005 12 7.00005H11.925L12.325 7.40005C12.5083 7.58338 12.6 7.81672 12.6 8.10005C12.6 8.38338 12.5083 8.61672 12.325 8.80005C12.1417 8.98338 11.9083 9.07505 11.625 9.07505C11.3417 9.07505 11.1083 8.98338 10.925 8.80005L8.825 6.70005C8.725 6.60005 8.65417 6.49172 8.6125 6.37505C8.57083 6.25838 8.55 6.13338 8.55 6.00005C8.55 5.86672 8.57083 5.74172 8.6125 5.62505C8.65417 5.50838 8.725 5.40005 8.825 5.30005L10.925 3.20005C11.1083 3.01672 11.3417 2.92505 11.625 2.92505C11.9083 2.92505 12.1417 3.01672 12.325 3.20005C12.5083 3.38338 12.6 3.61672 12.6 3.90005C12.6 4.18338 12.5083 4.41672 12.325 4.60005L11.925 5.00005H12C14.2333 5.00005 16.125 5.77505 17.675 7.32505C19.225 8.87505 20 10.7667 20 13C20 14.8167 19.4583 16.4334 18.375 17.85C17.2917 19.2667 15.8917 20.2167 14.175 20.7001Z" fill="#797979"/>
        </svg>
        </div>
        <div class="reset-btn bodyRegular18px" @click="resetFilters">초기화</div>
      </div>

      <!-- 날짜 범위 -->
      <div class="range">
        <div class="range-name">범위</div>
        <div class="range-list">
          <div
            v-for="option in options"
            :key="option"
            :class="['range-option', { active: selectedRange === option }]"
            @click="selectRange(option)"
          >
            {{ option }}
          </div>
        </div>
        
      </div>

      <!-- 수입/지출 필터 버튼 -->
      <BtnDual
        @clickIncome="clickIncome"
        @clickExpense="clickExpense"
        :is-income-active="isIncome"
        :is-expense-active="isExpense"
      />

      <!-- 수입 카테고리 -->
      <div class="category-group">
        <div class="category-title bodySemibold16px">카테고리(수입)</div>
        <div class="category-list">
          <span
            v-for="cat in incomeCategories"
            :key="cat.id"
            class="category-item"
            :class="{ selected: selectedIncome.includes(cat.id) }"
            @click="selectIncome(cat.id)"
          >
            {{ cat.name }}
          </span>
        </div>
      </div>

      <!-- 지출 카테고리 -->
      <div class="category-group">
        <div class="category-title bodySemibold16px">카테고리(지출)</div>
        <div class="category-list">
          <span
            v-for="cat in expenseCategories"
            :key="cat.id"
            class="category-item"
            :class="{ selected: selectedExpense.includes(cat.id) }"
            @click="selectExpense(cat.id)"
          >
            {{ cat.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import BtnDual from '@/components/button/BtnDual.vue'
import backButton from '@/assets/icons/IconArrowBack.svg'
import forwardButton from '@/assets/icons/IconArrowForward.svg'


const props = defineProps({
  categories: Array,
  transactions: Array,
  filteredTransactions: Array,
})

const resetFilters = () => {
  selectedRange.value = '1개월'
  isIncome.value = false
  isExpense.value = false
  selectedIncome.value = []
  selectedExpense.value = []
  emitFilters()
}

const emit = defineEmits(['filter-change'])

const currentDate = ref(dayjs())
const selectedRange = ref('1개월')

// ✅ 초기값: 수입/지출 모두 true → 전체 보기
const isIncome = ref(false)
const isExpense = ref(false)

const selectedIncome = ref([])
const selectedExpense = ref([])

const options = ['1주', '1개월', '3개월']

const rangeText = computed(() => {
  const date = currentDate.value

  if (selectedRange.value === '1주') {
    const start = date.day() === 0 ? date.subtract(6, 'day') : date.subtract(date.day() - 1, 'day')
    const end = start.add(6, 'day')
    return `${start.format('M/D')} ~ ${end.format('M/D')}`
  }

  if (selectedRange.value === '1개월') {
    if(date.year()=='2025') {
      return `${date.month() + 1}월`
    } else {
      return `${date.year()}년 `+`${date.month() + 1}월`
    }
  }

  if (selectedRange.value === '3개월') {
    const start = date.subtract(2, 'month')
    return `${start.month() + 1}월 ~ ${date.month() + 1}월`
  }

  return ''
})

const totalIncome = computed(() =>
  props.filteredTransactions
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0)
)
const totalExpense = computed(() =>
  props.filteredTransactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0)
)
const netTotal = computed(() => totalIncome.value - totalExpense.value)
const totalColorClass = computed(() =>
  netTotal.value > 0 ? 'color-positive' : netTotal.value < 0 ? 'color-negative' : ''
)

const handlePrev = () => {
  if (selectedRange.value === '1주') currentDate.value = currentDate.value.subtract(1, 'week')
  else if (selectedRange.value === '1개월') currentDate.value = currentDate.value.subtract(1, 'month')
  else if (selectedRange.value === '3개월') currentDate.value = currentDate.value.subtract(3, 'month')
  emitFilters()
}
const handleNext = () => {
  if (selectedRange.value === '1주') currentDate.value = currentDate.value.add(1, 'week')
  else if (selectedRange.value === '1개월') currentDate.value = currentDate.value.add(1, 'month')
  else if (selectedRange.value === '3개월') currentDate.value = currentDate.value.add(3, 'month')
  emitFilters()
}

const selectRange = (val) => {
  selectedRange.value = val
  emitFilters()
}

const clickIncome = () => {
  isIncome.value = !isIncome.value
  if (!isIncome.value) {
    selectedIncome.value = [] // 💥 수입 카테고리도 초기화
  }
  emitFilters()
}

const clickExpense = () => {
  isExpense.value = !isExpense.value
  if (!isExpense.value) {
    selectedExpense.value = [] // 💥 지출 카테고리도 초기화
  }
  emitFilters()
}

const selectIncome = (id) => {
  if (selectedIncome.value.includes(id)) {
    selectedIncome.value = selectedIncome.value.filter((i) => i !== id)
    // 선택된 게 아예 없으면 자동 비활성화
    if (selectedIncome.value.length === 0) isIncome.value = false
  } else {
    selectedIncome.value.push(id)
    isIncome.value = true // 수동으로 on
  }
  emitFilters()
}

const selectExpense = (id) => {
  if (selectedExpense.value.includes(id)) {
    selectedExpense.value = selectedExpense.value.filter((i) => i !== id)
    if (selectedExpense.value.length === 0) isExpense.value = false
  } else {
    selectedExpense.value.push(id)
    isExpense.value = true
  }
  emitFilters()
}

const incomeCategories = computed(() => props.categories.filter((c) => c.type === 'Income'))
const expenseCategories = computed(() => props.categories.filter((c) => c.type === 'Expense'))

// 필터 상태 상위 컴포넌트로 전달
const emitFilters = () => {
  emit('filter-change', {
    date: currentDate.value,
    range: selectedRange.value,
    showIncome: isIncome.value,
    showExpense: isExpense.value,
    incomeCategoryIds: selectedIncome.value,
    expenseCategoryIds: selectedExpense.value,
  })
}
</script>

<style scoped>
.sidebar-wrapper {
  width: 100%;
}
.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  gap: 1rem;
}
.month-nav img {
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.summary .total-line {
  margin: 2rem 0;
  border-top: 1px solid var(--color-light);
}
.sideBar-bottom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: start;
}
.range {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}

.reset-container {
  display: flex;                /* inline-block → flex */
  justify-content: flex-end;   /* 오른쪽 정렬 */
  margin-top: -0.5rem;          /* 위쪽 여백 (선택사항) */
  margin-bottom: 0.5rem;    
  gap: 4px;    /* 아래 여백 */
  width: 100%;
}

.reset-btn {
  margin-left: auto;
  font-size: 14px;
  cursor: pointer;
  color: var(--color-semidark);
  text-decoration: underline;
  color: var(--SemiDark, #797979);
  text-align: center;
}
.range-list {
  display: flex;
  gap: 0.5rem;
}
.range-option {
  cursor: pointer;
  color: var(--color-semidark);
}
.range-option.active {
  text-decoration: underline;
  text-underline-offset: 0.25rem;
  font-weight: 600;
}

.category-title {
  margin-bottom: 0.5rem;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-item {
  cursor: pointer;
  color: var(--color-semidark);
  transition: var(--transition);
  text-align: center;
}
.category-item.selected {
  color: var(--color-semidark);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 0.25rem;
}
</style>
