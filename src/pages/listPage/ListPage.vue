<template>
  <div class="list-page">
    <div class="left-area">
      <ListSideBar :categories="categories" :transactions="transactions" />
    </div>
    <div class="right-area">
      <TransactionOneDay
        v-for="(txList, date) in sortedGroupedTransactions"
        :key="date"
        :date="date"
        :items="txList"
        :categoryMap="categoryMap"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import TransactionOneDay from './TransactionOneDay.vue'
import ListSideBar from './ListSideBar.vue'

const transactions = ref([])
const categories = ref([])

onMounted(async () => {
  const txRes = await axios.get('/api/transactions')
  const catRes = await axios.get('/api/categories')
  transactions.value = txRes.data
  categories.value = catRes.data
})

const today = dayjs()

// 미래 거래 제외, 날짜 그룹화
const groupedTransactions = computed(() => {
  const groups = {}
  for (const tx of transactions.value) {
    if (dayjs(tx.date).isAfter(today)) continue
    if (!groups[tx.date]) groups[tx.date] = []
    groups[tx.date].push(tx)
  }
  return groups
})

// 최신 날짜부터 정렬
const sortedGroupedTransactions = computed(() => {
  return Object.fromEntries(
    Object.entries(groupedTransactions.value).sort((a, b) => dayjs(b[0]).unix() - dayjs(a[0]).unix())
  )
})

const categoryMap = computed(() => {
  const map = {}
  categories.value.forEach((cat) => {
    map[cat.id] = cat
  })
  return map
})
</script>

<style scoped>
.list-page {
  display: flex;
  padding: 24px;
  gap: 32px;
  background-color: #f8f8f8;
}

.left-area {
  width: 250px;
}

.right-area {
  flex: 1;
}
</style>

<!-- <template>
  <div class="list-page">
    <TransactionList
      :transactions="transactions"
      :categoryMap="categoryMap"
    />
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import axios from 'axios'
  import TransactionList from './TransactionList.vue'

  const transactions = ref([])
  const categories = ref([])
  
  // const categoryMap = computed(() => {
  //   const map = {}
  //   categories.value.forEach((cat) => (map[cat.id] = cat))
  //   return map
  // })

  const categoryMap = computed(() => {
  const map = {}
  if (Array.isArray(categories.value)) {
    categories.value.forEach((cat) => {
      if (cat && cat.id) map[cat.id] = cat
    })
  }
  return map
})


  const groupedTransactions = computed(() => {
  const groups = {}
  for (const tx of transactions.value) {
    if (!groups[tx.date]) groups[tx.date] = []
    groups[tx.date].push(tx)
  }
  return groups
})

  onMounted(async () => {
    const txRes = await axios.get('/api/transactions')
    const catRes = await axios.get('/api/categories')
    transactions.value = txRes.data
    categories.value = catRes.data
  })
  </script>

<style scoped>
.list-page {
  padding: 24px;
  background-color: #f8f8f8;
}
</style>

   -->

   