<template>
  <div class="body">
    <h3>거래내역 추가</h3>
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
      @clickIncome="clickIncome"
      @clickExpense="clickExpense"
      :is-income-active="isIncome"
      :is-expense-active="isExpense"
    />

    <div class="form-group">
      <label>카테고리</label>
      <InputLg type="text" placeholder="카테고리를 선택하세요" v-model="categoryName" readonly />
      <select id="category" v-model="categoryId">
        <option value="" disabled>카테고리를 선택하세요</option>
        <option v-for="category in filteredCategories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

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
          v-model="date"
          :enable-time-picker="true"
          time-picker-inline
          :input-props="{ readonly: true }"
          :format="(d) => d.toLocaleString('ko-KR')"
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
      <BtnLg text="추가" @click="addTransaction" color="var(--color-primary)" />
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

import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

const prevPage = ref(null)

const BASEURI = '/api'

const transactionTitle = ref('') // 거래 타이틀

const amount = ref(0) // 금액

const memo = ref('') // 메모

const date = ref('') // 날짜
const isoDate = computed(() => date.value.toISOString().slice(0, 19)) // 날짜 (iso 표준 - 실제 DB 저장 형식)
const dateDisplay = computed(() => (date.value ? date.value.toLocaleString('ko-KR') : '')) // 화면에 표시될 날짜 형식

// 선택된 카테고리 ID
const categoryId = ref('0000')

// 모든 카테고리 목록 (id, name, type)
const allCategories = reactive([])

// 카테고리 타입 (수입 or 지출)
const categoryType = ref('')

// type에 따른 카테고리 목록 (수입 -> [미분류, 월급, 용돈, 기타수입])
const filteredCategories = computed(() => {
  return allCategories.filter((category) => category.type === categoryType.value)
})

// 카테고리 이름
const categoryName = computed(() => {
  const category = allCategories.find((category) => category.id === categoryId.value)

  return category ? category.name : ''
})

const showModal = ref(false) // 모달창 띄울 지 여부

const openModal = () => (showModal.value = true) // 모달 열기
const closeModal = () => (showModal.value = false) // 모달 닫기

const isIncome = computed(() => categoryType.value === 'Income')
const isExpense = computed(() => categoryType.value === 'Expense')

function clickIncome() {
  selectType('Income')
}
function clickExpense() {
  selectType('Expense')
}

onMounted(async () => {
  const historyState = window.history.state
  prevPage.value = historyState.from

  try {
    const response = await axios.get(BASEURI + '/categories')
    allCategories.splice(0, allCategories.length, ...response.data)
    date.value = new Date()

    const category = allCategories.find((category) => category.id === categoryId.value)
    categoryType.value = category.type
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
  amount.value = e.target.value
}

const selectType = (type) => {
  categoryType.value = type
  const category = allCategories.find(
    (category) => category.name === '미분류' && category.type === type,
  )
  console.log('category : ', category)
  categoryId.value = category.id
}

const addTransaction = async () => {
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
      isoDate.value +
      '\n메모: ' +
      memo.value,
  )

  try {
    const response = await axios.post(`${BASEURI}/transactions/`, {
      title: transactionTitle.value,
      category_id: categoryId.value,
      type: categoryType.value,
      amount: amount.value,
      date: isoDate.value,
      memo: memo.value,
    })

    if (response.status === 201) {
      console.log('추가 성공')
      transactionTitle.value = ''
      amount.value = 0
      categoryId.value = '0000'
      date.value = ''
      memo.value = ''
    } else {
      console.log('추가 실패')
    }
  } catch (error) {
    console.log('에러 발생 : ' + error)
    console.log(error.stack)
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
