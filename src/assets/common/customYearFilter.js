/**
 * Created by wisdom on 2017/11/15.
 */
export default function (startTime, endTime, data) {
    let arryData = []
    for (let i = startTime; i <= 12; i++) {
        switch (i) {
            case 1:
                arryData.push([i, data.January])
                break
            case 2:
                arryData.push([i, data.February])
                break
            case 3:
                arryData.push([i, data.March])
                break
            case 4:
                arryData.push([i, data.April])
                break
            case 5:
                arryData.push([i, data.May])
                break
            case 6:
                arryData.push([i, data.June])
                break
            case 7:
                arryData.push([i, data.July])
                break
            case 8:
                arryData.push([i, data.August])
                break
            case 9:
                arryData.push([i, data.September])
                break
            case 10:
                arryData.push([i, data.October])
                break
            case 11:
                arryData.push([i, data.November])
                break
            case 12:
                arryData.push([i, data.December])
                break
            default:
                break
        }
    }
    for (let i = 13; i <= endTime + 12; i++) {
        switch (i) {
            case 13:
                arryData.push([i, data.January2])
                break
            case 14:
                arryData.push([i, data.February2])
                break
            case 15:
                arryData.push([i, data.March2])
                break
            case 16:
                arryData.push([i, data.April2])
                break
            case 17:
                arryData.push([i, data.May2])
                break
            case 18:
                arryData.push([i, data.June2])
                break
            case 19:
                arryData.push([i, data.July2])
                break
            case 20:
                arryData.push([i, data.August2])
                break
            case 21:
                arryData.push([i, data.September2])
                break
            case 22:
                arryData.push([i, data.October2])
                break
            case 23:
                arryData.push([i, data.November2])
                break
            case 24:
                arryData.push([i, data.December2])
                break
            default:
                break
        }
    }
    return arryData
}
