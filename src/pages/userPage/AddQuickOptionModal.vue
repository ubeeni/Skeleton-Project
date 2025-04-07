<!-- components/AddQuickOptionModal.vue -->
<template>
  <div class="modal">
    <div class="modal-box">
      <h3>기본 지출 추가</h3>

      <div class="form-row">
        <label>거래명</label>
        <input v-model="newItem.memo" type="text" />
      </div>

      <div class="form-row">
        <label>구분</label>
        <button @click="newItem.type = 'Income'" :class="{ active: newItem.type === 'Income' }">
          수입
        </button>
        <button @click="newItem.type = 'Expense'" :class="{ active: newItem.type === 'Expense' }">
          지출
        </button>
      </div>

      <div class="form-row">
        <label>카테고리</label>
        <select v-model="newItem.category_id">
          <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="form-row">
        <label>반복주기</label>
        <select v-model="newItem.cycle">
          <option value="daily">매일</option>
          <option value="weekly">매주</option>
          <option value="monthly">매월</option>
        </select>
        <input v-if="newItem.cycle === 'weekly'" v-model="newItem.week" placeholder="ex. monday" />
        <input v-if="newItem.cycle === 'monthly'" v-model="newItem.month" placeholder="ex. 15" />
        <input v-if="newItem.cycle === 'daily'" disabled value="매일" />
      </div>

      <div class="form-row">
        <label>금액</label>
        <input v-model="newItem.amout" type="number" />
      </div>

      <div class="form-row">
        <label>메모</label>
        <input v-model="newItem.memo" type="text" />
      </div>

      <div class="button-group">
        <button @click="$emit('close')">취소</button>
        <button @click="submit">추가</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}
.modal-box {
  background: white;
  margin: 100px auto;
  padding: 30px;
  max-width: 500px;
  border-radius: 10px;
}
.form-row {
  margin-bottom: 16px;
}
button.active {
  background-color: #ef4444;
  color: white;
}
.button-group {
  display: flex;
  gap: 12px;
}
</style>
