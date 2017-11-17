import {
    SET_MENU
} from './../../mutation-types.js'

const state = {
    menuId: null
}

const getters = {
    getMenu: state => {
        return state.menuId
    }
}

const mutations = {
    [SET_MENU] (state, menu) {
        state.menuId = menu
    }
}

const actions = {
    setMenu ({commit, state}, menu) {
        commit(SET_MENU, menu)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
