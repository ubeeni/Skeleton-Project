<template>
  <div class="list-page">
    <div class="left-area">
      <ListSideBar
        :categories="categories"
        :transactions="transactions"
        :filtered-transactions="filteredTransactions"
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
import ListSideBar from '@/pages/listPage/_components/ListSideBar.vue'
import TransactionList from '@/pages/listPage/_components/TransactionList.vue'

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
  const {
    date,
    range,
    showIncome,
    showExpense,
    incomeCategoryIds,
    expenseCategoryIds,
  } = filterOptions.value

  const now = dayjs()
  const base = dayjs(date)
  let from, to

  if (range === '1주') {
    const day = base.day()
    from = base.subtract(day === 0 ? 6 : day - 1, 'day')
    to = base
  } else if (range === '1개월') {
    from = base.startOf('month')
    to = base.isSame(now, 'month') ? now : base.endOf('month') // 핵심 수정
  } else if (range === '3개월') {
    from = base.subtract(2, 'month').startOf('month')
    to = base.isSame(now, 'month') ? now : base.endOf('month')
  }

  return transactions.value.filter((tx) => {
    const txDate = dayjs(tx.date).startOf('day')
    const inRange =
      txDate.isSame(from, 'day') || txDate.isSame(to, 'day') || txDate.isBetween(from, to, null, '[]')

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
  gap: 2rem;
}

.left-area {
  width: 17.5rem;
}

.right-area {
  flex: 1;
}
</style>
