/**
 * Created by wisdom on 2017/10/27.
 */
import o from 'o.js'
// import Q from 'q'

// import {
//     STEPDATA,
//     DETAILDATA,
//     DETAILNAME,
//     DETAILID
// } from './../../mutation-types.js'
// let locationList = [
//     '大洋',
//     '中美加勒比海',
//     '欧盟',
//     '北美',
//     '南美',
//     '非洲',
//     '东亚',
//     '中东',
//     '东南亚',
//     '南亚',
//     '欧洲其他',
//     '前苏联',
//     '中国',
//     '全球'
// ]
const LOCATION_DATA = 'LOCATION_DATA'
const YEAR_DATA = 'YEAR_DATA'
const WEEK_DATA = 'WEEK_DATA'
// const YEAR_DATA = 'YEAR_DATA'
const state = {
    locationList: [],
    yearList: 17,
    weekList: []
}

const getters = {
    getLocationList: state => {
        return state.locationList
    },
    getYearList: state => {
        return state.yearList
    },
    getWeekList: state => {
        return state.weekList
    }
}

const mutations = {
    [LOCATION_DATA] (state, locationList) {
        state.locationList = locationList
    },
    [YEAR_DATA] (state, yearList) {
        state.yearList = yearList
    },
    [WEEK_DATA] (state, weekList) {
        state.weekList = weekList
    }
}

const actions = {
    setlocationList ({commit, state}, menu) {
        let webApiRootSite = localStorage.getItem('ImApiUrl')
        let url = `${webApiRootSite}Area/Rcdc.GetAreaList`
        o(url).post().save().then(
            (response) => {
                let data = response.data
                commit(LOCATION_DATA, data)
            }
        ).fail(function (ex) {
            console.log(ex)
        })
    },
    setyearList ({commit, state}, menu) {
        let time = new Date()
        let yearFull = time.getFullYear()
        let mouth = time.getMonth()
        let day = time.getDate()
        if (mouth >= 4 && day > 1) {
            yearFull = yearFull + 1
        }
        let webApiRootSite = localStorage.getItem('ImApiUrl')
        let url = `${webApiRootSite}/SalesDataWeekReport?$filter=(Commodity eq 'Soybeans' and (`
        for (let i = 2000; i < yearFull; i++) {
            if (i === yearFull - 1) {
                url = url + `Year eq '${i}/${i + 1}'))&$orderby= Week desc&$top=1`
            } else {
                url = url + `Year eq '${i}/${i + 1}' or `
            }
        }
        let year = (yearFull - 1).toString().slice(2, 4)
        commit(YEAR_DATA, year)
        if (menu === 'year') {
            return
        }
        o(url).get().then(
            (response) => {
                if (response.data.length === 0) {
                    commit(YEAR_DATA, year)
                    return
                }
                let data = response.data[0].Week
                let week = []
                for (let i = 1; i <= data; i++) {
                    week.push({value: i, label: i})
                }
                commit(WEEK_DATA, week)
            }
        ).fail(function (ex) {
            console.log(ex)
        })
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}
