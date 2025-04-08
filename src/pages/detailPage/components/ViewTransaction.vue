<template>
  <div class="body">
    <h3>상세보기</h3>
    <br />

    <div class="form-group">
      <label>금액</label>
      <InputLg type="text" placeholder="금액을 입력하세요" v-model="amount" readonly />
    </div>

    <BtnDual :is-income-active="isIncome" :is-expense-active="isExpense" />

    <div class="form-group">
      <label>거래명</label>
      <InputLg type="text" placeholder="거래명을 입력하세요" v-model="transactionTitle" readonly />
    </div>

    <div class="form-group">
      <label>카테고리</label>
      <InputLg type="text" placeholder="카테고리를 선택하세요" v-model="categoryName" readonly />
    </div>

    <div class="form-group">
      <label>날짜</label>
      <InputLg type="text" placeholder="날짜를 선택하세요" v-model="date" readonly />
    </div>

    <div class="form-group">
      <label>메모</label>
      <InputLg type="text" placeholder="메모는 선택사항입니다" v-model="memo" readonly />
    </div>

    <div class="actions">
      <BtnLg text="수정" @click="gotoUpdate" color="var(--color-primary)" />
      <BtnLg text="취소" @click="cancle" color="var(--color-primary)" />
    </div>
  </div>
</template>

<!-- ----------------------------------- script  ----------------------------------- -->

<script setup>
import BtnLg from '@/components/button/BtnLg.vue'
import BtnMed from '@/components/button/BtnMed.vue'
import BtnSm from '@/components/button/BtnSm.vue'
import BtnDual from '@/components/button/BtnDual.vue'
import InputLg from '@/components/input/InputLg.vue'
import InputMed from '@/components/input/InputMed.vue'
import InputSm from '@/components/input/InputSm.vue'

import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const currentRoute = useRoute()
const router = useRouter()

const BASEURI = '/api'

const transactionId = ref('SIVA') // 상세 보기할 트랜잭션 ID

const transactionTitle = ref('') // 거래명
const amount = ref(0) // 금액
const date = ref('') // 날짜
const memo = ref('') // 메모

// 선택된 카테고리 ID
const categoryId = ref('')

// 선택된 카테고리 타입 (수입 or 지출)
const categoryType = ref('')

// 선택된 카테고리 이름
const categoryName = ref('')

const isIncome = computed(() => categoryType.value === 'Income')
const isExpense = computed(() => categoryType.value === 'Expense')

onMounted(async () => {
  try {
    const transResponse = await axios.get(BASEURI + '/transactions')
    const catResponse = await axios.get(BASEURI + '/categories')

    const allTransactions = transResponse.data
    const allCategories = catResponse.data

    console.log(allTransactions)
    console.log(allCategories)

    const transaction = allTransactions.find(
      (transaction) => transaction.id === transactionId.value,
    )

    console.log(transaction)

    transactionTitle.value = transaction.title
    amount.value = transaction.amount
    date.value = transaction.date
    memo.value = transaction.memo

    categoryId.value = transaction.category_id
    const category = allCategories.find((category) => category.id === categoryId.value)

    categoryType.value = category.type
    categoryName.value = category.name

    console.log(
      '거래명: ' +
        transactionTitle.value +
        '\n금액: ' +
        amount.value +
        '\n카테고리 타입: ' +
        categoryType.value +
        '\n카테고리명: ' +
        categoryName.value +
        '\n날짜: ' +
        date.value +
        '\n메모: ' +
        memo.value,
    )
  } catch (error) {
    console.log('에러 발생 : ' + error)
  }
})

const gotoUpdate = () => {
  console.log('수정 버튼')
  router.push('/detail/update')
}

const cancle = () => {
  console.log('취소 버튼')
}
</script>

<!-- ----------------------------------- style  ----------------------------------- -->

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
