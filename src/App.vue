<template>
  <header><HeaderMobile v-if="isMobile" /><Header v-else /></header>

  <main class="bodyRegular16px">
    <RouterView />
    <Floating />
  </main>
  <!-- <footer><Footer /></footer> -->
</template>

<script setup>
import axios from 'axios'
import { ref, computed, onMounted, provide } from 'vue'
import { useIsMobile } from './composables/UseIsMobile'

import Floating from './components/layout/Floating.vue'
import Header from './components/layout/Header.vue'
import HeaderMobile from './components/layout/HeaderMobile.vue'
// import Footer from './components/layout/Footer.vue'
import { toast } from 'vue3-toastify'

const { isMobile } = useIsMobile()

const quickAddOptions = ref([])

const transactions = ref([])
const categories = ref([])

const isIncome = ref(false)
const isExpense = ref(true)
const periodLine = ref('1개월')
const periodDoughnut = ref('1개월')
const PERIOD_OPTIONS = ['1주', '1개월', '3개월']

onMounted(async () => {
  const [txRes, catRes, quickAddRes] = await Promise.all([
    axios.get('/api/transactions'),
    axios.get('/api/categories'),
    axios.get('/api/quickAddOptions'),
  ])
  transactions.value = txRes.data
  categories.value = catRes.data
  quickAddOptions.value = quickAddRes.data

  const today = new Date()
  const todayDate = today.getDate()
  const todayDayKor = today.toLocaleDateString('ko-KR', { weekday: 'long' })
  const todayMonth = String(today.getMonth() + 1)

  const todayQuickAdds = quickAddOptions.value.filter((item) => {
    if (item.cycle === 'daily') return true
    if (item.cycle === 'weekly') return item.week === todayDayKor
    if (item.cycle === 'monthly') {
      const dayAsNumber = parseInt(item.month)
      return !isNaN(dayAsNumber) && dayAsNumber === todayDate
    }

    return false
  })

  if (todayQuickAdds.length > 0) {
    const titles = todayQuickAdds
      .map((item) => `• ${item.title} (${item.amount.toLocaleString()}원)`)
      .join('\n')
    toast.info(`💡 오늘 예정 거래가 ${todayQuickAdds.length}건 있어요!\n${titles}`)
  }
})

// 카테고리 매핑
const categoryMap = computed(() => {
  const map = new Map()
  categories.value.forEach((c) => {
    map.set(c.id, c.name)
  })
  return map
})

// Date 범위 계산
function subtractPeriod(date, type, amount) {
  const newDate = new Date(date)
  if (type === '1주') newDate.setDate(date.getDate() - amount * 7)
  else if (type === '1개월') newDate.setMonth(date.getMonth() - amount)
  else if (type === '3개월') newDate.setMonth(date.getMonth() - amount * 3)
  return newDate
}

// 현재 기간(기준) 데이터
const lineFilteredTransactions = computed(() => {
  const now = new Date()
  const start = subtractPeriod(now, periodLine.value, 1)
  return transactions.value.filter((tx) => {
    const d = new Date(tx.date)
    return d >= start && d <= now
  })
})

const prevFilteredTransactions = computed(() => {
  const now = new Date()
  const prevEnd = subtractPeriod(now, periodLine.value, 1)
  const prevStart = subtractPeriod(now, periodLine.value, 2)
  return transactions.value.filter((tx) => {
    const d = new Date(tx.date)
    return d >= prevStart && d < prevEnd
  })
})

// 소비 총합 비교 계산
const monthlyTotal = computed(() => {
  const getNetConsumption = (list) => {
    let income = 0
    let expense = 0
    list.forEach((tx) => {
      if (tx.type === 'Income') income += tx.amount
      else expense += tx.amount
    })
    return expense - income
  }

  return {
    thisTotal: getNetConsumption(lineFilteredTransactions.value),
    prevTotal: getNetConsumption(prevFilteredTransactions.value),
    diff:
      getNetConsumption(lineFilteredTransactions.value) -
      getNetConsumption(prevFilteredTransactions.value),
  }
})

// 소비,수입,트랜잭션 그룹화
const grouped = computed(() => {
  const map = new Map()
  // 날짜별로 그룹핑
  lineFilteredTransactions.value.forEach((tx) => {
    const date = tx.date
    const isIncome = tx.type === 'Income'

    // 해당 날짜 없으면 초기화
    if (!map.has(date)) {
      map.set(date, {
        income: 0,
        incomeCount: 0,
        expense: 0,
        expenseCount: 0,
      })
    }
    // 해당 날짜 있으면 업데이트
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
    incomeData: sorted.map(([, val]) => val.income),
    incomeCounts: sorted.map(([, val]) => val.incomeCount),
    expenseData: sorted.map(([, val]) => val.expense),
    expenseCounts: sorted.map(([, val]) => val.expenseCount),
  }
})

// 도넛 기간 계산
const doughnutFilteredTransactions = computed(() => {
  const now = new Date()
  const start = subtractPeriod(now, periodDoughnut.value, 1)
  return transactions.value.filter((tx) => {
    const d = new Date(tx.date)
    return d >= start && d <= now
  })
})

const doughnutData = computed(() => {
  const map = new Map()
  doughnutFilteredTransactions.value.forEach((tx) => {
    if ((isIncome.value && tx.type === 'Income') || (isExpense.value && tx.type === 'Expense')) {
      const categoryName = categoryMap.value.get(tx.category_id) || '기타'
      map.set(categoryName, (map.get(categoryName) || 0) + tx.amount)
    }
  })
  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1])
  return {
    labels: sorted.map(([label]) => label),
    series: sorted.map(([, value]) => value),
  }
})

const top5Labels = computed(() => doughnutData.value.labels.slice(0, 5))

// provide로 데이터 전달
provide('PERIOD_OPTIONS', PERIOD_OPTIONS)
provide('periodLine', periodLine)
provide('periodDoughnut', periodDoughnut)
provide('isIncome', isIncome)
provide('isExpense', isExpense)
provide('clickIncome', () => {
  isIncome.value = true
  isExpense.value = false
})
provide('clickExpense', () => {
  isIncome.value = false
  isExpense.value = true
})
provide('monthlyTotal', monthlyTotal)
provide('grouped', grouped)
provide('doughnutData', doughnutData)
provide('top5Labels', top5Labels)
</script>

<style scoped>
header {
  width: 100vw;
  margin: auto;
}
main {
  width: 62vw;
  margin: 8rem auto;
  min-height: 60vh;
}
/* footer {
  width: 100vw;
  margin: 0 auto;
} */

@media screen and (max-width: 767px) {
  main {
    width: 90vw;
    margin: 5rem auto;
  }
}
</style>
