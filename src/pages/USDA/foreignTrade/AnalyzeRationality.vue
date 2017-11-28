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
                            <h2>出口合理性分析</h2>
                        </Col>
                        <!--<Col span="2">-->
                            <!--<Button class="pull-right" title="刷新"> <Icon type="refresh"></Icon> </Button>-->
                        <!--</Col>-->
                    </Row>
                </div>
                <div class="content-wrap">
                    <div class="content-wrap-right">
                        <div class="chart-head"><span>单位: 公吨</span></div>
                        <chart :options="chartOption" class="chart" auto-resize></chart>
                    </div>
                    <div class="content-wrap-left">
                        <div class="content-wrap-left-content">
                            <div style="width: 240px">
                                <div class="request-content">
                                    <span class="item-text">
                                        样本起始年份:
                                    </span>
                                    <span class="item-select">
                                        <Select v-model="requestData.startTime" style="width:100px" size="small">
                                            <Option v-for="item in optionTime" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </span>
                                </div>
                                <div class="request-content">
                                        <span class="item-text">
                                            样本结束年份:
                                        </span>
                                    <span class="item-select">
                                        <Select v-model="requestData.endTime" style="width:100px" size="small">
                                            <Option v-for="item in optionTime" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </span>
                                </div>
                                <div class="request-content">
                                        <span class="item-text">
                                            周度选择:
                                        </span>
                                    <span class="item-select">
                                        <Select v-model="requestData.weekCount" style="width:100px" size="small">
                                            <Option v-for="item in getWeekList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </span>
                                </div>
                            </div>
                            <div style="flex:1">
                                <div class="request-content ">
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
                                </div>
                            </div>
                        </div>
                        <div class="margin-content-left">
                            <Button type="primary" @click="getObj">生成图表</Button>
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
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/scatter'
    import 'echarts/lib/component/title'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/legend'
//    import ecStat from 'echarts-stat'
    import o from 'o.js'
//    const ENDTIME = 17
    import {mapActions, mapGetters} from 'vuex'
    import { ExportAnalysis } from './../../../config/apiConfig.js'
