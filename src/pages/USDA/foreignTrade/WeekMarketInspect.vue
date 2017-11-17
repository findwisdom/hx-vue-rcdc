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
                    <h2>周度出口检验</h2>
                    </Col>
                    <Col span="2">
                    <!--<Button class="pull-right" title="刷新"> <Icon type="refresh"></Icon> </Button>-->
                    </Col>
                </Row>
            </div>
            <div class="content-wrap">
                <div class="content-wrap-right">
                    <div v-if="requestData.data === '周度出口'">
                        <div class="chart-head"><span>单位: 公吨</span><span style="margin-left: 50px">时间： 周</span></div>
                        <chart :options="chartOption" class="chart" auto-resize></chart>
                    </div>
                    <div v-if="requestData.data === '累计出口'">
                        <div class="chart-head"><span>单位: 公吨</span><span style="margin-left: 50px">时间： 周</span></div>
                        <chart :options="chartOption1" class="chart" auto-resize></chart>
                    </div>
                </div>
                <div class="content-wrap-left">
                    <div class="content-wrap-left-item">
                        <span class="item-text-short" style="vertical-align: top;margin-top: 5px">
                            年度:
                        </span>
                        <span class="item-select item-text-time">
                            <CheckboxGroup v-model="requestData.year" v-if="requestData.data === '周度出口'">
                                <template v-for="item in optionTime">
                                    <Checkbox :label="item.value" :disabled="(requestData.year.length === 5 && !requestData.year.some((key) => item.value === key))">
                                    <span>{{item.label}}</span>
                                    </Checkbox>
                                </template>
                            </CheckboxGroup>
                            <CheckboxGroup v-model="requestData.Allyear" v-if="requestData.data === '累计出口'">
                                <template v-for="item in optionTime">
                                    <Checkbox :label="item.value" :disabled="(requestData.Allyear.length === 5 && !requestData.Allyear.some((key) => item.value === key))">
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
                            <RadioGroup v-model="requestData.location" vertical v-if="requestData.data === '周度出口'">
                                <template v-for="item in getLocationList">
                                    <Radio :label="item">
                                    <span>{{item}}</span>
                                </Radio>
                                </template>
                            </RadioGroup>
                            <RadioGroup v-model="requestData.Alllocation" vertical v-if="requestData.data === '累计出口'">
                                <template v-for="item in getLocationList">
                                    <Radio :label="item">
                                    <span>{{item}}</span>
                                </Radio>
                                </template>
                            </RadioGroup>
                        </span>
                    </div>
                    <div class="content-wrap-left-item" style="vertical-align:top">
                        <div>
                            <span class="item-text" style="vertical-align: top;margin-top: 5px">
                            数据:
                            </span>
                            <span class="item-select">
                            <RadioGroup v-model="requestData.data" vertical>
                                <template v-for="item in optionData">
                                    <Radio :label="item">
                                    <span>{{item}}</span>
                                </Radio>
                                </template>
                            </RadioGroup>
                        </span>
                        </div>
                    </div>
                    <div style="margin-top: 40px;margin-left: 70px">
                        <Button type="primary" @click="getobj">生成图表</Button>
                        <Button type="ghost" @click="exportObj">导出</Button>
                    </div>
                </div>
                <!--<div class="content-wrap-right">-->
                    <!--<chart v-show="requestData.data === '周度出口'" :options="chartOption" class="chart" auto-resize></chart>-->
                    <!--<chart v-show="requestData.data === '累计出口'" :options="chartOption1" class="chart" auto-resize></chart>-->
                <!--</div>-->
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
    const ENDTIME = 17
    import { InspectVari } from './../../../config/apiConfig.js'
    import {mapActions, mapGetters} from 'vuex'
    import Q from 'q'
    import o from 'o.js'
    export default {
        data () {
            return {
                optionData: [
                    '周度出口',
                    '累计出口'
                ],
                accordion: true,
                openNames: [],
                selectVari: null,
                variCode: '',
                filterVariCode: '',
                TradeVari: [],
                requestData: {
                    year: [],
                    location: '',
                    Allyear: [],
                    Alllocation: '',
                    data: '周度出口',
                    label: 'line'
                },
                chartOption: {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
//                            lineStyle: {
//                                color: 'rgba(0,0,0,0)'
//                            }
                        },
                        formatter: function (name) {
                            let data = `第${name[0].data.value[0]}周` + `<br/>`
                            name.forEach(function (item) {
                                data = data + `${item.seriesName}: ${item.data.value[1]}` + `<br/>`
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
                        boundaryGap: false,
                        zlevel: 100000,
                        data: [],
                        min: 1
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
//                            lineStyle: {
//                                color: 'rgba(0,0,0,0)'
//                            }
                        },
                        formatter: function (name) {
                            let data = `第${name[0].data.name}周` + `<br/>`
                            name.forEach(function (item) {
                                data = data + `${item.seriesName}: ${item.data.value[1]}` + `<br/>`
                            })
                            return data
                        }
                    },
                    title: {
                        text: ''
                    },
                    backgroundColor: '#ffffff',
                    legend: {
                        data: ['bar2']
                    },
                    xAxis: {
                        type: 'category',
                        axisLine: {
                            lineStyle: { color: '#000' }
                        },
                        boundaryGap: false,
                        data: [],
                        min: 1
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
                    series: [
                    ]
                }
            }
        },
        mounted: function () {
            this.setyearList()
            this.setlocationList()
            this.TradeVari = InspectVari
            var variCode = this.$route.params.TradeVariCode
            this.variCode = variCode
            if (variCode) {
                this.variCode = variCode
                this.$router.push({name: 'WeekMarketInspect', params: {TradeVariCode: this.variCode}})
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
                'getLocationList'
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
                    for (let i = 0; i < ENDTIME; i++) {
                        if (i < 9) {
                            let time = `200${i}/0${i + 1}`
                            let value = {
                                startTime: `200${i}-${this.selectVari.StartTime}T00:00:00Z`,
                                endTime: `200${i + 1}-${this.selectVari.EndTime}T00:00:00Z`,
                                year: `200${i}/200${i + 1}`,
                                time: time
                            }
                            value = JSON.stringify(value)
                            let item = {value: value, label: time}
                            timeArray.push(item)
                        } else if (i === 9) {
                            let time = `200${i}/${i + 1}`
                            let value = {
                                startTime: `200${i}-${this.selectVari.StartTime}T00:00:00Z`,
                                endTime: `20${i + 1}-${this.selectVari.EndTime}T00:00:00Z`,
                                year: `200${i}/20${i + 1}`,
                                time: time
                            }
                            value = JSON.stringify(value)
                            let item = {value: value, label: time}
                            timeArray.push(item)
                        } else {
                            let time2 = `20${i}/${i + 1}`
                            let value = {
                                startTime: `20${i}-${this.selectVari.StartTime}T00:00:00Z`,
                                endTime: `20${i + 1}-${this.selectVari.EndTime}T00:00:00Z`,
                                year: `20${i}/20${i + 1}`,
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
            optionRanking: function () {
                let data = []
                this.requestData.year.forEach(function (item) {
                    data.push({value: item, label: item})
                })
                data.sort(function (b, a) {
                    return Number(b.label.substr(0, 4)) - Number(a.label.substr(0, 4))
                })
                return data
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
                this.requestData.Allyear = []
                this.requestData.location = ''
                this.requestData.Alllocation = []
                this.requestData.data = '周度出口'
                this.chartOption.xAxis.data = []
                this.chartOption1.xAxis.data = []
                this.chartOption.series = []
                this.chartOption1.series = []
                this.chartOption.legend.data = []
                this.chartOption1.legend.data = []
                this.$router.push({name: 'WeekMarketInspect', params: {TradeVariCode: name}})
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
                let xseries = []
                for (let i = 0; i < 54; i++) {
                    xseries.push(i.toString())
                }
                if (this.requestData.data === '周度出口') {
                    if (this.requestData.year.length === 0) {
                        this.$Message.info('请选择年度')
                        return
                    }
                    if (this.requestData.location === '') {
                        this.$Message.info('请选择地区')
                        return
                    }
                    this.chartOption.legend.data = []
                    let arename = this.requestData.location
                    let legendData = []
                    let timedta = this.requestData.year
                    let qUrls = []
                    timedta.forEach(function (item, key) {
                        let url = `${_self.$baseUrl.ImApiUrl}InspectionDataWeekReport?$filter=((Grain eq '${_self.$route.params.TradeVariCode}') and (AreaName eq '${arename}') and (Year eq '${JSON.parse(item).year}'))&$orderby=Week asc`
                        qUrls.push(o(url).get())
                        legendData.push(JSON.parse(item).time)
                    })
                    let series = []
                    Q.all(qUrls).then(function (oHandlerArray) {
                        legendData.forEach(function (item, key) {
                            let totalData = oHandlerArray[key].data
                            let seriesData = []
                            totalData.forEach(function (seriesItem) {
                                let dataItem = {}
                                dataItem.name = seriesItem.Week
                                dataItem.value = [seriesItem.Week, seriesItem.TotalMetricTon]
                                seriesData.push(dataItem)
                            })
                            let line = {
                                name: item,
                                type: 'line',
                                showSymbol: true,
                                hoverAnimation: false,
                                smooth: true,
                                symbolSize: 5,
                                data: seriesData
                            }
                            series.push(line)
                        })
                        let allurl = `${_self.$baseUrl.ImApiUrl}InspectionDataCountReport?$filter=((Grain eq '${_self.$route.params.TradeVariCode}') and (AreaName eq '${arename}') and (Type eq 'Week'))`
                        o(allurl).get().then(function (allresponse) {
                            let allresponseData = allresponse.data
                            let maxData = []
                            let minData = []
                            let AverageData = []
                            allresponseData.forEach(function (item) {
                                let Average = {}
                                let max = {}
                                let min = {}
                                Average.name = item.Week
                                Average.value = [item.Week, item.AverageMetricTon]
                                max.name = item.Week
                                max.value = [item.Week, item.MaxMetricTon]
                                min.name = item.Week
                                min.value = [item.Week, item.MinMetricTon]
                                minData.push(min)
                                maxData.push(max)
                                AverageData.push(Average)
                            })
                            let maxline = {
                                name: '最大值',
                                type: 'line',
                                showSymbol: true,
                                hoverAnimation: false,
                                smooth: true,
                                symbol: 'none',
                                itemStyle: {
                                    normal: {
                                        opacity: 0.1
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        width: 1,
                                        color: '#000',
                                        opacity: 0.5
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        color: '#a0a0a0',
                                        opacity: 0.1
                                    }
                                },
                                data: maxData
                            }
                            let minline = {
                                name: '最小值',
                                type: 'line',
                                showSymbol: false,
                                hoverAnimation: false,
                                smooth: true,
                                symbol: 'none',
                                sampling: 'average',
                                lineStyle: {
                                    normal: {
                                        color: '#000',
                                        width: 1,
                                        opacity: 0.5
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#ffffff'
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        color: '#ffffff',
                                        opacity: 1
                                    }
                                },
                                data: minData
                            }
                            let Averageline = {
                                name: '平均值',
                                type: 'line',
                                showSymbol: false,
                                hoverAnimation: false,
                                smooth: true,
                                symbol: 'none',
                                sampling: 'average',
                                itemStyle: {
                                    normal: {
                                        color: '#000'
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        width: 1
                                    }
                                },
                                data: AverageData
                            }
                            series.push(maxline)
                            series.push(Averageline)
                            series.push(minline)
                            console.log(series)
                            legendData.push('平均值')
                            _self.chartOption.legend.data = legendData
                            _self.chartOption.series = series
                            _self.chartOption.xAxis.data = xseries
                        })
                    })
                }
                if (this.requestData.data === '累计出口') {
                    if (this.requestData.Allyear.length === 0) {
                        this.$Message.info('请选择年度')
                        return
                    }
                    if (this.requestData.Alllocation === '') {
                        this.$Message.info('请选择地区')
                        return
                    }
                    this.chartOption.legend.data = []
                    let arename = this.requestData.Alllocation
                    let legendData = []
                    let timedta = this.requestData.Allyear
                    let qUrls = []
                    timedta.forEach(function (item, key) {
                        let url = `${_self.$baseUrl.ImApiUrl}InspectionDataCumulativeReport?$filter=((Grain eq '${_self.$route.params.TradeVariCode}') and (AreaName eq '${arename}') and (Year eq '${JSON.parse(item).year}'))&$orderby=Week asc`
                        qUrls.push(o(url).get())
                        legendData.push(JSON.parse(item).time)
                    })
                    let series = []
                    Q.all(qUrls).then(function (oHandlerArray) {
                        legendData.forEach(function (item, key) {
                            let totalData = oHandlerArray[key].data
                            let seriesData = []
                            totalData.forEach(function (seriesItem) {
                                let dataItem = {}
                                dataItem.name = seriesItem.Week
                                dataItem.value = [seriesItem.Week, seriesItem.TotalMetricTon]
                                seriesData.push(dataItem)
                            })
                            let line = {
                                name: item,
                                type: 'line',
                                showSymbol: true,
                                hoverAnimation: false,
                                smooth: true,
                                symbolSize: 5,
                                data: seriesData
                            }
                            series.push(line)
                        })
                        let allurl = `${_self.$baseUrl.ImApiUrl}InspectionDataCountReport?$filter=((Grain eq '${_self.$route.params.TradeVariCode}') and (AreaName eq '${arename}') and (Type eq 'Sum'))`
                        o(allurl).get().then(function (allresponse) {
                            let allresponseData = allresponse.data
                            let maxData = []
                            let minData = []
                            let AverageData = []
                            allresponseData.forEach(function (item) {
                                let Average = {}
                                let max = {}
                                let min = {}
                                Average.name = item.Week
                                Average.value = [item.Week, item.AverageMetricTon]
                                max.name = item.Week
                                max.value = [item.Week, item.MaxMetricTon]
                                min.name = item.Week
                                min.value = [item.Week, item.MinMetricTon]
                                minData.push(min)
                                maxData.push(max)
                                AverageData.push(Average)
                            })
                            let maxline = {
                                name: '最大值',
                                type: 'line',
                                showSymbol: false,
                                hoverAnimation: false,
                                smooth: true,
                                symbol: 'none',
                                sampling: 'average',
                                itemStyle: {
                                    normal: {
                                        opacity: 0.1
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        width: 1,
                                        color: '#000',
                                        opacity: 0.5
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        color: '#a0a0a0',
                                        opacity: 0.1
                                    }
                                },
                                data: maxData
                            }
                            let minline = {
                                name: '最小值',
                                type: 'line',
                                showSymbol: false,
                                hoverAnimation: false,
                                smooth: true,
                                symbol: 'none',
                                sampling: 'average',
                                lineStyle: {
                                    normal: {
                                        color: '#000',
                                        width: 1,
                                        opacity: 0.5
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#ffffff'
                                    }
                                },
                                areaStyle: {
                                    normal: {
                                        color: '#ffffff',
                                        opacity: 1
                                    }
                                },
                                data: minData
                            }
                            let Averageline = {
                                name: '平均值',
                                type: 'line',
                                showSymbol: false,
                                hoverAnimation: false,
                                smooth: true,
                                symbol: 'none',
                                sampling: 'average',
                                itemStyle: {
                                    normal: {
                                        color: '#000'
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        width: 1
                                    }
                                },
                                data: AverageData
                            }
                            legendData.push('平均值')
                            series.push(maxline)
                            series.push(Averageline)
                            series.push(minline)
                            _self.chartOption1.xAxis.data = xseries
                            _self.chartOption1.legend.data = legendData
                            _self.chartOption1.series = series
                        })
                    })
                }
            },
            exportObj () {
                let _self = this
                let TradeVariCode = _self.$route.params.TradeVariCode
                if (this.requestData.data === '周度出口') {
                    if (this.requestData.year.length === 0) {
                        this.$Message.info('请选择年度')
                        return
                    }
                    if (this.requestData.location === '') {
                        this.$Message.info('请选择地区')
                        return
                    }
                    let areaName = this.requestData.location
                    let url = `${_self.$baseUrl.ImApiUrl}InspectionDataWeekReport/Rcdc.ExportExecl?`
                    let length = _self.requestData.year.length
                    _self.requestData.year.forEach(function (areaItem, key) {
                        let allYear = JSON.parse(areaItem).year
                        if (length === 1 && key === 0) {
                            url = url + `$filter=(Grain eq '${TradeVariCode}' and Year eq '${allYear}' and AreaName eq '${areaName}')`
                        } else if (length !== 1 && key === 0) {
                            url = url + `$filter=((Grain eq '${TradeVariCode}' and Year eq '${allYear}' and AreaName eq '${areaName}')`
                        } else if (length > 1 && length === key + 1) {
                            url = url + ` or (Grain eq '${TradeVariCode}' and Year eq '${allYear}' and AreaName eq '${areaName}'))`
                        } else {
                            url = url + ` or (Grain eq '${TradeVariCode}' and Year eq '${allYear}' and AreaName eq '${areaName}')`
                        }
                    })
                    let handler = function () {
                        if (this.readyState === this.DONE) {
                            if (this.status === 200) {
                                var link = document.createElement('a')
                                link.href = window.URL.createObjectURL(this.response)
                                link.download = '周度出口检验.xlsx'
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
                if (this.requestData.data === '累计出口') {
                    if (this.requestData.Allyear.length === 0) {
                        this.$Message.info('请选择年度')
                        return
                    }
                    if (this.requestData.Alllocation === '') {
                        this.$Message.info('请选择地区')
                        return
                    }
                    let areaName = this.requestData.Alllocation
                    let url = `${_self.$baseUrl.ImApiUrl}InspectionDataCumulativeReport/Rcdc.ExportExecl?`
                    let length = _self.requestData.Allyear.length
                    _self.requestData.Allyear.forEach(function (areaItem, key) {
                        let allYear = JSON.parse(areaItem).year
                        if (length === 1 && key === 0) {
                            url = url + `$filter=(Grain eq '${TradeVariCode}' and Year eq '${allYear}' and AreaName eq '${areaName}')`
                        } else if (length !== 1 && key === 0) {
                            url = url + `$filter=((Grain eq '${TradeVariCode}' and Year eq '${allYear}' and AreaName eq '${areaName}')`
                        } else if (length > 1 && length === key + 1) {
                            url = url + ` or (Grain eq '${TradeVariCode}' and Year eq '${allYear}' and AreaName eq '${areaName}'))`
                        } else {
                            url = url + ` or (Grain eq '${TradeVariCode}' and Year eq '${allYear}' and AreaName eq '${areaName}')`
                        }
                    })
                    let handler = function () {
                        if (this.readyState === this.DONE) {
                            if (this.status === 200) {
                                var link = document.createElement('a')
                                link.href = window.URL.createObjectURL(this.response)
                                link.download = '累计出口检验.xlsx'
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
    .content-wrap-left{
        width: 640px;
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
