/**
 * Created by wisdom on 2017/11/14.
 */
export default function (startTime, endTime, data) {
    let arryData = []
    for (let i = startTime; i <= 12; i++) {
        switch (i) {
            case 1:
                if (data.January !== null && data.January !== undefined) {
                    arryData.push([i, data.January])
                }
                break
            case 2:
                if (data.February !== null && data.February !== undefined) {
                    arryData.push([i, data.February])
                }
                break
            case 3:
                if (data.March !== null && data.March !== undefined) {
                    arryData.push([i, data.March])
                }
                break
            case 4:
                if (data.April !== null && data.April !== undefined) {
                    arryData.push([i, data.April])
                }
                break
            case 5:
                if (data.May !== null && data.May !== undefined) {
                    arryData.push([i, data.May])
                }
                break
            case 6:
                if (data.June !== null && data.June !== undefined) {
                    arryData.push([i, data.June])
                }
                break
            case 7:
                if (data.July !== null && data.July !== undefined) {
                    arryData.push([i, data.July])
                }
                break
            case 8:
                if (data.August !== null && data.August !== undefined) {
                    arryData.push([i, data.August])
                }
                break
            case 9:
                if (data.September !== null && data.September !== undefined) {
                    arryData.push([i, data.September])
                }
                break
            case 10:
                if (data.October !== null && data.October !== undefined) {
                    arryData.push([i, data.October])
                }
                break
            case 11:
                if (data.November !== null && data.November !== undefined) {
                    arryData.push([i, data.November])
                }
                break
            case 12:
                if (data.December !== null && data.December !== undefined) {
                    arryData.push([i, data.December])
                }
                break
            default:
                break
        }
    }
    for (let i = 13; i <= endTime + 12; i++) {
        switch (i) {
            case 13:
                if (data.January2 !== null && data.January2 !== undefined) {
                    arryData.push([i, data.January2])
                }
                break
            case 14:
                if (data.February2 !== null && data.February2 !== undefined) {
                    arryData.push([i, data.February2])
                }
                break
            case 15:
                if (data.March2 !== null && data.March2 !== undefined) {
                    arryData.push([i, data.March2])
                }
                break
            case 16:
                if (data.April2 !== null && data.April2 !== undefined) {
                    arryData.push([i, data.April2])
                }
                break
            case 17:
                if (data.May2 !== null && data.May2 !== undefined) {
                    arryData.push([i, data.May2])
                }
                break
            case 18:
                if (data.June2 !== null && data.June2 !== undefined) {
                    arryData.push([i, data.June2])
                }
                break
            case 19:
                if (data.July2 !== null && data.July2 !== undefined) {
                    arryData.push([i, data.July2])
                }
                break
            case 20:
                if (data.August2 !== null && data.August2 !== undefined) {
                    arryData.push([i, data.August2])
                }
                break
            case 21:
                if (data.September2 !== null && data.September2 !== undefined) {
                    arryData.push([i, data.September2])
                }
                break
            case 22:
                if (data.October2 !== null && data.October2 !== undefined) {
                    arryData.push([i, data.October2])
                }
                break
            case 23:
                if (data.November2 !== null && data.November2 !== undefined) {
                    arryData.push([i, data.November2])
                }
                break
            case 24:
                if (data.December2 !== null && data.December2 !== undefined) {
                    arryData.push([i, data.December2])
                }
                break
            default:
                break
        }
    }
    return arryData
}

