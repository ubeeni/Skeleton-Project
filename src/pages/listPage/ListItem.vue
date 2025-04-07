<template>
    <div class="list-item">
      <div class="left">
        <div>{{ categoryName }}</div>
        <div>{{ item.memo }}</div>
      </div>
      <div class="right" :class="{ income: isIncome, expense: !isIncome }">
        {{ formattedAmount }}
      </div>
    </div>
  </template>

<script setup>
import { computed } from "vue";
        
const props = defineProps({
    item: {
        type : Object,
        required : true
    },
    categoryMap : {
        type : Object,
        required : true
    }
})

const categoryInfo = computed(() => props.categoryMap[props.item.category_id] || {})
const categoryName = computed(() => categoryInfo.value.name || '알 수 없음')
const isIncome = computed(() => categoryInfo.value.type === 'Income')
const formattedAmount = computed(() => {
  const sign = isIncome.value ? '+' : '-'
  return `${sign} ${props.item.amount.toLocaleString()}원`
})
</script>

<style scoped>
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: #fff;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.right {
  font-weight: bold;
}

.income {
  color: #1976d2;
}

.expense {
  color: #d32f2f;
}
</style>
