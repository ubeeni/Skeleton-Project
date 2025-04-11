<template>
  <div class="transaction-day">
    <div class="header">
      <div class="date bodySemibold18px">{{ formattedDate }}</div>
      <div class="summary bodyRegular16px">
        {{ formattedTotal }}&nbsp; &nbsp;{{ items.length }}건
      </div>
    </div>
    <div class="items">
      <ListItem
        v-for="item in sortedItems"
        :key="item.id"
        :item="item"
        :categoryMap="categoryMap"
      />
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

const sortedItems = computed(() =>
  [...props.items].sort((a, b) => {
    return dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  }),
)
</script>

<style scoped>
.transaction-day {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-items: center;
}

.summary {
  color: var(--color-semidark);
  display: flex;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media screen and (max-width: 767px) {
  .header {
    /* flex-direction: column; */
    /* align-items: flex-start; */
    /* gap: 0.25rem; */
  }
}
</style>
