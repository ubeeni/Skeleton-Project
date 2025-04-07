import { createApp } from 'vue'
import { createPinia } from 'pinia'

import AppTest from './AppTest.vue'
import router from './router'

const app = createApp(AppTest)

app.use(createPinia())
app.use(router)

app.mount('#app')
