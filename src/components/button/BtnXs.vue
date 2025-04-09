<template>
  <button
    class="btn-xs-wrapper bodyRegular16px"
    :class="{ active: isActive }"
    :style="{
      backgroundColor: isActive ? 'var(--color-primary)' : color,
    }"
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
  isActive: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>

<style scoped>
.btn-xs-wrapper {
  border-radius: 1rem;
  width: 4rem;
  height: auto;
  color: var(--color-white);
  text-align: center;
  padding: 0.5rem 0;
}

.btn-xs-wrapper:hover {
  background: var(--color-hover);
}
</style>
