<template>
    <div>
        <div class="content-wrap">
            <!--视图-->
            <div class="content-wrap-right">
                <div v-if="requestData.data === '优良率折线图'">
                    <!--<div class="chart-head"><span>单位: 公吨</span><span style="margin-left: 50px">时间： 周</span></div>-->
                    <chart :options="chartOption" class="chart" auto-resize></chart>
                </div>
                <div v-if="requestData.data === '优良率分布图'">
                    <!--<div class="chart-head"><span>单位: 公吨</span><span style="margin-left: 50px">时间： 周</span></div>-->
                    <chart :options="chartOption1" class="chart" auto-resize></chart>
                </div>
                <div v-if="requestData.data === '优良率生产周期'">
                    <!--<div class="chart-head"><span>优良率生产周期</span><span style="margin-left: 50px"></span></div>-->
                    <chart :options="chartOption2" class="chart" auto-resize></chart>
                </div>
            </div>
            <div class="content-wrap-left">
                <div class="content-wrap-left-item-long" style="vertical-align:top">

                        <span class="item-text-short" style="vertical-align: top;">
                        图例:
                        </span>
                    <span class="item-select">
                        <RadioGroup v-model="requestData.data">
                            <template v-for="item in optionData">
                                <Radio :label="item">
                                <span class="sub-span">{{item}}</span>
                            </Radio>
                            </template>
                        </RadioGroup>
                    </span>
                </div>
                <div class="content-wrap-left-item" v-if="requestData.data === '优良率折线图'">
                        <span class="item-text-short" style="vertical-align: top;margin-top: 5px">
                            年度:
                        </span>
                    <span class="item-select item-text-time">
                        <CheckboxGroup v-model="requestData.year">
                            <template v-for="item in optionTime">
                                <Checkbox :label="item.value" :disabled="(requestData.year.length === 5 && !requestData.year.some((key) => item.value === key))">
                                <span class="sub-span">{{item.label}}</span>
                                </Checkbox>
                            </template>
                        </CheckboxGroup>
                    </span>
                </div>
                <div class="content-wrap-left-item" v-if="requestData.data === '优良率生产周期'">
                        <span class="item-text-short" style="vertical-align: top;">
                            年度:
                        </span>
                    <span class="item-select">
                        <RadioGroup v-model="requestData.cycleYear">
                            <template v-for="item in optionTime">
                                <Radio :label="item.value">
                                <span  class="sub-span">{{item.label}}</span>
                            </Radio>
                            </template>
                        </RadioGroup>
                    </span>
                </div>
                <div class="content-wrap-left-item" style="vertical-align:top">
                        <span class="item-text-short" style="vertical-align: top;">
                            州:
                        </span>
                    <span class="item-select">
                            <RadioGroup v-model="requestData.location" v-if="requestData.data === '优良率折线图'">
                                <template v-for="item in getPlantLocationList">
                                    <Radio :label="item">
                                    <span class="sub-span">{{item}}</span>
                                </Radio>
                                </template>
                            </RadioGroup>
                            <RadioGroup v-model="requestData.Alllocation" v-if="requestData.data === '优良率分布图'">
                                <template v-for="item in getPlantAreaLocationList">
                                    <Radio :label="item">
                                    <span class="sub-span">{{item}}</span>
                                </Radio>
                                </template>
                            </RadioGroup>
                            <RadioGroup v-model="requestData.cycleLocation" v-if="requestData.data === '优良率生产周期'">
                                <template v-for="item in getPlantCycleLocationList">
                                    <Radio :label="item">
                                    <span class="sub-span">{{item}}</span>
                                </Radio>
                                </template>
                            </RadioGroup>
                        </span>
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
    </div>
