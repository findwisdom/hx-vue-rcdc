<template>
    <Row>
        <!--左侧-->
        <Col span="8">
            <Form :model="chartSetting" :label-width="80">
                <Form-item label="年度">
                    <Checkbox-group v-model="chartSetting.years">
                        <Checkbox :label="year.value" v-for="year in years" :key="year.value">{{ year.name }}</Checkbox>
                    </Checkbox-group>
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

        <!--右侧-->
        <Col span="16">
            <chart :options="chartOption" class="chart" auto-resize style="height: 500px"></chart>
        </Col>
    </Row>
</template>
<script>
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

// mport radioCheck from 'vue-radio-checkbox'
import usdaColumns from './../../config/Usda/usdaColumns.js'
import { getODataApi } from './../../config/apiConfig.js'
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
            years: [],
            chartSetting: {
                years: [],
                dataItem: ''
            },
            chartOption: {
                title: {
                    text: ''
                },
                grid: {
                    top: '90px'
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
                        let data = ''
                        params.forEach(function (item) {
                            data = data + item.seriesName + ': ' + Number(item.data).toFixed(2) + '<br/>'
                        })
                        return data
                    }
                },
                legend: {
                    data: [],
                    align: 'right',
                    right: '10%'
                },
                xAxis: {
                    data: [],
                    axisLabel: {
                        interval: 0

                    }
                },
                yAxis: {},
                series: [{
                    name: '',
                    type: 'line',
                    data: []
                }]
            }
        }
    },
    mounted: function () {
        for (var i = 2000; i <= new Date().getFullYear(); i++) {
            var nextYear = i + 1
            var nextYearStr = nextYear.toString()
            var nextyearlyStr = nextYearStr.substring(nextYearStr.length - 2)
            this.years.push({name: i + '/' + nextyearlyStr, value: i})
        }
    },
    watch: {
    },
    computed: {
        chartDataSetting () {
            let VariCode = this.$route.query.name
            if (!usdaColumns[VariCode]) {
                VariCode = 'Soybeans'
            }
            let xx = usdaColumns[VariCode].filter(function (item) {
                return item.type === 'Number'
            })
            this.chartSetting.dataItem = xx[0].key
            return xx
        },
        chartTitle: function () {
            return '数据调整路径 ' + this.chartSetting.dataItem
        },
        payload: function () {
            let payload = {
                Variety: this.$route.query.name,
                Years: this.chartSetting.years,
                DataItem: this.chartSetting.dataItem
            }

            return payload
        }
    },
    methods: {
        getChartMAP: function () {
            let _self = this
            if (this.chartSetting.years.length === 0) {
                this.$Message.error('至少要选择一个年份', 1)
                return
            }
            var url = getODataApi('AdjustmentPath')
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
                    if (response.data.xAxisData.length === 0) {
                        _self.$Notice.open({
                            title: '提示',
                            desc: '暂无数据'
                        })
                        return
                    }
                    this.chartOption.xAxis.data = response.data.xAxisData
                    this.chartOption.series = response.data.series
                    this.chartOption.legend.data = response.data.legendData
                },
                (response) => {
                    this.$Message.error('数据调用异常', 1)
                }
            )
        },
        exportChart: function () {
            if (this.chartSetting.years.length === 0) {
                this.$Message.error('至少要选择一个年份', 1)
                return
            }

            var url = getODataApi('ExportAdjustmentPath')
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
