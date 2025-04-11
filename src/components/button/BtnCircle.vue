<template>
  <button class="btn-circle" :style="{ backgroundColor: color }" @click="$emit('click')">
    <img :src="icon" alt="icon" class="icon" />
  </button>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'var(--color-primary)',
  },
  icon: {
    type: String,
  },
})
// 클릭이벤트를 받아서 부모에게 전달
defineEmits(['click'])
</script>

<style scoped>
.btn-circle {
  border-radius: 100%;
  width: 3.75rem;
  height: 3.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: var(--color-white);
}

.icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-white);
}

@media screen and (max-width: 767px) {
  /** Mobile */
  .btn-circle {
    width: 2.5rem;
    height: 2.5rem;
    box-shadow: var(--boxshadow-light);
  }
}
</style>
