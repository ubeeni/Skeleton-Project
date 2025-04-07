<template>
  <button
    class="btn-lg-wrapper bodySemibold18px"
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
.btn-lg-wrapper {
  border-radius: 1rem;
  width: 25rem;
  height: auto;
  color: var(--color-white);
  text-align: center;
  padding: 1.25rem 0;
}

.btn-lg-wrapper:hover {
  background: var(--color-hover);
}
</style>
