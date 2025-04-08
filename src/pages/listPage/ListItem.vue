<template>
  <div class="list-item" v-if="item && item.amount !== undefined">
    <div class="item-left">
      <img :src="categoryImg" class="category-img" alt="카테고리 이미지" />
      <div class="text">
        <div class="category bodySemibold16px">{{ categoryInfo.name }}</div>
        <div class="memo bodyRegular16px">{{ item.memo }}</div>
      </div>
    </div>
    <div class="item-right">
      <span :class="{ income: isIncome, expense: !isIncome }">{{ amountOnly }}</span>
      <span class="won">원</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
// import categoryImgs from '@/assets/images/categories/'


const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  categoryMap: {
    type: Object,
    required: true
  }
})

const categoryInfo = computed(() => props.categoryMap[props.item.category_id] || {})
const isIncome = computed(() => categoryInfo.value.type === 'Income')

const amountOnly = computed(() => {
  const sign = isIncome.value ? '+' : '-'
  return `${sign} ${props.item.amount.toLocaleString()}`
})
</script>

<style scoped>
.list-item {
  /* display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: var(--color-white); */
  display: flex;
width: 800px;
height: 120px;
padding: 20px;
justify-content: space-between;
align-items: center;
flex-shrink: 0;
border-radius: 20px;
border: 1px solid var(--Light, #C8C8C8);
background: var(--White, #FFF);
}
.item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.category-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.text {
  display: flex;
  flex-direction: column;
}
.item-right {
  font-weight: bold;
  display: flex;
  align-items: baseline;
  gap: 2px;
}
.income {
  color: var(--color-income);
}
.expense {
  color: var(--color-expense);
}
.won {
  color: var(--color-dark); /* '원'은 항상 검정색 */
}
</style>
