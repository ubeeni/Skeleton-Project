<template>
  <div class="home-wrapper">
    <div class="calender">
      <Calendar />
    </div>
    <div class="report-divider"></div>
    <div class="report-title titleBold24px">
      <RouterLink :to="{ name: 'report' }">1개월 소비리포트</RouterLink>
    </div>
    <div class="report-wrapper bodySemibold18px">
      <div class="report-left">
        <div class="report-subtitle">
          <RouterLink :to="{ name: 'report', hash: '#line' }">소비 분석 그래프</RouterLink>
        </div>
        <Line
          :labels="grouped.labels"
          :income-data="grouped.incomeData"
          :expense-data="grouped.expenseData"
          :income-counts="grouped.incomeCounts"
          :expense-counts="grouped.expenseCounts"
        />
      </div>
      <div class="report-right">
        <div class="report-subtitle">
          <RouterLink :to="{ name: 'report', hash: '#doughnut' }">지출 카테고리</RouterLink>
        </div>
        <Doughnut :labels="doughnutData.labels" :series="doughnutData.series" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Calendar from '@/pages/homePage/_components/Calendar.vue'
import Doughnut from '@/components/chart/Doughnut.vue'
import Line from '@/components/chart/Line.vue'
import { inject } from 'vue'

const grouped = inject('grouped')
const doughnutData = inject('doughnutData')
</script>

<style scoped>
.home-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
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
