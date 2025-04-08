<template>
  <div class="body">
    <h3>상세보기</h3>
    <br />

    <div class="form-group">
      <label>금액</label>
      <InputLg type="text" placeholder="금액을 입력하세요" v-model="amount" />
    </div>

    <BtnDual :is-income-active="isIncome" :is-expense-active="isExpense" />

    <div class="form-group">
      <label>거래명</label>
      <InputLg type="text" placeholder="거래명을 입력하세요" v-model="transactionName" />
    </div>

    <div class="form-group">
      <label>카테고리</label>
      <InputLg
        type="text"
        placeholder="카테고리를 선택하세요"
        v-model="selectedCategoryName"
        readonly
      />
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
      <BtnLg text="수정" @click="EditTransaction" color="var(--color-primary)" />
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

const transactionId = ref('')

const transactionName = ref('') // 거래명
const amount = ref(null) // 금액
const date = ref('') // 날짜
const memo = ref('') // 메모

// 선택된 카테고리 ID
const selectedCategoryId = computed(() => {})

// 선택된 카테고리 타입 (수입 or 지출)
const selectedCategoryType = computed(() => {
  const selectedCategory = allCategories.find(
    (category) => category.id === selectedCategoryId.value,
  )
  return selectedCategory ? selectedCategory.type : ''
})

// 선택된 카테고리 이름
const selectedCategoryName = computed(() => {
  const selectedCategory = allCategories.find(
    (category) => category.id === selectedCategoryId.value,
  )
  return selectedCategory ? selectedCategory.name : ''
})

const isIncome = computed(() => selectedCategoryType.value === 'Income')
const isExpense = computed(() => selectedCategoryType.value === 'Expense')

onMounted(async () => {
  try {
    const response = await axios.get(BASEURI + '/transactions')
  } catch (error) {
    console.log('에러 발생 : ' + error)
  }
})

const EditTransaction = () => {
  console.log('수정 버튼')
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
