import base from './baseColumns.js'
let addArr = [{
    title: 'Seed',
    key: 'Seed',
    search_hide: 1,
    width: 80,
    type: 'Number'
}, {
    title: 'Residual',
    key: 'Residual',
    search_hide: 1,
    width: 90,
    type: 'Number'
}, {
    title: 'Crushings',
    key: 'Crushings',
    search_hide: 1,
    width: 100,
    type: 'Number'
}]
const SoybeansColumns = base.concat(addArr)
export default SoybeansColumns
