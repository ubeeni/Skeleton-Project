<template>
  <div class="modal">
    <div class="modal-box">
      <h3 class="titleBold24px">기본 지출 수정</h3>
      <div class="input-group">
        <!-- 구분 (수입 / 지출 버튼) -->
        <div class="form-row-dual">
          <BtnDual
            :is-income-active="editItem.type === 'Income'"
            :is-expense-active="editItem.type === 'Expense'"
            @clickIncome="editItem.type = 'Income'"
            @clickExpense="editItem.type = 'Expense'"
          />
          <InputMed
            v-model="editItem.amount"
            type="number"
            :class="{ error: (!editItem.amount || editItem.amount <= 0) && triedSubmit }"
            placeholder="금액을 입력하세요"
          />
          <span class="bodySemibold18px"> 원</span>
        </div>
        <!-- 거래명 -->
        <div class="form-row">
          <span class="bodySemibold18px">거래명</span>
          <InputLg
            v-model="editItem.title"
            :class="{ error: !editItem.title && triedSubmit }"
            placeholder="거래명을 입력하세요"
          />
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
            <SelectMed
              v-model="editItem.cycle"
              :options="cycleOptions"
              placeholder="반복주기 선택"
            />
            <SelectMed
              v-if="newItem.cycle === 'weekly'"
              :options="weeklyOptions"
              v-model="editItem.week"
              placeholder="요일 선택"
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
        <!-- 메모 -->
        <div class="form-row">
          <span class="bodySemibold18px">메모</span>
          <InputLg v-model="editItem.memo" placeholder="추가 정보를 입력하세요" />
        </div>
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

import InputLg from '@/components/input/InputLg.vue'
import InputMed from '@/components/input/InputMed.vue'
import SelectLg from '@/components/input/SelectLg.vue'
import SelectMed from '@/components/input/SelectMed.vue'
import BtnLg from '@/components/button/BtnLg.vue'
import BtnDual from '@/components/button/BtnDual.vue'

const props = defineProps({
  option: Object,
  categories: Array,
})

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
  if (!editItem.value.title || !editItem.value.amount || editItem.value.amount <= 0) {
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

input.error {
  border: 1px solid red;
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
</style>
