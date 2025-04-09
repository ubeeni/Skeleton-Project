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
  const { date, range, showIncome, showExpense, incomeCategoryIds, expenseCategoryIds } =
    filterOptions.value

  const to = dayjs(date)
  const from = to.subtract(range === '1주' ? 7 : range === '3개월' ? 90 : 30, 'day')

  return transactions.value.filter((tx) => {
    const txDate = dayjs(tx.date)
    const inRange = txDate.isBetween(from, to, null, '[]')

    // ❗수입/지출 전부 꺼져 있으면 안 보여주기
    if (!showIncome && !showExpense) return false

    // ✅ type 필터
    if (tx.type === 'Income' && !showIncome) return false
    if (tx.type === 'Expense' && !showExpense) return false

    // ✅ category 필터 (선택된 게 있을 경우만 필터링)
    if (tx.type === 'Income' && incomeCategoryIds.length > 0) {
      return inRange && incomeCategoryIds.includes(tx.category_id)
    }

    if (tx.type === 'Expense' && expenseCategoryIds.length > 0) {
      return inRange && expenseCategoryIds.includes(tx.category_id)
    }

    // ❗선택된 카테고리가 없으면 해당 타입은 전체 허용
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
