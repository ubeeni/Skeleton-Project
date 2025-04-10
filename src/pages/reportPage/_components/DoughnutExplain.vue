<template>
  <div class="filter-wrapper">
    <!-- 월 이동 -->
    <div class="month-nav">
      <img :src="backButton" alt="back" @click="handlePrev" />
      <span class="titleBold24px range-text" @click="resetToToday"> {{ rangeText }} </span>
      <img :src="forwardButton" alt="forward" @click="handleNext" />
    </div>
    <div class="filter-button">
      <!-- 기간 선택 버튼 -->
      <div class="report-selector">
        <BtnXs
          v-for="p in PERIOD_OPTIONS"
          :key="p"
          :text="p"
          :is-active="p === periodDoughnut"
          @click="periodDoughnut = p"
          color="var(--color-accent)"
        />
      </div>
      <BtnDual
        @clickIncome="clickIncome"
        @clickExpense="clickExpense"
        :is-income-active="isIncome"
        :is-expense-active="isExpense"
      />
    </div>
    <div class="report-subtitle">
      <div v-for="(label, index) in top5Labels" :key="index">{{ index + 1 }}위: {{ label }}</div>
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'
import BtnDual from '@/components/button/BtnDual.vue'
import BtnXs from '@/components/button/BtnXs.vue'
import backButton from '@/assets/icons/IconArrowBack.svg'
import forwardButton from '@/assets/icons/IconArrowForward.svg'

const periodDoughnut = inject('periodDoughnut')
const clickIncome = inject('clickIncome')
const clickExpense = inject('clickExpense')
const isIncome = inject('isIncome')
const isExpense = inject('isExpense')
const top5Labels = inject('top5Labels')
const PERIOD_OPTIONS = inject('PERIOD_OPTIONS')
const currentDate = inject('currentDoughnutDate')
const setCurrentDate = inject('setCurrentDoughnutDate')
const transactions = inject('transactions')
const subtractPeriod = inject('subtractPeriod')

function formatDateYMD(date) {
  return date.toISOString().split('T')[0]
}

function hasTransactionsInRange(start, end) {
  const startStr = formatDateYMD(start)
  const endStr = formatDateYMD(end)

  return transactions.value.some((tx) => {
    const txStr = formatDateYMD(new Date(tx.date))
    return txStr >= startStr && txStr <= endStr
  })
}

// 날짜 이동 함수
function tryMoveDate(direction) {
  const date = new Date(currentDate.value)
  const unit = periodDoughnut.value
  let nextDate = new Date(date)

  if (unit === '1주') {
    nextDate.setDate(date.getDate() + 7 * direction)
  } else if (unit === '1개월') {
    nextDate.setMonth(date.getMonth() + 1 * direction)
  } else if (unit === '3개월') {
    nextDate.setMonth(date.getMonth() + 3 * direction)
  }

  const today = new Date()
  if (nextDate > today) return // 오늘 이후는 이동 금지

  // 계산된 범위 내에 데이터 있는지 확인
  const start = subtractPeriod(nextDate, unit, 1)
  const end = nextDate

  if (hasTransactionsInRange(start, end)) {
    setCurrentDate(nextDate)
  }
}

function handlePrev() {
  tryMoveDate(-1)
}

function handleNext() {
  tryMoveDate(1)
}

// 범위 텍스트
const rangeText = computed(() => {
  const date = new Date(currentDate.value)
  const thisYear = new Date().getFullYear()

  if (periodDoughnut.value === '1주') {
    const day = date.getDay() || 7 // 일요일을 7로
    const start = new Date(date)
    start.setDate(date.getDate() - (day - 1))
    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    return `${start.getMonth() + 1}/${start.getDate()} ~ ${end.getMonth() + 1}/${end.getDate()}`
  }

  if (periodDoughnut.value === '1개월') {
    return date.getFullYear() === thisYear
      ? `${date.getMonth() + 1}월`
      : `${date.getFullYear()}년 ${date.getMonth() + 1}월`
  }

  if (periodDoughnut.value === '3개월') {
    const start = new Date(date)
    start.setMonth(date.getMonth() - 2)
    return `${start.getMonth() + 1}월 ~ ${date.getMonth() + 1}월`
  }

  return ''
})

function resetToToday() {
  setCurrentDate(new Date())
  periodDoughnut.value = '1개월'
}
</script>

<style scoped>
.filter-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.report-selector {
  display: flex;
  gap: 0.5rem;
}

.range-text {
  cursor: pointer;
}

.filter-button {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.5rem;
}

@media screen and (max-width: 767px) {
  /** Mobile */
  .filter-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .report-subtitle {
    margin-bottom: 1rem;
  }
}
</style>
