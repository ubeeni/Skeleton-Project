<template>
  <div class="report-page bodyRegular18px">
    <div class="report-wrapper">
      <div class="report-left">
        <div class="report-title titleBold24px">소비 분석 그래프</div>
        <div class="report-subtitle">
          {{
            monthlyTotal.diff === 0
              ? '전월과 동일한 소비입니다.'
              : monthlyTotal.diff > 0
                ? `전월 대비 ${monthlyTotal.diff.toLocaleString()}원 더 소비하였습니다.`
                : `전월 대비 ${Math.abs(monthlyTotal.diff).toLocaleString()}원 덜 소비하였습니다.`
          }}
        </div>
      </div>
      <div class="report-right">
        <Line
          :labels="grouped.labels"
          :income-data="grouped.incomeData"
          :expense-data="grouped.expenseData"
          :income-counts="grouped.incomeCounts"
          :expense-counts="grouped.expenseCounts"
        />
      </div>
    </div>
    <div class="report-divider"></div>
    <div class="report-wrapper">
      <div class="report-left">
        <div class="report-title titleBold24px">카테고리 별 비율</div>
        <BtnDual
          @clickIncome="clickIncome"
          @clickExpense="clickExpense"
          :is-income-active="isIncome"
          :is-expense-active="isExpense"
        />
        <div class="report-subtitle">
          1위: 카페<br />2위: 식당<br />3위: xx<br />4위: xx<br />5위: xx
        </div>
      </div>
      <div class="report-right">
        <Doughnut />
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import BtnDual from '@/components/button/BtnDual.vue'
import Doughnut from '@/components/chart/Doughnut.vue'
import Line from '@/components/chart/Line.vue'

const isIncome = ref(false)
const isExpense = ref(true)
// 토글 버튼 형식 구현
function clickIncome() {
  isIncome.value = !isIncome.value
  isExpense.value = !isIncome.value
}
function clickExpense() {
  isExpense.value = !isExpense.value
  isIncome.value = !isExpense.value
}

// db.json에서 데이터 받아오기
const transactions = ref([])

async function requestAPI() {
  try {
    const res = await axios.get('/api/transactions') // 엔드포인트 확인 필요
    transactions.value = res.data
  } catch (error) {
    console.error('🚨 트랜잭션 불러오기 실패:', error)
  }
}

// ✅ 날짜별 수입/지출 총합과 건수를 계산
const grouped = computed(() => {
  const map = new Map()
  transactions.value.forEach((tx) => {
    const date = tx.date
    const isIncome = tx.category_id.startsWith('2')

    if (!map.has(date)) {
      map.set(date, {
        income: 0,
        incomeCount: 0,
        expense: 0,
        expenseCount: 0,
      })
    }

    const entry = map.get(date)
    if (isIncome) {
      entry.income += tx.amount
      entry.incomeCount++
    } else {
      entry.expense += tx.amount
      entry.expenseCount++
    }
  })

  const sorted = [...map.entries()].sort(([a], [b]) => a.localeCompare(b))

  return {
    labels: sorted.map(([date]) => date),
    incomeData: sorted.map(([_, val]) => val.income),
    incomeCounts: sorted.map(([_, val]) => val.incomeCount),
    expenseData: sorted.map(([_, val]) => val.expense),
    expenseCounts: sorted.map(([_, val]) => val.expenseCount),
  }
})

// ✅ 전월 대비 소비 총합 비교
const monthlyTotal = computed(() => {
  const now = new Date()
  const thisMonth = now.toISOString().slice(0, 7)
  const prevMonth = new Date(now.setMonth(now.getMonth() - 1)).toISOString().slice(0, 7)

  let thisTotal = 0
  let prevTotal = 0

  transactions.value.forEach((tx) => {
    const isExpense = !tx.category_id.startsWith('2')
    const month = tx.date.slice(0, 7)

    if (isExpense) {
      if (month === thisMonth) thisTotal += tx.amount
      else if (month === prevMonth) prevTotal += tx.amount
    }
  })

  return {
    thisTotal,
    prevTotal,
    diff: thisTotal - prevTotal,
  }
})

onMounted(() => {
  requestAPI()
})
</script>
<style scoped>
.report-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.report-wrapper {
  display: flex;
  justify-content: space-between;
}

.report-left {
  width: 24%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

.report-right {
  width: 64%;
}

.report-divider {
  width: 100%;
  height: 0.0625rem;
  background-color: var(--color-light);
}
</style>
