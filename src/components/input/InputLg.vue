<template>
  <input
    :type="type"
    class="input-lg bodyRegular16px"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: 'placeholder',
  },
  modelValue: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>
<style scoped>
.input-lg {
  width: 37.5rem;
  height: 3.75rem;
  border-radius: 1rem;
  padding: 1.25rem 1rem;
  border: 1px solid var(--color-light);
}

.input-lg::placeholder {
  color: var(--color-light);
}

@media screen and (max-width: 767px) {
  /** Mobile */
  .input-lg {
    width: 22.125rem;
    height: 3.75rem;
    border-radius: 1rem;
    padding: 1.25rem 1rem;
    border: 1px solid var(--color-light);
  }
}
</style>
