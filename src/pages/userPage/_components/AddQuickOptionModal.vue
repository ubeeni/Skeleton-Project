<template>
  <div class="modal">
    <div class="modal-box">
      <div class="modal-content"></div>
      <h3 class="titleBold24px">고정 수입/지출 추가</h3>
      <div class="input-group">
        <div class="form-row-dual">
          <BtnDual
            :is-income-active="newItem.type === 'Income'"
            :is-expense-active="newItem.type === 'Expense'"
            @clickIncome="newItem.type = 'Income'"
            @clickExpense="newItem.type = 'Expense'"
          />
          <div class="amount-row">
            <InputMed
              v-model.number="newItem.amount"
              type="number"
              :class="{ error: (!newItem.amount || newItem.amount <= 0) && triedSubmit }"
              placeholder="금액을 입력하세요(단위: 원)"
            />
            <span class="bodySemibold18px"> 원</span>
          </div>
        </div>
        <!-- 거래명 -->
        <div class="form-row">
          <span class="bodySemibold18px">거래명</span>
          <InputLg
            v-model="newItem.title"
            :class="{ error: !newItem.title && triedSubmit }"
            placeholder="거래명을 입력하세요"
          />
        </div>

        <!-- 카테고리 드롭다운 -->
        <div class="form-row">
          <span class="bodySemibold18px">카테고리</span>
          <SelectLg
            v-model="newItem.category_id"
            :options="filteredCategories.map((cat) => ({ label: cat.name, value: cat.id }))"
            placeholder="카테고리 선택"
          />
        </div>

        <!-- 반복주기 + 상세 입력 -->
        <div class="form-row repeat-row">
          <span class="bodySemibold18px">반복주기</span>
          <div class="select-group">
            <SelectMed
              v-model="newItem.cycle"
              :options="cycleOptions"
              placeholder="반복주기 선택"
            />
            <SelectMed
              v-if="newItem.cycle === 'weekly'"
              :options="weeklyOptions"
              v-model="newItem.week"
              :class="{ error: (!newItem.week || newItem.week === '') && triedSubmit }"
              placeholder="요일 선택"
            />

            <InputMed
              v-if="newItem.cycle === 'monthly'"
              v-model="newItem.month"
              :class="{
                error: (!newItem.month || newItem.month < 1 || newItem.month > 31) && triedSubmit,
              }"
              placeholder="1 ~ 31일까지 입력 가능합니다."
              type="number"
            />
            <InputMed v-if="newItem.cycle === 'daily'" value="매일" disabled />
            <InputMed v-if="newItem.cycle === 'onetime'" value="반복 없음" disabled />
          </div>
        </div>

        <!-- 메모 -->
        <div class="form-row">
          <span class="bodySemibold18px">메모</span>
          <InputLg v-model="newItem.memo" placeholder="추가 정보를 입력하세요" />
        </div>
      </div>

      <div class="button-group">
        <BtnLg :color="'var(--color-primary)'" :text="`추가`" @click="submit" />
        <BtnLg :color="'var(--color-light)'" :text="`취소`" @click="$emit('close')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import InputLg from '@/components/input/InputLg.vue'
import InputMed from '@/components/input/InputMed.vue'
import SelectLg from '@/components/input/SelectLg.vue'
import SelectMed from '@/components/input/SelectMed.vue'
import BtnLg from '@/components/button/BtnLg.vue'
import BtnDual from '@/components/button/BtnDual.vue'

const props = defineProps({
  categories: Array,
  currentCount: Number,
})

const emit = defineEmits(['close', 'add'])

const route = useRoute()
const userId = route.params.id

const newItem = ref({
  member_id: userId,
  title: '',
  type: 'Expense',
  category_id: '',
  cycle: 'onetime',
  day: null,
  week: null,
  month: null,
  amount: 0,
  memo: '',
})

const filteredCategories = computed(() =>
  props.categories.filter((cat) => cat.type === newItem.value.type),
)