</template>
<script>
//    import echarts from 'echarts'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/scatter'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/legend'
    import {mapActions, mapGetters} from 'vuex'
    import Q from 'q'
    import o from 'o.js'
    export default {
        data () {
            return {
                optionData: [
                    '优良率折线图',
                    '优良率分布图',
                    '优良率生产周期'
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
                    data: '优良率折线图',
                    label: 'line',
                    cycleLocation: '',
                    cycleYear: ''
                },
                chartOption: {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                        },
                        formatter: function (params) {
                            params = params[0]
                            var date = new Date(params.name)
                            let year = params.seriesName.substring(0, 4)
                            let month = date.getMonth() + 1
                            if (month > 9) {
                                year = Number(year)
                            } else {
                                year = Number(year) + 1
                            }
                            return year + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' : ' + params.value[1]
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
                        type: 'time',
                        splitLine: {
                            show: false
                        },
                        interval: 3600 * 24 * 1000,
                        axisLabel: {
                            formatter: function (value, index) {
                                // 格式化成月/日，只在第一个刻度显示年份
                                var date = new Date(value)
                                var texts = [(date.getMonth() + 1), date.getDate()]
                                return texts.join('-')
                            },
                            rotate: 90
                        }
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
                    title: {
                        left: 'center',
                        text: ''
                    },
                    legend: {
                        data: ['Very Poor', 'Poor', 'Fair', 'Good', 'ExcellentData']
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                        },
                        position: function (pt) {
                            return [pt[0], 130]
                        }
                    },
                    xAxis: {
                        type: 'time',
                        // boundaryGap: [0, 0],
//                        axisPointer: {
//                            value: '2016-10-7',
//                            snap: true,
//                            lineStyle: {
//                                color: '#004E52',
//                                opacity: 0.5,
//                                width: 2
//                            },
//                            label: {
//                                show: true,
//                                formatter: function (params) {
//                                    return echarts.format.formatTime('yyyy-MM-dd', params.value)
//                                },
//                                backgroundColor: '#004E52'
//                            },
//                            handle: {
//                                show: true,
//                                color: '#004E52'
//                            }
//                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            formatter: function (value, index) {
                                // 格式化成月/日，只在第一个刻度显示年份
                                var date = new Date(value)
                                var texts = [(date.getMonth() + 1), date.getDate()]
                                return texts.join('-')
                            },
                            rotate: 90
                        }
                    },
                    yAxis: {
                        type: 'value',
//                        axisTick: {
//                            inside: true
//                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            formatter: function (value, index) {
                                return value + '%'
                            }
                        },
                        z: 10
                    },
                    grid: {
                    },
