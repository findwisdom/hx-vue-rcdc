// 项目必须填写,且不能含有^%&\',;=?$\/\"等特殊符号
export function required (value) {
    if (strLeng(value) > 100) {
        return false
    }
    const reg = new RegExp(`[\`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]`)
    if (value !== '' && value !== undefined && value !== null && value.toString()
    .length !== 0 && !reg.test(value)) {
        return true
    } else {
        return false
    }
}
// 返回字节数
export function strLeng (str) {
    if (str == null) {
        return 0
    }
    if (typeof str !== 'string') {
        str += ''
    }
    return str.replace(/[^x00-xff]/g, '01').length
}

// 去掉首尾空格的正则表达式
export function trim (s) {
    return s.replace(/(^\s*)|(\s*$)/g, '')
}
// 去掉字符串里特殊字符的正则表达式方求
export function stripscript (s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    var rs = ''
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, '')
    }
    return rs
}

// 最小值
export function min (value, min) {
    if (value && value >= min) {
        return true
    } else {
        return false
    }
}

// 是否为空
export function isEmpty (value) {
    if (strLeng(value) > 100) {
        return false
    }
    if (value !== '' && value !== undefined && value !== null && value.toString()
    .length !== 0) {
        return true
    } else {
        return false
    }
}

// 处理返回合适时间格式
export function setTime (value) {
    if (value) {
        return value.split('T')[0]
    }
}

// 是否为整数
export function regNumber (value) {
    const reg = new RegExp('^[0-9]*$')
    return reg.test(value)
}

// 是否为浮点数
export function isFloatNumber (value) {
    if (strLeng(value) > 100) {
        return false
    }
    const reg = new RegExp(`^(-?\\d+)(\\.\\d+)?$`)
    return reg.test(value)
}

// 时间格式验证
export function regTimeType (value) {
    const reg = new RegExp(`/^\\d{4}-\\d{1,2}-\\d{1,2}$/`)
    return reg.test(value)
}

// 邮政编码
export function regPostcode (value) {
    const reg = new RegExp(`[1-9]\\d{5}(?!\\d)`)
    return reg.test(value)
}

// 验证是否含有 ^%&',;=?$\" 等字符
export function regSymbol (value) {
    const reg = new RegExp(`[\`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]`)
    return reg.test(value)
}

// 验证EMAIL
export function regEmail (value) {
    const reg = new RegExp(`^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$`)
    return reg.test(value)
}

// 字母开头，允许5-16字节，允许字母数字下划线
export function regName (value) {
    const reg = new RegExp(`^[a-zA-Z][a-zA-Z0-9_]{4,15}$`)
    return reg.test(value)
}

// 组合对象数组
export function setArrObj (role, options) {
    const obj = role
    const arr = options
    const newArr = []
    var index = 0
    for (var key in obj) {
        var o = {}
        for (var i = 0; i < arr.length; i++) {
            if (i === index) {
                o[key] = arr[i]
            }
        }
        newArr.push(o)
        index++
    }
    return newArr
}

// 筛选数组
export function filterArr (arr, filter) {
    let $notAdd = filter
    let newArr = arr
    for (let i = 0; i < newArr.length; i++) {
        for (let item in newArr[i]) {
            for (let a = 0; a < $notAdd.length; a++) {
                if ($notAdd[a] === item) {
                    newArr.splice(i, 1)
                    i--
                }
            }
        }
    }
    return newArr
}