//    import { scattedata, scattedataline } from '../../../assets/common/data/scatte'
//    var myRegression = ecStat.regression('linear', scattedataline)
//    myRegression.points.sort(function (a, b) {
//        return a[0] - b[0]
//    })
    export default {
        data () {
            return {
                accordion: true,
                openNames: [],
                selectVari: null,
                variCode: '',
                filterVariCode: '',
                TradeVari: [],
                requestData: {
                    startTime: '',
                    endTime: '',
                    weekCount: 1,
                    location: ''
                },
                chartOption: {
                    title: {
//                        text: 'Linear Regression',
//                        subtext: 'By ecStat.regression',
//                        sublink: 'https://github.com/ecomfe/echarts-stat',
//                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        },
                        formatter: function (name) {
                            let data = ` ${name[0].seriesName}: ${name[0].data[1]}` + '<bar>' + ` ${name[1].seriesName}: ${name[0].data[1]}`
                            return data
                        }
                    },
                    xAxis: {
                        type: 'value',
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        min: 1.5,
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },
                    series: []
                }
            }
        },
        mounted: function () {
            this.setlocationList()
            this.setyearList()
            this.TradeVari = ExportAnalysis
            var variCode = this.$route.params.TradeVariCode
            this.variCode = variCode
            if (variCode) {
                this.variCode = variCode
                this.$router.push({name: 'AnalyzeRationality', params: {TradeVariCode: this.variCode}})
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
        },
        watch: {
        },
        computed: {
            ...mapGetters([
                'getLocationList',
                'getYearList',
                'getWeekList'
            ]),
            unit () {
                let TradeVariCode = this.$route.params.TradeVariCode
                if (TradeVariCode === 'Soybeans' ||
                    TradeVariCode === 'All Wheats' ||
                    TradeVariCode === 'Wheat-SRW' ||
                    TradeVariCode === 'Wheat-HRW' ||
                    TradeVariCode === 'Wheat-HRS') {
                    return '蒲式耳'
                } else if (TradeVariCode === 'All Upland Cotton' ||
                    TradeVariCode === 'Soybean Oil') {
                    return '磅'
                } else {
                    return '吨'
                }
            },
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
            optionsWeek: function () {
                let week = []
                for (let i = 1; i < 76; i++) {
                    week.push({value: i, label: i})
                }
                return week
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
            // 选择品种
            changeVari: function (name) {
                this.$router.push({name: 'AnalyzeRationality', params: {TradeVariCode: name}})
                this.variCode = name
                var variArr = [this.TradeVari]
                for (var i = 0; i < variArr.length; i++) {
                    for (var j = 0; j < variArr[i].length; j++) {
                        if (variArr[i][j].VariCode === name) {
                            this.selectVari = variArr[i][j]
                        }
                    }
                }
                this.setyearList(name)
            },
            getObj () {
                let _self = this
                if (!_self.requestData.startTime) {
                    this.$Message.info('请选择开始时间')
                    return
                }
                if (!_self.requestData.endTime) {
                    this.$Message.info('请选择结束时间')
                    return
                }
                if (!_self.requestData.location) {
                    this.$Message.info('请选择地区')
                    return
                }
                let startTime = JSON.parse(_self.requestData.startTime).year
                let endTime = JSON.parse(_self.requestData.endTime).year
                let startNum = Number(startTime.substr(0, 4))
                let endNum = Number(endTime.substr(0, 4))
                if (startNum > endNum) {
                    this.$Message.info('结束时间应大于等于开始时间')
                    return
                }
                let Years = []
                let AreaName = _self.requestData.location
                let Commodity = _self.$route.params.TradeVariCode
                let url = `${_self.$baseUrl.ImApiUrl}SalesDataWeekReport/Rcdc.GetAnalysisReportList`
                for (let i = startNum; i <= endNum; i++) {
                    Years.push(`${i}/${i + 1}`)
                }
                Years = Years.join(',')
                let postData = {
                    AreaName: AreaName,
                    Commodity: Commodity,
                    Years: Years,
                    Week: _self.requestData.weekCount
                }
                o(url).post(postData).save().then(function (response) {
                    let message = response.data.Message
                    if (message !== null) {
                        _self.$Notice.warning({
                            title: '提示',
                            desc: message
                        })
                        _self.chartOption.series = []
                        return
                    }
                    let data = response.data.List
                    if (data === null) {
                        _self.$Notice.warning({
                            title: '提示',
                            desc: '暂无此周数据'
                        })
                        _self.chartOption.series = []
                        return
                    }
                    let arg = response.data.Parameter
                    let seriesScatterData = []
                    let seriesLineData = []
                    data.forEach(function (item, key) {
                        let seriesItem = []
                        let lineItem = []
                        lineItem[0] = Math.round(Number(item.PSETotalCommi))
                        lineItem[1] = Math.round(Number(item.PSETotalCommi) * arg[0] + arg[1])
                        seriesItem[0] = Math.round(Number(item.PSETotalCommi))
                        seriesItem[1] = Math.round(Number(item.Exports))
                        seriesItem[2] = item.Year
                        if (key !== data.length - 1) {
                            seriesScatterData.push(seriesItem)
                            seriesLineData.push(lineItem)
                        }
                    })
                    seriesScatterData.sort(function (a, b) {
                        return a[0] - b[0]
                    })
                    seriesLineData.sort(function (a, b) {
                        return a[0] - b[0]
                    })
                    let series = [{
                        name: '实际值',
                        type: 'scatter',
                        label: {
                            emphasis: {
                                show: true,
                                formatter: function (param) {
                                    return param.data[2]
                                },
                                position: 'top'
                            }
                        },
                        itemStyle: {
                            normal: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(120, 36, 50, 0.5)',
                                shadowOffsetY: 5
                            }
                        },
                        data: seriesScatterData
                    }, {
                        name: '理论值',
                        type: 'line',
                        showSymbol: false,
                        data: seriesLineData,
                        markPoint: {
                            itemStyle: {
                                normal: {
                                    color: 'transparent'
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'left',
                                    formatter: '',
                                    textStyle: {
                                        color: '#333',
                                        fontSize: 14
                                    }
                                }
                            },
                            data: [{
                                coord: seriesLineData[seriesLineData.length - 1]
                            }]
                        }
                    }]
                    _self.chartOption.series = series
                })
            },
            exportObj () {
                let _self = this
                if (!_self.requestData.startTime) {
                    this.$Message.info('请选择开始时间')
                    return
                }
                if (!_self.requestData.endTime) {
                    this.$Message.info('请选择结束时间')
                    return
                }
                if (!_self.requestData.location) {
                    this.$Message.info('请选择地区')
                    return
                }
                let url = `${_self.$baseUrl.ImApiUrl}SalesDataWeekReport/Rcdc.ExportAnalysisReport`
                let startTime = JSON.parse(_self.requestData.startTime).year
                let endTime = JSON.parse(_self.requestData.endTime).year
                let startNum = Number(startTime.substr(0, 4))
                let endNum = Number(endTime.substr(0, 4))
                if (startNum > endNum) {
                    this.$Message.info('结束时间应大于等于开始时间')
                    return
                }
                let Years = []
                let AreaName = _self.requestData.location
                let Commodity = _self.$route.params.TradeVariCode
                for (let i = startNum; i <= endNum; i++) {
                    Years.push(`${i}/${i + 1}`)
                }
                Years = Years.join(',')
                let postData = {
                    AreaName: AreaName,
                    Commodity: Commodity,
                    Years: Years,
                    Week: _self.requestData.weekCount
                }
                let handler = function () {
                    if (this.readyState === this.DONE) {
                        if (this.status === 200) {
                            var link = document.createElement('a')
                            link.href = window.URL.createObjectURL(this.response)
                            link.download = '出口合理性分析.xlsx'
                            link.click()
                        } else {
                            _self.$Notice.warning({
                                title: '提示',
                                desc: '暂无此周数据'
                            })
                            _self.chartOption.series = []
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
                xhr.send(JSON.stringify(postData))
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
    .content-wrap-left-content{
        display: flex;
    }
    .content-wrap-left{
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
        width: 100px;
        text-align: right;
        display: inline-block;
    }
    .item-text-short{
        font-weight: bold;
        width: 60px;
        text-align: right;
        display: inline-block;
    }
    .item-select{
        padding: 0 10px;
        display: inline-block;
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
