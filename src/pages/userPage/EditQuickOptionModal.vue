<template>
  <div class="modal">
    <div class="modal-box">
      <h3>기본 지출 수정</h3>

      <!-- 거래명 -->
      <div class="form-row">
        <span class="bodySemibold18px">거래명</span>
        <InputLg
          v-model="editItem.title"
          :class="{ error: !editItem.title && triedSubmit }"
          placeholder="거래명을 입력하세요"
        />
      </div>

      <!-- 구분 -->
      <div class="form-row">
        <div class="toggle-group">
          <button
            :class="[
              'toggle-btn',
              { active: editItem.type === 'Income', income: editItem.type === 'Income' },
            ]"
            @click="editItem.type = 'Income'"
          >
            수입
          </button>
          <button
            :class="[
              'toggle-btn',
              { active: editItem.type === 'Expense', expense: editItem.type === 'Expense' },
            ]"
            @click="editItem.type = 'Expense'"
          >
            지출
          </button>
        </div>
      </div>

      <!-- 카테고리 -->
      <div class="form-row">
        <span class="bodySemibold18px">카테고리</span>
        <SelectLg
          v-model="editItem.category_id"
          :options="filteredCategories.map((cat) => ({ label: cat.name, value: cat.id }))"
          placeholder="카테고리 선택"
        />
      </div>

      <!-- 반복주기 -->
      <div class="form-row">
        <span class="bodySemibold18px">반복주기</span>
        <div class="select-group">
          <SelectMed v-model="editItem.cycle" :options="cycleOptions" placeholder="반복주기 선택" />
          <InputMed
            v-if="editItem.cycle === 'weekly'"
            v-model="editItem.week"
            placeholder="예: 월요일"
          />
          <InputMed
            v-if="editItem.cycle === 'monthly'"
            v-model="editItem.month"
            placeholder="예: 15"
            type="number"
          />
          <InputMed v-if="editItem.cycle === 'daily'" value="매일" disabled />
        </div>
      </div>

      <!-- 금액 -->
      <div class="form-row">
        <span class="bodySemibold18px">금액</span>
        <InputLg
          v-model="editItem.amout"
          type="number"
          :class="{ error: (!editItem.amout || editItem.amout <= 0) && triedSubmit }"
          placeholder="금액을 입력하세요"
        />
      </div>

      <!-- 메모 -->
      <div class="form-row">
        <span class="bodySemibold18px">메모</span>
        <InputLg v-model="editItem.memo" placeholder="추가 정보를 입력하세요" />
      </div>

      <div class="button-group">
        <BtnLg :color="'var(--color-primary)'" :text="`수정 완료`" @click="update" />
        <BtnLg :color="'var(--color-light)'" :text="`삭제`" @click="remove" />
        <BtnLg :color="'var(--color-light)'" :text="`취소`" @click="$emit('close')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'

import InputLg from '@/components/input/InputLg.vue'
import InputMed from '@/components/input/InputMed.vue'
import SelectLg from '@/components/input/SelectLg.vue'
import SelectMed from '@/components/input/SelectMed.vue'
import BtnLg from '@/components/button/BtnLg.vue'

const props = defineProps({
  option: Object,
  categories: Array,
})

const cycleOptions = [
  { value: 'daily', label: '매일' },
  { value: 'weekly', label: '매주' },
  { value: 'monthly', label: '매월' },
]

const emit = defineEmits(['close', 'update', 'delete'])

const editItem = ref({ ...props.option })
const triedSubmit = ref(false)

watch(
  () => props.option,
  (newVal) => {
    editItem.value = { ...newVal }
  },
  { immediate: true },
)

const filteredCategories = computed(() =>
  props.categories.filter((cat) => cat.type === editItem.value.type),
)

const update = () => {
  triedSubmit.value = true
  if (!editItem.value.title || !editItem.value.amout || editItem.value.amout <= 0) {
    alert('거래명과 금액은 필수 항목입니다.')
    return
  }

  emit('update', editItem.value) // ⬅️ 상위에 수정 내용 전달
  emit('close')
}

const remove = () => {
  const confirmDelete = confirm('정말 삭제하시겠습니까?')
  if (!confirmDelete) return

  emit('delete', editItem.value.id) // ⬅️ 상위에 삭제 요청 전달
  emit('close')
}
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
  background: white;
  padding: 40px;
  border-radius: 20px;
  width: 500px;
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
  background-color: var(--color-income);
  color: var(--color-white);
}

.toggle-btn.active.expense {
  background-color: var(--color-expense);
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
  color: white;
}

.button-group button:nth-child(2) {
  background-color: var(--color-expense);
  color: white;
}

.button-group button:last-child {
  background-color: #ccc;
  color: white;
}
</style>
