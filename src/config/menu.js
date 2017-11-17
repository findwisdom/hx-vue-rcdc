// import * as RoleMap from './role-map.js'
/**
 *
 * index 为唯一标识,vuex state 存储
 */
let item1 = {
    name: 'USDA',
    text: '农产品供需数据',
    index: '1',
    icon: 'cube',
    display: true,
    dir: 'pages/USDA/UsdaProductList',
    path: '/UsdaProductList',
    role: '*',
    meta: {
        requiresAuth: true,
        role: '*'
    },
    child: [{
        text: 'WASDE',
        dir: 'pages/USDA/UsdaShowVarieties/:TradeVariCode',
        name: 'UsdaShowVarieties',
        index: '1-1',
        icon: 'calendar',
        display: true,
        path: '/UsdaShowVarieties',
        role: '*',
        meta: {
            requiresAuth: true,
            role: '*'
        },
        child: [
            {
                text: '数据查看',
                dir: 'pages/USDA/UsdaShowVarieties',
                name: 'UsdaShowVarieties',
                index: '2-1',
                icon: 'android-list',
                display: true,
                path: '/UsdaShowVarieties/:TradeVariCode',
                role: '*',
                meta: {
                    requiresAuth: true,
                    role: '*'
                }
            },
            {
                text: '数据分析',
                dir: 'pages/USDA/UsdaChart',
                name: 'UsdaChart',
                index: '2-1',
                icon: 'compose',
                display: true,
                path: '/UsdaChart/:TradeVariCode',
                role: '*',
                meta: {
                    requiresAuth: true,
                    role: '*'
                }
            }
            // {
            //     text: '数据分析',
            //     dir: 'pages/USDA/foreignTrade/WeekMarketInspect',
            //     name: 'WeekMarketInspect',
            //     index: '2-1',
            //     icon: 'levels',
            //     display: true,
            //     path: '/WeekMarketInspect/:TradeVariCode',
            //     role: '*',
            //     meta: {
            //         requiresAuth: true,
            //         role: '*'
            //     }
            // }
        ]
    },
    {
        text: '进出口数据',
        dir: 'pages/USDA/foreignTrade/AnalyzeRationality',
        name: 'foreignTrade',
        index: '1-1',
        icon: 'android-options',
        display: true,
        role: '*',
        meta: {
            requiresAuth: true,
            role: '*'
        },
        child: [
            {
                text: '周度出口销售报告',
                dir: 'pages/USDA/foreignTrade/WeekMarketReport',
                name: 'WeekMarketReport',
                index: '2-1',
                icon: 'compose',
                display: true,
                path: '/WeekMarketReport/:TradeVariCode',
                role: '*',
                meta: {
                    requiresAuth: true,
                    role: '*'
                }
            },
            {
                text: '出口合理性分析',
                dir: 'pages/USDA/foreignTrade/AnalyzeRationality',
                name: 'AnalyzeRationality',
                index: '2-1',
                icon: 'android-list',
                display: true,
                path: '/AnalyzeRationality/:TradeVariCode',
                role: '*',
                meta: {
                    requiresAuth: true,
                    role: '*'
                }
            },
            {
                text: '周度出口检验',
                dir: 'pages/USDA/foreignTrade/WeekMarketInspect',
                name: 'WeekMarketInspect',
                index: '2-1',
                icon: 'levels',
                display: true,
                path: '/WeekMarketInspect/:TradeVariCode',
                role: '*',
                meta: {
                    requiresAuth: true,
                    role: '*'
                }
            },
            {
                text: '海关出口数据',
                dir: 'pages/USDA/foreignTrade/CustomsExit',
                name: 'CustomsExit',
                index: '2-1',
                icon: 'ios-book-outline',
                display: true,
                path: '/CustomsExit/:TradeVariCode',
                role: '*',
                meta: {
                    requiresAuth: true,
                    role: '*'
                }
            }
        ]
    }
    ]
}
let item2 = {
    name: 'EXCHDATA',
    text: '交易所数据',
    dir: 'pages/EXCHDATA/FutureHoldData',
    path: '/FutureHoldData/:VariCode',
    index: '1',
    icon: 'stats-bars',
    display: true,
    role: '*',
    child: [
        {
            text: '持仓排名',
            dir: 'pages/EXCHDATA/FutureHoldData',
            name: 'FutureHoldData',
            index: '2-1',
            icon: 'stats-bars',
            display: true,
            path: '/FutureHoldData/:VariCode',
            role: '*',
            meta: {
                requiresAuth: true,
                role: '*'
            }
        },
        {
            text: '仓单日报',
            dir: 'pages/EXCHDATA/ExchangeWarrant',
            name: 'ExchangeWarrant',
            index: '2-2',
            icon: 'ios-paper',
            display: true,
            path: '/ExchangeWarrant/:VariCode',
            role: '*',
            meta: {
                requiresAuth: true,
                role: '*'
            },
            child: [
                {
                    text: '上海期货交易所',
                    dir: 'pages/EXCHDATA/ExchangeWarrant/shWarrant',
                    name: 'shWarrant',
                    index: '2-1',
                    icon: 'android-home',
                    display: true,
                    path: '/shWarrant/:VariCode',
                    role: '*',
                    meta: {
                        requiresAuth: true,
                        role: '*'
                    }
                },
                {
                    text: '郑州商品交易所',
                    dir: 'pages/EXCHDATA/ExchangeWarrant/zzWarrant',
                    name: 'zzWarrant',
                    index: '2-1',
                    icon: 'android-star',
                    display: true,
                    path: '/zzWarrant/:VariCode',
                    role: '*',
                    meta: {
                        requiresAuth: true,
                        role: '*'
                    }
                },
                {
                    text: '大连商品交易所',
                    dir: 'pages/EXCHDATA/ExchangeWarrant/dlWarrant',
                    name: 'dlWarrant',
                    index: '2-1',
                    icon: 'gear-b',
                    display: true,
                    path: '/dlWarrant/:VariCode',
                    role: '*',
                    meta: {
                        requiresAuth: true,
                        role: '*'
                    }
                }
            ]
        }]
}
const menus = [item1, item2]
export default menus
