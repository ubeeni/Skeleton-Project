<template>
  <div class="wrapper">
    <span class="titleBold24px">프로필</span>

    <div class="form-row">
      <span class="bodySemibold18px">이름</span>
      <div class="input-wrapper">
        <InputLg
          v-model="editedName"
          type="text"
          :placeholder="user?.name"
          :class="{ error: isInvalid }"
        />
        <p class="error-msg" :class="{ show: isInvalid }">이름은 공백일 수 없습니다.</p>
      </div>
    </div>

    <div class="button-group">
      <BtnLg :color="'var(--color-primary)'" :text="`저장`" @click="saveName" />
      <BtnLg :color="'var(--color-light)'" :text="`취소`" @click="cancelAndRedirect" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import InputLg from '@/components/input/InputLg.vue'
import BtnLg from '@/components/button/BtnLg.vue'

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

const isInvalid = ref(false)

const saveName = async () => {
  if (!editedName.value.trim()) {
    isInvalid.value = true
    alert('이름은 공백일 수 없습니다.')
    return
  }

  isInvalid.value = false

  await axios.patch(`http://localhost:3000/members/${userId}`, {
    name: editedName.value,
  })
  user.value.name = editedName.value
  editedName.value = ''
  alert('이름이 수정되었습니다!')
  router.push(`/user/${userId}`)
}

const cancelAndRedirect = () => {
  const confirmCancel = confirm('수정 내용이 반영되지 않습니다. 정말 취소하시겠어요?')
  if (confirmCancel) {
    router.push(`/user/${userId}`)
  }
}

watchEffect(() => {
  isInvalid.value = !editedName.value.trim()
})

onMounted(fetchUser)
</script>

<style scoped>
.wrapper {
  max-width: 48rem;
  width: 100%;
  margin: 0 auto;
}

.form-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 1.25rem;
  margin-bottom: 10rem;
}

.form-row > span {
  margin-top: 19.25px;
}

.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error-msg {
  height: 20px;
  margin-top: 5px;
  color: red;
  text-align: end;
  font-size: 16px;
  visibility: hidden;
}

.error-msg.show {
  visibility: visible;
}

input.error {
  border: 1px solid red;
}
</style>
