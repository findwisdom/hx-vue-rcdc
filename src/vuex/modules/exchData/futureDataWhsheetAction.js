/**
 * Created by wisdom on 2017/8/25.
 */
import Vue from 'vue'
import { getExchODataApi } from './../../../config/apiConfig.js'
import * as Types from './../../mutation-types.js'

function getApiUrl (param) {
    return getExchODataApi(param)
}
export const getWhsheetLastDate = ({ commit }) => {
    var resource = Vue.resource(getApiUrl('FutureDataWhsheet?$select=Date&$orderby=Date desc&$top=1'))
    resource.get().then(
        (response) => {
            var lastDate = ''
            if (response.data.value.length > 0) {
                lastDate = response.data.value[0].Date.substr(0, 10)
            } else {
                var dt = new Date()
                lastDate = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
            }commit(Types.FUTUREDATAWHSHEET_LASTDATE, lastDate)
        }, (response) => {
    })
}
