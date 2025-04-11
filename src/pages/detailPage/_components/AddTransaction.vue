<template>
  <div class="form-containe bodySemibold18px">
    <div class="form-body">
      <div class="form-body-left">
        <div class="form-row">
          <div class="form-input form-input-amount-container">
            <div class="form-input-amount">
              <span class="form-alert" :class="{ visible: !isValidAmount }">* &nbsp;</span
              ><InputMed
                type="text"
                placeholder="금액을 입력하세요"
                v-model.number="amount"
                @keypress="onlyAllowDigits"
                @input="removeNonDigits"
                style="text-align: right"
              /><span> 원</span>
            </div>
            <BtnDual
              @clickIncome="selectType('Income')"
              @clickExpense="selectType('Expense')"
              :is-income-active="isIncome"
              :is-expense-active="isExpense"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-input form-lg">
            <label>
              <span class="form-alert" :class="{ visible: !isValidTitle }">* &nbsp;</span
              >거래명</label
            >
            <div class="input-with-alert">
              <InputLg type="search" placeholder="거래명을 입력하세요" v-model="transactionTitle" />
            </div>
          </div>
        </div>
      </div>
      <div class="form-body-right">
        <div class="form-input">
          <label>카테고리</label>
          <SelectMed
            v-model="categoryId"
            :options="filteredCategory"
            placeholder="카테고리"
            @onChange="handleCategorySelect"
          />
        </div>
        <div class="form-input">
          <label>날짜</label>
          <InputMed
            type="text"
            placeholder="날짜를 선택하세요"
            @click="openCalenderModal"
            v-model="dateDisplay"
          />
        </div>
        <div class="form-input">
          <label>메모</label>
          <InputMed
            type="text"
            placeholder="메모는 선택사항입니다"
            v-model="memo"
            color="var(--color-primary)"
          />
        </div>
      </div>
    </div>
    <div class="form-btn-container">
      <BtnLg text="추가" @click="addTransaction" color="var(--color-primary)" />
      <BtnLg text="취소" @click="cancle" color="var(--color-light)" />
    </div>

    <!-- 캘린더 모달 -->

    <div v-if="showCalenderModal" class="modal-backdrop">
      <div class="modal-content">
        <h3 class="bodySemibold16px">날짜와 시간 선택</h3>
        <Datepicker
          v-model="dateStr"
          :enable-time-picker="true"
          time-picker-inline
          :input-props="{ readonly: true }"
          :format="(d) => d.toLocaleString('ko-KR')"
          :max-date="new Date()"
        />
        <div class="modal-btn">
          <BtnXs @click="closeCalenderModal" text="닫기" />
        </div>
      </div>
    </div>

    <!-- 컨펌 모달 -->

    <div v-if="showConfirmModal" class="modal-backdrop">
      <div class="modal-content">
        <div>
          <p>거래 내역이 추가되었습니다!</p>
        </div>
        <div class="modal-btn">
          <BtnXs text="확인" @click="moveToPrev" />
        </div>
      </div>
    </div>
  </div>
</template>

<!-- ----------------------------------- script  ----------------------------------- -->

<script setup>
import BtnLg from '@/components/button/BtnLg.vue'
import BtnDual from '@/components/button/BtnDual.vue'
import InputLg from '@/components/input/InputLg.vue'
import InputMed from '@/components/input/InputMed.vue'
import SelectMed from '@/components/input/SelectMed.vue'

import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import BtnXs from '@/components/button/BtnXs.vue'

// const prevPage = ref(null)
const props = defineProps({
  prevPage: String,
  transactionId: String, // Add에서는 안 들어오므로 옵셔널로 사용 가능
})

const router = useRouter()

const BASEURI = '/api'

const memberId = ref('')

const transactionTitle = ref('') // 거래 타이틀
const isValidTitle = computed(() => transactionTitle.value !== '')

const amount = ref(0) // 금액
const isValidAmount = computed(() => amount.value > 0)

const memo = ref('') // 메모

const dateStr = ref('') // 날짜 (문자열)
const dateObj = computed(() => {
  return !dateStr.value
    ? ''
    : typeof dateStr.value === 'string'
      ? new Date(dateStr.value)
      : dateStr.value
}) // 날짜 (Date 객체)
const dateDisplay = computed(() => (dateObj.value ? dateObj.value.toLocaleString('ko-KR') : '')) // 화면에 표시될 날짜 형식
const isoDate = computed(() => toKSTISOString(dateStr.value).slice(0, 19)) // 날짜 (iso 표준 - 실제 DB 저장 형식)

