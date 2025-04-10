<template>
  <div class="container">
    <div class="sidebar">
      <div class="month-nav">
        <img :src="backButton" alt="back" @click="handlePrev" />
        <span class="titleBold24px"> {{ parseInt(currentDate.split('-')[1]) }}월 </span>
        <img :src="forwardButton" alt="forward" @click="handleNext" />
      </div>

      <div class="summary">
        <div class="bodyRegular16px">
          💰 수입:
          <span style="color: var(--color-dark)"> {{ monthlyIncome.toLocaleString() }}원 </span>
        </div>
        <div class="bodyRegular16px">
          💸 지출:
          <span style="color: var(--color-dark)"> {{ monthlyExpense.toLocaleString() }}원 </span>
        </div>
        <div class="bodySemibold18px" style="margin-top: 0.5rem">
          총합:
          <span :class="totalColorClass">
            {{ (monthlyIncome - monthlyExpense).toLocaleString() }}
          </span>
          원
        </div>
      </div>

      <div style="height: 2rem"></div>
      <BtnMed
        :color="'var(--color-secondary)'"
        :text="`빠른추가`"
        @click="toggleQuickAddDropdown"
      />

      <div v-if="showQuickAddDropdown" class="quick-add-dropdown">
        <button
          v-for="(option, index) in quickAddOptions"
          :key="option.id"
          class="quick-add-option"
          @click="selectQuickAddOption(option)"
        >
          {{ option.title }} {{ option.amount.toLocaleString() }}원
        </button>
      </div>

      <div style="height: 1rem"></div>
      <BtnMed :color="'var(--color-primary)'" :text="`기본추가`" @click="moveToAdd" />
    </div>

    <div class="calendar-wrapper">
      <FullCalendar ref="calendarRef" :options="calendarOptions" />
      <Modal v-if="showModal" :date="clickedDate" :data="dailyData" @close="closeModal" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import backButton from '@/assets/icons/IconArrowBack.svg'
import forwardButton from '@/assets/icons/IconArrowForward.svg'
import BtnMed from '@/components/button/BtnMed.vue'
import Modal from './Modal.vue'

import { useRouter } from 'vue-router'
const router = useRouter()

function moveToAdd() {
  router.push({
    name: 'detail',
    params: { action: 'add' },
    state: { from: 'home' },
  })
}

const transactions = ref([])
const quickAddOptions = ref([])

onMounted(async () => {
  const res = await fetch('/db.json')
  const json = await res.json()
  transactions.value = json.transactions
  quickAddOptions.value = json.quickAddOptions
})

const showQuickAddDropdown = ref(false)

function toggleQuickAddDropdown() {
  showQuickAddDropdown.value = !showQuickAddDropdown.value
}

