export function filterData (datas) {
    let data = datas
    let o = {}
    for (let item of data) {
        if (item.add_hide !== 1) {
            o[item.key] = (item.type === 'number' ? null : '')
        }
    }
    return o
}

/**
 *  处理搜索下拉菜单，返回所有key
 * @param data
 * @returns {Array}
 */
export function getAllKeys (data) {
    let keys = []
    for (let item of data) {
        if (item.search_hide !== 1) {
            keys.push(item.key)
        }
    }
    return keys
}

/**
 *  设置table td 颜色
 * @param attrs   需要加class 的td key
 * @param val   className
 * @returns {{}}
 */
export function setCellClassName (attrs, val) {
    let obj = attrs
    let o = {}
    for (let item of obj) {
        if (item.list_hide !== 1) {
            o[item.key] = val
        }
    }
    return o
}

export function toLocaleString (t) {
    let d = new Date(t).getTime() - 57600000  // 16小时
    let times = new Date(d)
    let year = times.getFullYear()
    let month = (times.getMonth() + 1).toString().length === 2 ? (times.getMonth() + 1) : `0${(times.getMonth() + 1)}`
    let day = (times.getDate()).toString().length === 2 ? (times.getDate()) : `0${(times.getDate())}`
    let hours = (times.getHours()).toString().length === 2 ? (times.getHours()) : `0${(times.getHours())}`
    let minutes = (times.getMinutes()).toString().length === 2 ? (times.getMinutes()) : `0${(times.getMinutes())}`
    let seconds = (times.getSeconds()).toString().length === 2 ? (times.getSeconds()) : `0${(times.getSeconds())}`
    return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds
}
