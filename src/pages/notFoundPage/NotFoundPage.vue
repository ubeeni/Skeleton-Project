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
  <InputLg type="search" placeholder="이메일을 입력하세요" v-model="inputVal" />
  <InputMed type="text" placeholder="text" v-model="inputVal" />
  <InputSm type="number" placeholder="number" v-model="inputVal" />
  {{ inputVal }}
  <SelectLg v-model="selectedValue" :options="categoryOptions" placeholder="수입 카테고리" />
  <SelectMed v-model="selectedValue" :options="categoryOptions" placeholder="수입 카테고리" />
  <SelectSm v-model="selectedValue" :options="categoryOptions" placeholder="수입 카테고리" />
</template>

<script setup>
import BtnLg from '@/components/button/BtnLg.vue'
import BtnMed from '@/components/button/BtnMed.vue'
import BtnSm from '@/components/button/BtnSm.vue'
import BtnDual from '@/components/button/BtnDual.vue'
import InputLg from '@/components/input/InputLg.vue'

import { ref } from 'vue'
import InputMed from '@/components/input/InputMed.vue'
import InputSm from '@/components/input/InputSm.vue'
import SelectLg from '@/components/input/SelectLg.vue'
import SelectMed from '@/components/input/SelectMed.vue'
import SelectSm from '@/components/input/SelectSm.vue'
const isIncome = ref(false)
const isExpense = ref(false)
const inputVal = ref('')

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

const selectedValue = ref('')
const categoryOptions = [
  { value: 'income', label: '수입' },
  { value: 'expense', label: '지출' },
  { value: 'other', label: '기타' },
]
</script>

<style scoped></style>
