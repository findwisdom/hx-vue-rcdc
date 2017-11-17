/**
 * Created by wisdom on 2017/8/25.
 */
import * as actions from './futureDataWhsheetAction.js'
import * as getters from './futureDataWhsheetGetters.js'
import { FUTUREDATAWHSHEET_LASTDATE } from './../../mutation-types.js'
const state = {
    whsheetlastDate: null
}

const mutations = {
    [FUTUREDATAWHSHEET_LASTDATE] (state, lastDate) {
        state.whsheetlastDate = lastDate
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
