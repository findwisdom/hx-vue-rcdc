/**
 * Created by wisdom on 2017/2/28.
 */
import Vue from 'vue'
import Vuex from 'vuex'

// 公共actions方法
import * as actions from './actions.js'
import menu from './modules/menu/menu.js'
import futureHoldData from './modules/exchData/futureHoldData.js'
import futureDataWhsheet from './modules/exchData/futureDataWhsheet.js'
import ImportEntrances from './modules/ImportEntrances/ImportEntrances.js'
import plantData from './modules/plantData/plantData.js'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    strict: debug,
    modules: {
        plantData,
        menu,   //  侧边导航栏
        futureHoldData,
        futureDataWhsheet,
        ImportEntrances
    },
    actions
})
