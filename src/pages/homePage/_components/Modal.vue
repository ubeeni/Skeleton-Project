<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button @click="$emit('close')" class="close-btn">
        <img :src="closeButton" alt="close" />
      </button>

      <div class="bodySemibold18px">{{ date }}</div>
      <br />

      <div class="bodyRegular16px" style="color: var(--color-dark)" v-if="data">
        <div>
          <strong>💰 수입</strong>
          <ul>
            <li v-for="(item, index) in data.income" :key="'i' + index">
              {{ item.title }}
              <span style="color: var(--color-income)">
                {{ item.amount.toLocaleString() }}
              </span>
              원
              <button @click="goToEditPage(item.id)" class="edit-btn">✏️</button>
            </li>
          </ul>
        </div>
        <div style="margin-top: 1rem">
          <strong>💸 지출</strong>
          <ul>
            <li v-for="(item, index) in data.expense" :key="'e' + index">
              {{ item.title }}
              <span style="color: var(--color-expense)">
                {{ item.amount.toLocaleString() }}
              </span>
              원
              <button @click="goToEditPage(item.id)" class="edit-btn">✏️</button>
            </li>
          </ul>
        </div>
      </div>
      <p class="bodyRegular16px" v-else>내역이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import closeButton from '@/assets/icons/IconClose.svg'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToEditPage = (id) => {
  router.push({
    name: 'detail',
    params: { action: 'update' },
    state: { from: 'home', transaction_id: id },
  })
}

defineProps({
  date: String,
  data: Object,
})

defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: var(--color-white);
  padding: 2rem;
  border-radius: 16px;
  width: 340px;
  max-width: 90%;
  color: var(--color-dark);
}

li {
  margin-top: 0.5rem;
}

li + li {
  margin-top: 0.5rem;
}

.edit-btn {
  transform: scaleX(-1);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  padding: 0;
  width: 24px;
  height: 24px;
}

.close-btn img {
  width: 100%;
  height: 100%;
}
</style>
