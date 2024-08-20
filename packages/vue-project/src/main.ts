import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import HelloWorld from './components/HelloWorld.vue'
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('HelloWorld', HelloWorld)
app.mount('#app')
