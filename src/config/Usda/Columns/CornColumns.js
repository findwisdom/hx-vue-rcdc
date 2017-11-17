import base from './baseColumns.js'
let addArr = [{
    title: 'Seed',
    key: 'Seed',
    width: 80,
    search_hide: 1,
    type: 'Number'
}, {
    title: 'Residual',
    key: 'Residual',
    width: 100,
    search_hide: 1,
    type: 'Number'
}, {
    title: 'Ethanol',
    key: 'Ethanol',
    width: 100,
    search_hide: 1,
    type: 'Number'
}, {
    title: 'TotalDomestic',
    key: 'TotalDomestic',
    width: 130,
    search_hide: 1,
    type: 'Number'
}]
const corn = base.concat(addArr)
export default corn
