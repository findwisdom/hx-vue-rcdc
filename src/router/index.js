import Vue from 'vue'
import Router from 'vue-router'
// import Index from './../pages/app/Index'
// import UsdaProductList from './../pages/USDA/UsdaProductList.vue'
// import dadou from './../pages/USDA/dadou.vue'
// import FutureHoldData from './../pages/EXCHDATA/FutureHoldData.vue'
// import FutureHoldDataDetail from './../pages/EXCHDATA/FutureHoldDataDetail.vue'
// import ExchangeWarrant from '../pages/EXCHDATA/ExchangeWarrant.vue'
// import ExchangeWarrantDetail from '../pages/EXCHDATA/ExchangeWarrantDetail.vue'
import menuRoot from './../config/menu.js'

Vue.use(Router)
const routes = []
menuRoot.forEach((module) => {
    const menus = module.child
    if (menus) {
        menus.forEach((menu) => {
            // 菜单项增加到路由数组中
            const subMenus = menu.child
            if (subMenus) {
                subMenus.forEach((subMenu) => {
                    if (subMenu.role === '*') {
                        routes.push({
                            path: subMenu.path,
                            name: subMenu.name,
                            component: resolve => require([`./../${subMenu.dir}.vue`], resolve)
                        })
                    }
                })
            } else {
                if (menu.role === '*') {
                    routes.push({
                        path: menu.path,
                        name: menu.name,
                        component: resolve => require([`./../${menu.dir}.vue`], resolve)
                    })
                }
            }
        })
    } else {
        if (module.role === '*') {
            routes.push({
                path: module.path,
                name: module.name,
                component: resolve => require([`./../${module.dir}.vue`], resolve)
            })
        }
    }
})
routes.push({
    path: '/',
    name: 'Index',
    component: resolve => require([`./../pages/app/Index.vue`], resolve)
})
routes.push({
    path: '/UsdaChart',
    name: 'UsdaChart',
    component: resolve => require([`./../pages/USDA/UsdaChart.vue`], resolve)
})
routes.push({
    path: '/UsdaShowVarieties',
    name: 'UsdaShowVarieties',
    component: resolve => require([`./../pages/USDA/UsdaShowVarieties.vue`], resolve)
})
routes.push({
    path: '/dadou',
    name: 'dadou',
    component: resolve => require([`./../pages/USDA/dadou.vue`], resolve)
})

routes.push({
    path: '/FutureHoldDataDetail/:VariCode&:CustName',
    name: 'FutureHoldDataDetail',
    component: resolve => require([`./../pages/EXCHDATA/FutureHoldDataDetail.vue`], resolve)
})
routes.push({
    path: '/FutureHoldDataRankDetail/:VariCode&:CustName',
    name: 'FutureHoldDataRankDetail',
    component: resolve => require([`./../pages/EXCHDATA/FutureHoldDataRankDetail.vue`], resolve)
})
routes.push({
    path: '/ExchangeWarrantDetail/:VariCode',
    name: 'ExchangeWarrantDetail',
    component: resolve => require([`./../pages/EXCHDATA/ExchangeWarrantDetail.vue`], resolve)
})
export default new Router({
    mode: 'history',
    routes: routes
    // routes: [{
    //     path: '/',
    //     // name: 'Index',
    //     component: UsdaProductList
    // }, {
    //     path: '/UsdaProductList',
    //     name: 'UsdaProductList',
    //     component: UsdaProductList
    // }, {
    //     path: '/UsdaChart',
    //     name: 'UsdaChart',
    //     component: UsdaChart
    // }, {
    //     path: '/UsdaShowVarieties',
    //     name: 'UsdaShowVarieties',
    //     component: UsdaShowVarieties
    // }, {
    //     path: '/dadou',
    //     name: 'dadou',
    //     component: dadou
    // }, {
    //     path: '/FutureHoldData/:VariCode',
    //     name: 'FutureHoldData',
    //     component: FutureHoldData
    // }, {
    //     path: '/FutureHoldDataDetail/:VariCode&:CustName',
    //     name: 'FutureHoldDataDetail',
    //     component: FutureHoldDataDetail
    // }, {
    //     path: '/ExchangeWarrant/:VariCode',
    //     name: 'ExchangeWarrant',
    //     component: ExchangeWarrant
    // }, {
    //     path: '/ExchangeWarrantDetail/:VariCode',
    //     name: 'ExchangeWarrantDetail',
    //     component: ExchangeWarrantDetail
    // }]
})
