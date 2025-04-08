<template>
    <div class="transaction-day">
      <div class="header">
        <div class="date titleBold14px">{{ formattedDate }}</div>
        <div class="summary bodyRegular16px">
          {{ formattedTotal }} · {{ items.length }}건
        </div>
      </div>
      <div class="items">
        <ListItem
          v-for="item in items"
          :key="item.id"
          :item="item"
          :categoryMap="categoryMap"
        />
      </div>
    </div>
  </template>

<script setup>
    import {computed} from 'vue';
    import dayjs from 'dayjs';
    import ListItem from './ListItem.vue';
    
    const props = defineProps({
        date: String,
        items : Array,
        categoryMap : Object
    })
    
    const formattedDate = computed(() =>
    dayjs(props.date).isValid()
    ? dayjs(props.date).format('M월 D일')
    : '날짜 오류'
    )

    const total = computed(() => {
        return props.items.reduce((sum, item) => {
        const type = props.categoryMap[item.category_id]?.type
        const sign = type === 'Income' ? 1 : -1
        return sum + item.amount * sign
    }, 0 )
    })

    const formattedTotal = computed(() => {
        const sign = total.value >= 0 ? '+' : '-'
        return `${sign}${Math.abs(total.value).toLocaleString()}원`
    })

</script>


<style scoped>
.transaction-day {
  margin-bottom: 24px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>