<!-- components/AddQuickOptionModal.vue -->
<template>
  <div class="modal">
    <div class="modal-box">
      <h3>기본 지출 추가</h3>

      <!-- 거래명 -->
      <div class="form-row">
        <label>거래명</label>
        <input v-model="newItem.title" placeholder="place holder" />
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
        <label>카테고리</label>
        <select v-model="newItem.category_id">
          <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- 반복주기 + 상세 입력 -->
      <div class="form-row">
        <label>반복주기</label>
        <div class="select-group">
          <select v-model="newItem.cycle">
            <option value="daily">매일</option>
            <option value="weekly">매주</option>
            <option value="monthly">매월</option>
          </select>

          <input
            v-if="newItem.cycle === 'weekly'"
            v-model="newItem.week"
            placeholder="예: 월요일"
          />
          <input
            v-if="newItem.cycle === 'monthly'"
            v-model="newItem.month"
            placeholder="예: 15"
            type="number"
          />
          <input v-if="newItem.cycle === 'daily'" value="매일" disabled />
        </div>
      </div>

      <!-- 금액 -->
      <div class="form-row">
        <label>금액</label>
        <input v-model="newItem.amout" type="number" placeholder="place holder" />
      </div>

      <!-- 메모 -->
      <div class="form-row">
        <label>메모</label>
        <input v-model="newItem.memo" placeholder="place holder" />
      </div>

      <div class="button-group">
        <button @click="$emit('close')">취소</button>
        <button @click="submit">추가</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const props = defineProps({
  categories: Array,
})

const emit = defineEmits(['close', 'refresh'])

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
  amout: 0,
  memo: '',
})

const filteredCategories = computed(() =>
  props.categories.filter((cat) => cat.type === newItem.value.type),
)

const submit = async () => {
  await axios.post('http://localhost:3000/quickAddOptions', newItem.value)
  alert('기본 지출이 추가되었습니다!')
  emit('refresh')
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
  color: var(--color-dark);
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
  background-color: var(--color-light);
  color: var(--color-white);
}

.button-group button:last-child {
  background-color: var(--color-primary);
  color: var(--color-white);
}
</style>
