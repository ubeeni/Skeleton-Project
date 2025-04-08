<template>
  <div class="report-page bodyRegular18px">
    <div class="report-wrapper">
      <div class="report-left">
        <div class="report-title titleBold24px">소비 분석 그래프</div>
        <!-- 기간 선택 버튼 -->
        <div class="report-selector">
          <BtnXs
            v-for="p in PERIOD_OPTIONS"
            :key="p"
            :text="p"
            :is-active="p === periodLine"
            @click="periodLine = p"
            color="var(--color-accent)"
          />
        </div>
        <div class="report-subtitle">
          {{
            monthlyTotal.diff === 0
              ? `${periodLine} 기준으로 동일한 소비입니다.`
              : monthlyTotal.diff > 0
                ? `${periodLine} 기준으로 ${monthlyTotal.diff.toLocaleString()}원 더 소비하였습니다.`
                : `${periodLine} 기준으로 ${Math.abs(monthlyTotal.diff).toLocaleString()}원 덜 소비하였습니다.`
          }}
        </div>
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
    <div class="report-wrapper">
      <div class="report-left">
        <div class="report-title titleBold24px">카테고리 별 비율</div>
        <!-- 기간 선택 버튼 -->
        <div class="report-selector">
          <BtnXs
            v-for="p in PERIOD_OPTIONS"
            :key="p"
            :text="p"
            :is-active="p === periodDoughnut"
            @click="periodDoughnut = p"
            color="var(--color-accent)"
          />
        </div>
        <BtnDual
          @clickIncome="clickIncome"
          @clickExpense="clickExpense"
          :is-income-active="isIncome"
          :is-expense-active="isExpense"
        />
        <div class="report-subtitle">
          <div v-for="(label, index) in top5Labels" :key="index">
            {{ index + 1 }}위: {{ label }}
          </div>
        </div>
      </div>
      <div class="report-right">
        <Doughnut :labels="doughnutData.labels" :series="doughnutData.series" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import BtnDual from '@/components/button/BtnDual.vue'
import Doughnut from '@/components/chart/Doughnut.vue'
import Line from '@/components/chart/Line.vue'
import BtnXs from '@/components/button/BtnXs.vue'

const periodLine = inject('periodLine')
const periodDoughnut = inject('periodDoughnut')
const isIncome = inject('isIncome')
const isExpense = inject('isExpense')
const clickIncome = inject('clickIncome')
const clickExpense = inject('clickExpense')
const grouped = inject('grouped')
const monthlyTotal = inject('monthlyTotal')
const doughnutData = inject('doughnutData')
const top5Labels = inject('top5Labels')
const PERIOD_OPTIONS = inject('PERIOD_OPTIONS')
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

.report-selector {
  display: flex;
  gap: 0.5rem;
}

.report-right {
  width: 64%;
}

.report-divider {
  width: 100%;
  height: 0.0625rem;
  background-color: var(--color-light);
}
</style>
