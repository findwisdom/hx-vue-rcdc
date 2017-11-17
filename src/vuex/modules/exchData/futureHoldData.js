import * as actions from './futureHoldDataAction.js'
import * as getters from './futureHoldDataGetters.js'
import { FUTUREHOLDDATA_LASTDATE } from './../../mutation-types.js'
const state = {
    lastDate: null
}

const mutations = {
    [FUTUREHOLDDATA_LASTDATE] (state, lastDate) {
        state.lastDate = lastDate
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
