<template>
  <div class="form-container bodySemibold18px">
    <div class="form-body">
      <div class="form-body-left">
        <div class="form-input">
          <span
            ><span class="titleBold24px">{{ amount }} </span>&nbsp;&nbsp;원</span
          >
          <BtnDual :is-income-active="isIncome" :is-expense-active="isExpense" />
        </div>
        <div class="form-input form-lg">
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

    <div class="form-btn-container">
      <BtnLg text="수정" @click="gotoUpdate" color="var(--color-primary)" />
    </div>
  </div>
</template>

<!-- ----------------------------------- script  ----------------------------------- -->

<script setup>
import BtnLg from '@/components/button/BtnLg.vue'
import BtnDual from '@/components/button/BtnDual.vue'
import InputLg from '@/components/input/InputLg.vue'
import InputMed from '@/components/input/InputMed.vue'

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// const prevPage = ref(null)
const props = defineProps({
  prevPage: String,
  transactionId: String, // Add에서는 안 들어오므로 옵셔널로 사용 가능
})

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
  // const historyState = window.history.state
  // prevPage.value = historyState.from
  // props.transactionId = historyState.transaction_id || 'e5f7'

  try {
    console.log(transactionId)

    const transResponse = await axios.get(BASEURI + '/transactions')
    const catResponse = await axios.get(BASEURI + '/categories')

    const allTransactions = transResponse.data
    const allCategories = catResponse.data

    const transaction = allTransactions.find(
      (transaction) => transaction.id === props.transactionId,
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
    state: { from: props.prevPage, transaction_id: props.transactionId },
  })
}

const cancle = () => {
  console.log('취소 버튼')
  router.push({
    name: props.prevPage,
  })
}
</script>

<!-- ----------------------------------- style  ----------------------------------- -->

<style scoped>
/* ---------------------- Desktop ---------------------- */

.form-container {
  /* max-width: 100%;
  margin: 0 auto;
  padding: 24px; */
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-body {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.form-body-left,
.form-body-right {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.form-side {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.form-input {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 1rem;
}

.form-input span {
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: 0%;
}

.form-input label {
  white-space: nowrap; /* 줄바꿈 방지 */

  flex-shrink: 0; /* 작아지지 않게 */
}

.form-btn-container {
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

/* ---------------------- Mobile ---------------------- */

@media (max-width: 768px) {
  .form-body {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
  }

  .form-lg {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 0.5rem;
  }

  .form-btn-container {
    margin-top: 2rem;
  }
}
</style>
