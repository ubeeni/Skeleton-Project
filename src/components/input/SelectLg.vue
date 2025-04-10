<template>
  <select
    class="select-lg bodyRegular16px"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option class="select-default" value="" disabled selected>{{ placeholder }}</option>
    <option v-for="(opt, idx) in options" :key="idx" :value="opt.value">
      {{ opt.label }}
    </option>
  </select>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '선택하세요',
  },
  options: {
    type: Array,
    required: true,
  },
})

defineEmits(['update:modelValue'])
</script>
<style scoped>
.select-lg {
  width: 37.5rem;
  height: 3.75rem;
  border-radius: 1rem;
  padding: 1.25rem 1rem;
  border: 1px solid var(--color-light);
}

@media screen and (max-width: 767px) {
  /** Mobile */
  .select-lg {
    width: 22.125rem;
    height: 3.75rem;
    border-radius: 1rem;
    padding: 1.25rem 1rem;
    border: 1px solid var(--color-light);
  }
}
</style>
