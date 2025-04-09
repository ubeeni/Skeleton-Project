<template>
  <div class="modal">
    <div class="modal-box">
      <h3>기본 지출 추가</h3>

      <!-- 거래명 -->
      <div class="form-row">
        <span class="bodySemibold18px">거래명</span>
        <InputLg
          v-model="newItem.title"
          :class="{ error: !newItem.title && triedSubmit }"
          placeholder="거래명을 입력하세요"
        />
      </div>

      <!-- 구분 (수입 / 지출 버튼) -->
      <div class="form-row">
        <div class="toggle-group">
          <button
            :class="[
              'toggle-btn',
              { active: newItem.type === 'Income', income: newItem.type === 'Income' },
            ]"
            @click="newItem.type = 'Income'"
          >
            수입
          </button>
          <button
            :class="[
              'toggle-btn',
              { active: newItem.type === 'Expense', expense: newItem.type === 'Expense' },
            ]"
            @click="newItem.type = 'Expense'"
          >
            지출
          </button>
        </div>
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
      <div class="form-row">
        <span class="bodySemibold18px">반복주기</span>
        <div class="select-group">
          <SelectMed v-model="newItem.cycle" :options="cycleOptions" placeholder="반복주기 선택" />
          <SelectMed
            v-if="newItem.cycle === 'weekly'"
            :options="weeklyOptions"
            v-model="newItem.week"
            placeholder="요일 선택"
          />

          <InputMed
            v-if="newItem.cycle === 'monthly'"
            v-model="newItem.month"
            placeholder="예: 15"
            type="number"
          />
          <InputMed v-if="newItem.cycle === 'daily'" value="매일" disabled />
        </div>
      </div>

      <!-- 금액 -->
      <div class="form-row">
        <span class="bodySemibold18px">금액</span>
        <InputLg
          v-model="newItem.amount"
          type="number"
          :class="{ error: (!newItem.amount || newItem.amount <= 0) && triedSubmit }"
          placeholder="금액을 입력하세요"
        />
      </div>

      <!-- 메모 -->
      <div class="form-row">
        <span class="bodySemibold18px">메모</span>
        <InputLg v-model="newItem.memo" placeholder="추가 정보를 입력하세요" />
      </div>

      <div class="button-group">
        <BtnLg :color="'var(--color-primary)'" :text="`추가`" @click="submit" />
        <BtnLg :color="'var(--color-light)'" :text="`취소`" @click="$emit('close')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, watch } from 'vue'
import { useRoute } from 'vue-router'
import InputLg from '@/components/input/InputLg.vue'
import InputMed from '@/components/input/InputMed.vue'
import SelectLg from '@/components/input/SelectLg.vue'
import SelectMed from '@/components/input/SelectMed.vue'
import BtnLg from '@/components/button/BtnLg.vue'

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
  cycle: 'daily',
  day: '매일',
  week: null,
  month: null,
  amount: 0,
})

const filteredCategories = computed(() =>
  props.categories.filter((cat) => cat.type === newItem.value.type),
)

const cycleOptions = [
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

watch(
  () => newItem.value.amount,
  (val) => {
    if (typeof val === 'string') {
      const parsed = Number(val)
      newItem.value.amount = isNaN(parsed) ? 0 : parsed
    }
  },
)

const submit = () => {
  triedSubmit.value = true

  if (!newItem.value.title || !newItem.value.amount || newItem.value.amount <= 0) {
    alert('거래명과 금액은 필수 항목입니다.')
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
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-box {
  background: var(--color-white);
  padding: 40px;
  border-radius: 20px;
  height: 744px;
  width: 839px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
}

.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

label {
  width: 100px;
  font-weight: 500;
}

input,
select {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 14px;
}

input.error {
  border: 1px solid red;
}

.select-group {
  display: flex;
  gap: 12px;
}

.toggle-group {
  display: flex;
  gap: 12px;
  flex: 1;
}

.toggle-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  background-color: var(--color-light);
  color: var(--color-white);
  cursor: pointer;
}

.toggle-btn.active.income {
  background-color: var(--color-income); /* 파란색 */
  color: var(--color-white);
}

.toggle-btn.active.expense {
  background-color: var(--color-expense); /* 빨간색 */
  color: var(--color-white);
}

.button-group {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.button-group button {
  padding: 14px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.button-group button:first-child {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.button-group button:last-child {
  background-color: var(--color-light);
  color: var(--color-white);
}
</style>
