<template>
  <div class="line-wrapper">
    <apexchart class="line-chart" type="line" :options="options" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 옵션 설정
const options = ref({
  chart: {
    id: 'line-chart',
    type: 'line',
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
  },
})

// 데이터 시리즈
const series = ref([
  {
    name: 'income',
    data: [30, 40, 45, 50, 49, 60, 70, 70],
    color: 'var(--color-income)',
  },
  {
    name: 'expense',
    data: [20, 30, 35, 40, 39, 50, 60, 81],
    color: 'var(--color-expense)',
  },
])
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
