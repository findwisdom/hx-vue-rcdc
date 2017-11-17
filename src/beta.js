/**
 * Created by wisdom on 2017/9/20.
 */
// var url = '111'
// var url1 = '222'
//
// function getJSON (url) {
//     setTimeout(function () {
//         console.log(url)
//         return url
//     }, '3000')
// }
// function getJSON2 (url) {
//     console.log(url)
//     return url
// }
// function renderRace () {
//     return Promise.race([getJSON(url), getJSON2(url1)])
// }
//
// renderRace().then(function (value) {
//     console.log(value)
// })
// import Q from 'q.js'
//
// let oldUrl = 1
// let oldUrl2 = 2
//
// function getOdata (data) {
//     return data
// }
// Q.all([
//     getOdata(oldUrl),
//     getOdata(oldUrl2)
// ]).then(function (oHandlerArray) {
//     console.log(oHandlerArray)
// }, function (error) {
//     console.log(error)
// })
let o = require('../node_modules/o.js/o.js')
console.log(o)
let url = 'http://automata.cefcfco.com:6789/api/manage/odata/'
let url2 = 'http://automata.cefcfco.com:6789/api/manage/odata/Queue/'
function getData () {
    let xx = {}
    o(url).get().then(function (data) {
        xx = data.data
        console.log(data.data)
        o(url2).get().then(function (data) {
            xx = data.data
            console.log(data.data)
        })
    })
    console.log(xx.data)
    return xx
}
function* Hello() {
    yield 100
    yield getData()
    return 300
}

var h = Hello()
console.log(typeof h)  // object

console.log(h.next())  // { value: 100, done: false }
console.log(h.next())  // { value: 200, done: false }
console.log(h.next())  // { value: 300, done: true }
console.log(h.next())  // { value: undefined, done: true }