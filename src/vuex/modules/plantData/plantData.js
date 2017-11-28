/**
 * Created by wisdom on 2017/11/20.
 */
/**
 * Created by wisdom on 2017/10/27.
 */
import o from 'o.js'
import Q from 'q'
const PLANT_CYCLELOCATION_DATA = 'PLANT_CYCLELOCATIONLOCATION_DATA'
const PLANT_AREALOCATION_DATA = 'PLANT_AREALOCATION_DATA'
const PLANT_LOCATION_DATA = 'PLANT_LOCATION_DATA'
const PLANT_YEAR_DATA = 'PLANT_YEAR_DATA'
const PLANT_VARI_DATA = 'PLANT_VARI_DATA'
// const YEAR_DATA = 'YEAR_DATA'
const state = {
    variData: {},
    locationList: [],
    areaLocationList: [],
    cycleLocationList: [],
    yearList: 17
}

const getters = {
    // 优良率折线图州
    getPlantLocationList: state => {
        return state.locationList
    },
    // 优良率面积图州
    getPlantAreaLocationList: state => {
        return state.areaLocationList
    },
    // 优良率周期图州
    getPlantCycleLocationList: state => {
        return state.cycleLocationList
    },
    // 优良率周期图州
    getPlantYearList: state => {
        return state.yearList
    },
    getPlantVariData: state => {
        return state.variData
    }
}

const mutations = {
    [PLANT_CYCLELOCATION_DATA] (state, locationList) {
        state.cycleLocationList = locationList
    },
    [PLANT_AREALOCATION_DATA] (state, locationList) {
        state.areaLocationList = locationList
    },
    [PLANT_LOCATION_DATA] (state, locationList) {
        state.locationList = locationList
    },
    [PLANT_YEAR_DATA] (state, yearList) {
        state.yearList = yearList
    },
    [PLANT_VARI_DATA] (state, variData) {
        state.variData = variData
    }
}

const actions = {
    setPlantLocalList ({commit, state}, menu) {
        // commit(LOCATION_DATA, data)
        let webApiRootSite = localStorage.getItem('ImApiUrl')
        let url = `${webApiRootSite}CropProgressLineData/Rcdc.GetStateList`
        let url2 = `${webApiRootSite}CropProgressDistributionData/Rcdc.GetStateList`
        let url3 = `${webApiRootSite}CropProgressCycleData/Rcdc.GetStateList`
        let Commodity = state.variData.VariCode
        let urlArr = []
        urlArr.push(o(url).post({Commodity: Commodity}).save())
        urlArr.push(o(url2).post({Commodity: Commodity}).save())
        urlArr.push(o(url3).post({Commodity: Commodity}).save())
        Q.all(urlArr).then(function (oHandlerArray) {
            let data = oHandlerArray[0].data
            let data2 = oHandlerArray[1].data
            let data3 = oHandlerArray[2].data
            commit(PLANT_LOCATION_DATA, data)
            commit(PLANT_AREALOCATION_DATA, data2)
            commit(PLANT_CYCLELOCATION_DATA, data3)
        }).fail(function (ex) {
            console.log(ex)
        })
    },
    setPlantYearList ({commit, state}, menu) {
        let time = new Date()
        let yearFull = time.getFullYear()
        let mouth = time.getMonth()
        let day = time.getDate()
        if (mouth >= 3 && day > 1) {
            yearFull = yearFull + 1
        }
        let year = (yearFull).toString().slice(2, 4)
        commit(PLANT_YEAR_DATA, year)
    },
    setPlantVariData ({commit, state}, data) {
        commit(PLANT_VARI_DATA, data)
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}
