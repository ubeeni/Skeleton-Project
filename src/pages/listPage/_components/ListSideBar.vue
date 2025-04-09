<template>
  <div class="sidebar-wrapper">
    <!-- 월 이동 -->
    <div class="month-nav">
      <img :src="backButton" alt="back" @click="handlePrev" />
      <span class="titleBold24px"> {{ monthText }} </span>
      <img :src="forwardButton" alt="forward" @click="handleNext" />
    </div>

    <!-- 수입/지출/총합 요약 -->
    <div class="summary">
      <div class="bodyRegular16px">
        💰 수입:
        <span style="color: var(--color-dark)"> {{ monthlyIncome.toLocaleString() }}원 </span>
      </div>
      <div class="bodyRegular16px">
        💸 지출:
        <span style="color: var(--color-dark)"> {{ monthlyExpense.toLocaleString() }}원 </span>
      </div>
      <div class="bodySemibold18px" style="margin-top: 0.5rem">
        총합:
        <span :class="totalColorClass">
          {{ (monthlyIncome - monthlyExpense).toLocaleString() }}
        </span>
        원
      </div>
      <div class="total-line"></div>
    </div>

    <div class="sideBar-bottom">
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
})
const emit = defineEmits(['filter-change'])

const currentDate = ref(dayjs())
const selectedRange = ref('1개월')

// ✅ 초기값: 수입/지출 모두 true → 전체 보기
const isIncome = ref(false)
const isExpense = ref(false)

const selectedIncome = ref([])
const selectedExpense = ref([])

const options = ['1주', '1개월', '3개월']

const monthText = computed(() => `${currentDate.value.month() + 1}월`)

const handlePrev = () => {
  currentDate.value = currentDate.value.subtract(1, 'month')
  emitFilters()
}
const handleNext = () => {
  currentDate.value = currentDate.value.add(1, 'month')
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

const monthlyIncome = computed(() => {
  const ym = currentDate.value.format('YYYY-MM')
  return props.transactions
    .filter((t) => t.type === 'Income' && t.date.startsWith(ym))
    .reduce((sum, t) => sum + t.amount, 0)
})
const monthlyExpense = computed(() => {
  const ym = currentDate.value.format('YYYY-MM')
  return props.transactions
    .filter((t) => t.type === 'Expense' && t.date.startsWith(ym))
    .reduce((sum, t) => sum + t.amount, 0)
})
const totalColorClass = computed(() => {
  const net = monthlyIncome.value - monthlyExpense.value
  return net > 0 ? 'color-positive' : net < 0 ? 'color-negative' : ''
})

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
