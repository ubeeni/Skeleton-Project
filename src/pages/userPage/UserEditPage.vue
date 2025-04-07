<template>
  <div class="p-6 max-w-md mx-auto">
    <h1 class="text-xl font-bold mb-4">프로필 수정</h1>

    <!-- 🟣 유저 이름 표시 -->
    <p class="mb-4 text-gray-700">
      이름 : <strong>{{ user?.name }}</strong>
    </p>

    <div class="mb-6">
      <label class="block mb-1 font-medium">이름</label>
      <input
        v-model="editedName"
        type="text"
        class="w-full border rounded px-3 py-2"
        placeholder="이름을 입력하세요"
      />
    </div>

    <div class="flex gap-2">
      <button class="flex-1 bg-gray-300 text-white py-2 rounded" @click="resetName">취소</button>
      <button class="flex-1 bg-purple-500 text-white py-2 rounded" @click="saveName">완료</button>
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
  const res = await axios.get(`http://localhost:3000/users/${userId}`)
  user.value = res.data
  editedName.value = res.data.name
}

const saveName = async () => {
  await axios.patch(`http://localhost:3000/users/${userId}`, {
    name: editedName.value,
  })
  user.value.name = editedName.value
  editedName.value = ''
  alert('이름이 수정되었습니다!')
}

const resetName = () => {
  router.back() // ✅ 이전 페이지로 이동
}

onMounted(fetchUser)
</script>
