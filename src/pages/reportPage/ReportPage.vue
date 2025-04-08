<template>
  <div class="report-page bodyRegular18px">
    <div class="report-wrapper">
      <div class="report-left">
        <div class="report-title titleBold24px">가장 많이 소비한 내역</div>
        <div class="report-subtitle">전월 대비 5,000원 덜 소비하였습니다.</div>
      </div>
      <div class="report-right">
        <Line />
      </div>
    </div>
    <div class="report-divider"></div>
    <div class="report-wrapper">
      <div class="report-left">
        <div class="report-title titleBold24px">카테고리 별 비율</div>
        <BtnDual
          @clickIncome="clickIncome"
          @clickExpense="clickExpense"
          :is-income-active="isIncome"
          :is-expense-active="isExpense"
        />
        <div class="report-subtitle">
          1위: 카페<br />2위: 식당<br />3위: xx<br />4위: xx<br />5위: xx
        </div>
      </div>
      <div class="report-right">
        <Doughnut />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BtnDual from '@/components/button/BtnDual.vue'
import Doughnut from '@/components/chart/Doughnut.vue'
import Line from '@/components/chart/Line.vue'

const isIncome = ref(false)
const isExpense = ref(true)

// 토글 버튼 형식 구현
function clickIncome() {
  isIncome.value = !isIncome.value
  isExpense.value = !isIncome.value
}
function clickExpense() {
  isExpense.value = !isExpense.value
  isIncome.value = !isExpense.value
}
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
</style>