async function selectQuickAddOption(option) {
  const today = new Date()
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate(),
  ).padStart(2, '0')}`

  const newTransaction = {
    title: option.title,
    member_id: option.member_id,
    category_id: option.category_id,
    type: option.type,
    amount: option.amount,
    date: formattedDate,
    memo: option.memo,
  }

  try {
    await axios.post('http://localhost:3000/transactions', newTransaction)
    alert('추가되었습니다!')
    transactions.value.push(newTransaction)
    showQuickAddDropdown.value = false
  } catch (err) {
    console.error(err)
    alert('추가 실패')
  }
}

const groupedByDate = computed(() => {
  const result = {}

  transactions.value.forEach((item) => {
    const { id, title, type, amount, date } = item

    if (!result[date]) {
      result[date] = { income: [], expense: [] }
    }

    if (type === 'Income') {
      result[date].income.push({ id, title, amount })
    } else if (type === 'Expense') {
      result[date].expense.push({ id, title, amount })
    }
  })

  return result
})

const totalColorClass = computed(() => {
  const net = monthlyIncome.value - monthlyExpense.value
  if (net > 0) return 'color-positive'
  else if (net < 0) return 'color-negative'
  else return ''
})

const calendarRef = ref(null)
const currentDate = ref(formatDate(new Date()))
const showModal = ref(false)
const clickedDate = ref('')
const dailyData = ref(null)

const handleDateClick = (info) => {
  const dateStr = info.dateStr
  clickedDate.value = dateStr
  dailyData.value = groupedByDate.value[dateStr] || null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  clickedDate.value = ''
  dailyData.value = null
}

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

const handlePrev = () => {
  const calendarApi = calendarRef.value.getApi()
  calendarApi.prev()
  const newDate = calendarApi.getDate()
  currentDate.value = formatDate(newDate)
}

const handleNext = () => {
  const calendarApi = calendarRef.value.getApi()
  calendarApi.next()
  const newDate = calendarApi.getDate()
  currentDate.value = formatDate(newDate)
}

const monthlyIncome = computed(() => {
  const selectedMonth = currentDate.value
  return transactions.value
    .filter(
      (t) => typeof t.date === 'string' && t.date.startsWith(selectedMonth) && t.type === 'Income',
    )
    .reduce((acc, cur) => acc + cur.amount, 0)
})

const monthlyExpense = computed(() => {
  const selectedMonth = currentDate.value
  return transactions.value
    .filter(
      (t) => typeof t.date === 'string' && t.date.startsWith(selectedMonth) && t.type === 'Expense',
    )
    .reduce((acc, cur) => acc + cur.amount, 0)
})

const events = computed(() =>
  Object.entries(groupedByDate.value).map(([date, data]) => {
    const expenseTotal = data.expense.reduce((acc, cur) => acc + cur.amount, 0)
    const incomeTotal = data.income.reduce((acc, cur) => acc + cur.amount, 0)

    return {
      title: `수입: ${incomeTotal.toLocaleString()}원\n지출: ${expenseTotal.toLocaleString()}원`,
      start: date,
      allDay: true,
      extendedProps: { expenseTotal, incomeTotal },
    }
  }),
)

const renderEventContent = (arg) => {
  const expense = arg.event.extendedProps.expenseTotal
  const income = arg.event.extendedProps.incomeTotal

  const wrapper = document.createElement('div')
  wrapper.style.fontSize = '0.75rem'
  wrapper.style.lineHeight = '1.2'
  wrapper.style.textAlign = 'center'
  wrapper.style.pointerEvents = 'none'

  const incomeEl = document.createElement('div')
  incomeEl.textContent = `${income.toLocaleString()}`
  incomeEl.style.color = 'var(--color-income)'
  wrapper.appendChild(incomeEl)

  const expenseEl = document.createElement('div')
  expenseEl.textContent = `-${expense.toLocaleString()}`
  expenseEl.style.color = 'var(--color-expense)'
  wrapper.appendChild(expenseEl)

  return { domNodes: [wrapper] }
}

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  dayCellContent: (arg) => String(arg.date.getDate()),
  headerToolbar: {
    left: '',
    center: '',
    right: '',
  },
  locale: 'ko',
  height: 'auto',
  dateClick: handleDateClick,
  events: events.value,
  eventContent: renderEventContent,
}))
</script>

<style>
.summary {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  gap: 1rem;
}
.month-nav img {
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.container {
  display: flex;
}

.sidebar {
  width: 17.5rem;
}

.calendar-wrapper {
  box-shadow: var(--boxshadow-light);
  background: var(--color-white);
  border-radius: 1rem;
  margin-left: 2rem;
}

.fc .fc-button.fc-today-button {
  background: var(--color-white);
  color: var(--color-dark) !important;
  border-radius: 6px !important;
  border: none;
  padding: 0.3rem 0.8rem;
  /* bodyRegular16px */
  font-size: 1rem;
  font-weight: 400;
  font-family: 'Pretendard-Regular', sans-serif;
}

.fc .fc-button.fc-today-button:hover,
.fc .fc-button.fc-today-button:focus,
.fc .fc-button.fc-today-button:active {
  background: var(--color-white) !important;
  color: var(--color-dark) !important;
  border: none;
  box-shadow: none !important;
  outline: none !important;
}

.fc .fc-col-header-cell .fc-col-header-cell-cushion {
  /* bodySemibold18px */
  font-size: 1.125rem;
  font-weight: 600;
  font-family: 'Pretendard-SemiBold', sans-serif;
  padding-bottom: 0.5rem;
}

.fc .fc-daygrid-day-number {
  color: var(--color-dark);
  text-align: center;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  display: block;
  width: 100%;
}

.fc td,
.fc th,
.fc-scrollgrid,
.fc-scrollgrid-section,
.fc-scrollgrid-sync-table,
.fc-scrollgrid-liquid {
  border: none !important;
}

.fc .fc-daygrid-event {
  background: none;
  border: none;
  padding: 0;
}

.fc .fc-day-today {
  background: var(--color-secondary2) !important;
  border-radius: 12px;
}

.fc-daygrid-day.fc-day-today:hover,
.fc-daygrid-day:hover {
  background: var(--color-light2);
  border-radius: 12px;
  cursor: pointer;
}

.color-positive {
  color: var(--color-income);
}

.color-negative {
  color: var(--color-expense);
}

.quick-add-dropdown {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-top: 0.5rem;
  background: var(--color-light2);
  border-radius: 12px;
  padding: 0.5rem;
}

.quick-add-option {
  background: var(--color-white);
  border: none;
  border-radius: 8px;
  padding: 0.6rem;
  text-align: left;
  transition: background 0.2s;
}

.quick-add-option:hover {
  background: var(--color-secondary2);
}
</style>
