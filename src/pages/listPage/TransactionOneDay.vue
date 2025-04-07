<template>
    <section class="day-group">
        <h3>{{ formatDate(date) }}</h3>
        <p>{{ totalText }}</p>
        <ListItem
            v-for="tx in transactions"
            :key="tx.id"
            :item="tx"
            :categoryMap="categoryMap"
        />
    </section>
</template>

<script setup>
    import {computed} from 'vue';
    import dayjs from 'dayjs';
    import ListItem from './ListItem.vue';
    
    const props = defineProps({
        date: String,
        transactions : Array,
        categoryMap : Object
    })
    
    const formatDate = (d) => {
        const today = dayjs().format('YYYY-MM-DD')
        return d === today ? '오늘' : dayjs(d).format('M월 D일')
    }

    const totalText = computed(() => {
        const total = props.transactions.reduce((acc,tx) => {
            const type = props.categoryMap[tx.category_id]?.type
            return acc + (type === 'Income' ? tx.amount : -tx.amount)
        },0)
        return `${total >= 0 ? '+' : ''}${total.toLocaleString()}원 · ${props.transactions.length}건`

    })
</script>

<style lang="scss" scoped>

</style>