<template>
  <div class="line-wrapper">
    <apexchart class="line-chart" type="line" :options="options" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// props 전달
const props = defineProps({
  labels: Array,
  incomeData: Array,
  expenseData: Array,
  incomeCounts: Array,
  expenseCounts: Array,
})

// 각 라인 데이터 설정
const series = computed(() => [
  {
    name: '수입',
    data: props.incomeData,
    color: 'var(--color-income)',
  },
  {
    name: '지출',
    data: props.expenseData,
    color: 'var(--color-expense)',
  },
])

// 옵션 설정
const options = computed(() => ({
  chart: {
    id: 'line-chart',
    type: 'line',
  },
  xaxis: {
    categories: props.labels,
  },
  tooltip: {
    shared: true,
    custom: ({ dataPointIndex }) => {
      const date = props.labels[dataPointIndex]
      const income = props.incomeData[dataPointIndex] || 0
      const incomeCount = props.incomeCounts[dataPointIndex] || 0
      const expense = props.expenseData[dataPointIndex] || 0
      const expenseCount = props.expenseCounts[dataPointIndex] || 0

      return `
        <div style="padding: 8px;">
          <strong>${date}</strong><br/>
          <span style="color: var(--color-income)">● 수입:</span> ${income.toLocaleString()}원 (${incomeCount}건)<br/>
          <span style="color: var(--color-expense)">● 지출:</span> ${expense.toLocaleString()}원 (${expenseCount}건)
        </div>
      `
    },
  },
}))
</script>

<style scoped>
.line-wrapper {
  width: 100%;
  height: 100%;
  background-color: var(--color-white);
  border-radius: 2rem;
  box-shadow: 0 0 1rem var(--color-light3);
  padding: 0.5rem;
}

.line-chart {
  width: 100%;
  height: 100%;
}
</style>
