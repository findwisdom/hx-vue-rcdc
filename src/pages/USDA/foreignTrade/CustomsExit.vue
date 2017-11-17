<template>
    <div class="template">
        <Row>
            <Col span="2" class="exch-list">
            <Input v-model="filterVariCode" placeholder="请输入品种..." class="filter-vari"></Input>
            <Menu ref="leftMenu" :accordion="accordion" :active-name="variCode" :open-names="openNames" @on-select="changeVari" style="width: 100">
                <Submenu name="A">
                    <template slot="title">
                        品种列表
                    </template>
                    <!--({{vari.VariCode}})-->
                    <Menu-item :class="{'init-active': variCode === vari.VariCode}" :name="vari.VariCode" :key="vari.VariCode" v-for="vari in shVariDict">
                        {{vari.VariName}}
                        </Menu-item>
                </Submenu>
            </Menu>
            </Col>
            <Col span="22" class="exch-content">
            <div class="header">
                <Row>
                    <Col span="22">
                    <h2>海关出口数据</h2>
                    </Col>
                    <Col span="2">
                    <Button class="pull-right" title="刷新"> <Icon type="refresh"></Icon> </Button>
                    </Col>
                </Row>
            </div>
            <div class="content-wrap">
                <div class="content-wrap-right">
                    <div v-if="requestData.data === '月度出口'">
                        <div class="chart-head"><span>单位: {{unit}}</span></div>
                        <chart :options="chartOption" class="chart" auto-resize></chart>
                    </div>
                    <div v-if="requestData.data === '年度累计出口'">
                        <div class="chart-head"><span>单位: {{unit}}</span></div>
                        <chart :options="chartOption1" class="chart" auto-resize></chart>
                    </div>
                </div>
                <div class="content-wrap-left">
                    <div class="content-wrap-left-item">
                        <span class="item-text-short" style=" vertical-align: top;margin-top: 5px">
                            年度:
                        </span>
                        <span class="item-select item-text-time">
                             <CheckboxGroup v-model="requestData.month" v-show="requestData.data === '月度出口'">
                                <template v-for="item in optionTime">
                                    <Checkbox :label="item.value" :disabled="(requestData.month.length === 5 && !requestData.month.some((key) => item.value === key))">
                                    <span>{{item.label}}</span>
                                    </Checkbox>
                                </template>
                            </CheckboxGroup>
                            <CheckboxGroup v-model="requestData.year" v-show="requestData.data === '年度累计出口'">
                                <template v-for="item in optionTime">
                                    <Checkbox :label="item.value" :disabled="(requestData.year.length === 5 && !requestData.year.some((key) => item.value === key))">
                                    <span>{{item.label}}</span>
                                    </Checkbox>
                                </template>
                            </CheckboxGroup>
                        </span>
                    </div>
                    <div class="content-wrap-left-item" style="vertical-align:top">
                        <span class="item-text-short" style="vertical-align: top;margin-top: 5px">
                            地区:
                        </span>
                        <span class="item-select">
                            <RadioGroup v-model="requestData.location" vertical v-if="requestData.data === '月度出口'">
                                <template v-for="item in getLocationList">
                                    <Radio :label="item">
                                    <span>{{item}}</span>
                                </Radio>
                                </template>
                            </RadioGroup>
                            <RadioGroup v-model="requestData.Alllocation" vertical v-if="requestData.data === '年度累计出口'">
                                <template v-for="item in getLocationList">
                                    <Radio :label="item">
                                    <span>{{item}}</span>
                                </Radio>
                                </template>
                            </RadioGroup>
                        </span>
                        </span>
                    </div>
                    <div class="content-wrap-left-item-long" style="vertical-align:top">
                        <span class="item-text" style="vertical-align: top;margin-top: 5px">
                            数据:
                        </span>
                        <span class="item-select">
                            <RadioGroup v-model="requestData.data" vertical>
                                <template v-for="item in optionChart">
                                    <Radio :label="item">
                                    <span>{{item}}</span>
                                    </Radio>
                                </template>
                            </RadioGroup>
                        </span>
                    </div>
                    <div style="margin-top: 40px;margin-left: 70px">
                        <Button type="primary" @click =getobj>生成图表</Button>
                        <Button type="ghost" @click="exportObj">导出</Button>
                    </div>
                </div>
            </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    // import * as exchDict from './../../config/ExchData/exchDict.js'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/scatter'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/legend'
    import customMonthFilter from './../../../assets/common/customMonthFilter.js'
    import customYearFilter from './../../../assets/common/customYearFilter.js'
    import { CustomsVari } from './../../../config/apiConfig.js'
    import Q from 'q'
    import o from 'o.js'
    import {mapActions, mapGetters} from 'vuex'
    export default {
        data () {
            return {
                optionData: [
                    '月度出口',
                    '年度累计出口'
                ],
                accordion: true,
                openNames: [],
                selectVari: null,
                variCode: '',
                filterVariCode: '',
                TradeVari: [],
                requestData: {
                    year: [],
                    month: [],
                    location: '',
                    Alllocation: '',
                    data: '月度出口'
                },
                chartOption: {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                        },
                        formatter: function (name) {
                            let num = Number(name[0].data[0])
                            if (num >= 13) {
                                num = num - 12
                            }
                            let data = `第${num}月` + `<br/>`
//                            let data = ''
                            name.forEach(function (item) {
                                data = data + `${item.seriesName}: ${item.data[1]}` + `<br/>`
                            })
                            return data
                        }
                    },
                    title: {
                        text: ''
                    },
                    backgroundColor: '#ffffff',
                    legend: {
                        data: []
                    },
                    xAxis: {
                        type: 'category',
                        axisLine: {
                            lineStyle: { color: '#000' }
                        },
                        axisLabel: {
                            formatter: function (value) {
                                let x = Number(value)
                                if (x >= 13) {
                                    return `${x - 12}月`
                                } else {
                                    return `${x}月`
                                }
                            }
                        },
                        boundaryGap: false,
                        zlevel: 100000,
                        data: []
//                        min: 5
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: { color: '#666' }
                        },
                        boundaryGap: false,
                        splitLine: { show: false },
                        zlevel: 100000
                    },
                    series: []
                },
                chartOption1: {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                        },
                        formatter: function (name) {
                            let num = Number(name[0].data[0])
                            if (num >= 13) {
                                num = num - 12
                            }
                            let data = `第${num}月` + `<br/>`
//                            let data = ''
                            name.forEach(function (item) {
                                data = data + `${item.seriesName}: ${item.data[1]}` + `<br/>`
                            })
                            return data
                        }
                    },
                    title: {
                        text: ''
                    },
                    backgroundColor: '#ffffff',
                    legend: {
                        data: []
                    },
                    xAxis: {
                        type: 'category',
                        axisLine: {
                            lineStyle: { color: '#000' }
                        },
                        axisLabel: {
                            formatter: function (value) {
                                let x = Number(value)
                                if (x >= 13) {
                                    return `${x - 12}月`
                                } else {
                                    return `${x}月`
                                }
                            }
                        },
                        boundaryGap: false,
                        zlevel: 100000,
                        data: []
//                        min: 5
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: { color: '#666' }
                        },
                        boundaryGap: false,
                        splitLine: { show: false },
                        zlevel: 100000
                    },
                    series: []
                }
            }
        },
        mounted: function () {
            this.setlocationList()
            this.setyearList()
            this.TradeVari = CustomsVari
            var variCode = this.$route.params.TradeVariCode
            this.variCode = variCode
            if (variCode) {
                this.variCode = variCode
                this.$router.push({name: 'CustomsExit', params: {TradeVariCode: this.variCode}})
                var variArr = [this.TradeVari]
                for (var i = 0; i < variArr.length; i++) {
                    for (var j = 0; j < variArr[i].length; j++) {
                        if (variArr[i][j].VariCode === variCode) {
                            this.selectVari = variArr[i][j]
                        }
                    }
                }
            }
            this.openNames = [this.selectVari.ExchCode]
            this.$nextTick(function () {
                this.$refs.leftMenu.updateOpened()
                this.$refs.leftMenu.updateActiveName()
            })
            // 数组去重
            // var set1 = Array.from(new Set([1, 1, 2, 2, 33, '33', 44, 44, '44']))
        },
        watch: {
        },
        computed: {
            ...mapGetters([
                'getLocationList',
                'getYearList',
                'getWeekList'
            ]),
            shVariDict: function () {
                var patt = new RegExp(this.filterVariCode, 'i')
                var result = this.TradeVari.filter((item) => {
                    return patt.test(item.VariCode) || patt.test(item.VariCode.toLowerCase()) || patt.test(item.VariName)
                })
                if (this.filterVariCode) {
                    this.accordion = false
                    this.openNames = ['A', 'B', 'C']
                    this.$nextTick(function () {
                        this.$refs.leftMenu.updateOpened()
                        this.$refs.leftMenu.updateActiveName()
                    })
                } else {
                    this.accordion = true
                    if (this.selectVari) {
                        this.openNames = [this.selectVari.ExchCode]
                        this.$nextTick(function () {
                            this.$refs.leftMenu.updateOpened()
                        })
                    }
                }
                return result
            },
            optionTime: function () {
                let timeArray = []
                if (this.selectVari) {
                    for (let i = 0; i < this.getYearList; i++) {
                        if (i < 9) {
                            let time = `200${i}/0${i + 1}`
                            let value = {
                                startTime: this.selectVari.StartTime,
                                endTime: this.selectVari.EndTime,
                                year: `200${i}-200${i + 1}`,
                                time: time
                            }
                            value = JSON.stringify(value)
                            let item = {value: value, label: time}
                            timeArray.push(item)
                        } else if (i === 9) {
                            let time = `200${i}/${i + 1}`
                            let value = {
                                startTime: this.selectVari.StartTime,
                                endTime: this.selectVari.EndTime,
                                year: `200${i}-20${i + 1}`,
                                time: time
                            }
                            value = JSON.stringify(value)
                            let item = {value: value, label: time}
                            timeArray.push(item)
                        } else {
                            let time2 = `20${i}/${i + 1}`
                            let value = {
                                startTime: this.selectVari.StartTime,
                                endTime: this.selectVari.EndTime,
                                year: `20${i}-20${i + 1}`,
                                time: time2
                            }
                            value = JSON.stringify(value)
                            let item2 = {value: value, label: time2}
                            timeArray.push(item2)
                        }
                    }
                }
                return timeArray
            },
//            optionRanking: function () {
//                let data = []
//                this.requestData.year.forEach(function (item) {
//                    data.push({value: item, label: item})
//                })
//                data.sort(function (b, a) {
//                    return Number(b.label.substr(0, 4)) - Number(a.label.substr(0, 4))
//                })  return data
//            }
            optionChart: function () {
                return this.optionData
            },
            unit () {
                let TradeVariCode = this.$route.params.TradeVariCode
                if (TradeVariCode === 'Cotton') {
                    return 'STBL'
                } else {
                    return '公吨'
                }
            }
        },
        updated () {
            // 设置宽度
        },
        methods: {
            ...mapActions([
                'setlocationList',
                'setyearList'
            ]),
            limtLength () {
            },
            // 选择品种
            changeVari: function (name) {
                this.requestData.year = []
                this.requestData.month = []
                this.requestData.location = ''
                this.requestData.Alllocation = ''
                this.requestData.data = this.optionChart[0]
                this.chartOption.xAxis.data = []
                this.chartOption1.xAxis.data = []
                this.chartOption.series = []
                this.chartOption1.series = []
                this.chartOption.legend.data = []
                this.chartOption1.legend.data = []
                this.$router.push({name: 'CustomsExit', params: {TradeVariCode: name}})
                this.variCode = name
                var variArr = [this.TradeVari]
                for (var i = 0; i < variArr.length; i++) {
                    for (var j = 0; j < variArr[i].length; j++) {
                        if (variArr[i][j].VariCode === name) {
                            this.selectVari = variArr[i][j]
                        }
                    }
                }
            },
            getobj () {
                let _self = this
                if (this.requestData.data === '月度出口') {
                    if (this.requestData.month.length === 0) {
                        this.$Message.info('请选择年度')
                        return
                    }
                    if (this.requestData.location === '') {
                        this.$Message.info('请选择地区')
                        return
                    }
                    let StartTime = Number(this.selectVari.StartTime)
                    let EndTime = Number(this.selectVari.EndTime)
                    let arename = this.requestData.location
                    let legendData = []
                    let series = []
                    let seriesX = []
                    let timeData = this.requestData.month
                    // 时间排序
                    timeData.sort(function (a, b) {
                        return (Number(JSON.parse(a).year.slice(0, 4)) - Number(JSON.parse(b).year.slice(0, 4)))
                    })
                    let qUrls = []
                    timeData.forEach(function (item, key) {
                        let url = `${_self.$baseUrl.ImApiUrl}CustomsDataMonthReport?$filter=(Product eq '${_self.$route.params.TradeVariCode}' and AreaName eq '${arename}' and Year eq '${JSON.parse(item).year}')`
                        qUrls.push(o(url).get())
                        legendData.push(JSON.parse(item).year.replace('-', '/'))
                    })
                    Q.all(qUrls).then(function (oHandlerArray) {
                        legendData.forEach(function (item, key) {
                            let response = oHandlerArray[key].data[0]
                            if (response) {
                                let lineChartData = customMonthFilter(StartTime, EndTime, response)
                                lineChartData.forEach(function (item, key) {
                                    lineChartData[key][0] = lineChartData[key][0].toString()
                                })
                                let line = {
                                    name: legendData[key],
                                    type: 'line',
                                    showSymbol: true,
                                    hoverAnimation: false,
                                    smooth: true,
                                    symbolSize: 5,
                                    data: lineChartData
                                }
                                series.push(line)
                            } else {
                                let line = {
                                    name: item,
                                    type: 'line',
                                    showSymbol: true,
                                    hoverAnimation: false,
                                    smooth: true,
                                    symbolSize: 5,
                                    data: []
                                }
                                series.push(line)
                            }
                        })
                        for (let i = StartTime; i <= EndTime + 12; i++) {
                            seriesX.push(i.toString())
                        }
                        _self.chartOption.xAxis.data = seriesX
                        _self.chartOption.series = series
                        _self.chartOption.legend.data = legendData
                    })
                }
                if (this.requestData.data === '年度累计出口') {
                    if (this.requestData.year.length === 0) {
                        this.$Message.info('请选择年度')
                        return
                    }
                    if (this.requestData.Alllocation === '') {
                        this.$Message.info('请选择地区')
                        return
                    }
                    let StartTime = Number(this.selectVari.StartTime)
                    let EndTime = Number(this.selectVari.EndTime)
                    let arename = this.requestData.Alllocation
                    let legendData = []
                    let series = []
                    let seriesX = []
                    let timeData = this.requestData.year
                    // 时间排序
                    timeData.sort(function (a, b) {
                        return (Number(JSON.parse(a).year.slice(0, 4)) - Number(JSON.parse(b).year.slice(0, 4)))
                    })
                    let qUrls = []
                    timeData.forEach(function (item, key) {
                        let url = `${_self.$baseUrl.ImApiUrl}CustomsDataMonthReport?$filter=(Product eq '${_self.$route.params.TradeVariCode}' and AreaName eq '${arename}' and Year eq '${JSON.parse(item).year}')`
                        qUrls.push(o(url).get())
                        legendData.push(JSON.parse(item).year.replace('-', '/'))
                    })
                    Q.all(qUrls).then(function (oHandlerArray) {
                        legendData.forEach(function (item, key) {
                            let response = oHandlerArray[key].data[0]
                            if (response) {
                                let lineChartData = customYearFilter(StartTime, EndTime, response)
                                lineChartData.forEach(function (item, key) {
                                    lineChartData[key][0] = lineChartData[key][0].toString()
                                })
                                let lineData = 0
                                lineChartData.forEach(function (item, key) {
                                    let addData = lineChartData[key][1]
                                    if (lineChartData[key][1] === null || lineChartData[key][1] === undefined) {
                                        addData = 0
                                    }
                                    lineData = lineData + addData
                                    lineChartData[key][1] = lineData
                                })
                                let line = {
                                    name: legendData[key],
                                    type: 'line',
                                    showSymbol: true,
                                    hoverAnimation: false,
                                    smooth: true,
                                    symbolSize: 5,
                                    data: lineChartData
                                }
                                series.push(line)
                            } else {
                                let line = {
                                    name: item,
                                    type: 'line',
                                    showSymbol: true,
                                    hoverAnimation: false,
                                    smooth: true,
                                    symbolSize: 5,
                                    data: []
                                }
                                series.push(line)
                            }
                        })
                        for (let i = StartTime; i <= EndTime + 12; i++) {
                            seriesX.push(i.toString())
                        }
                        _self.chartOption1.xAxis.data = seriesX
                        _self.chartOption1.series = series
                        _self.chartOption1.legend.data = legendData
                    })
                }
            },
            exportObj () {
                let _self = this
                let TradeVariCode = _self.$route.params.TradeVariCode
                if (this.requestData.data === '月度出口') {
                    if (this.requestData.month.length === 0) {
                        this.$Message.info('请选择年度')
                        return
                    }
                    if (this.requestData.location === '') {
                        this.$Message.info('请选择地区')
                        return
                    }
                    let areaName = this.requestData.location
                    let url = `${_self.$baseUrl.ImApiUrl}CustomsDataMonthReport/Rcdc.ExportExecl?$filter=((Product eq '${TradeVariCode}'  and AreaName eq '${areaName}') and (`
                    let timeData = this.requestData.month
                    // 时间排序
                    timeData.sort(function (a, b) {
                        return (Number(JSON.parse(a).year.slice(0, 4)) - Number(JSON.parse(b).year.slice(0, 4)))
                    })
                    let length = timeData.length
                    timeData.forEach(function (areaItem, key) {
                        let allYear = JSON.parse(areaItem).year
                        if (length === 1 && key === 0) {
                            url = url + `Year eq '${allYear}'))`
                        } else if (length !== 1 && key === 0) {
                            url = url + `Year eq '${allYear}' or `
                        } else if (length > 1 && length === key + 1) {
                            url = url + `Year eq '${allYear}'))`
                        } else {
                            url = url + `Year eq '${allYear}' or `
                        }
                    })
                    let handler = function () {
                        if (this.readyState === this.DONE) {
                            if (this.status === 200) {
                                var link = document.createElement('a')
                                link.href = window.URL.createObjectURL(this.response)
                                link.download = '月度出口.xlsx'
                                link.click()
                            } else {
                                console.error('no pdf :(')
                            }
                        }
                    }
                    let xhr = new XMLHttpRequest()
                    xhr.open('post', url)
                    xhr.onreadystatechange = handler
                    xhr.responseType = 'blob'
                    xhr.setRequestHeader('Authorization', 'Bearer')
                    xhr.send()
                }
//                if (this.requestData.data === '年度累计出口') {
//                    if (this.requestData.year.length === 0) {
//                        this.$Message.info('请选择年度')
//                        return
//                    }
//                    if (this.requestData.Alllocation === '') {
//                        this.$Message.info('请选择地区')
//                        return
//                    }
//                    let areaName = this.requestData.Alllocation
//                    let url = `${_self.$baseUrl.ImApiUrl}CustomsDataCumulativeReport/Rcdc.ExportExecl?$filter=((Product eq '${TradeVariCode}'  and AreaName eq '${areaName}') and (`
//                    let timeData = this.requestData.year
//                    // 时间排序
//                    timeData.sort(function (a, b) {
//                        return (Number(JSON.parse(a).year.slice(0, 4)) - Number(JSON.parse(b).year.slice(0, 4)))
//                    })
//                    let length = timeData.length
//                    timeData.forEach(function (areaItem, key) {
//                        let allYear = JSON.parse(areaItem).year
//                        if (length === 1 && key === 0) {
//                            url = url + `Year eq '{allYear}'))`
//                        } else if (length !== 1 && key === 0) {
//                            url = url + `Year eq '${allYear}' or `
//                        } else if (length > 1 && length === key + 1) {
//                            url = url + `Year eq '${allYear}'))`
//                        } else {
//                            url = url + `Year eq '${allYear}' or `
//                        }
//                    })
//                    let handler = function () {
//                        if (this.readyState === this.DONE) {
//                            if (this.status === 200) {
//                                var link = document.createElement('a')
//                                link.href = window.URL.createObjectURL(this.response)
//                                link.download = '年度累计出口.xlsx'
//                                link.click()
//                            } else {
//                                console.error('no pdf :(')
//                            }
//                        }
//                    }
//                    let xhr = new XMLHttpRequest()
//                    xhr.open('post', url)
//                    xhr.onreadystatechange = handler
//                    xhr.responseType = 'blob'
//                    xhr.setRequestHeader('Authorization', 'Bearer')
//                    xhr.send()
//                }
                if (this.requestData.data === '年度累计出口') {
                    if (this.requestData.year.length === 0) {
                        this.$Message.info('请选择年度')
                        return
                    }
                    if (this.requestData.Alllocation === '') {
                        this.$Message.info('请选择地区')
                        return
                    }
                    let postData = []
                    let monthData = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January2', 'February2', 'March2', 'April2', 'May2', 'June2', 'July2', 'August2', 'September2', 'October2', 'November2', 'December2']
                    let StartTime = Number(this.selectVari.StartTime)
                    let EndTime = Number(this.selectVari.EndTime)
                    let arename = this.requestData.Alllocation
                    let timeData = this.requestData.year
                    // 时间排序
                    timeData.sort(function (a, b) {
                        return (Number(JSON.parse(a).year.slice(0, 4)) - Number(JSON.parse(b).year.slice(0, 4)))
                    })
                    let qUrls = []
                    timeData.forEach(function (item, key) {
                        let url = `${_self.$baseUrl.ImApiUrl}CustomsDataMonthReport?$filter=(Product eq '${_self.$route.params.TradeVariCode}' and AreaName eq '${arename}' and Year eq '${JSON.parse(item).year}')`
                        qUrls.push(o(url).get())
                    })
                    Q.all(qUrls).then(function (oHandlerArray) {
                        oHandlerArray.forEach(function (item, key) {
                            let response = oHandlerArray[key].data[0]
                            if (response) {
                                let obj = {}
                                // 数据统计处理
                                let lineChartData = customYearFilter(StartTime, EndTime, response)
                                lineChartData.forEach(function (item, key) {
                                    lineChartData[key][0] = lineChartData[key][0].toString()
                                })
                                let lineData = 0
                                lineChartData.forEach(function (item, key) {
                                    let addData = lineChartData[key][1]
                                    if (lineChartData[key][1] === null || lineChartData[key][1] === undefined) {
                                        addData = 0
                                    }
                                    lineData = lineData + addData
                                    lineChartData[key][1] = lineData
                                })
                                // 导出post数据处理
                                obj.Product = response.Product
                                obj.AreaName = response.AreaName
                                obj.Year = response.Year
                                lineChartData.forEach(function (item, key) {
                                    obj[monthData[item[0] - 1]] = item[1]
                                })
                                postData.push(obj)
                            }
                        })
                        // 导出数据
                        let url = `${_self.$baseUrl.ImApiUrl}CustomsDataMonthReport/Rcdc.ExportReport`
                        let handler = function () {
                            if (this.readyState === this.DONE) {
                                if (this.status === 200) {
                                    var link = document.createElement('a')
                                    link.href = window.URL.createObjectURL(this.response)
                                    link.download = '年度累计出口.xlsx'
                                    link.click()
                                } else {
                                    console.error('no pdf :(')
                                }
                            }
                        }
                        let xhr = new XMLHttpRequest()
                        xhr.open('post', url)
                        xhr.onreadystatechange = handler
                        xhr.responseType = 'blob'
                        xhr.setRequestHeader('Content-Type', 'application/json')
                        xhr.setRequestHeader('Authorization', 'Bearer')
                        xhr.send(JSON.stringify({List: JSON.stringify(postData)}))
                    })
                }
            }
        },
        components: {
        }
    }
