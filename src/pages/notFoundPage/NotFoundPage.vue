<template>
  <BtnLg text="추가" @click="handleClick" color="var(--color-secondary)" />
  <BtnMed text="추가" @click="handleClick" color="var(--color-primary)" />
</template>

<script setup>
import BtnLg from '@/components/button/BtnLg.vue'
import BtnMed from '@/components/button/BtnMed.vue'

function handleClick() {
  alert('Button clicked!')
}
</script>

<style scoped></style>
