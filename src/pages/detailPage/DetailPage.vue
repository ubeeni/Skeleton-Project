<template>
  <div>
    <component :is="currentComponent" />
  </div>
</template>

<style scoped></style>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import axios from 'axios'

import AddTransaction from './_components/AddTransaction.vue'
import UpdateTransaction from './_components/UpdateTransaction.vue'
import ViewTransaction from './_components/ViewTransaction.vue'

const currentRoute = useRoute()

const componentsMap = {
  add: AddTransaction,
  view: ViewTransaction,
  update: UpdateTransaction,
}

const currentComponent = computed(() => {
  return componentsMap[currentRoute.params.action]
})
</script>
