<template>
  404페이지입니다 현재는 컴포넌트 테스트용으로 사용되고 있습니다.
  <BtnLg text="큰버튼" @click="handleClick" color="var(--color-secondary)" />
  <BtnMed text="중간버튼" @click="handleClick" color="var(--color-primary)" />
  <BtnSm text="작은버튼" @click="handleClick" color="var(--color-accent)" />
  <BtnDual
    @clickIncome="clickIncome"
    @clickExpense="clickExpense"
    :is-income-active="isIncome"
    :is-expense-active="isExpense"
  />
</template>

<script setup>
import BtnLg from '@/components/button/BtnLg.vue'
import BtnMed from '@/components/button/BtnMed.vue'
import BtnSm from '@/components/button/BtnSm.vue'
import BtnDual from '@/components/button/BtnDual.vue'

import { ref } from 'vue'
const isIncome = ref(false)
const isExpense = ref(false)

function handleClick() {
  alert('Button clicked!')
}

function clickIncome() {
  isIncome.value = !isIncome.value
  // alert('Income button clicked!')
}
function clickExpense() {
  isExpense.value = !isExpense.value
  // alert('Expense button clicked!')
}
</script>

<style scoped></style>
