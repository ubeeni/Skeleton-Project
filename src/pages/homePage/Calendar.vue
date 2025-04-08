<template>
  <div class="container">
    <div class="sidebar">
      <div class="month-nav">
        <button @click="handlePrev" class="back-btn">
          <img :src="backButton" alt="back" />
        </button>

        <span class="titleBold24px"> {{ parseInt(currentDate.split('-')[1]) }}월 </span>

        <button @click="handleNext" class="forward-btn">
          <img :src="forwardButton" alt="forward" />
        </button>
      </div>

      <BtnMed :color="'var(--color-secondary)'" :text="`빠른추가`" @click="moveToAdd"></BtnMed>
      <BtnMed :color="'var(--color-primary)'" :text="`기본추가`" @click="moveToAdd"></BtnMed>
    </div>

    <div class="calendar-wrapper">
      <FullCalendar ref="calendarRef" :options="calendarOptions" />

      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <button @click="closeModal" class="close-btn">
            <img :src="closeButton" alt="close" />
          </button>

          <div class="bodySemibold18px">{{ clickedDate }}</div>
          <br />

          <div class="bodyRegular16px" v-if="dailyData">
            <div>
              <strong>💸 지출</strong>
              <ul>
                <li v-for="(item, index) in dailyData.expense" :key="'e' + index">
                  {{ item.category }} -
                  <span style="color: var(--color-expense)">
                    {{ item.amount.toLocaleString() }}원
                  </span>
                </li>
              </ul>
            </div>
            <div style="margin-top: 1rem">
              <strong>💰 수입</strong>
              <ul>
                <li v-for="(item, index) in dailyData.income" :key="'i' + index">
                  {{ item.category }} -
                  <span style="color: var(--color-income)">
                    {{ item.amount.toLocaleString() }}원
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <p class="bodyRegular16px" v-else>내역이 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import closeButton from '@/assets/icons/IconClose.svg'
import backButton from '@/assets/icons/IconArrowBack.svg'
import forwardButton from '@/assets/icons/IconArrowForward.svg'
import BtnMed from '@/components/button/BtnMed.vue'

import { useRouter } from 'vue-router'
const router = useRouter()

function moveToAdd() {
  router.push({ name: 'add' })
}

const showModal = ref(false)
const clickedDate = ref('')

const dummyData = {
  '2025-04-01': {
    expense: [{ category: '카페', amount: 4500 }],
    income: [],
  },
  '2025-04-07': {
    expense: [
      { category: '식비', amount: 12000 },
      { category: '교통', amount: 3500 },
    ],
    income: [{ category: '알바비', amount: 50000 }],
  },
}

const calendarRef = ref(null)
const currentDate = ref(formatDate(new Date()))

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

const closeModal = () => {
  showModal.value = false
}

const dailyData = computed(() => dummyData[clickedDate.value] ?? null)

const handleDateClick = (info) => {
  clickedDate.value = info.dateStr
  showModal.value = true
}

const events = Object.entries(dummyData).map(([date, data]) => {
  const expenseTotal = data.expense.reduce((acc, cur) => acc + cur.amount, 0)
  const incomeTotal = data.income.reduce((acc, cur) => acc + cur.amount, 0)
  return {
    title: `지출: ${expenseTotal.toLocaleString()}원\n수입: ${incomeTotal.toLocaleString()}원`,
    start: date,
    allDay: true,
    extendedProps: { expenseTotal, incomeTotal },
  }
})

const renderEventContent = (arg) => {
  const expense = arg.event.extendedProps.expenseTotal
  const income = arg.event.extendedProps.incomeTotal

  const wrapper = document.createElement('div')
  wrapper.style.fontSize = '0.75rem'
  wrapper.style.lineHeight = '1.2'
  wrapper.style.textAlign = 'center'
  wrapper.style.pointerEvents = 'none'

  const expenseEl = document.createElement('div')
  expenseEl.textContent = `${expense.toLocaleString()}원`
  expenseEl.style.color = 'var(--color-expense)'
  wrapper.appendChild(expenseEl)

  const incomeEl = document.createElement('div')
  incomeEl.textContent = `${income.toLocaleString()}원`
  incomeEl.style.color = 'var(--color-income)'
  wrapper.appendChild(incomeEl)

  return { domNodes: [wrapper] }
}

const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  dayCellContent: function (arg) {
    return String(arg.date.getDate())
  },
  headerToolbar: {
    left: 'today',
    center: '',
    right: '',
  },
  locale: 'ko',
  buttonText: {
    today: '오늘',
    month: '',
  },
  height: 'auto',
  dateClick: handleDateClick,
  events,
  eventContent: renderEventContent,
}
</script>

<style>
.month-nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  text-align: center;
  margin-bottom: 1rem;
}

.container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  margin: 0 auto;
}

.calendar-wrapper {
  padding: 1.5rem;
  background: var(--color-white);
  border-radius: 16px;
  border: 1px solid var(--color-light);
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
}

.fc .fc-daygrid-day-number {
  color: var(--color-dark);
  text-align: center;
  margin-bottom: 0.25rem;
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

.fc-theme-standard td {
  padding: 1.2rem 0.5rem;
}

.fc .fc-day-today {
  background: var(--color-secondary2) !important;
  border-radius: 12px;
}

.fc-daygrid-day.fc-day-today:hover,
.fc-daygrid-day:hover {
  background: var(--color-light2);
  border-radius: 12px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: var(--color-white);
  padding: 2rem;
  border-radius: 16px;
  width: 340px;
  max-width: 90%;
  color: var(--color-dark);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.close-btn img {
  width: 100%;
  height: 100%;
}
</style>
