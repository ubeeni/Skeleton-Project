<template>
  <div class="report-page bodyRegular18px">
    <div class="report-wrapper" id="line">
      <div class="report-left">
        <div class="report-title titleBold24px">소비 분석 그래프</div>
        <LineExplain />
      </div>
      <div class="report-right">
        <Line
          :labels="grouped.labels"
          :income-data="grouped.incomeData"
          :expense-data="grouped.expenseData"
          :income-counts="grouped.incomeCounts"
          :expense-counts="grouped.expenseCounts"
        />
      </div>
    </div>
    <div class="report-divider"></div>
    <div class="report-wrapper" id="doughnut">
      <div class="report-left">
        <div class="report-title titleBold24px">카테고리 별 비율</div>
        <DoughnutExplain />
      </div>
      <div class="report-right">
        <Doughnut :labels="doughnutData.labels" :series="doughnutData.series" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import Doughnut from '@/components/chart/Doughnut.vue'
import DoughnutExplain from './_components/DoughnutExplain.vue'
import Line from '@/components/chart/Line.vue'
import LineExplain from './_components/LineExplain.vue'
const grouped = inject('grouped')
const doughnutData = inject('doughnutData')
</script>

<style scoped>
.report-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.report-wrapper {
  display: flex;
  justify-content: space-between;
}

.report-left {
  width: 24%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

.report-right {
  width: 64%;
}

.report-divider {
  width: 100%;
  height: 0.0625rem;
  background-color: var(--color-light);
}

@media screen and (max-width: 767px) {
  /** Mobile */
  .report-wrapper {
    flex-direction: column;
    align-items: start;
    justify-content: left;
  }

  .report-left {
    width: 100%;
  }
  .report-right {
    width: 100%;
  }
}
</style>
