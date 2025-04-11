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

// 라우터 및 상태
const route = useRoute()
const router = useRouter()
const userId = route.params.id

// 사용자 정보 및 입력값
const user = ref(null)
const editedName = ref('')
const isInvalid = ref(false)

// 유저 정보 가져오기
const fetchUser = async () => {
  const res = await axios.get(`http://localhost:3000/members/${userId}`)
  user.value = res.data
  editedName.value = res.data.name
}

// 이름 저장
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

// 취소 버튼 동작
const cancelAndRedirect = () => {
  const confirmCancel = confirm('수정 내용이 반영되지 않습니다. 정말 취소하시겠어요?')
  if (confirmCancel) {
    router.push(`/user/${userId}`)
  }
}

// 실시간 유효성 검사
watchEffect(() => {
  isInvalid.value = !editedName.value.trim()
})

onMounted(fetchUser)
</script>

<style scoped>
/* 레이아웃 */
.wrapper {
  max-width: 48rem;
  width: 100%;
  margin: 0 auto;
}

/* 폼 행 */
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

/* 입력 */
.input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

/* 오류 메시지 */
.error-msg {
  height: 20px;
  margin-top: 5px;
  color: var(--color-expense);
  text-align: end;
  font-size: 16px;
  visibility: hidden;
}

.error-msg.show {
  visibility: visible;
}

input.error {
  border: 1px solid var(--color-expense);
}

/* 버튼 그룹 */
.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* 📱 반응형 */
@media screen and (max-width: 767px) {
  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
  }

  .form-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 1.25rem;
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 1rem;
  }

  .button-group {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}
</style>
