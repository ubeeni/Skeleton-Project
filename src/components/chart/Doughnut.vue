<template>
  <div class="doughnut-wrapper">
    <apexchart width="380" type="donut" :options="options" :series="series" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 도넛 데이터
const series = ref([44, 55, 41, 17, 15])

// 옵션 설정
const options = ref({
  chart: {
    type: 'donut',
  },
  labels: ['카페', '교통', '마트', '쇼핑', '기타'],
  colors: [
    'var(--color-primary)',
    'var(--color-secondary)',
    'var(--color-accent)',
    'var(--color-expense)',
    'var(--color-income)',
  ],
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
  background-color: var(--color-light);
}
</style>
