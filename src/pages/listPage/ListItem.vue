<template>
  <div class="list-item" v-if="item && item.amount !== undefined">
    <div class="item-left">
      <img :src="categoryInfo.imgUrl" alt="category" class="category-img" />
      <div class="text">
        <div class="memo bodySemibold16px">{{ item.title }}</div>
        <div class="category bodyRegular16px">{{ categoryInfo.name }}</div>
      </div>
    </div>
    <div class="item-right bodyRegular16px">
      <span :class="{ income: isIncome, expense: !isIncome }">{{ amountOnly }}</span>
      <span class="won">원</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
// import categoryImgs from '@/assets/images/categories/'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  categoryMap: {
    type: Object,
    required: true,
  },
})

const categoryInfo = computed(() => props.categoryMap[props.item.category_id] || {})
const isIncome = computed(() => categoryInfo.value.type === 'Income')

const amountOnly = computed(() => {
  const sign = isIncome.value ? ' ' : '-'
  return `${sign} ${props.item.amount.toLocaleString()}`
})
</script>

<style scoped>
.list-item {
  display: flex;
  width: 100%;
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
  justify-content: center;
  align-items: center;
  gap: 24px;
}

.category-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  background-color: var(--color-light); /* fallback bg */
}
.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;
}

.item-right {
  display: flex;
  align-items: center;
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
  text-align: right;

}
</style>
