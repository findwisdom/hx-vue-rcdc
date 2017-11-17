import base from './baseColumns.js'
let addArr = [{
    title: 'Seed',
    key: 'Seed',
    search_hide: 1,
    width: 110,
    type: 'Number'
}, {
    title: 'Residual',
    key: 'Residual',
    search_hide: 1,
    width: 110,
    type: 'Number'
}, {
    title: 'Food',
    key: 'Food',
    search_hide: 1,
    width: 100,
    type: 'Number'
}, {
    title: 'TotalDomestic',
    key: 'TotalDomestic',
    search_hide: 1,
    width: 120,
    type: 'Number'
}]
const wheat = base.concat(addArr)
export default wheat
