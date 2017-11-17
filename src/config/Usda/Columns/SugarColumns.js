import baseOher from './baseOherColumns.js'
let addArr = [{
    title: 'StocksToUseRatio',
    key: 'StocksToUseRatio',
    search_hide: 1,
    width: 150,
    type: 'Number'
}, {
    title: 'BeetSugarProduction',
    key: 'BeetSugarProduction',
    width: 170,
    search_hide: 1,
    type: 'Number'
}, {
    title: 'Deliveries',
    key: 'Deliveries',
    width: 130,
    search_hide: 1,
    type: 'Number'
}, {
    title: 'OtherDeliveries',
    key: 'OtherDeliveries',
    width: 130,
    search_hide: 1,
    type: 'Number'
}, {
    title: 'Miscellaneous',
    key: 'Miscellaneous',
    width: 130,
    search_hide: 1,
    type: 'Number'
}, {
    title: 'CaneSugarProduction',
    key: 'CaneSugarProduction',
    search_hide: 1,
    width: 170,
    type: 'Number'
}, {
    title: 'OtherImports',
    key: 'OtherImports',
    search_hide: 1,
    width: 150,
    type: 'Number'
}]
const Sugar = baseOher.concat(addArr)
export default Sugar
