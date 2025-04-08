<template>
  <div class="doughnut-wrapper">
    <apexchart class="doughnut-chart" type="donut" :options="options" :series="series" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 도넛 데이터
const series = ref([44, 55, 41, 17, 15])

// 옵션 설정
const options = ref({
  chart: {
    type: 'doughnut',
  },
  labels: ['카페', '교통', '마트', '쇼핑', '기타'],
  legend: {
    position: 'bottom',
  },
  dataLabels: {
    enabled: true,
  },
})
</script>

<style scoped>
.doughnut-wrapper {
  width: 100%;
  height: 100%;
  background-color: var(--color-white);
  border-radius: 2rem;
  box-shadow: 0 0 1rem var(--color-light3);
  padding: 0.5rem;
}

.doughnut-chart {
  width: 100%;
  height: 100%;
}
</style>
