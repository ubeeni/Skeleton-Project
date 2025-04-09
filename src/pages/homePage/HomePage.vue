<template>
  <div>
    <Calendar />
  </div>
  <!-- 여기부터 승아 -->
  <div class="report-divider"></div>
  <div class="report-title titleBold24px">소비리포트</div>
  <div class="report-wrapper bodySemibold18px">
    <div class="report-left">
      <div class="report-subtitle">소비 분석 그래프</div>
      <Line
        :labels="grouped.labels"
        :income-data="grouped.incomeData"
        :expense-data="grouped.expenseData"
        :income-counts="grouped.incomeCounts"
        :expense-counts="grouped.expenseCounts"
      />
    </div>
    <div class="report-right">
      <div class="report-subtitle">지출 카테고리</div>
      <Doughnut :labels="doughnutData.labels" :series="doughnutData.series" />
    </div>
  </div>
  <!-- 여기까지 승아 -->
</template>

<script setup>
import Calendar from './Calendar.vue'
// 여기부터 승아
import Doughnut from '@/components/chart/Doughnut.vue'
import Line from '@/components/chart/Line.vue'
import { inject } from 'vue'

const grouped = inject('grouped')
const doughnutData = inject('doughnutData')
// 여기까지 승아
</script>

<style scoped>
/* 여기부터 승아 */
.report-divider {
  width: 100%;
  height: 0.0625rem;
  background-color: var(--color-light);
}
.report-wrapper {
  display: flex;
  justify-content: space-between;
}

.report-title {
  margin-bottom: 1.25rem;
}

.report-subtitle {
  margin-bottom: 0.5rem;
}

.report-left,
.report-right {
  width: 48%;
}
</style>
