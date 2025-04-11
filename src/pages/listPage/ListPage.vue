<template>
  <div class="list-page">
    <div class="left-area">
      <ListSideBar
        :categories="categories"
        :transactions="transactions"
        :filtered-transactions="filteredTransactions"
        @filter-change="handleFilterChange"
      />
    </div>
    <!-- 필터 버튼 -->
<button class="filter-btn" v-if="isMobile" @click="openFilterModal">필터</button>
    <div class="right-area">
      <TransactionList :transactions="filteredTransactions" :categoryMap="categoryMap" />
    </div>
  </div>

  
<!--mobile-->
<!-- 모바일 모달 -->
<transition name="slide-up">
  <div class="filter-modal" v-if="isMobile && isFilterModalOpen">
    <ListSideBar
      :categories="categories"
      :transactions="transactions"
      :filtered-transactions="filteredTransactions"
      @filter-change="handleFilterChange"
      :is-filter-only="true" 
    />
    <div class="modal-actions">
      <button @click="closeFilterModal" class="btn-save">저장</button>
      <button @click="closeFilterModal" class="btn-cancel">취소</button>
    </div>
  </div>
</transition>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
import ListSideBar from '@/pages/listPage/_components/ListSideBar.vue'
import TransactionList from '@/pages/listPage/_components/TransactionList.vue'

const transactions = ref([])
const categories = ref([])

onMounted(async () => {
  const txRes = await axios.get('/api/transactions')
  const catRes = await axios.get('/api/categories')
  transactions.value = txRes.data
  categories.value = catRes.data
})

const categoryMap = computed(() => {
  const map = {}
  categories.value.forEach((cat) => {
    map[cat.id] = cat
  })
  return map
})

const filterOptions = ref({
  date: dayjs(),
  range: '1개월',
  showIncome: true,
  showExpense: true,
  incomeCategoryIds: [],
  expenseCategoryIds: [],
})

function handleFilterChange(newOptions) {
  filterOptions.value = newOptions
}
const filteredTransactions = computed(() => {
  const {
    date,
    range,
    showIncome,
    showExpense,
    incomeCategoryIds,
    expenseCategoryIds,
  } = filterOptions.value

  const now = dayjs()
  const base = dayjs(date)
  let from, to

  if (range === '1주') {
    const day = base.day()
    from = base.subtract(day === 0 ? 6 : day - 1, 'day')
    to = base
  } else if (range === '1개월') {
    from = base.startOf('month')
    to = base.isSame(now, 'month') ? now : base.endOf('month') // 핵심 수정
  } else if (range === '3개월') {
    from = base.subtract(2, 'month').startOf('month')
    to = base.isSame(now, 'month') ? now : base.endOf('month')
  }

  return transactions.value.filter((tx) => {
    const txDate = dayjs(tx.date).startOf('day')
    const inRange =
      txDate.isSame(from, 'day') || txDate.isSame(to, 'day') || txDate.isBetween(from, to, null, '[]')

    if (!showIncome && !showExpense) return inRange

    if (tx.type === 'Income' && !showIncome) return false
    if (tx.type === 'Expense' && !showExpense) return false

    if (tx.type === 'Income' && incomeCategoryIds.length > 0) {
      return inRange && incomeCategoryIds.includes(tx.category_id)
    }

    if (tx.type === 'Expense' && expenseCategoryIds.length > 0) {
      return inRange && expenseCategoryIds.includes(tx.category_id)
    }

    return inRange
  })
})

</script>

<style scoped>
.list-page {
  display: flex;
  gap: 2rem;
}

.left-area {
  width: 17.5rem;
  
}

.right-area {
  flex: 1;
}

@media screen and (max-width: 767px) {
  .list-page {
    flex-direction: column;
  }
  .left-area {
  width: 17.5rem;
  margin: 0 ; 
  }

  .filter-btn {
    position: fixed;
    top: 80px;
    right: 16px;
    z-index: 10;
    padding: 0.5rem 1rem;
    border: none;
    background-color: var(--color-main);
    color: white;
    font-weight: bold;
    border-radius: 8px;
  }

  .filter-modal {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70%;
    height: calc(100% - 100px); 
    background: white;
    z-index: 100;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
    overflow-y: scroll;
    padding: 1rem;
  }

  .modal-actions {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1rem;
  }

  .btn-save {
    flex: 1;
    background-color: var(--color-main);
    color: white;
    font-weight: bold;
    padding: 0.75rem;
    border-radius: 8px;
    border: none;
  }

  .btn-cancel {
    flex: 1;
    background-color: #eee;
    font-weight: bold;
    padding: 0.75rem;
    border-radius: 8px;
    border: none;
  }
}



</style>
