/* eslint-disable no-undef */
export const apiBaseUrl = config.apiBaseUrl
export const oDataApiBaseUrl = config.oDataApiBaseUrl
export const exchDataApiUrl = config.exchDataApiUrl
export const zzVari = config.zzVari
export const dlVari = config.dlVari
export const shVari = config.shVari
export const TradeVari = config.TradeVari
export const InspectVari = config.InspectVari
export const ExportAnalysis = config.ExportAnalysis
export const WsdeVari = config.WsdeVari
export const CustomsVari = config.CustomsVari
/* eslint-enable */

export function getApi (controller) {
    return apiBaseUrl + controller
}

export function getODataApi (controller) {
    return oDataApiBaseUrl + controller
}

export function getExchODataApi (controller) {
    return exchDataApiUrl + controller
}