//                    dataZoom: [{
//                        type: 'inside',
//                        throttle: 50
//                    }],
                    series: []
                },
                chartOption2: {
                    tooltip: {
//                        trigger: 'axis',
                        trigger: 'item',
                        axisPointer: {
                        },
                        formatter: function (params) {
                            let data = ''
                            data = params.value[0].substring(5) + '<br/>' + params.seriesName + ': ' + params.value[1] + ' , ' + params.value[2] + '<br/>'
//                            let data = ''
//                            data = params[0].axisValueLabel.substring(0, 5) + '<br/>'
//                            params.forEach(function (item) {
//                                data = data + item.seriesName + ': ' + item.value[1] + ' , ' + item.value[2] + '<br/>'
//                            })
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
                        type: 'time',
                        splitLine: {
                            show: false
                        },
//                        interval: 3600 * 24 * 1000 * 7,
                        axisLabel: {
                            formatter: function (value, index) {
                                // 格式化成月/日，只在第一个刻度显示年份
                                var date = new Date(value)
                                var texts = [(date.getMonth() + 1), date.getDate()]
                                return texts.join('-')
                            },
                            rotate: 90
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: { color: '#666' }
                        },
                        axisLabel: {
                            formatter: function (value, index) {
                                return value + '%'
                            }
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
        },
        watch: {
            // 切换品种初始化选项
            '$route.params': 'initData'
        },
        computed: {
            ...mapGetters([
                'getPlantVariData',
                'getPlantYearList',
                'getPlantLocationList',
                'getPlantAreaLocationList',
                'getPlantCycleLocationList'
            ]),
            optionTime: function () {
                let timeArray = []
                if (this.getPlantVariData) {
                    let x = 0
                    if (this.requestData.data === '优良率生产周期') {
                        x = 5
                    }
                    for (let i = x; i < this.getPlantYearList; i++) {
                        if (i < 9) {
                            let time = `200${i}/0${i + 1}`
                            let value = {
                                startTime: `200${i}-${this.getPlantVariData.StartTime}T00:00:00Z`,
                                endTime: `200${i + 1}-${this.getPlantVariData.EndTime}T00:00:00Z`,
                                year: `200${i}/200${i + 1}`,
                                time: time
                            }
                            if (this.$route.params.TradeVariCode !== 'Winter Wheat') {
                                time = `200${i}`
                                value.endTime = `200${i}-${this.getPlantVariData.EndTime}T00:00:00Z`
                                value.year = `200${i}`
                                value.time = `200${i}`
                            }
                            value = JSON.stringify(value)
                            let item = {value: value, label: time}
                            timeArray.push(item)
                        } else if (i === 9) {
                            let time = `200${i}/${i + 1}`
                            let value = {
                                startTime: `200${i}-${this.getPlantVariData.StartTime}T00:00:00Z`,
                                endTime: `20${i + 1}-${this.getPlantVariData.EndTime}T00:00:00Z`,
                                year: `200${i}/20${i + 1}`,
                                time: time
                            }
                            if (this.$route.params.TradeVariCode !== 'Winter Wheat') {
                                time = `200${i}`
                                value.endTime = `200${i}-${this.getPlantVariData.EndTime}T00:00:00Z`
                                value.year = `200${i}`
                                value.time = `200${i}`
                            }
                            value = JSON.stringify(value)
                            let item = {value: value, label: time}
                            timeArray.push(item)
                        } else {
                            let time2 = `20${i}/${i + 1}`
                            let value = {
                                startTime: `20${i}-${this.getPlantVariData.StartTime}T00:00:00Z`,
                                endTime: `20${i + 1}-${this.getPlantVariData.EndTime}T00:00:00Z`,
                                year: `20${i}/20${i + 1}`,
                                time: time2
                            }
                            if (this.$route.params.TradeVariCode !== 'Winter Wheat') {
                                time2 = `20${i}`
                                value.endTime = `20${i}-${this.getPlantVariData.EndTime}T00:00:00Z`
                                value.year = `20${i}`
                                value.time = `20${i}`
                            }
                            value = JSON.stringify(value)
                            let item2 = {value: value, label: time2}
                            timeArray.push(item2)
                        }
                    }
                }
                return timeArray
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
            initData () {
                this.requestData.data = '优良率折线图'
                this.requestData.location = ''
                this.requestData.year = []
                this.requestData.Alllocation = ''
                this.requestData.Allyear = []
                this.requestData.cycleLocation = ''
                this.requestData.cycleYear = ''
                this.chartOption.series = []
                this.chartOption1.series = []
                this.chartOption2.series = []
            },
            changeData () {
                if (document.createEvent) {
                    let event = document.createEvent('HTMLEvents')
                    event.initEvent('resize', true, true)
                    window.dispatchEvent(event)
                } else if (document.createEventObject) {
                    window.fireEvent('onresize')
                }
            },
            // 选择品种
            getobj () {
                let _self = this
                if (this.requestData.data === '优良率折线图') {
                    if (this.requestData.year.length === 0) {
                        this.$Message.info('请选择年度')
                        return
                    }
                    if (this.requestData.location === '') {
                        this.$Message.info('请选择州')
                        return
                    }
                    this.chartOption.legend.data = []
                    let areName = this.requestData.location
                    let legendData = []
                    let series = []
                    let timeData = this.requestData.year
                    timeData.sort(function (a, b) {
                        return (Number(JSON.parse(a).year.slice(0, 4)) - Number(JSON.parse(b).year.slice(0, 4)))
                    })
                    let qUrls = []
                    timeData.forEach(function (item, key) {
                        let startTime = JSON.parse(item).startTime
                        let endTime = JSON.parse(item).endTime
                        let url = `${_self.$baseUrl.ImApiUrl}CropProgressLineData?$filter=(Commodity eq '${_self.$route.params.TradeVariCode}' and State eq '${areName}' and Date ge ${startTime} and Date le ${endTime})&$orderby=Date`
                        qUrls.push(o(url).get())
                        legendData.push(JSON.parse(item).time)
                        Q.all(qUrls).then(function (oHandlerArray) {
                            legendData.forEach(function (item, key) {
                                let totalData = oHandlerArray[key].data
                                let seriesData = []
                                totalData.forEach(function (seriesItem) {
                                    let now = new Date(seriesItem.Date)
                                    let time = [2000, now.getMonth() + 1, now.getDate()].join('-')
                                    let dataItem = {}
                                    dataItem.name = time
                                    dataItem.value = [time, seriesItem.Data]
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
                        })
                    })
                    _self.chartOption.legend.data = legendData
                    _self.chartOption.series = series
                }
                if (this.requestData.data === '优良率分布图') {
                    if (this.requestData.Alllocation === '') {
                        this.$Message.info('请选择州')
                        return
                    }
                    let now = new Date()
                    let year = now.getFullYear()
                    let month = now.getMonth() + 1
                    let startTime = null
                    let endTime = null
                    let areName = this.requestData.Alllocation
                    if (_self.$route.params.TradeVariCode !== 'Winter Wheat') {
                        if (month < 4) {
                            year = year - 1
                        }
                        startTime = `${year}-04-01T00:00:00Z`
                        endTime = `${year}-11-31T00:00:00Z`
                    } else {
                        if (month < 9) {
                            year = year - 1
                        }
                        startTime = `${year}-09-01T00:00:00Z`
                        endTime = `${year + 1}-08-31T00:00:00Z`
                    }
                    let url = `${_self.$baseUrl.ImApiUrl}CropProgressDistributionData?$filter=(Commodity eq '${_self.$route.params.TradeVariCode}' and State eq '${areName}' and Date ge ${startTime} and Date le ${endTime})&$orderby=Date`
                    o(url).get().then(function (response) {
                        let veryPoorData = []
                        let poorData = []
                        let fairData = []
                        let goodData = []
                        let excellentData = []
                        let resData = response.data
                        resData.forEach(function (item) {
                            let day = item.Date
                            let now = new Date(day)
                            let time = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-')
                            veryPoorData.push([time, item.VeryPoor])
                            poorData.push([time, item.Poor])
                            fairData.push([time, item.Fair])
                            goodData.push([time, item.Good])
                            excellentData.push([time, item.Excellent])
                        })
                        let data = [veryPoorData, poorData, fairData, goodData, excellentData]
                        let dataName = ['Very Poor', 'Poor', 'Fair', 'Good', 'ExcellentData']
                        let dataColor = ['#00b050', '#1af229', '#99FF66', '#ffff00', '#ffc000']
                        let series = []
                        data.forEach(function (item, key) {
                            let line = {
                                name: dataName[key],
                                type: 'line',
                                smooth: true,
                                symbol: 'circle',
                                symbolSize: 5,
                                sampling: 'average',
                                itemStyle: {
                                    normal: {
                                        color: dataColor[key],
                                        opacity: 0.8
                                    }
                                },
                                stack: 'a',
                                areaStyle: {
                                    normal: {
                                        color: dataColor[key],
                                        opacity: 0.8
                                    }
                                },
                                data: item
                            }
                            series.push(line)
                        })
                        _self.chartOption1.series = series
                    })
                }
                if (this.requestData.data === '优良率生产周期') {
                    if (this.requestData.cycleYear.length === 0) {
                        this.$Message.info('请选择年度')
                        return
                    }
                    if (this.requestData.cycleLocation === '') {
                        this.$Message.info('请选择州')
                        return
                    }
                    let urlArr = []
                    let cycleLocation = _self.requestData.cycleLocation
                    let startTime = JSON.parse(_self.requestData.cycleYear).startTime
                    let endTime = JSON.parse(_self.requestData.cycleYear).endTime
                    let startTimeBefor = (Number(startTime.substr(0, 4)) - 1).toString() + '-' + startTime.substr(5)
                    let endTimeBefor = (Number(startTime.substr(0, 4)) - 1).toString() + '-' + endTime.substr(5)
                    let urlCurrent = `${_self.$baseUrl.ImApiUrl}CropProgressCycleData?$filter=(Commodity eq '${_self.$route.params.TradeVariCode}' and State eq '${cycleLocation}' and Date ge ${startTime} and Date le ${endTime})&$orderby=Date`
                    let urlbefor = `${_self.$baseUrl.ImApiUrl}CropProgressCycleData?$filter=(Commodity eq '${_self.$route.params.TradeVariCode}' and State eq '${cycleLocation}' and Date ge ${startTimeBefor} and Date le ${endTimeBefor})&$orderby=Date`
                    let urlsAverage = `${_self.$baseUrl.ImApiUrl}CropProgressCycleData/Rcdc.GetCycleCountData`
                    let postData = {
                        Commodity: _self.$route.params.TradeVariCode,
                        State: cycleLocation,
                        Year: Number(startTime.substr(0, 4))
                    }
                    urlArr.push(o(urlCurrent).get())
                    urlArr.push(o(urlbefor).get())
                    urlArr.push(o(urlsAverage).post(postData).save())
                    Q.all(urlArr).then(function (oHandlerArray) {
                        let phases = []
                        let series = []
                        let resData = oHandlerArray[0].data
                        if (resData.length === 0) {
                            _self.$Notice.open({
                                title: '提示',
                                desc: '暂无数据'
                            })
                            return
                        }
                        let resBeforData = oHandlerArray[1].data
                        let resAverageData = oHandlerArray[2].data
//                        let resAverageData = []
                        if (resBeforData.length > 0) {
                            resBeforData.forEach(function (item) {
                                phases.push(item.Progress)
                            })
                        } else {
                            resData.forEach(function (item) {
                                phases.push(item.Progress)
                            })
                        }
                        let tmp = new Set(phases)
                        let phase = Array.from(tmp)
//                        let resData = [
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Harvested',
//                                Date: '2017-11-14T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 40
//                            },
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Sex',
//                                Date: '2017-11-16T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 50
//                            },
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Harvested',
//                                Date: '2017-11-21T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 50
//                            },
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Sex',
//                                Date: '2017-11-23T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 60
//                            },
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Harvested',
//                                Date: '2017-11-27T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 60
//                            },
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Sex',
//                                Date: '2017-11-30T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 70
//                            }
//                        ]
//                        let resBeforData = [
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Harvested',
//                                Date: '2017-11-15T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 40
//                            },
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Sex',
//                                Date: '2017-11-16T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 50
//                            },
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Harvested',
//                                Date: '2017-11-22T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 50
//                            },
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Sex',
//                                Date: '2017-11-23T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 55
//                            },
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Harvested',
//                                Date: '2017-11-29T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 60
//                            },
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Sex',
//                                Date: '2017-11-30T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 62
//                            }
//                        ]
//                        let resAverageData = [
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Harvested',
//                                Week: '2017-11-15T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 45
//                            },
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Sex',
//                                Week: '2017-11-16T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 46
//                            },
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Harvested',
//                                Week: '2017-11-22T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 55
//                            },
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Sex',
//                                Week: '2017-11-23T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 59
//                            },
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Harvested',
//                                Week: '2017-11-29T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 69
//                            },
//                            {
//                                Commodity: 'Corn',
//                                Progress: 'Sex',
//                                Week: '2017-11-30T00:00:00+08:00',
//                                State: 'Colorado',
//                                CycleData: 68
//                            }
//                        ]
                        let color = ['#00b050', '#1af229', '#99FF66', '#ffff00', '#ffc000', '#ffff00', '#ffc000', '#1af229', '#99FF66']
                        let current = JSON.parse(_self.requestData.cycleYear).year
                        let befor = (Number(startTime.substr(0, 4)) - 1).toString()
                        if (_self.$route.params.TradeVariCode === 'Winter Wheat') {
                            befor = `${(Number(startTime.substr(0, 4)) - 1).toString()}/${Number(startTime.substr(0, 4)).toString()}`
                        }
                        phase.forEach(function (phaseItem, key) {
                            let seriesCurrentLine = []
                            let seriesBeforLine = []
                            let seriesBefor = []
                            let seriesAverageine = []
                            let seriesAverage = []
                            resData.forEach(function (resItem) {
                                if (resItem.Progress === phaseItem) {
                                    let obj = {}
                                    let now = new Date(resItem.Date)
                                    let time = [2000, now.getMonth() + 1, now.getDate()].join('/')
                                    if (_self.$route.params.TradeVariCode === 'Winter Wheat') {
                                        if (now.getMonth() + 1 >= 9) {
                                            time = [2000, now.getMonth() + 1, now.getDate()].join('/')
                                        } else {
                                            time = [2001, now.getMonth() + 1, now.getDate()].join('/')
                                        }
                                    }
                                    obj.name = phaseItem
                                    obj.value = [time, resItem.CycleData, phaseItem]
                                    seriesCurrentLine.push(obj)
                                }
                            })
                            resBeforData.forEach(function (resBeforItem) {
                                if (resBeforItem.Progress === phaseItem) {
                                    let obj2 = {}
                                    let now = new Date(resBeforItem.Date)
                                    let time = [2000, now.getMonth() + 1, now.getDate()].join('/')
                                    if (_self.$route.params.TradeVariCode === 'Winter Wheat') {
                                        if (now.getMonth() + 1 >= 9) {
                                            time = [2000, now.getMonth() + 1, now.getDate()].join('/')
                                        } else {
                                            time = [2001, now.getMonth() + 1, now.getDate()].join('/')
                                        }
                                    }
                                    obj2.name = phaseItem
                                    obj2.value = [time, resBeforItem.CycleData, phaseItem]
                                    seriesBefor.push(obj2)
                                }
                            })
                            resAverageData.forEach(function (resAverageItem) {
                                if (resAverageItem.Progress === phaseItem) {
                                    let obj3 = {}
                                    obj3.name = phaseItem
                                    obj3.value = [resAverageItem.Week, resAverageItem.CycleData, phaseItem]
                                    seriesAverage.push(obj3)
                                }
                            })
                            if (_self.requestData.cycleYear !== _self.optionTime[_self.optionTime.length - 1].value) {
                                seriesCurrentLine.forEach(function (seriesItem, key) {
                                    if (seriesBefor[key]) {
                                        let obj = {}
                                        obj.name = seriesCurrentLine[key].name
                                        obj.value = [seriesCurrentLine[key].value[0], seriesBefor[key].value[1], seriesCurrentLine[key].value[2]]
                                        seriesBeforLine.push(obj)
                                    }
                                    if (seriesAverage[key]) {
                                        let obj = {}
                                        obj.name = seriesCurrentLine[key].name
                                        obj.value = [seriesCurrentLine[key].value[0], seriesAverage[key].value[1], seriesCurrentLine[key].value[2]]
                                        seriesAverageine.push(obj)
                                    }
                                })
                            } else {
                                seriesBefor.forEach(function (seriesItem, key) {
                                    seriesBeforLine.push(seriesItem)
                                    if (seriesCurrentLine[key]) {
                                        seriesCurrentLine[key].value[0] = seriesBefor[key].value[0]
                                    }
                                    if (seriesAverage[key]) {
                                        let obj = {}
                                        obj.name = seriesBefor[key].name
                                        obj.value = [seriesBefor[key].value[0], seriesAverage[key].value[1], seriesBefor[key].value[2]]
                                        seriesAverageine.push(obj)
                                    }
                                })
                            }
                            let lineCurrent = {
                                name: current,
                                type: 'line',
                                showSymbol: true,
                                hoverAnimation: false,
                                smooth: true,
                                symbolSize: 1,
                                lineStyle: {
                                    normal: {
                                        color: color[key]
                                    }
                                },
                                data: seriesCurrentLine
                            }
                            let lineBefor = {
                                name: befor,
                                type: 'line',
                                showSymbol: true,
                                hoverAnimation: false,
                                smooth: true,
                                symbolSize: 1,
                                lineStyle: {
                                    normal: {
                                        color: color[key],
                                        type: 'dashed'
                                    }
                                },
                                data: seriesBeforLine
                            }
                            let lineAverage = {
                                name: '近5年平均值',
                                type: 'line',
                                showSymbol: true,
                                hoverAnimation: false,
                                lineStyle: {
                                    normal: {
                                        color: color[key],
                                        type: 'dotted'
                                    }
                                },
                                smooth: true,
                                symbolSize: 1,
                                data: seriesAverageine
                            }
                            series.push(lineCurrent)
                            series.push(lineBefor)
                            series.push(lineAverage)
                        })
                        _self.chartOption2.series = series
                        _self.chartOption2.series = series
                        _self.chartOption2.legend.data = [current, befor, '近5年平均值']
                    })
                }
            },
            exportObj () {
                let _self = this
                if (this.requestData.data === '优良率折线图') {
                    if (this.requestData.year.length === 0) {
                        this.$Message.info('请选择年度')
                        return
                    }
                    if (this.requestData.location === '') {
                        this.$Message.info('请选择州')
                        return
                    }
                    let areName = this.requestData.location
                    let timeData = this.requestData.year
                    timeData.sort(function (a, b) {
                        return (Number(JSON.parse(a).year.slice(0, 4)) - Number(JSON.parse(b).year.slice(0, 4)))
                    })
                    let startTime = JSON.parse(timeData[0]).startTime
                    let endTime = JSON.parse(timeData[timeData.length - 1]).endTime
                    let Url = `${_self.$baseUrl.ImApiUrl}CropProgressLineData/Rcdc.ExportExecl?$filter=(Commodity eq '${_self.$route.params.TradeVariCode}' and State eq '${areName}' and Date ge ${startTime} and Date le ${endTime})&$orderby=Date`
                    let handler1 = function () {
                        if (this.readyState === this.DONE) {
                            if (this.status === 200) {
                                var link = document.createElement('a')
                                link.href = window.URL.createObjectURL(this.response)
                                link.download = '优良率折线图.xlsx'
                                link.click()
                            } else {
                                console.error('no pdf :(')
                            }
                        }
                    }
                    let xhr = new XMLHttpRequest()
                    xhr.open('post', Url)
                    xhr.onreadystatechange = handler1
                    xhr.responseType = 'blob'
                    xhr.setRequestHeader('Authorization', 'Bearer')
                    xhr.send()
                }
                if (this.requestData.data === '优良率分布图') {
                    if (this.requestData.Alllocation === '') {
                        this.$Message.info('请选择州')
                        return
                    }
                    let now = new Date()
                    let year = now.getFullYear()
                    let month = now.getMonth() + 1
                    let startTime = null
                    let endTime = null
                    let areName = this.requestData.Alllocation
                    if (_self.$route.params.TradeVariCode !== 'Winter Wheat') {
                        // 除冬麦以外品种 未到四月以上一年的数据为准
                        if (month < 4) {
                            year = year - 1
                        }
                        startTime = `${year}-04-01T00:00:00Z`
                        endTime = `${year}-11-31T00:00:00Z`
                    } else {
                        if (month < 9) {
                            year = year - 1
                        }
                        startTime = `${year}-09-01T00:00:00Z`
                        endTime = `${year + 1}-08-31T00:00:00Z`
                    }
                    let Url = `${_self.$baseUrl.ImApiUrl}CropProgressDistributionData/Rcdc.ExportExecl?$filter=(Commodity eq '${_self.$route.params.TradeVariCode}' and State eq '${areName}' and Date ge ${startTime} and Date le ${endTime})&$orderby=Date`
                    let handler1 = function () {
                        if (this.readyState === this.DONE) {
                            if (this.status === 200) {
                                var link = document.createElement('a')
                                link.href = window.URL.createObjectURL(this.response)
                                link.download = '优良率分布图.xlsx'
                                link.click()
                            } else {
                                console.error('no pdf :(')
                            }
                        }
                    }
                    let xhr = new XMLHttpRequest()
                    xhr.open('post', Url)
                    xhr.onreadystatechange = handler1
                    xhr.responseType = 'blob'
                    xhr.setRequestHeader('Authorization', 'Bearer')
                    xhr.send()
                }
                if (this.requestData.data === '优良率生产周期') {
                    if (this.requestData.cycleYear.length === 0) {
                        this.$Message.info('请选择年度')
                        return
                    }
                    if (this.requestData.cycleLocation === '') {
                        this.$Message.info('请选择州')
                    }
                    let startTime = JSON.parse(_self.requestData.cycleYear).startTime
                    let postData = {
                        Commodity: _self.$route.params.TradeVariCode,
                        State: _self.requestData.cycleLocation,
                        Year: Number(startTime.substr(0, 4))
                    }
                    let Url = `${_self.$baseUrl.ImApiUrl}CropProgressCycleData/Rcdc.ExportCycleExecl`
                    let handler1 = function () {
                        if (this.readyState === this.DONE) {
                            if (this.status === 200) {
                                var link = document.createElement('a')
                                link.href = window.URL.createObjectURL(this.response)
                                link.download = '优良率分布图.xlsx'
                                link.click()
                            } else {
                                console.error('no pdf :(')
                            }
                        }
                    }
                    let xhr = new XMLHttpRequest()
                    xhr.open('post', Url)
                    xhr.onreadystatechange = handler1
                    xhr.responseType = 'blob'
                    xhr.setRequestHeader('Content-Type', 'application/json')
                    xhr.setRequestHeader('Authorization', 'Bearer')
                    xhr.send(JSON.stringify(postData))
                }
            },
            toDateTime: function (t) {
                let timeArr = t.toString().split(' ')
                timeArr[4] = '00:00:00'
                let timeSting = ''
                timeArr.forEach(function (item) {
                    timeSting += `${item} `
                })
                let d = new Date(timeSting).getTime() - 28800000  // 8小时
                let times = new Date(d)
                let year = times.getFullYear()
                let month = (times.getMonth() + 1).toString().length === 2 ? (times.getMonth() + 1) : `0${(times.getMonth() + 1)}`
                let day = (times.getDate()).toString().length === 2 ? (times.getDate()) : `0${(times.getDate())}`
                let hours = (times.getHours()).toString().length === 2 ? (times.getHours()) : `0${(times.getHours())}`
                let minutes = (times.getMinutes()).toString().length === 2 ? (times.getMinutes()) : `0${(times.getMinutes())}`
                let seconds = (times.getSeconds()).toString().length === 2 ? (times.getSeconds()) : `0${(times.getSeconds())}`
                return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + 'Z'
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
        font-size: 16px;
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
        /*padding: 20px!important;*/
    }
    .sub-span{
        display: inline-block;
        padding: 0px 6px 4px;
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
        margin-left: 45px;
    }
    .content-wrap-left-item{
        margin-top: 45px;
        display: flex;
        width: 650px;
    }
    .content-wrap-left-item-long{
        margin-top: 40px;
        display: inline-block;
        width: 650px;
    }
    .content-wrap-left{
        width: 680px;
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
        /*font-weight: bold;*/
        width: 100px;
        text-align: right;
        display: inline-block;
    }
    .item-text-short{
        /*font-weight: bold;*/
        width: 90px;
        text-align: right;
        display: inline-block;
    }
    .item-select{
        flex: 1;
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
