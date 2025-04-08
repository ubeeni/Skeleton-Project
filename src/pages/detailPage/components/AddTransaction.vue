<template>
  <div class="body">
    <h3>거래내역 추가</h3>
    <div class="form-group">
      <label>거래명</label>
      <InputLg type="text" placeholder="거래명을 입력하세요" v-model="transactionTitle" />
    </div>

    <div class="form-group">
      <label>금액</label>
      <InputLg type="text" placeholder="금액을 입력하세요" v-model="amount" />
    </div>

    <BtnDual
      @clickIncome="clickIncome"
      @clickExpense="clickExpense"
      :is-income-active="isIncome"
      :is-expense-active="isExpense"
    />

    <div class="form-group">
      <label>카테고리</label>
      <InputLg
        type="text"
        placeholder="카테고리를 선택하세요"
        v-model="selectedCategoryName"
        readonly
      />
      <select id="category" v-model="selectedCategoryId">
        <option value="" disabled>카테고리를 선택하세요</option>
        <option v-for="category in filteredCategories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label>날짜</label>
      <InputLg type="text" placeholder="날짜를 선택하세요" v-model="date" />
    </div>

    <div class="form-group">
      <label>메모</label>
      <InputLg type="text" placeholder="메모는 선택사항입니다" v-model="memo" />
    </div>

    <div class="actions">
      <BtnLg text="추가" @click="addTransaction" color="var(--color-primary)" />
      <BtnLg text="취소" @click="cancleTransaction" color="var(--color-semidark)" />
    </div>
  </div>
</template>

<!-- ------------------------------------------------------------------------ -->

<script setup>
import BtnLg from '@/components/button/BtnLg.vue'
import BtnMed from '@/components/button/BtnMed.vue'
import BtnSm from '@/components/button/BtnSm.vue'
import BtnDual from '@/components/button/BtnDual.vue'
import InputLg from '@/components/input/InputLg.vue'
import InputMed from '@/components/input/InputMed.vue'
import InputSm from '@/components/input/InputSm.vue'

import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

const BASEURI = '/api'

const transactionTitle = ref('') // 거래 타이틀
const amount = ref(null) // 금액
const date = ref('') // 날짜
const memo = ref('') // 메모

// 모든 카테고리 목록 (id, name, type)
const allCategories = reactive([])

// 선택된 카테고리 타입 (수입 or 지출)
const selectedCategoryType = ref('Income')

// type에 따른 카테고리 목록 (수입 -> [미분류, 월급, 용돈, 기타수입])
const filteredCategories = computed(() => {
  return allCategories.filter((category) => category.type === selectedCategoryType.value)
})

// 선택된 카테고리 이름
const selectedCategoryName = computed(() => {
  const selectedCategory = allCategories.find(
    (category) => category.id === selectedCategoryId.value,
  )

  return selectedCategory ? selectedCategory.name : ''
})

// 선택된 카테고리 ID
const selectedCategoryId = ref('0000')

const isIncome = computed(() => selectedCategoryType.value === 'Income')
const isExpense = computed(() => selectedCategoryType.value === 'Expense')

function clickIncome() {
  selectType('Income')
}
function clickExpense() {
  selectType('Expense')
}

onMounted(async () => {
  try {
    const response = await axios.get(BASEURI + '/categories')
    allCategories.splice(0, allCategories.length, ...response.data)
  } catch (error) {
    console.log('에러 발생 : ' + error)
  }
})

const selectType = (type) => {
  selectedCategoryType.value = type
  const selectedCategory = allCategories.find(
    (category) => category.name === '미분류' && category.type === type,
  )
  console.log('selectedCategory : ', selectedCategory)
  selectedCategoryId.value = selectedCategory.id
}

const addTransaction = () => {
  console.log(
    '거래명: ' +
      transactionTitle.value +
      '\n금액: ' +
      amount.value +
      '\n카테고리 타입: ' +
      selectedCategoryType.value +
      '\n카테고리명: ' +
      selectedCategoryName.value +
      '\n날짜: ' +
      date.value +
      '\n메모: ' +
      memo.value,
  )
}

const cancleTransaction = () => {
  transactionName.value = ''
  amount.value = 0
  selectedCategoryId.value = '0000'
  date.value = ''
  memo.value = ''
}
</script>

<!-- ------------------------------------------------------------------------ -->

<style scoped>
* {
  padding: 0;
  margin: 0;
}
.body {
  width: 500px;
  margin: 0 auto;
  font-family: sans-serif;
  padding: 30px;
}

.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
</style>
