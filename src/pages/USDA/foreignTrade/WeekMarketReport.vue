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
                    <h2>周度出口销售报告</h2>
                    </Col>
                    <!--<Col span="2">-->
                    <!--<Button class="pull-right" title="刷新"> <Icon type="refresh"></Icon> </Button>-->
                    <!--</Col>-->
                </Row>
            </div>
            <div class="content-wrap">
                <div class="content-wrap-right">
                    <div v-if="requestData.data === '报告数据'">
                        <div class="chart-head"><span>单位: 千吨</span><span style="margin-left: 50px">时间： 周</span></div>
                        <chart :options="chartOption" class="chart" auto-resize></chart>
                    </div>
                    <div v-if="requestData.data === '本周排名'">
                        <div class="chart-head"><span>单位: 千吨</span></div>
                        <chart :options="chartOption1" class="chart" auto-resize></chart>
                    </div>
                    <div v-if="requestData.data === '年度排名'">
                        <div class="chart-head"><span>单位: 千吨</span></div>
                        <chart v-show="requestData.data === '年度排名'" :options="chartOption2" class="chart1" auto-resize></chart>
                    </div>
                </div>
                <div class="content-wrap-left">
                    <div class="content-wrap-left-item" v-if="requestData.data === '报告数据' || requestData.data === '年度排名'">
                        <span class="item-text-short" style="vertical-align: top;margin-top: 5px">
                            年度:
                        </span>
                        <span class="item-select item-text-time">
                            <CheckboxGroup v-model="requestData.year"  v-if="requestData.data === '报告数据'">
                                <template v-for="item in optionTime">
                                    <Checkbox :label="item.value" :disabled="(requestData.year.length === 5 && !requestData.year.some((key) => item.value === key))">
                                    <span>{{item.label}}</span>
                                    </Checkbox>
                                </template>
                            </CheckboxGroup>
                            <CheckboxGroup v-model="requestData.yearRanking" @on-change="yearRankinglimtLength" v-if="requestData.data === '年度排名'">
                                <template v-for="item in optionTime">
                                    <Checkbox :label="item.value" :disabled="(requestData.yearRanking.length === 5 && !requestData.yearRanking.some((key) => item.value === key))">
                                    <span>{{item.label}}</span>
                                    </Checkbox>
                                </template>
                            </CheckboxGroup>
                        </span>
                    </div>
                    <div class="content-wrap-left-item" v-if="requestData.data === '本周排名'">
                        <span class="item-text-short" style="vertical-align: top;margin-top: 5px">
                            时间:
                        </span>
                        <span class="item-select item-text-time">
                            {{weekday}}
                        </span>
                    </div>
                    <div class="content-wrap-left-item" style="vertical-align:top" v-if="requestData.data === '报告数据'">
                        <span class="item-text-short" style="vertical-align: top;margin-top: 5px">
                            地区:
                        </span>
                        <span class="item-select">
                            <RadioGroup v-model="requestData.location" vertical>
                                <template v-for="item in getLocationList">
                                    <Radio :label="item">
                                    <span>{{item}}</span>
                                </Radio>
                                </template>
                            </RadioGroup>
                        </span>
                        <!--<span class="item-select" v-else>-->
                            <!--<RadioGroup v-model="requestData.location" vertical>-->
                                <!--<template v-for="item in locationList">-->
                                    <!--<Radio :label="item" disabled>-->
                                    <!--<span>{{item}}</span>-->
                                <!--</Radio>-->
                                <!--</template>-->
                            <!--</RadioGroup>-->
                        <!--</span>-->
                    </div>
                    <div class="content-wrap-left-item" style="vertical-align:top">
                        <div>
                            <span class="item-text" style="vertical-align: top;margin-top: 5px">
                            数据:
                            </span>
                            <span class="item-select">
                            <RadioGroup v-model="requestData.data" vertical @on-change="changeData">
                                <template v-for="item in optionData">
                                    <Radio :label="item">
                                    <span>{{item}}</span>
                                </Radio>
                                </template>
                            </RadioGroup>
                        </span>
                        </div>
                        <div v-if="requestData.yearRanking.length !==0 && requestData.data === '年度排名'" style="margin-top: 50px">
                            <span class="item-text">
                                        排名年份:
                                    </span>
                            <span class="item-select">
                                <Select v-model="requestData.yearRankingData" style="width:80px" size="small">
                                    <Option v-for="item in optionRanking" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </span>
                        </div>
                    </div>
                    <div style="margin-top: 40px;margin-left: 70px">
                        <Button type="primary" @click="getobj">生成图表</Button>
                        <Button type="ghost" @click="exportObj">导出</Button>
                    </div>
                </div>
                <!--<div class="content-wrap-right">-->
                    <!--<div v-if="requestData.data === '报告数据'">-->
                        <!--<div class="chart-head"><span>单位: 千吨</span><span>时间： 周</span></div>-->
                        <!--<chart :options="chartOption" class="chart" auto-resize></chart>-->
                    <!--</div>-->
                    <!--<div v-if="requestData.data === '本周排名'">-->
                        <!--<div class="chart-head"><span>单位: 千吨</span></div>-->
                        <!--<chart :options="chartOption1" class="chart" auto-resize></chart>-->
                    <!--</div>-->
                    <!--<div v-if="requestData.data === '年度排名'">-->
                        <!--<div class="chart-head"><span>单位: 千吨</span></div>-->
                        <!--<chart v-show="requestData.data === '年度排名'" :options="chartOption2" class="chart1" auto-resize></chart>-->
                    <!--</div>-->
                <!--</div>-->
            </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    function randomData () {
        now = new Date(+now + oneDay)
        value = value + Math.random() * 21 - 10
        return {
            name: now.toString(),
            value: [
                [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                Math.round(value)
            ]
        }
    }
    var data = []
    var now = +new Date(1997, 9, 3)
    var oneDay = 24 * 3600 * 1000
    var value = Math.random() * 1000
    for (var i = 0; i < 10; i++) {
        data.push(randomData())
    }
    // import * as exchDict from './../../config/ExchData/exchDict.js'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/scatter'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/legend'
    import {mapActions, mapGetters} from 'vuex'
    const ENDTIME = 17
    import { TradeVari } from './../../../config/apiConfig.js'
    import Q from 'q'
    import o from 'o.js'
    import format from 'polymer-filters-format'
    export default {
        data () {
            return {
                UIState: {
                    time: true,
                    location: true
                },
                weekday: '',
                locationList: [
                    '大洋',
                    '中美加勒比海',
                    '欧盟',
                    '北美',
                    '南美',
                    '非洲',
                    '东亚',
                    '中东',
                    '东南亚',
                    '南亚',
                    '欧洲其他',
                    '前苏联',
                    '中国',
                    '全球'
                ],
                optionData: [
                    '报告数据',
                    '本周排名',
                    '年度排名'
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
                    data: '报告数据',
                    yearRanking: [],
                    yearRankingData: ''
                },
                chartOption: {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            lineStyle: {
                                color: 'rgba(0,0,0,0)'
                            }
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
                        data: []
                    },
                    xAxis: {
                        type: 'category',
//                        splitLine: {
//                            show: false
//                        }
                        data: []
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
                },
                chartOption1: {
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: []
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: []
                    },
                    series: [
                        {
                            name: '2011年',
                            type: 'bar',
                            data: []
                        }
                    ]
                },
                chartOption2: {
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: []
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: []
                    },
                    series: [
                    ]
                }
            }
        },
        mounted: function () {
            this.setlocationList()
            this.TradeVari = TradeVari
            var variCode = this.$route.params.TradeVariCode
            this.variCode = variCode
            if (variCode) {
                this.variCode = variCode
                this.$router.push({name: 'WeekMarketReport', params: {TradeVariCode: this.variCode}})
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
            getLocationList (val) {
            }
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
                this.requestData.yearRanking.forEach(function (item) {
                    data.push({value: item, label: JSON.parse(item).time})
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
                'setlocationList'
            ]),
            changeData () {
                if (document.createEvent) {
                    console.log(document.createEvent)
                    let event = document.createEvent('HTMLEvents')
                    event.initEvent('resize', true, true)
                    window.dispatchEvent(event)
                } else if (document.createEventObject) {
                    window.fireEvent('onresize')
                }
            },
            yearRankinglimtLength (val) {
            },
            // 选择品种
            dataInit () {
                this.weekday = ''
                this.requestData.year = []
                this.requestData.yearRanking = []
                this.requestData.location = ''
                this.requestData.data = '报告数据'
                this.chartOption.xAxis.data = []
                this.chartOption.series = []
                this.chartOption.legend.data = []
                this.chartOption1.yAxis.data = []
                this.chartOption1.series = []
                this.chartOption1.legend.data = []
                this.chartOption2.yAxis.data = []
                this.chartOption2.series = []
                this.chartOption2.legend.data = []
            },
            changeVari: function (name) {
                this.$router.push({name: 'WeekMarketReport', params: {TradeVariCode: name}})
                this.variCode = name
                var variArr = [this.TradeVari]
                for (var i = 0; i < variArr.length; i++) {
                    for (var j = 0; j < variArr[i].length; j++) {
                        if (variArr[i][j].VariCode === name) {
                            this.selectVari = variArr[i][j]
                        }
                    }
                }
                // 数据重置
                this.dataInit()
            },
            getobj () {
                let _self = this
                let xseries = []
                for (let i = 0; i < 75; i++) {
                    xseries.push(i.toString())
                }
                if (this.requestData.data === '报告数据') {
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
                        let url = `${_self.$baseUrl.ImApiUrl}SalesDataWeekReport?$filter=((Commodity eq '${_self.$route.params.TradeVariCode}') and (AreaName eq '${arename}') and (Year eq '${JSON.parse(item).year}'))&$orderby=Week asc`
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
                                dataItem.name = seriesItem.Week.toString()
                                dataItem.value = [seriesItem.Week, Math.round(Number(seriesItem.TotalCommi) / 1000)]
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
                        let allurl = `${_self.$baseUrl.ImApiUrl}SalesDataCountReport?$filter=(Commodity eq '${_self.$route.params.TradeVariCode}') and (AreaName eq '${arename}')`
                        o(allurl).get().then(function (allresponse) {
                            console.log(allresponseData)
                            let allresponseData = allresponse.data
                            let maxData = []
                            let minData = []
                            let AverageData = []
                            allresponseData.forEach(function (item) {
                                let Average = {}
                                let max = {}
                                let min = {}
                                Average.name = item.Week.toString()
                                Average.value = [item.Week, Math.round(Number(item.AverageTotalCommi) / 1000)]
                                max.name = item.Week.toString()
                                max.value = [item.Week, Math.round(Number(item.MaxTotalCommi) / 1000)]
                                min.name = item.Week.toString()
                                min.value = [item.Week, Math.round(Number(item.MinTotalCommi) / 1000)]
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
                            series.push(maxline)
                            series.push(minline)
                            series.push(Averageline)
                            legendData.push('平均值')
                            _self.chartOption.legend.data = legendData
                            _self.chartOption.series = series
                            _self.chartOption.xAxis.data = xseries
                        })
                    })
                }
                if (this.requestData.data === '本周排名') {
                    let TradeVariCode = _self.$route.params.TradeVariCode
                    if (TradeVariCode === 'Soybean cake & meal') {
                        TradeVariCode = 'Soybean cake %26 meal'
                    }
                    let weekDataUrl = `${_self.$baseUrl.ImApiUrl}SalesDataLastWeekReport?$filter=(Commodity eq '${TradeVariCode}')&$top=10&$orderby=Date desc`
                    o(weekDataUrl).get().then(function (res) {
                        if (res.data.length === 0) {
                            _self.weekday = '暂无数据'
                            return
                        }
                        let resDate = new Date(res.data[0].Date)
                        _self.weekday = format.date(resDate, 'yyyy-MM-dd')
                        let odataYear = resDate.getFullYear()
                        let odatamonth = resDate.getMonth() + 1
                        let odataday = resDate.getDate()
                        if (odatamonth < 10) {
                            odatamonth = '0' + odatamonth
                        }
                        if (odataday < 10) {
                            odataday = '0' + odataday
                        }
                        let DateUrl = `${_self.$baseUrl.ImApiUrl}SalesDataLastWeekReport?$filter=(Commodity eq '${TradeVariCode}' and year(Date) eq ${odataYear} and month(Date) eq ${odatamonth} and day(Date) eq ${odataday})&$top=10&$orderby=TotalCommi desc`
                        return (o(DateUrl).get())
                    })
                        .then(function (response) {
                            let data = response.data
                            console.log(data)
                            let yData1 = []
                            let seriesData1 = []
                            let series1 = []
                            data.forEach(function (item) {
                                yData1.unshift(item.Country)
                                seriesData1.unshift(Math.round(Number(item.TotalCommi) / 1000))
                            })
                            let bar1 = {
                                name: '',
                                type: 'bar',
                                showSymbol: false,
                                hoverAnimation: false,
                                data: seriesData1
                            }
                            series1.push(bar1)
                            _self.chartOption1.series = series1
                            _self.chartOption1.yAxis.data = yData1
                        })
                }
                if (this.requestData.data === '年度排名') {
                    if (this.requestData.yearRanking.length === 0) {
                        this.$Message.info('请选择年度')
                        return
                    }
                    if (this.requestData.yearRankingData === '') {
                        this.$Message.info('请选择排名年度')
                        return
                    }
                    let rankworldurl = `${_self.$baseUrl.ImApiUrl}SalesDataYearReport/Rcdc.GetSalesDataYearReportList`
                    let legend = []
                    let wroldUrl = []
                    this.requestData.yearRanking.forEach(function (item) {
                        legend.push(JSON.parse(item).time)
                        let postData = {
                            Commodity: _self.$route.params.TradeVariCode,
                            Year: JSON.parse(_self.requestData.yearRankingData).year,
                            Years: JSON.parse(item).year
                        }
                        console.log(postData)
                        wroldUrl.push(o(rankworldurl).post(postData).save())
                    })
                    Q.all(wroldUrl).then(function (handresponse) {
                        console.log(handresponse)
                        let seriesData = []
                        let xData = []
                        handresponse[0].data.forEach(function (item) {
                            xData.push(item.Country)
                        })
                        legend.forEach(function (item, key) {
                            let serizes = []
                            xData.forEach(function (countryItem) {
                                let isData = handresponse[key].data.some(function (item) {
                                    return item.Country === countryItem
                                })
                                if (isData) {
                                    handresponse[key].data.forEach(function (seriesDataItem) {
                                        if (countryItem === seriesDataItem.Country) {
                                            serizes.unshift(Math.round(Number(seriesDataItem.TotalCommi) / 1000))
                                        }
                                    })
                                } else {
                                    serizes.unshift(0)
                                }
                            })
                            let line = {
                                name: item,
                                type: 'bar',
                                showSymbol: false,
                                hoverAnimation: false,
                                data: serizes
                            }
                            seriesData.push(line)
                        })
                        _self.chartOption2.series = seriesData
                        _self.chartOption2.yAxis.data = xData
                        _self.chartOption2.legend.data = legend
                    })
                }
            },
            exportObj () {
                let _self = this
                let TradeVariCode = _self.$route.params.TradeVariCode
                if (this.requestData.data === '报告数据') {
                    if (this.requestData.year.length === 0) {
                        this.$Message.info('请选择年度')
                        return
                    }
                    if (this.requestData.location === '') {
                        this.$Message.info('请选择地区')
                        return
                    }
                    let areaName = this.requestData.location
                    let url = `${_self.$baseUrl.ImApiUrl}SalesDataWeekReport/Rcdc.ExportExecl?`
                    let length = _self.requestData.year.length
                    _self.requestData.year.forEach(function (areaItem, key) {
                        let allYear = JSON.parse(areaItem).year
                        if (length === 1 && key === 0) {
                            url = url + `$filter=(Commodity eq '${TradeVariCode}' and Year eq '${allYear}' and AreaName eq '${areaName}')`
                        } else if (length !== 1 && key === 0) {
                            url = url + `$filter=((Commodity eq '${TradeVariCode}' and Year eq '${allYear}' and AreaName eq '${areaName}')`
                        } else if (length > 1 && length === key + 1) {
                            url = url + ` or (Commodity eq '${TradeVariCode}' and Year eq '${allYear}' and AreaName eq '${areaName}'))`
                        } else {
                            url = url + ` or (Commodity eq '${TradeVariCode}' and Year eq '${allYear}' and AreaName eq '${areaName}')`
                        }
                    })
                    let handler = function () {
                        if (this.readyState === this.DONE) {
                            if (this.status === 200) {
                                var link = document.createElement('a')
                                link.href = window.URL.createObjectURL(this.response)
                                link.download = '周度销售报告数据.xlsx'
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
                if (this.requestData.data === '本周排名') {
                    let weekDataUrl = `${_self.$baseUrl.ImApiUrl}SalesDataLastWeekReport?$filter=(Commodity eq '${_self.$route.params.TradeVariCode}')&$top=10&$orderby=Date desc`
                    o(weekDataUrl).get().then(function (res) {
                        let resDate = new Date(res.data[0].Date)
                        let odataYear = resDate.getFullYear()
                        let odatamonth = resDate.getMonth() + 1
                        let odataday = resDate.getDate()
                        if (odatamonth < 10) {
                            odatamonth = '0' + odatamonth
                        }
                        if (odataday < 10) {
                            odataday = '0' + odataday
                        }
                        let DateUrl = `${_self.$baseUrl.ImApiUrl}SalesDataLastWeekReport/Rcdc.ExportExecl?$filter=(Commodity eq '${_self.$route.params.TradeVariCode}' and year(Date) eq ${odataYear} and month(Date) eq ${odatamonth} and day(Date) eq ${odataday})&$top=10&$orderby=TotalCommi desc`
                        let handler1 = function () {
                            if (this.readyState === this.DONE) {
                                if (this.status === 200) {
                                    var link = document.createElement('a')
                                    link.href = window.URL.createObjectURL(this.response)
                                    link.download = '本周销售排名.xlsx'
                                    link.click()
                                } else {
                                    console.error('no pdf :(')
                                }
                            }
                        }
                        let xhr = new XMLHttpRequest()
                        xhr.open('post', DateUrl)
                        xhr.onreadystatechange = handler1
                        xhr.responseType = 'blob'
                        xhr.setRequestHeader('Authorization', 'Bearer')
                        xhr.send()
                    })
                }
                if (this.requestData.data === '年度排名') {
                    if (this.requestData.yearRanking.length === 0) {
                        this.$Message.info('请选择年度')
                        return
                    }
                    if (this.requestData.yearRankingData === '') {
                        this.$Message.info('请选择排名年度')
                        return
                    }
                    let yearRankingData = JSON.parse(this.requestData.yearRankingData)
                    let yearRankCountryUrl = `${_self.$baseUrl.ImApiUrl}SalesDataYearReport?$filter=(Commodity eq '${_self.$route.params.TradeVariCode}' and Year eq '${yearRankingData.year}')&$top=10&$orderby=TotalCommi desc`
                    o(yearRankCountryUrl).get().then(function (response) {
                        let yearRankData = response.data
                        let xData = []
                        yearRankData.forEach(function (item) {
                            xData.push(item.Country)
                        })
                        xData = xData.reverse()
                        return xData
                    }).then(function (contryData) {
                        let yearUrl = `${_self.$baseUrl.ImApiUrl}SalesDataYearReport/Rcdc.ExportExecl?$filter=(Commodity eq '${TradeVariCode}' and (`
                        let length1 = contryData.length
                        console.log(contryData)
                        contryData.forEach(function (country, key) {
                            if (length1 === 1 && key === 0) {
                                yearUrl = yearUrl + `Country eq '${country}') and `
                            } else if (length1 > 1 && key === 0) {
                                yearUrl = yearUrl + `Country eq '${country}'`
                            } else if (length1 > 1 && length1 === key + 1) {
                                yearUrl = yearUrl + ` or Country eq '${country}') and `
                            } else {
                                yearUrl = yearUrl + ` or Country eq '${country}'`
                            }
                        })
                        console.log(yearUrl)
                        let length2 = _self.requestData.yearRanking.length
                        _self.requestData.yearRanking.forEach(function (areaItem, key) {
                            let allYear = JSON.parse(areaItem).year
                            if (length2 === 1 && key === 0) {
                                yearUrl = yearUrl + `(Year eq '${allYear}'))`
                            } else if (length2 > 1 && length2 === key + 1) {
                                yearUrl = yearUrl + ` or Year eq '${allYear}'))`
                            } else if (length2 > 1 && key === 0) {
                                yearUrl = yearUrl + `(Year eq '${allYear}'`
                            } else {
                                yearUrl = yearUrl + ` or Year eq '${allYear}'`
                            }
                        })
                        let handler2 = function () {
                            if (this.readyState === this.DONE) {
                                if (this.status === 200) {
                                    var link = document.createElement('a')
                                    link.href = window.URL.createObjectURL(this.response)
                                    link.download = '年度销售排名.xlsx'
                                    link.click()
                                } else {
                                    console.error('no pdf :(')
                                }
                            }
                        }
                        let xhr = new XMLHttpRequest()
                        xhr.open('post', yearUrl)
                        xhr.onreadystatechange = handler2
                        xhr.responseType = 'blob'
                        xhr.setRequestHeader('Authorization', 'Bearer')
                        xhr.send()
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
    .chart1 {
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
    .content-wrap-left-short{
        width: 500px;
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
