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
import o from '../node_modules/o.js'
console.log(o)
let url = 'http://automata.cefcfco.com:6789/api/manage/odata/'
function getData () {
    o(url).get().then(function (data) {
        return data
    })
}
function* Hello() {
    yield 100
    return 300
}

var h = Hello()
console.log(typeof h)  // object

console.log(h.next())  // { value: 100, done: false }
console.log(h.next())  // { value: 200, done: false }
console.log(h.next())  // { value: 300, done: true }
console.log(h.next())  // { value: undefined, done: true }