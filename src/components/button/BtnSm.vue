<template>
  <button
    class="btn-sm-wrapper bodyRegular16px"
    :style="{ backgroundColor: color }"
    @click="$emit('click')"
  >
    {{ text }}
  </button>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'var(--color-primary)',
  },
  text: {
    type: String,
    required: true,
  },
})

defineEmits(['click'])
</script>

<style scoped>
.btn-sm-wrapper {
  border-radius: 1rem;
  width: 7.5rem;
  height: auto;
  color: var(--color-white);
  text-align: center;
  padding: 1.25rem 0;
}

.btn-sm-wrapper:hover {
  background: var(--color-hover);
}
</style>
