<template>
  <div class="form-container">
    <div class="form-body">
      <div class="form-body-left">
        <div class="form-input">
          <span>{{ amount }} 원</span>
          <BtnDual :is-income-active="isIncome" :is-expense-active="isExpense" />
        </div>
        <div class="form-input">
          <label>거래명</label>
          <InputLg
            type="text"
            placeholder="거래명을 입력하세요"
            v-model="transactionTitle"
            readonly
          />
        </div>
      </div>
      <div class="form-body-right">
        <div class="form-input">
          <label>카테고리</label>
          <InputMed
            type="text"
            placeholder="카테고리를 선택하세요"
            v-model="categoryName"
            readonly
          />
        </div>
        <div class="form-input">
          <label>날짜</label>
          <InputMed type="text" placeholder="날짜를 선택하세요" v-model="dateDisplay" readonly />
        </div>
        <div class="form-input">
          <label>메모</label>
          <InputMed
            type="text"
            placeholder="메모는 선택사항입니다"
            v-model="memo"
            color="var(--color-primary)"
            readonly
          />
        </div>
      </div>
    </div>
    <div class="form-footer">
      <div class="form-btn-container">
        <BtnLg text="수정" @click="gotoUpdate" color="var(--color-primary)" />
        <BtnLg text="취소" @click="cancle" color="var(--color-light)" />
      </div>
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
import SelectLg from '@/components/input/SelectLg.vue'
import SelectMed from '@/components/input/SelectMed.vue'
import SelectSm from '@/components/input/SelectSm.vue'

import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const prevPage = ref(null)

const currentRoute = useRoute()
const router = useRouter()

const BASEURI = '/api'

const transactionId = ref(null) // 상세 보기할 트랜잭션 ID - 추후 pinia로 다른 페이지에서 받아올 것

const transactionTitle = ref('') // 거래명

const amount = ref(0) // 금액

const dateStr = ref('') // 날짜 (문자열)
const dateObj = computed(() => {
  return !dateStr.value
    ? ''
    : typeof dateStr.value === 'string'
      ? new Date(dateStr.value)
      : dateStr.value
}) // 날짜 (Date 객체)
const dateDisplay = computed(() => (dateObj.value ? dateObj.value.toLocaleString('ko-KR') : '')) // 화면에 표시될 날짜 형식

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
  const historyState = window.history.state
  prevPage.value = historyState.from
  transactionId.value = historyState.transaction_id || 'e5f7'

  try {
    console.log(transactionId)

    const transResponse = await axios.get(BASEURI + '/transactions')
    const catResponse = await axios.get(BASEURI + '/categories')

    const allTransactions = transResponse.data
    const allCategories = catResponse.data

    const transaction = allTransactions.find(
      (transaction) => transaction.id === transactionId.value,
    )

    transactionTitle.value = transaction.title
    amount.value = transaction.amount
    dateStr.value = transaction.date
    memo.value = transaction.memo

    categoryId.value = transaction.category_id
    const category = allCategories.find((category) => category.id === categoryId.value)

    categoryType.value = category.type
    categoryName.value = category.name
  } catch (error) {
    console.log('에러 발생 : ' + error)
  }
})

const gotoUpdate = () => {
  console.log('수정 버튼')
  router.push({
    name: 'detail',
    params: { action: 'update' },
    state: { from: prevPage.value, transaction_id: transactionId.value },
  })
}

const cancle = () => {
  console.log('취소 버튼')
  router.push({
    name: prevPage.value,
  })
}
</script>

<!-- ----------------------------------- style  ----------------------------------- -->

<style scoped>
.form-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-body {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.form-body-left {
  display: flex;
  flex-direction: column;
}

.form-body-right {
  display: flex;
  flex-direction: column;
}

.form-right {
  display: flex;
  flex-direction: column;
}

.form-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  gap: 16px;
}

.form-input span {
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: 0%;
}

.form-input label {
  white-space: nowrap; /* 줄바꿈 방지 */
  font-size: 16px;
  flex-shrink: 0; /* 작아지지 않게 */
}

.text-like-input {
  width: auto;
  min-width: 1ch;
  max-width: 15ch;
  font-size: 18px;
  background: transparent;
  border: none;
}

.form-footer {
  display: flex;
  justify-content: center;
}

.form-btn-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
</style>
