<template>
  <div class="body">
    <h3>거래 수정</h3>
    <div class="form-group">
      <label>거래명</label>
      <InputLg type="text" placeholder="거래명을 입력하세요" v-model="transactionTitle" />
    </div>

    <div class="form-group">
      <label>금액</label>
      <InputLg
        type="number"
        placeholder="금액을 입력하세요"
        v-model.number="amount"
        @keypress="onlyAllowDigits"
        @input="removeNonDigits"
      />
    </div>

    <BtnDual
      @clickIncome="selectType('Income')"
      @clickExpense="selectType('Expense')"
      :is-income-active="isIncome"
      :is-expense-active="isExpense"
    />

    <SelectLg v-model="categoryId" :options="filteredCategory" placeholder="카테고리" />

    <div class="form-group">
      <label>날짜</label>
      <InputLg
        type="text"
        placeholder="날짜를 선택하세요"
        @click="openModal"
        v-model="dateDisplay"
      />
    </div>

    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-content">
        <h3>날짜와 시간 선택</h3>
        <Datepicker
          v-model="dateStr"
          :enable-time-picker="true"
          time-picker-inline
          :input-props="{ readonly: true }"
          :format="(d) => d.toLocaleString('ko-KR')"
          :max-date="new Date()"
        />
        <br />
        <button @click="closeModal">닫기</button>
      </div>
    </div>

    <div class="form-group">
      <label>메모</label>
      <InputLg type="text" placeholder="메모는 선택사항입니다" v-model="memo" />
    </div>

    <div class="actions">
      <BtnLg text="수정" @click="updateTransaction" color="var(--color-primary)" />
      <BtnLg text="삭제" @click="deleteTransaction" color="var(--color-semidark)" />
      <BtnLg text="취소" @click="cancle" color="var(--color-semidark)" />
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

import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const prevPage = ref(null)

const currentRoute = useRoute()
const router = useRouter()

const BASEURI = '/api'

const transactionId = ref(null) // 상세 보기할 트랜잭션 ID - 추후 ViewTransaction 에서 받아올 것

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
const isoDate = computed(() => toKSTISOString(dateObj.value).slice(0, 19)) // 날짜 (iso 표준 - 실제 DB 저장 형식)

const memo = ref('') // 메모

// 모든 카테고리 목록 (id, name, type)
const allCategories = reactive([])

// 선택된 카테고리 ID
const categoryId = ref('')

// 선택된 카테고리 (type, name)
const category = computed(() => allCategories.find((category) => category.id === categoryId.value))

// 카테고리 타입 (수입 or 지출)
const categoryType = computed(() => {
  return category.value?.type || ''
})

// 카테고리 이름
const categoryName = computed(() => {
  return category.value?.name || ''
})

// type에 따른 카테고리 목록 [ {label : name, value : id} ]
const filteredCategory = computed(() => {
  return allCategories
    .filter((category) => category.type === categoryType.value)
    .map((category) => ({
      value: category.id,
      label: category.name,
    }))
})

const showModal = ref(false) // 모달창 띄울 지 여부

const openModal = () => (showModal.value = true) // 모달 열기
const closeModal = () => (showModal.value = false) // 모달 닫기

const isIncome = computed(() => categoryType.value === 'Income')
const isExpense = computed(() => categoryType.value === 'Expense')

onMounted(async () => {
  const historyState = window.history.state
  prevPage.value = historyState.from
  transactionId.value = historyState.transaction_id

  console.log('prevPage : ', prevPage.value)
  console.log('transactionId : ', transactionId.value)

  try {
    const transResponse = await axios.get(BASEURI + '/transactions')
    const catResponse = await axios.get(BASEURI + '/categories')

    const allTransactions = transResponse.data
    allCategories.splice(0, allCategories.length, ...catResponse.data)

    const transaction = allTransactions.find(
      (transaction) => transaction.id === transactionId.value,
    )

    transactionTitle.value = transaction.title
    amount.value = transaction.amount
    dateStr.value = transaction.date
    memo.value = transaction.memo
    categoryId.value = transaction.category_id
  } catch (error) {
    console.log('에러 발생 : ' + error)
    console.log(error.stack)
  }
})

const onlyAllowDigits = (e) => {
  const key = e.key
  if (!/^[0-9]$/.test(key)) {
    e.preventDefault()
  }
}

const removeNonDigits = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '')
  // onlyNumber.value = e.target.value
}

const selectType = (type) => {
  const category = allCategories.find(
    (category) => category.type === type && category.name === '미분류',
  )
  categoryId.value = category.id
}

const toKSTISOString = (date) => {
  const offset = 9 * 60 * 60 * 1000 // 9시간 (KST)
  const kstDate = new Date(date.getTime() + offset)
  return kstDate.toISOString().slice(0, 19)
}

const checkTransaction = () => {
  if (transactionTitle.value === '' || Number(amount.value) < 0) {
    return false
  }
  return true
}

const updateTransaction = async () => {
  if (!checkTransaction()) {
    alert('데이터 입력이 잘못되었습니다.')
    return
  }

  try {
    const response = await axios.put(`${BASEURI}/transactions/${transactionId.value}`, {
      title: transactionTitle.value,
      category_id: categoryId.value,
      type: categoryType.value,
      amount: Number(amount.value),
      date: isoDate.value,
      memo: memo.value,
    })

    if (response.status === 200) {
      console.log('수정 성공')
      router.push({
        name: 'detail',
        params: { action: 'view' },
        state: { from: prevPage.value, transaction_id: transactionId.value },
      })
    } else {
      console.log('수정 실패')
    }
  } catch (error) {
    console.log('에러 발생 : ' + error.stack)
  }
}

const deleteTransaction = async () => {
  const isAllowed = confirm('정말로 삭제하시겠습니까?')

  if (!isAllowed) {
    return
  }

  try {
    const response = await axios.delete(`${BASEURI}/transactions/${transactionId.value}`)

    if (response.status === 200) {
      console.log('삭제 성공')
      router.push({
        name: prevPage.value,
      })
    } else {
      console.log('삭제 실패')
    }
  } catch (error) {
    console.log('에러 발생 : ' + error.stack)
  }
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

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.modal-content {
  background: white;
  padding: 24px;
  width: 300px;
  margin: 100px auto;
  border-radius: 10px;
}
</style>
