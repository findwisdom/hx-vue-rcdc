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
                <Form-item label="数据项">
                    <Radio-group v-model="chartSetting.dataItem">
                        <template v-for="item in chartDataSetting">
                            <Radio :label="item.key">{{item.title}}</Radio>
                        </template>
                    </Radio-group>
                </Form-item>
                <Form-item>
                    <Button type="primary" @click="getChartMAP()">生成图表</Button>
                    <Button icon="arrow-down-a" @click="exportChart()">导出</Button>
                </Form-item>
            </Form>
        </Col>
        <Col span="14">
            <div class="chartTitle">{{title}}</div>
            <chart :options="chartOption" class="chart" auto-resize></chart>
        </Col>
    </Row>
</template>
<script>
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'

import dateformat from 'dateformat'
import { getODataApi } from './../../config/apiConfig.js'
import usdaColumns from './../../config/Usda/usdaColumns.js'
import httpUtility from './../../utility/httpUtility.js'
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
            title: '最新年度数据',
            chartSetting: {
                startDate: new Date().setFullYear(2007, 1, 1),
                endDate: new Date(),
                dataItem: ''
            },
            chartOption: {
                title: {
                    text: ''
                },
                tooltip: {
                    formatter: function (params) {
                        return params.name + ':' + Number(params.data).toFixed(2)
                    }
                },
                legend: {
                    data: ['最新年度数据'],
                    align: 'right',
                    right: '10%'
                },
                xAxis: {
                    data: [],
                    axisLabel: {
                        interval: 0,
                        rotate: 90
                    }
                },
                yAxis: {},
                series: [{
                    name: '最新年度数据',
                    type: 'bar',
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
        chartTitle: function () {
            return this.chartSetting.dataItem + '最新年度数据 '
        },
        payload: function () {
            var payload = {
                Variety: this.$route.query.name,
                StartTime: dateformat(this.chartSetting.startDate, 'yyyy') + '-05-01',
                EndTime: dateformat(this.chartSetting.endDate, 'yyyy') + '-12-31',
                DataItem: this.chartSetting.dataItem
            }

            return payload
        }
    },
    methods: {
        getChartMAP: function () {
            var url = getODataApi('YearlyData')
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
                    this.chartOption.series[0].data = response.data.seriesData
                },
                (response) => {
                    this.$Message.error('数据调用异常', 1)
                }
            )
        },
        exportChart: function () {
            var url = getODataApi('ExportYearlyData')
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
.chart {
    margin-left: 20px;
}
.chartTitle{
    margin-left: 60px;
    font-size: 16px;
    font-weight: bold;
}
</style>
