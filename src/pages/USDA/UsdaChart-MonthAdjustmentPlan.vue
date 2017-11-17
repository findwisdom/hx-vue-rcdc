<template>
    <Row>
        <!--左侧-->
        <Col span="10">
            <Form :model="chartSetting" :label-width="80">
                <Form-item label="报表日期">
                    <Row>
                        <Col span="11">
                            <Date-picker type="year" placeholder="起始日期" v-model="chartSetting.startDate" :editable="false"></Date-picker>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11">
                            <Date-picker type="year" placeholder="结束日期" v-model="chartSetting.endDate" :editable="false"></Date-picker>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item label="报表类型">
                    <Radio-group v-model="chartSetting.chartType">
                        <Radio label="abs">绝对量</Radio>
                        <Radio label="percent">百分比</Radio>
                    </Radio-group>
                </Form-item>
                <Form-item label="数据项">
                    <Radio-group v-model="chartSetting.dataItem">
                        <template v-for="item in chartDataSetting">
                            <Radio :label="item.key">{{item.title}}</Radio>
                        </template>
                    </Radio-group>
                </Form-item>
                <Form-item label="月份对比">
                    <Row>
                        <Col span="6" class="monthComparer">
                            <Radio-group v-model="chartSetting.firstMonth" class="monthComparer">
                                <Radio label="年度前5月">5</Radio>
                                <Radio label="年度前6月">6</Radio>
                                <Radio label="年度前7月">7</Radio>
                                <Radio label="年度前8月">8</Radio>
                                <Radio label="年度前9月">9</Radio>
                                <Radio label="年度前10月">10</Radio>
                                <Radio label="年度前11月">11</Radio>
                                <Radio label="年度前12月">12</Radio>
                                <Radio label="年度后1月">1</Radio>
                                <Radio label="年度后2月">2</Radio>
                                <Radio label="年度后3月">3</Radio>
                                <Radio label="年度后4月">4</Radio>
                                <Radio label="年度后5月">5</Radio>
                                <Radio label="年度后6月">6</Radio>
                                <Radio label="年度后7月">7</Radio>
                                <Radio label="年度后8月">8</Radio>
                                <Radio label="年度后9月">9</Radio>
                                <Radio label="年度后10月">10</Radio>
                                <Radio label="年度后11月">11</Radio>
                                <Radio label="年度后12月">12</Radio>
                            </Radio-group>
                        </Col>
                        <Col span="6" class="monthComparer">
                            <Radio-group v-model="chartSetting.secondMonth">
                                <Radio label="年度前5月">5</Radio>
                                <Radio label="年度前6月">6</Radio>
                                <Radio label="年度前7月">7</Radio>
                                <Radio label="年度前8月">8</Radio>
                                <Radio label="年度前9月">9</Radio>
                                <Radio label="年度前10月">10</Radio>
                                <Radio label="年度前11月">11</Radio>
                                <Radio label="年度前12月">12</Radio>
                                <Radio label="年度后1月">1</Radio>
                                <Radio label="年度后2月">2</Radio>
                                <Radio label="年度后3月">3</Radio>
                                <Radio label="年度后4月">4</Radio>
                                <Radio label="年度后5月">5</Radio>
                                <Radio label="年度后6月">6</Radio>
                                <Radio label="年度后7月">7</Radio>
                                <Radio label="年度后8月">8</Radio>
                                <Radio label="年度后9月">9</Radio>
                                <Radio label="年度后10月">10</Radio>
                                <Radio label="年度后11月">11</Radio>
                                <Radio label="年度后12月">12</Radio>
                            </Radio-group>
                        </Col>
                        <Col span="12">
                            <span class="firstMonthTxt">{{ chartSetting.firstMonth }}</span> 对比 <span class="secendMonthTxt">{{ chartSetting.secondMonth }}</span>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item>
                    <Button type="primary" @click="getChartMAP()">生成图表</Button>
                    <Button icon="arrow-down-a" @click="exportChart()">导出</Button>
                </Form-item>
            </Form>
        </Col>
        <!--右侧-->
        <Col span="14">
            <div class="chartTitle">{{title}}</div>
            <chart :options="chartOption" class="chart" auto-resize></chart>
        </Col>
    </Row>
</template>
<script>
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'

import dateformat from 'dateformat'
import { getODataApi } from './../../config/apiConfig.js'
import httpUtility from './../../utility/httpUtility.js'
import usdaColumns from './../../config/Usda/usdaColumns.js'
import o from 'o.js'
import urlAppend from 'url-append'

