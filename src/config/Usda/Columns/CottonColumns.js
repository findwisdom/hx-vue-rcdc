import base from './baseColumns.js'
let addArr = [{
    title: 'Unaccounted',
    key: 'Unaccounted',
    width: 120,
    search_hide: 1,
    type: 'Number'
}, {
    title: 'DomesticUse',
    key: 'DomesticUse',
    width: 120,
    search_hide: 1,
    type: 'Number'
}]
const Cotton = base.concat(addArr)
export default Cotton
