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
import dayjs from 'dayjs'
import TransactionOneDay from './TransactionOneDay.vue'

const props = defineProps({
  transactions: Array,
  categoryMap: Object,
})

const groupedTransactions = computed(() => {
  const groups = {}
  for (const item of props.transactions) {
    // ✅ 날짜 포맷 통일
    const dateKey = dayjs(item.date).format('YYYY-MM-DD')
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(item)
  }

  // 최신 날짜가 위로 오도록 정렬
  return Object.fromEntries(
    Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]))
  )
  //   const date = item.date
  //   if (!groups[date]) groups[date] = []
  //   groups[date].push(item)
  // }
  // return Object.fromEntries(Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0])))
})
</script>

<style scoped>
.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media screen and (max-width: 767px) {
  .transaction-list {
    gap: 1.5rem; /* 모바일에 맞게 여백 줄이기 */
  }
}

</style>
