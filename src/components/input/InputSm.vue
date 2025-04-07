<template>
  <input
    :type="type"
    class="input-sm bodyRegular16px"
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
.input-sm {
  width: 10rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  padding: 1.25rem 1rem;
  border: 1px solid var(--color-light);
}

.input-sm::placeholder {
  color: var(--color-light);
}
</style>
