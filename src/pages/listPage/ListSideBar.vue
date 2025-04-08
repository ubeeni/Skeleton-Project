<template>
    <div class="sidebar-wrapper">
      <div class="header">
        <div class="month-nav">
      <span class="arrow"><</span>
      <span class="month titleBold24px">{{ currentMonth }}월</span>
      <span class="arrow">></span>
    </div>
  
        <div class="summary bodyRegular16px">
          <div>수입: {{ formattedIncomeTotal }}원</div>
          <div>지출: {{ formattedExpenseTotal }}원</div>
          <div class="total">
            총합: <span :class="{ minus: total < 0, plus: total >= 0 }">
              {{ formattedTotal }} 원
            </span>
          </div>
        </div>
      </div>

      <div class="range">
        <div class="range-name">범위</div>
        <div class="range-list">
            <span
                v-for="option in options"
                :key="option"
                :class="['range-option', { active: selected === option }]"
                @click="selectRange(option)">
                {{ option }}
            </span>
        </div>
      </div>

      <BtnDual
        @clickIncome="clickIncome"
        @clickExpense="clickExpense"
        :is-income-active="isIncome"
        :is-expense-active="isExpense"
        />
  
      <!-- 카테고리(수입) -->
      <div class="category-group">
        <div class="title bodySemibold16px">카테고리(수입)</div>
        <div class="category-list">
          <span
            v-for="cat in incomeCategories"
            :key="cat.id"
            class="category-item bodyRegular16px"
            :class="{ selected: selectedIncome === cat.id }"
            @click="selectIncome(cat.id)"
          >
            {{ cat.name }}
          </span>
        </div>
      </div>
  
      <!-- 카테고리(지출) -->
      <div class="category-group">
        <div class="title bodySemibold16px">카테고리(지출)</div>
        <div class="category-list">
          <span
            v-for="cat in expenseCategories"
            :key="cat.id"
            class="category-item bodyRegular16px"
            :class="{ selected: selectedExpense === cat.id }"
            @click="selectExpense(cat.id)"
          >
            {{ cat.name }}
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue'
  import dayjs from 'dayjs'
  import BtnDual from '@/components/button/BtnDual.vue'

  const options = ['1주', '1개월', '3개월']
  const selected = ref('1개월')
  function selectRange(option) {
  selected.value = option
  // 여기에 필요한 로직 추가 (예: API 호출 등)
    }


  const isIncome = ref(false)
  const isExpense = ref(false)
  function clickIncome() {
  isIncome.value = !isIncome.value
  // alert('Income button clicked!')
  }
  function clickExpense() {
  isExpense.value = !isExpense.value
  // alert('Expense button clicked!')
  }

  const props = defineProps({
    categories: {
      type: Array,
      required: true,
    },
    transactions: {
      type: Array,
      required: true,
    },
  })
  
  const now = dayjs()
  const currentMonth = now.month() + 1
  const currentYear = now.year()
  
  // 현재 월의 트랜잭션 필터
  const monthlyTransactions = computed(() =>
    props.transactions.filter((tx) =>
      dayjs(tx.date).isSame(`${currentYear}-${currentMonth}`, 'month')
    )
  )
  
  // 총 수입
  const incomeTotal = computed(() =>
    monthlyTransactions.value
      .filter((tx) => tx.type === 'Income')
      .reduce((sum, tx) => sum + tx.amount, 0)
  )
  
  // 총 지출
  const expenseTotal = computed(() =>
    monthlyTransactions.value
      .filter((tx) => tx.type === 'Expense')
      .reduce((sum, tx) => sum + tx.amount, 0)
  )
  
  const total = computed(() => incomeTotal.value - expenseTotal.value)
  
  const formattedIncomeTotal = computed(() => incomeTotal.value.toLocaleString())
  const formattedExpenseTotal = computed(() =>
    expenseTotal.value.toLocaleString()
  )
  const formattedTotal = computed(() => total.value.toLocaleString())
  
  // 카테고리 구분
  const incomeCategories = computed(() =>
    props.categories.filter((cat) => cat.type === 'Income')
  )
  const expenseCategories = computed(() =>
    props.categories.filter((cat) => cat.type === 'Expense')
  )
  
  // 선택 상태
  const selectedIncome = ref(null)
  const selectedExpense = ref(null)
  
  const selectIncome = (id) => {
    selectedIncome.value = id
  }
  const selectExpense = (id) => {
    selectedExpense.value = id
  }
  </script>
  
  <style scoped>
  .sidebar-wrapper {
    width: 100%;
    padding: 0 16px;
  }
  
  .header {
    margin-bottom: 24px;
  }
  
  .month-text {
    display: inline-block;
    margin-bottom: 8px;
  }
  
  .summary {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .total {
    margin-top: 8px;
  }
  .total .plus {
    color: var(--color-income);
  }
  .total .minus {
    color: var(--color-expense);
  }
  
  .category-group {
    margin-top: 24px;
  }
  .title {
    margin-bottom: 8px;
  }
  .category-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .category-item {
    min-width: 70px;
    text-align: center;
    cursor: pointer;
    padding-bottom: 4px;
    border-bottom: 2px solid transparent;
    color: var(--color-semidark);
    transition: 0.2s;
  }
  .category-item.selected {
    border-bottom: 2px solid var(--color-dark);
    color: var(--color-dark);
    font-weight: 600;
  }

  .range {
  display: flex;
  align-items: center;
  gap: 12px;
}

.range-name {
  font-weight: 600;
  color: var(--color-dark);
}

.range-list {
  display: flex;
  gap: 12px;
}

.range-option {
  color: var(--color-light);
  cursor: pointer;
  font-size: 1rem;
}

.range-option.active {
  color: var(--color-dark);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
}
  </style>
  