<template>
  <div class="line-wrapper">
    <apexchart width="500" type="line" :options="options" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 옵션 설정
const options = ref({
  chart: {
    id: 'vuechart-example',
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
  },
})

// 데이터 시리즈
const series = ref([
  {
    name: 'series-1',
    data: [30, 40, 45, 50, 49, 60, 70, 91],
  },
])
</script>

<style scoped>
.line-wrapper {
  width: 100%;
  height: 100%;
  background-color: var(--color-light);
}
</style>