</script>
<style scoped>
    .chart-head{
        margin-left: 40px;
        margin-top: 5px;
        font-size: 14px;
        font-weight: bold;
    }
    .chart {
        width: 100%;
        height: 450px;
    }
    .template{
        padding: 20px!important;
    }
    .exch-list .ivu-col-span-2{
        margin-left: 20px;
        padding-right: 10px;
        width: 10%!important;
    }
    .exch-list .ivu-menu-submenu-title-icon{
        display: block;
    }
    .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title{
        padding: 6px!important;
    }
    .content-wrap{
        flex-direction: row-reverse;
        margin-top: 20px;
        display: flex;
    }
    .margin-content-left{
        margin-left: 40px;
    }
    .content-wrap-left-item{
        display: inline-block;
        width: 200px;
    }
    .content-wrap-left-item-long{
        display: inline-block;
        width: 210px;
    }
    .content-wrap-left{
        width: 700px;
    }
    .content-wrap-right{
        flex: 1;
    }
    .request-content{
        padding: 10px 0;
    }
    .item-text{
        font-weight: bold;
        width: 80px;
        text-align: right;
        display: inline-block;
    }
    .item-text-short{
        font-weight: bold;
        width: 50px;
        text-align: right;
        display: inline-block;
    }
    .item-select{
        padding: 0 10px;
        display: inline-block;
    }
    .item-text-time{
        width: 100px;
        margin-top: 5px;
    }
    .content-margin-top{
        margin-top: 40px;
    }
    @media screen and (min-width:1280px) and (max-width:1400px){
        .content-wrap{
            margin-top: 20px;
            display: block;
        }
        .content-wrap-right{
            width: 100%;
            flex: none;
        }
        .content-wrap-left-short{
            width: 100%;
        }
        .content-wrap-left{
            margin-left: 20px;
        }
    }
</style>
