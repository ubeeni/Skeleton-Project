<template>
    <div class="transaction-list">
      <TransactionOneDay
        v-for="(group, date) in groupedTransactions"
        :key="date"
        :date="date"
        :items="group"
        :categoryMap="categoryMap"
      />
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import TransactionOneDay from './TransactionOneDay.vue'
  
  const props = defineProps({
    transactions: Array,
    categoryMap: Object,
  })
  
  const groupedTransactions = computed(() => {
    const groups = {}
    for (const item of props.transactions) {
      const date = item.date
      if (!groups[date]) groups[date] = []
      groups[date].push(item)
    }
    return Object.fromEntries(
      Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]))
    )
  })
  </script>
  
  <style scoped>
  .transaction-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  </style>