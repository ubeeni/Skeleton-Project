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
    width: '100%',
    height: '100%',
    id: 'line-chart',
    type: 'line',
    // 차트 도구 비활성화
    toolbar: {
      show: false,
    },
    // 차트 확대/축소 비활성화
    zoom: {
      enabled: false,
    },
  },
  // 라인 그래프 스타일 설정
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  xaxis: {
    categories: props.labels,
    labels: {
      // 라벨 형식 mm/dd 형식으로 변환
      formatter: function (value) {
        const date = new Date(value)
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const dd = String(date.getDate()).padStart(2, '0')
        return `${mm}/${dd}`
      },
    },
  },
  tooltip: {
    shared: true,
    // 매핑
    custom: ({ dataPointIndex }) => {
      const date = props.labels[dataPointIndex]
      const income = props.incomeData[dataPointIndex] || 0
      const incomeCount = props.incomeCounts[dataPointIndex] || 0
      const expense = props.expenseData[dataPointIndex] || 0
      const expenseCount = props.expenseCounts[dataPointIndex] || 0

      return `
        <div style="padding: 1rem;">
          <div class="bodySemibold16px">${date}</div><br/>
          <span class="bodyRegular16px" style="color: var(--color-income)">● 수입:</span> ${income.toLocaleString()}원 (${incomeCount}건)<br/>
          <span class="bodyRegular16px" style="color: var(--color-expense)">● 지출:</span> ${expense.toLocaleString()}원 (${expenseCount}건)
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
  box-shadow: var(--boxshadow-light);
  padding: 0.5rem;
}

.line-chart {
  width: 100%;
  height: 100%;
}
</style>
