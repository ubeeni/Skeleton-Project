<template>
  <input
    :type="type"
    class="input-med bodyRegular16px"
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
.input-med {
  width: 17.5rem;
  height: 3.75rem;
  border-radius: 1rem;
  padding: 1.25rem 1rem;
  border: 1px solid var(--color-light);
}

.input-med::placeholder {
  color: var(--color-light);
}
</style>
