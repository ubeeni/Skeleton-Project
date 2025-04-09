<template>
  <div class="wrapper">
    <span class="titleBold24px title">프로필</span>

    <div class="form-row">
      <span class="bodySemibold18px">이름</span>
      <InputLg v-model="editedName" type="text" :placeholder="user?.name" />
    </div>

    <div class="button-group">
      <BtnLg :color="'var(--color-primary)'" :text="`저장`" @click="saveName" />
      <BtnLg :color="'var(--color-light)'" :text="`취소`" @click="resetName" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
  max-width: 48rem;
  width: 100%;
  margin: 0 auto;
}

.form-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.25rem;
  margin-bottom: 10rem;
}

.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