export default {
    created () {
//        let xx = usdaColumns[this.$route.query.name].filter(function (item) {
//            return item.type === 'Number'
//        })
//        this.chartDataSetting = xx
//        this.chartSetting.dataItem = xx[0].key
    },
    data () {
        return {
            title: this.$route.query.name + ' ' + '月份对比',
            chartSetting: {
                startDate: new Date().setFullYear(1995, 5, 1),
                endDate: new Date().setFullYear(2017, 12, 31),
                chartType: 'abs',
                dataItem: '',
                firstMonth: '年度前5月',
                secondMonth: '年度前5月'
            },
            chartOption: {
                title: {
                    text: ''
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer: {
                        label: {
                            show: true
                        },
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    formatter: function (params) {
                        params = params[0]
                        return params.seriesName + ':' + Number(params.value).toFixed(2)
                    }
                },
                legend: {
                    // show: false,
                    data: ['对比'],
                    align: 'right',
                    right: '10%'
                },
                yAxis: {
                    axisLabel: {
                        formatter: null
                    }
                },
                xAxis: {
                    data: [],
                    axisLabel: {
                        interval: 0,
                        rotate: 90
                    }
                },
                series: [{
                    name: '对比',
                    type: 'line',
                    data: []
                }]
            }
        }
    },
    watch: {
    },
    computed: {
        chartDataSetting () {
            let xx = usdaColumns[this.$route.query.name].filter(function (item) {
                return item.type === 'Number'
            })
            this.chartSetting.dataItem = xx[0].key
            return xx
        },
        chartTypeString: function () {
            var type = '绝对量'
            if (this.chartSetting.chartType === 'abs') {
                type = '绝对量'
            } else if (this.chartSetting.chartType === 'percent') {
                type = '百分比'
            }
            return type
        },
        chartTitle: function () {
            return this.$route.query.name + ' 月份对比 ' + this.chartSetting.firstMonth + '对比' + this.chartSetting.secondMonth + this.chartTypeString
        },
        payload: function () {
            var payload = {
                ChartType: this.chartSetting.chartType,
                Variety: this.$route.query.name,
                StartTime: dateformat(this.chartSetting.startDate, 'yyyy') + '-01-01',
                EndTime: dateformat(this.chartSetting.endDate, 'yyyy') + '-12-31',
                DataItem: this.chartSetting.dataItem,
                FirstMonth: this.chartSetting.firstMonth,
                SecondMonth: this.chartSetting.secondMonth
            }

            return payload
        }
    },
    methods: {
        chartdataing () {
        },
        getChartMAP: function () {
            var url = getODataApi('ChartMAP')
            var filter = this.payload
            if (filter.Variety === 'Wheat') {
                filter.Variety = 'Wheats'
            }
            if (filter.Variety === 'Sugar') {
                filter.Variety = 'Sugars'
            }
            var queryString = httpUtility.queryString(filter)

            url = url + '?' + queryString
            url = encodeURI(url)
            o(urlAppend(url, {r: Math.random()})).get().then(
                (response) => {
                    this.title = this.chartTitle
                    this.chartOption.xAxis.data = response.data.xAxisData

                    var seriesData = response.data.seriesData
                    if (this.chartSetting.chartType === 'percent') {
                        this.chartOption.yAxis.axisLabel.formatter = '{value} %'
                        for (var i = 0; i < seriesData.length; i++) {
                            seriesData[i] = seriesData[i] * 100
                        }
                    } else {
                        this.chartOption.yAxis.axisLabel.formatter = null
                    }

                    this.chartOption.series[0].data = seriesData
                },
                (response) => {
                    this.$Message.error('数据调用异常', 1)
                }
            )
        },
        exportChart: function () {
            var url = getODataApi('ExportChartMAP')
            var filter = this.payload
            if (filter.Variety === 'Wheat') {
                filter.Variety = 'Wheats'
            }
            if (filter.Variety === 'Sugar') {
                filter.Variety = 'Sugars'
            }
            var queryString = httpUtility.queryString(filter)

            url = url + '?' + queryString
            url = encodeURI(url)
            o(urlAppend(url, {r: Math.random()})).get().then(
                (response) => {
                    httpUtility.download(this, response.data.downloadUrl)
                },
                (response) => {
                    this.$Message.error('数据调用异常', 1)
                }
            )
        }
    }
}
</script>
<style type="text/css" scoped>
.monthComparer {
    min-height: 400px;
    width: 40px;
}

.firstMonthTxt {
    color: green;
    font-weight: bold;
}

.secendMonthTxt {
    color: red;
    font-weight: bold;
}

.chart {
    margin-left: 20px;
}
.chartTitle{
    margin-left: 60px;
    font-size: 16px;
    font-weight: bold;
}
</style>
