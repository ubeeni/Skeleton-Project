<template>
  <div class="list-page">
    <div class="left-area">
      <ListSideBar
        :categories="categories"
        :transactions="transactions"
        @filter-change="handleFilterChange"
      />
    </div>
    <div class="right-area">
      <TransactionList :transactions="filteredTransactions" :categoryMap="categoryMap" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
import ListSideBar from './ListSideBar.vue'
import TransactionList from './TransactionList.vue'

const transactions = ref([])
const categories = ref([])

onMounted(async () => {
  const txRes = await axios.get('/api/transactions')
  const catRes = await axios.get('/api/categories')
  transactions.value = txRes.data
  categories.value = catRes.data
})

const categoryMap = computed(() => {
  const map = {}
  categories.value.forEach((cat) => {
    map[cat.id] = cat
  })
  return map
})

const filterOptions = ref({
  date: dayjs(),
  range: '1개월',
  showIncome: true,
  showExpense: true,
  incomeCategoryIds: [],
  expenseCategoryIds: [],
})

function handleFilterChange(newOptions) {
  filterOptions.value = newOptions
}

const filteredTransactions = computed(() => {
  const { date, range, showIncome, showExpense, incomeCategoryIds, expenseCategoryIds } = filterOptions.value

  const to = dayjs(date)
  let from

  if (range === '1주') {
    const day = to.day() // 일요일(0) ~ 토요일(6)
    from = to.subtract((day === 0 ? 6 : day - 1), 'day') // 월요일까지 이동
  } else if (range === '1개월') {
    from = to.startOf('month')
  } else if (range === '3개월') {
    from = to.subtract(2, 'month').startOf('month')
  }

  return transactions.value.filter((tx) => {
    const txDate = dayjs(tx.date).startOf('day')
    const inRange = txDate.isSame(from, 'day') || txDate.isSame(to, 'day') || txDate.isBetween(from, to)

    // 수입/지출 모두 꺼져 있을 때 → 전체 출력
    if (!showIncome && !showExpense) return inRange

    if (tx.type === 'Income' && !showIncome) return false
    if (tx.type === 'Expense' && !showExpense) return false

    if (tx.type === 'Income' && incomeCategoryIds.length > 0) {
      return inRange && incomeCategoryIds.includes(tx.category_id)
    }

    if (tx.type === 'Expense' && expenseCategoryIds.length > 0) {
      return inRange && expenseCategoryIds.includes(tx.category_id)
    }

    return inRange
  })
})
</script>

<style scoped>
.list-page {
  display: flex;
  padding: 24px;
  gap: 32px;
}

.left-area {
  width: 250px;
}

.right-area {
  flex: 1;
}
</style>
