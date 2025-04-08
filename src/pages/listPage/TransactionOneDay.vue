<template>
  <div class="transaction-day">
    <div class="header">
      <div class="date bodySemibold18px">{{ formattedDate }}</div>
      <div class="summary bodyRegular16px">{{ formattedTotal }} {{ items.length }}건</div>
    </div>
    <div class="items">
      <ListItem v-for="item in items" :key="item.id" :item="item" :categoryMap="categoryMap" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import ListItem from './ListItem.vue'

const props = defineProps({
  date: String,
  items: Array,
  categoryMap: Object,
})

const formattedDate = computed(() =>
  dayjs(props.date).isValid() ? dayjs(props.date).format('M월 D일') : '날짜 오류',
)

const total = computed(() => {
  return props.items.reduce((sum, item) => {
    const type = props.categoryMap[item.category_id]?.type
    const sign = type === 'Income' ? 1 : -1
    return sum + item.amount * sign
  }, 0)
})

const formattedTotal = computed(() => {
  const sign = total.value >= 0 ? '+' : '-'
  return `${sign}${Math.abs(total.value).toLocaleString()}원`
})
</script>

<style scoped>
.transaction-day {
  margin-bottom: 24px;
  background-color: #f8f8f8;
  padding: 12px 16px;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  background-color: var(--color-white);

  align-items: center;
  gap: 8px;
}

.date {
  color: var(--Dark, #100d14);
  text-align: center;
}

.summary {
  color: var(--SemiDark, #797979);
  text-align: center;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
