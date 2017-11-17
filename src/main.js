// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'

import store from './vuex/store.js'
import iView from 'iview'
import 'iview/dist/styles/iview.css' // 使用 CSS
import VueECharts from 'vue-echarts/components/ECharts.vue'

import hxqh from 'hx-v'
import 'hx-v/dist/styles/common.css'
// 存储项目url
let baseUrl = {
    exchDataApiUrl: localStorage.getItem('exchDataApiUrl'),
    ImApiUrl: localStorage.getItem('ImApiUrl'),
    oDataApiBaseUrl: localStorage.getItem('oDataApiBaseUrl')
}
Vue.use(hxqh, baseUrl, '')

Vue.use(iView)
Vue.component('chart', VueECharts)
Vue.use(VueResource)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: {
        App
    }
})
