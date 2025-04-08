<template>
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

  