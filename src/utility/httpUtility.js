// 得到queryString
function queryString (obj) {
    var queryString = ''

    for (var key in obj) {
        if (queryString === '') {
            queryString = queryString + key + '=' + obj[key]
        } else {
            queryString = queryString + '&' + key + '=' + obj[key]
        }
    }

    return queryString
}

function download (vueInstance, downloadUrl) {
    if (!vueInstance.downloadIf) {
        vueInstance.downloadIf = document.createElement('iframe')
        vueInstance.downloadIf.style.display = 'none'
        document.body.appendChild(vueInstance.downloadIf)
    }

    vueInstance.downloadIf.src = downloadUrl
}

export default {
    queryString: queryString,
    download: download
}
