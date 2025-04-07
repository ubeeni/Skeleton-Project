<template>
    <div class="list-page">
      <TransactionOneDay
        :date="today"
        :transactions="sampleTransactions"
        :categoryMap="categoryMap"
      />
    </div>
  </template>
  
  <script setup>
  import TransactionOneDay from './TransactionOneDay.vue'
  
  const today = '2024-04-07'
  
  const sampleTransactions = [
    { id: 'tx1', category_id: '2222', amount: 50000, memo: '카테고리' },
    { id: 'tx2', category_id: '5555', amount: 3000, memo: '메모란' },
    { id: 'tx3', category_id: '5555', amount: 4000, memo: '메모란' }
  ]
  
  const categoryMap = {
    '2222': { name: '용돈', type: 'Income' },
    '5555': { name: '생활비', type: 'Expense' }
  }
  </script>
  