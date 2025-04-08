<!-- components/EditQuickOptionModal.vue -->
<template>
  <div class="modal">
    <div class="modal-box">
      <h3>기본 지출 수정</h3>

      <!-- 거래명 -->
      <div class="form-row">
        <label>거래명</label>
        <input
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
        <label>카테고리</label>
        <select v-model="editItem.category_id">
          <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- 반복주기 -->
      <div class="form-row">
        <label>반복주기</label>
        <div class="select-group">
          <select v-model="editItem.cycle">
            <option value="daily">매일</option>
            <option value="weekly">매주</option>
            <option value="monthly">매월</option>
          </select>

          <input
            v-if="editItem.cycle === 'weekly'"
            v-model="editItem.week"
            placeholder="예: 월요일"
          />
          <input
            v-if="editItem.cycle === 'monthly'"
            v-model="editItem.month"
            placeholder="예: 15"
            type="number"
          />
          <input v-if="editItem.cycle === 'daily'" value="매일" disabled />
        </div>
      </div>

      <!-- 금액 -->
      <div class="form-row">
        <label>금액</label>
        <input
          v-model="editItem.amout"
          type="number"
          :class="{ error: (!editItem.amout || editItem.amout <= 0) && triedSubmit }"
          placeholder="금액을 입력하세요"
        />
      </div>

      <!-- 메모 -->
      <div class="form-row">
        <label>메모</label>
        <input v-model="editItem.memo" placeholder="추가 정보를 입력하세요" />
      </div>

      <div class="button-group">
        <button @click="update">수정 완료</button>
        <button @click="remove">삭제</button>
        <button @click="$emit('close')">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
  option: Object,
  categories: Array,
})

const emit = defineEmits(['close', 'refresh'])

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

const update = async () => {
  triedSubmit.value = true

  if (!editItem.value.title || !editItem.value.amout || editItem.value.amout <= 0) {
    alert('거래명과 금액은 필수 항목입니다.')
    return
  }

  await axios.put(`http://localhost:3000/quickAddOptions/${editItem.value.id}`, editItem.value)
  alert('수정이 완료되었습니다.')
  emit('refresh')
  emit('close')
}

const remove = async () => {
  const confirmDelete = confirm('정말 삭제하시겠습니까?')
  if (!confirmDelete) return

  await axios.delete(`http://localhost:3000/quickAddOptions/${editItem.value.id}`)
  alert('삭제가 완료되었습니다.')
  emit('refresh')
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
