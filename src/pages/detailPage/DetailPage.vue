<template>
  <h2>Detail Page</h2>
  <div>
    <RouterLink
      v-for="item in componentsArray"
      :key="item.key"
      :to="{ path: '/detail/' + item.key }"
      >{{ item.key }} |
    </RouterLink>
    <component :is="currentComponent" />
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import AddTransaction from './components/AddTransaction.vue'
import UpdateTransaction from './components/UpdateTransaction.vue'
import ViewTransaction from './components/ViewTransaction.vue'

const currentRoute = useRoute()
const router = useRouter()

const componentsMap = {
  add: AddTransaction,
  view: ViewTransaction,
  update: UpdateTransaction,
}

const componentsArray = computed(() =>
  Object.entries(componentsMap).map(([key, component]) => ({ key, component })),
)

const currentComponent = computed(() => {
  return componentsMap[currentRoute.params.action] || ViewTransaction
})
</script>
