<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'

const BASEURI = '/api'

const transactionName = ref('')
const amount = ref(null)
const date = ref('')
const memo = ref('')

const allCategories = reactive([]) // 모든 카테고리 목록 (id, name, type)

const selectedCategoryType = ref('income')

const filteredCategories = computed(() =>
  allCategories.filter((category) => category.type === selectedCategoryType.value),
) // type에 따른 카테고리 목록 (id, name, type)

const selectedCategoryName = computed(() => {
  const match = allCategories.find((category) => category.id === selectedCategoryId.value)
  return match ? match.name : ''
}) // 선택된 카테고리 name

const selectedCategoryId = ref('') // 선택된 카테고리 id

onMounted(async () => {
  try {
    const response = await axios.get(BASEURI + '/categories')
    console.log(response.data)

    allCategories.splice(0, allCategories.length, ...response.data)
  } catch (error) {
    console.log('에러 발생 : ' + error)
  }
})

const selectType = (type) => {
  selectedCategoryType.value = type
  const selectedCategory = filteredCategories.find((category) => category.name === '미분류')
  selectedCategoryId = selectedCategory.id
}

const addTransaction = () => {
  console.log(
    transactionName.value,
    amount.value,
    selectedCategoryType.value,
    selectedCategoryName.value,
    date.value,
    memo.value,
  )
}

const cancleTransaction = () => {}
</script>

<template>
  <div class="body">
    <div class="form-group">
      <label>거래명</label>
      <input type="text" placeholder="거래명을 입력하세요" v-model="transactionName" />
    </div>

    <div class="form-group">
      <label>금액</label>
      <input type="text" placeholder="금액을 입력하세요" v-model="amount" />
    </div>

    <div class="radio-toggle-group">
      <label class="radio-label">
        <input
          type="radio"
          name="type"
          value="income"
          class="radio-toggle"
          v-model="selectedCategoryType"
        />
        <span
          class="radio-toggle income"
          :class="{ active: selectedCategoryType === 'income' }"
          @click="selectType('income')"
          >수입</span
        >
      </label>

      <label class="radio-label">
        <input
          type="radio"
          name="type"
          value="expense"
          class="radio-toggle"
          v-model="selectedCategoryType"
        />
        <span
          class="radio-toggle expense"
          :class="{ active: selectedCategoryType === 'expense' }"
          @click="selectType('expense')"
          >지출</span
        >
      </label>
    </div>

    <div class="form-group">
      <label>카테고리</label>
      <input type="text" placeholder="카테고리를 선택하세요" v-model="selectedCategoryName" />
    </div>

    <div class="form-group">
      <label for="category">카테고리</label>
      <select id="category" v-model="selectedCategoryId">
        <option value="" disabled>카테고리를 선택하세요</option>
        <option v-for="category in filteredCategories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label>날짜</label>
      <input type="text" placeholder="날짜를 선택하세요" v-model="date" />
    </div>

    <div class="form-group">
      <label>메모</label>
      <input type="text" placeholder="메모는 선택사항입니다" v-model="memo" />
    </div>

    <div class="actions">
      <button class="add-btn" @click="addTransaction">추가</button>
      <button class="cancel-btn" @click="cancleTransaction">취소</button>
    </div>
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
.body {
  width: 500px;
  margin: 0 auto;
  font-family: sans-serif;
  padding: 30px;
}
.radio-toggle-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.radio-toggle {
  appearance: none;
  -webkit-appearance: none;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  transition:
    background-color 0.2s,
    border-color 0.2s;
}
.radio-toggle.income.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.radio-toggle.expense.active {
  background-color: #d22020;
  color: white;
  border-color: #d22020;
}

/* 라벨 커스터마이징 */
.radio-label {
  position: relative;
}

.radio-label input {
  position: absolute;
  opacity: 0;
}
.btn-group {
  display: flex;
  margin-bottom: 10px;
}
.btn-group button {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input[type='text'] {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.actions {
  margin-top: 20px;
}
.actions button {
  display: block;
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
}
.add-btn {
  background-color: #a259ff;
  color: white;
}
.cancel-btn {
  background-color: #ccc;
  color: #333;
}
</style>

<script setup>
import { ref, reactive } from 'vue'

const transactionName = ref('')
const amount = ref(null)
const selectedType = ref('income')
const category = ref('')
const date = ref('')
const memo = ref('')

const selectType = (type) => {
  selectedType.value = type
}

const addTransaction = () => {
  console.log(
    transactionName.value,
    amount.value,
    selectedType.value,
    category.value,
    date.value,
    memo.value,
  )
}

const cancleTransaction = () => {}
</script>

<template>
  <div class="body">
    <div class="form-group">
      <label>거래명</label>
      <input type="text" placeholder="거래명을 입력하세요" v-model="transactionName" />
    </div>

    <div class="form-group">
      <label>금액</label>
      <input type="text" placeholder="금액을 입력하세요" v-model="amount" />
    </div>

    <div class="radio-toggle-group">
      <label class="radio-label">
        <input
          type="radio"
          name="type"
          value="income"
          class="radio-toggle"
          v-model="selectedType"
        />
        <span
          class="radio-toggle income"
          :class="{ active: selectedType === 'income' }"
          @click="selectType('income')"
          >수입</span
        >
      </label>

      <label class="radio-label">
        <input
          type="radio"
          name="type"
          value="expense"
          class="radio-toggle"
          v-model="selectedType"
        />
        <span
          class="radio-toggle expense"
          :class="{ active: selectedType === 'expense' }"
          @click="selectType('expense')"
          >지출</span
        >
      </label>
    </div>

    <div class="form-group">
      <label>카테고리</label>
      <input type="text" placeholder="카테고리를 선택하세요" v-model="category" />
    </div>

    <div class="form-group">
      <label>날짜</label>
      <input type="text" placeholder="날짜를 선택하세요" v-model="date" />
    </div>

    <div class="form-group">
      <label>메모</label>
      <input type="text" placeholder="메모는 선택사항입니다" v-model="memo" />
    </div>

    <div class="actions">
      <button class="add-btn" @click="addTransaction">추가</button>
      <button class="cancel-btn" @click="cancleTransaction">취소</button>
    </div>
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
.body {
  width: 500px;
  margin: 0 auto;
  font-family: sans-serif;
  padding: 30px;
}
.radio-toggle-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.radio-toggle {
  appearance: none;
  -webkit-appearance: none;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  transition:
    background-color 0.2s,
    border-color 0.2s;
}
.radio-toggle.income.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.radio-toggle.expense.active {
  background-color: #d22020;
  color: white;
  border-color: #d22020;
}

/* 라벨 커스터마이징 */
.radio-label {
  position: relative;
}

.radio-label input {
  position: absolute;
  opacity: 0;
}
.btn-group {
  display: flex;
  margin-bottom: 10px;
}
.btn-group button {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input[type='text'] {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.actions {
  margin-top: 20px;
}
.actions button {
  display: block;
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
}
.add-btn {
  background-color: #a259ff;
  color: white;
}
.cancel-btn {
  background-color: #ccc;
  color: #333;
}
</style>
