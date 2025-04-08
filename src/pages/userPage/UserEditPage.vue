<template>
  <div class="wrapper">
    <h1 class="title">프로필 수정</h1>

    <div class="form-row">
      <label class="label">이름</label>
      <input v-model="editedName" type="text" class="input" :placeholder="user?.name" />
    </div>

    <div class="button-group">
      <button class="btn complete" @click="saveName">완료</button>
      <button class="btn cancel" @click="resetName">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const userId = route.params.id

const user = ref(null)
const editedName = ref('')

const fetchUser = async () => {
  const res = await axios.get(`http://localhost:3000/members/${userId}`)
  user.value = res.data
  editedName.value = res.data.name
}

const saveName = async () => {
  await axios.patch(`http://localhost:3000/members/${userId}`, {
    name: editedName.value,
  })
  user.value.name = editedName.value
  editedName.value = ''
  alert('이름이 수정되었습니다!')
}

const resetName = () => {
  router.back()
}

onMounted(fetchUser)
</script>

<style scoped>
.wrapper {
  max-width: 600px;
  margin: 60px auto;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 40px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 60px;
}

.label {
  width: 60px;
  font-weight: 500;
}

.input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 14px;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn {
  padding: 14px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.complete {
  background-color: #8b5cf6;
  color: white;
}

.cancel {
  background-color: #ccc;
  color: white;
}
</style>
