<template>
  <div class="calendar-wrapper">
    <FullCalendar :options="calendarOptions" />

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ clickedDate }}</h3>

        <div v-if="dailyData">
          <div>
            <strong>💸 지출</strong>
            <ul>
              <li v-for="(item, index) in dailyData.expense" :key="'e' + index">
                {{ item.category }}
                <span style="color: var(--color-expense); font-weight: 500">
                  {{ item.amount.toLocaleString() }}원
                </span>
              </li>
            </ul>
          </div>
          <div style="margin-top: 1rem">
            <strong>💰 수입</strong>
            <ul>
              <li v-for="(item, index) in dailyData.income" :key="'i' + index">
                {{ item.category }}
                <span style="color: var(--color-income); font-weight: 500">
                  {{ item.amount.toLocaleString() }}원
                </span>
              </li>
            </ul>
          </div>
        </div>

        <p v-else>내역이 없습니다.</p>

        <button @click="closeModal">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

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

const closeModal = () => {
  showModal.value = false
}

const dailyData = computed(() => dummyData[clickedDate.value] ?? null)

const handleDateClick = (info) => {
  clickedDate.value = info.dateStr
  showModal.value = true
}

// 더미 데이터 → FullCalendar 이벤트로 변환
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
    center: 'prev title next',
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
.calendar-wrapper {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: var(--color-white);
  border-radius: 16px;
  border: 1px solid var(--color-light);
}

.fc .fc-button.fc-today-button {
  background: var(--color-white);
  color: var(--color-dark) !important;
  border-radius: 6px !important;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.3rem 0.8rem;
  border: none;
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

.fc .fc-toolbar-chunk:nth-child(2) {
  display: flex !important;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
}

.fc .fc-toolbar-title {
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
}

.fc .fc-prev-button,
.fc .fc-next-button {
  background: none !important;
  border: none !important;
  color: var(--color-dark) !important;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.2rem 0.4rem;
  box-shadow: none !important;
}

.fc .fc-prev-button:hover,
.fc .fc-next-button:hover,
.fc .fc-prev-button:focus,
.fc .fc-next-button:focus,
.fc .fc-prev-button:active,
.fc .fc-next-button:active {
  background: none !important;
  color: var(--color-dark) !important;
  box-shadow: none !important;
  outline: none !important;
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

.fc .fc-col-header-cell .fc-col-header-cell-cushion {
  color: var(--color-dark) !important;
  font-weight: 600;
  font-size: 0.85rem;
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
  background: var(--color-white);
  padding: 2rem;
  border-radius: 16px;
  width: 340px;
  max-width: 90%;
  font-size: 0.9rem;
  color: var(--color-dark);
}

.modal-content h3 {
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.modal-content button {
  margin-top: 1.5rem;
  padding: 0.6rem 1.2rem;
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}
</style>
