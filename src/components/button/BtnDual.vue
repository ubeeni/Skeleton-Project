<template>
  <div class="btn-dual-wrapper">
    <button
      class="btn-dual btn-dual-left bodyRegular16px"
      :class="{ activeIncome: isIncomeActive }"
      @click="$emit('clickIncome')"
    >
      수입
    </button>
    <div class="btn-dual-divider"></div>
    <button
      class="btn-dual btn-dual-right bodyRegular16px"
      :class="{ activeExpense: isExpenseActive }"
      @click="$emit('clickExpense')"
    >
      지출
    </button>
  </div>
</template>

<script setup>
defineProps({
  isIncomeActive: {
    type: Boolean,
    default: false,
  },
  isExpenseActive: {
    type: Boolean,
    default: false,
  },
})
defineEmits(['clickIncome', 'clickExpense'])
</script>

<style scoped>
.btn-dual-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-dual {
  background-color: var(--color-light);
  width: 5rem;
  height: 2.5rem;
  text-align: center;
  color: var(--color-white);
}

.btn-dual-left {
  border-radius: 0.5rem 0 0 0.5rem;
}

.btn-dual-right {
  border-radius: 0 0.5rem 0.5rem 0;
}

.btn-dual-divider {
  width: 0.0625rem;
  height: 2.5rem;
  background-color: var(--color-white);
}

.activeIncome {
  background: var(--color-income);
}

.activeExpense {
  background: var(--color-expense);
}
</style>