const cycleOptions = [
  { value: 'onetime', label: '반복 없음' },
  { value: 'daily', label: '매일' },
  { value: 'weekly', label: '매주' },
  { value: 'monthly', label: '매월' },
]

const weeklyOptions = [
  { value: '월요일', label: '월요일' },
  { value: '화요일', label: '화요일' },
  { value: '수요일', label: '수요일' },
  { value: '목요일', label: '목요일' },
  { value: '금요일', label: '금요일' },
  { value: '토요일', label: '토요일' },
  { value: '일요일', label: '일요일' },
]

const triedSubmit = ref(false)

const submit = () => {
  triedSubmit.value = true

  const errors = []

  if (!newItem.value.amount || newItem.value.amount <= 0) {
    errors.push('금액은 0보다 커야 합니다.')
  }

  if (!newItem.value.title) {
    errors.push('거래명을 입력해주세요.')
  }

  if (newItem.value.cycle === 'monthly') {
    const day = newItem.value.month
    if (!day || day < 1 || day > 31) {
      errors.push('1 ~ 31일 중 반복할 날짜를 선택해주세요.')
    }
  }

  if (newItem.value.cycle === 'weekly') {
    if (!newItem.value.week) {
      errors.push('반복할 요일을 선택해주세요.')
    }
  }

  if (errors.length > 0) {
    alert('입력값을 확인해주세요:\n\n' + errors.join('\n'))
    return
  }

  if (props.currentCount >= 5) {
    alert('기본 지출은 최대 5개까지만 추가할 수 있습니다.')
    return
  }

  if (newItem.value.cycle === 'daily') {
    newItem.value.day = '매일'
    newItem.value.week = null
    newItem.value.month = null
  } else if (newItem.value.cycle === 'weekly') {
    newItem.value.day = null
    newItem.value.month = null
  } else if (newItem.value.cycle === 'monthly') {
    newItem.value.day = null
    newItem.value.week = null
  } else if (newItem.value.cycle === 'onetime') {
    newItem.value.day = null
    newItem.value.week = null
    newItem.value.month = null
  }

  emit('add', { ...newItem.value })
  emit('close')
}

watchEffect(() => {
  if (props.categories.length > 0) {
    const defaultCategory = props.categories.find(
      (c) => c.name === '미분류' && c.type === newItem.value.type,
    )
    if (defaultCategory) {
      newItem.value.category_id = defaultCategory.id
    }
  }
})
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  background-color: var(--color-light2);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: auto;
  z-index: 1000;
}

.modal-box {
  background: var(--color-white);
  padding: 3rem 3rem;
  border-radius: 1.25rem;
  box-shadow: var(--boxshadow-light);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h3 {
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-row span {
  width: 5rem;
}

.form-row-dual {
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 2rem;
}

input.error,
select.error {
  border: 1px solid var(--color-expense);
}

.select-group {
  width: 100%;
  display: flex;
  justify-content: right;
  gap: 2.5rem;
}

.button-group {
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media screen and (max-width: 767px) {
  .modal {
    position: fixed;
    inset: 0;
    background-color: var(--color-light2);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding: 0;
    z-index: 1000;
  }

  .modal-box {
    width: 100%;
    max-height: 38rem;
    height: 100%;
    background: var(--color-white);
    border-radius: 1rem 1rem 0 0;
    box-shadow: var(--boxshadow-light);
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    overflow-y: auto;
    padding: 2rem 0;
  }

  .modal-content {
    width: 100%;
    max-width: 22.125rem;
  }

  .modal-box h3 {
    display: none;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-row,
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: start;
  }

  .form-row-dual {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .form-row-dual .amount-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .form-row-dual .amount-row span {
    white-space: nowrap;
  }

  .repeat-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: left;
    gap: 0;
  }

  .button-group {
    margin-top: 2rem;
    align-items: center;
  }

  input,
  select {
    width: 100%;
  }

  .select-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-end;
  }
}
</style>
