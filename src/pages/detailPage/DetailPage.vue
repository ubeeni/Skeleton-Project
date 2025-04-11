<template>
  <div>
    <component :is="currentComponent" v-bind="componentProps" />
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import axios from 'axios'

import AddTransaction from './_components/AddTransaction.vue'
import UpdateTransaction from './_components/UpdateTransaction.vue'
import ViewTransaction from './_components/ViewTransaction.vue'

const prevPage = ref(null)
// const transactionId = computed(() => route.query.transactionId || null)
const transactionId = ref(null)

const currentRoute = useRoute()

const componentsMap = {
  add: AddTransaction,
  view: ViewTransaction,
  update: UpdateTransaction,
}

const currentComponent = computed(() => {
  return componentsMap[currentRoute.params.action]
})

const componentProps = computed(() => {
  const base = { prevPage: prevPage.value, transactionId: transactionId.value }

  if (['ViewComponent', 'UpdateComponent'].includes(currentComponent.value)) {
    return {
      ...base,
      transactionId: transactionId.value,
    }
  }

  return base
})

onMounted(() => {
  const historyState = window.history.state
  prevPage.value = historyState?.from || null
  transactionId.value = historyState?.transaction_id
})
</script>