// 모든 카테고리 목록 (id, name, type)
const allCategories = reactive([])

// 사용자에 따른 디폴트 카테고리 ID (수입 및 지출)
const defaultIncomeCategoryId = ref('')
const defaultExpenseCategoryId = ref('')

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

const showCalenderModal = ref(false) // 모달창 띄울 지 여부

const openCalenderModal = () => {
  showCalenderModal.value = true
} // 모달 열기
const closeCalenderModal = () => {
  showCalenderModal.value = false
} // 모달 닫기

const isIncome = computed(() => categoryType.value === 'Income')
const isExpense = computed(() => categoryType.value === 'Expense')

const showConfirmModal = ref(false)

const moveToPrev = () => {
  showConfirmModal.value = false
  router.push({
    name: props.prevPage,
  })
}

const handleCategorySelect = () => {
  categoryId.value = allCategories.find(
    (category) =>
      category.type === categoryType.value && category.name === selectedCategoryName.value,
  )
}

onMounted(async () => {
  // const historyState = window.history.state
  // prevPage.value = historyState.from

  memberId.value = '12CD'
  dateStr.value = new Date()

  try {
    const categoryResponse = await axios.get(BASEURI + '/categories')
    const memberResponse = await axios.get(BASEURI + '/members')

    if (categoryResponse.status === 200 && memberResponse.status === 200) {
      console.log('성공')

      allCategories.splice(0, allCategories.length, ...categoryResponse.data)

      const allMembers = memberResponse.data

      console.log(allMembers)

      const member = allMembers.find((member) => member.id === memberId.value)

      // console.log(member)

      defaultIncomeCategoryId.value = allCategories.find(
        (category) => category.type === 'Income' && category.name === member.incomeDefault,
      ).id
      defaultExpenseCategoryId.value = allCategories.find(
        (category) => category.type === 'Expense' && category.name === member.expenseDefault,
      ).id

      categoryId.value = defaultExpenseCategoryId.value
    } else {
      console.log('실패')
    }
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
  amount.value = Number(e.target.value)
}

const selectType = (type) => {
  // const category = allCategories.find(
  //   (category) => category.type === type && category.name === '미분류',
  // )
  // console.log(category.id)
  // categoryId.value = category.id

  if (type === 'Income') {
    categoryId.value = defaultIncomeCategoryId.value
  } else {
    categoryId.value = defaultExpenseCategoryId.value
  }
}

const toKSTISOString = (date) => {
  const offset = 9 * 60 * 60 * 1000 // 9시간 (KST)
  const kstDate = new Date(date.getTime() + offset)
  return kstDate.toISOString().slice(0, 19)
}

const addTransaction = async () => {
  if (!(isValidAmount.value && isValidTitle.value)) {
    alert('데이터 입력이 잘못되었습니다.')
    return
  }

  try {
    const response = await axios.post(`${BASEURI}/transactions/`, {
      title: transactionTitle.value,
      category_id: categoryId.value,
      type: categoryType.value,
      amount: Number(amount.value),
      date: isoDate.value,
      memo: memo.value,
    })

    if (response.status === 201) {
      console.log('추가 성공')
      showConfirmModal.value = true
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
    name: props.prevPage,
  })
}
</script>

<!-- ----------------------------------- style  ----------------------------------- -->

<style scoped>
/* ---------------------- Modal ---------------------- */

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-light2);
}
.modal-content {
  background: var(--color-white);
  padding: 1.5rem;
  width: 20rem;
  margin: 10rem auto;
  border-radius: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-btn {
  display: flex;
  justify-content: right;
}

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

.form-input-amount-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.form-alert {
  visibility: hidden;
  color: var(--color-expense);
}

.form-alert.visible {
  visibility: visible;
}

.form-input-amount {
  justify-content: left;
  display: flex;
  align-items: center;
}

.form-input-amount span:last-child {
  margin-left: 1rem;
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

  .form-input-amount-container {
    display: flex;
    flex-direction: column-reverse;
    align-items: start;
  }

  .form-lg {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 0.5rem;
  }
}
</style>
