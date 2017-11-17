<template>
<div class="template">
<Row>
    <Col span="2" class="exch-list">
        <Input v-model="filterVariCode" placeholder="请输入品种..." class="filter-vari"></Input>
        <Menu ref="leftMenu" :accordion="accordion" :active-name="variCode" :open-names="openNames" @on-select="changeVari">
            <Submenu name="A">
                <template slot="title">
                    上海期货交易所
                </template>
                <Menu-item :class="{'init-active': variCode === vari.VariCode}" :name="vari.VariCode" :key="vari.VariCode" v-for="vari in shVariDict">
                    {{vari.VariName}} ({{vari.VariCode}})
                </Menu-item>
            </Submenu>
            <Submenu name="C">
                <template slot="title">
                    郑州商品交易所
                </template>
                <Menu-item :class="{'init-active': variCode === vari.VariCode}" :name="vari.VariCode" :key="vari.VariCode" v-for="vari in zzVariDict">
                    {{vari.VariName}} ({{vari.VariCode}})
                </Menu-item>
            </Submenu>
            <Submenu name="B">
                <template slot="title">
                    大连商品交易所
                </template>
                <Menu-item :class="{'init-active': variCode === vari.VariCode}" :name="vari.VariCode" :key="vari.VariCode" v-for="vari in dlVariDict">
                    {{vari.VariName}} ({{vari.VariCode}})
                </Menu-item>
            </Submenu>
        </Menu>
    </Col>
    <Col span="22" class="exch-content">
        <!-- <Row  class="breadcrumb">
            <Breadcrumb>
                <Breadcrumb-item href="/FutureHoldData/cu">持仓排名列表</Breadcrumb-item>
                <Breadcrumb-item>持仓排名详细</Breadcrumb-item>
            </Breadcrumb>
        </Row> -->
        <div class="header no-border">
            <h2 >会员名称：{{custName}}
                <Button type="primary" class="pull-right" @click="back()"> 返回</Button>
            </h2>
        </div>
        <Row class="exch-filter">
            <Col span="5" class="search">
                <span>开始日期：</span>
                <Date-picker type="date" :editable="editable" :clearable="clearable" v-model="startDate" placeholder="" ></Date-picker>
            </Col>
            <Col span="5" class="search">
                <span class="m-l">结束日期：</span>
                <Date-picker type="date" :editable="editable" :clearable="clearable" v-model="endDate" placeholder="" ></Date-picker>
            </Col>
            <Col  span="5">
                <Button type="primary" icon="ios-search" @click="searchData()">查询</Button>
            </Col>
            <Col span="9">
                <Button type="success" class="btn-download" v-on:click="downExl()" title="导出Excel">
                    <Icon type="ios-cloud-download-outline"></Icon>
                </Button>
            </Col>
        </Row>
        <Row>
            <p class="vari-text">品种：{{selectVari.VariName}} ({{variCode}})</p>
        </Row>
        <Row class="ecxh-table">
            <Row type="flex" justify="end">
                <Col class="filter-1" span="1">
                </Col>
                <Col class="filter-2" span="4">
                    <div class="table-title">
                        <Select class="select1" @on-change="handleChange" v-model="deliv1" filterable style="width:120px">
                            <Option v-for="(item, index) in delivList" :value="item" :key="item">{{item}}</Option>
                        </Select>
                    </div>
                </Col>
                <Col class="filter-3" span="4">
                    <div class="table-title">
                        <Select class="select2" @on-change="handleChange2" v-model="deliv2" filterable style="width:120px">
                            <Option v-for="(item, index) in delivList" :value="item" :key="item">{{item}}</Option>
                        </Select>
                    </div>
                </Col>
                <Col class="filter-4" span="4">
                    <div class="table-title">
                        <Select class="select3" @on-change="handleChange3" v-model="deliv3" filterable style="width:120px">
                            <Option v-for="(item, index) in delivList" :value="item" :key="item">{{item}}</Option>
                        </Select>
                    </div>
                </Col>
                <Col class="filter-5 tab-total-title" span="2">
                    <div class="table-title">
                        <a class="info text" href="javascript:void(0)">
                            <template>所有交割月份合约</template>
                        </a>
                    </div>
                </Col>
            </Row>
            <Row>
                <template v-if="loadingTab">
                    <Col span="24">
                        <Table class="fd-detail-tab" border stripe :columns="tabColumns" :data="tabDatas"></Table>
                        <div class="tab-page">
                            <Page :total="totalCount" :current="currentPage" :page-size-opts="pageSizeOpts" :page-size="pageSize" @on-change="changeCurPage" @on-page-size-change="changePageSize" show-total show-sizer></Page>
                        </div>
                    </Col>
                </template>
                <template v-else>
                    <div class="loading-icon">
                        <Spin fix>
                            <Icon type="load-c" size=40 class="icon-load"></Icon>
                            <div>Loading</div>
                        </Spin>
                    </div>
                </template>
            </Row>
        </Row>
        <Row class="exch-echart">
            <Row>
                <div class="header no-border">
                    <h2 class="m-t-md">多空走势图</h2>
                </div>
                <Col span="6">
                    <chart :options="chartOption1_1" class="chart" auto-resize></chart>
                </Col>
                <Col span="6">
                    <chart :options="chartOption2_1" class="chart" auto-resize></chart>
                </Col>
                <Col span="6">
                    <chart :options="chartOption3_1" class="chart" auto-resize></chart>
                </Col>
                <Col span="6">
                    <chart :options="chartOption4_1" class="chart" auto-resize></chart>
                </Col>
            </Row>
            <Row>
                <div class="header no-border">
                    <h2 class="m-t-md">买单增减</h2>
                </div>
                <Col span="6">
                    <chart :options="chartOption1_2" class="chart" auto-resize></chart>
                </Col>
                <Col span="6">
                    <chart :options="chartOption2_2" class="chart" auto-resize></chart>
                </Col>
                <Col span="6">
                    <chart :options="chartOption3_2" class="chart" auto-resize></chart>
                </Col>
                <Col span="6">
                    <chart :options="chartOption4_2" class="chart" auto-resize></chart>
                </Col>
            </Row>
            <Row>
                <div class="header no-border">
                    <h2 class="m-t-md">卖单增减</h2>
                </div>
                <Col span="6">
                    <chart :options="chartOption1_3" class="chart" auto-resize></chart>
                </Col>
                <Col span="6">
                    <chart :options="chartOption2_3" class="chart" auto-resize></chart>
                </Col>
                <Col span="6">
                    <chart :options="chartOption3_3" class="chart" auto-resize></chart>
                </Col>
                <Col span="6">
                    <chart :options="chartOption4_3" class="chart" auto-resize></chart>
                </Col>
            </Row>
        </Row>
    </Col>
</Row>
</div>
</template>
<script>
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import o from 'o.js'
import * as exchDict from './../../config/ExchData/exchDict.js'
import { mapGetters } from 'vuex'
import { getExchODataApi } from './../../config/apiConfig.js'
import httpUtility from './../../utility/httpUtility.js'
import $ from 'jquery'
// import clone from 'clone'
export default {
    name: 'FutureHoldData',
    data () {
        let url = this.$baseUrl.exchDataApiUrl + 'FutureHoldData'
        return {
            api: url,
            selectVari: {
                VariName: ''
            },
            openNames: [],
            accordion: true,
            initVal: false,
            variCode: '',
            custName: '',
            oldYear: '',
            startDate: '',
            endDate: '',
            editable: false,
            clearable: false,
            filterVariCode: '',
            delivList: [],
            enabledDate: [],
            deliv1: '',
            open1: false,
            deliv2: '',
            open2: false,
            deliv3: '',
            open3: false,
            zzVari: [],
            dlVari: [],
            shVari: [],
            loadingTab: false,
            tabData: [],
            tabDatas: [],
            tabShow1: false,
            tabShow2: false,
            tabShow3: false,
            totalCount: 0,
            currentPage: 1,
            pageSize: 10,
            pageSizeOpts: [10, 50, 100],
            tabColumns: [
                {
                    key: 'Date',
                    title: '日期'
                },
                {
                    key: 'PurNum',
                    title: '持买单量'
                },
                {
                    key: 'SellNum',
                    title: '持卖单量'
                },
                {
                    key: 'PurNum_CHG',
                    title: '买量增减'
                },
                {
                    key: 'SellNum_CHG',
                    title: '卖量增減'
                },
                {
                    key: 'PurNum2',
                    title: '持买单量'
                },
                {
                    key: 'SellNum2',
                    title: '持卖单量'
                },
                {
                    key: 'PurNum_CHG2',
                    title: '买量增减'
                },
                {
                    key: 'SellNum_CHG2',
                    title: '卖量增減'
                },
                {
                    key: 'PurNum3',
                    title: '持买单量'
                },
                {
                    key: 'SellNum3',
                    title: '持卖单量'
                },
                {
                    key: 'PurNum_CHG3',
                    title: '买量增减'
                },
                {
                    key: 'SellNum_CHG3',
                    title: '卖量增減'
                },
                {
                    key: 'PurNum4',
                    title: '持买单量'
                },
                {
                    key: 'SellNum4',
                    title: '持卖单量'
                },
                {
                    key: 'PurNum_CHG4',
                    title: '买量增减'
                },
                {
                    key: 'SellNum_CHG4',
                    title: '卖量增減'
                }
            ],
            data: [],
            chartOption1_1: {
                title: {
                    text: '',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['持买单量', '持卖单量']
                },
                calculable: true,
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            rotate: 30,
                            formatter: '{value}'
                        },
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [{
                    name: '持买单量',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#FF0000',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: ''
                            }
                        }
                    },
                    data: []
                }, {
                    name: '持卖单量',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#00CC66',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: ''
                            }
                        }
                    },
                    data: []
                }]
            },
            chartOption1_2: {
                title: {
                    x: 'center',
                    text: ''
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    // show: false,
                    data: [],
                    align: 'right',
                    right: '10%'
                },
                yAxis: {
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                xAxis: {
                    data: [],
                    axisLabel: {
                        alignWithLabel: true,
                        rotate: 30,
                        formatter: '{value}'
                    }
                },
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#FF0000',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: '' // {b}\n{c}
                            }
                        }
                    },
                    data: []
                }]
            },
            chartOption1_3: {
                title: {
                    x: 'center',
                    text: ''
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    // show: false,
                    data: [],
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
                        alignWithLabel: true,
                        rotate: 30,
                        formatter: '{value}'
                    }
                },
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#00CC66',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: ''
                            }
                        }
                    },
                    data: []
                }]
            },
            chartOption2_1: {
                title: {
                    text: '',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['持买单量', '持卖单量']
                },
                calculable: true,
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            rotate: 30,
                            formatter: '{value}'
                        },
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [{
                    name: '持买单量',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#FF0000',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: ''
                            }
                        }
                    },
                    data: []
                }, {
                    name: '持卖单量',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#00CC66',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: ''
                            }
                        }
                    },
                    data: []
                }]
            },
            chartOption2_2: {
                title: {
                    x: 'center',
                    text: ''
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    // show: false,
                    data: [],
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
                        alignWithLabel: true,
                        rotate: 30,
                        formatter: '{value}'
                    }
                },
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#FF0000',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: ''
                            }
                        }
                    },
                    data: []
                }]
            },
            chartOption2_3: {
                title: {
                    x: 'center',
                    text: ''
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    // show: false,
                    data: [],
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
                        alignWithLabel: true,
                        rotate: 30,
                        formatter: '{value}'
                    }
                },
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#00CC66',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: ''
                            }
                        }
                    },
                    data: []
                }]
            },
            chartOption3_1: {
                title: {
                    text: '',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['持买单量', '持卖单量']
                },
                calculable: true,
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            rotate: 30,
                            formatter: '{value}'
                        },
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [{
                    name: '持买单量',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#FF0000',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: ''
                            }
                        }
                    },
                    data: []
                }, {
                    name: '持卖单量',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#00CC66',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: ''
                            }
                        }
                    },
                    data: []
                }]
            },
            chartOption3_2: {
                title: {
                    x: 'center',
                    text: ''
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    // show: false,
                    data: [],
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
                        alignWithLabel: true,
                        rotate: 30,
                        formatter: '{value}'
                    }
                },
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#FF0000',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: ''
                            }
                        }
                    },
                    data: []
                }]
            },
            chartOption3_3: {
                title: {
                    x: 'center',
                    text: ''
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    // show: false,
                    data: [],
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
                        alignWithLabel: true,
                        rotate: 30,
                        formatter: '{value}'
                    }
                },
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#00CC66',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: ''
                            }
                        }
                    },
                    data: []
                }]
            },
            chartOption4_1: {
                title: {
                    text: '',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['持买单量', '持卖单量']
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: {
                            rotate: 30,
                            formatter: '{value}'
                        },
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
                },
                series: [{
                    name: '持买单量',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#FF0000',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: ''
                            }
                        }
                    },
                    data: []
                }, {
                    name: '持卖单量',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#00CC66',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: ''
                            }
                        }
                    },
                    data: []
                }]
            },
            chartOption4_2: {
                title: {
                    x: 'center',
                    text: ''
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    // show: false,
                    data: [],
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
                        alignWithLabel: true,
                        rotate: 30,
                        formatter: '{value}'
                    }
                },
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#FF0000',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: ''
                            }
                        }
                    },
                    data: []
                }]
            },
            chartOption4_3: {
                title: {
                    x: 'center',
                    text: ''
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    // show: false,
                    data: [],
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
                        alignWithLabel: true,
                        rotate: 30,
                        formatter: '{value}'
                    }
                },
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#00CC66',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: ''
                            }
                        }
                    },
                    data: []
                }]
            }
        }
    },
    mounted: function () {
        this.shVari = exchDict.shVari
        this.dlVari = exchDict.dlVari
        this.zzVari = exchDict.zzVari
        var custName = this.$route.params.CustName
        this.custName = custName
        var variCode = this.$route.params.VariCode
        this.variCode = variCode
        var variArr = [this.shVari, this.dlVari, this.zzVari]
        for (var i = 0; i < variArr.length; i++) {
            for (var j = 0; j < variArr[i].length; j++) {
                if (variArr[i][j].VariCode === variCode) {
                    this.selectVari = variArr[i][j]
                }
            }
        }
        this.openNames = [this.selectVari.ExchCode]
        this.$nextTick(function () {
            this.$refs.leftMenu.updateOpened()
            this.$refs.leftMenu.updateActiveName()
        })
        this.initVal = true
        this.initData()
    },
    watch: {
        'startDate': {
            handler: function (val, oldVal) {
                var year = ''
                if (val instanceof Date) {
                    year = val.getFullYear()
                } else {
                    year = parseInt(val.split('-')[0])
                }
                if (oldVal === '') {
                    this.oldYear = year
                }
            },
            deep: true
        }

    },
    computed: {
        ...mapGetters({
            fdLastDate: 'fdLastDate'
        }),
        shVariDict: function () {
            var patt = new RegExp(this.filterVariCode, 'i')
            var result = this.shVari.filter((item) => {
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
        zzVariDict: function () {
            var patt = new RegExp(this.filterVariCode, 'i')
            var result = this.zzVari.filter((item) => {
                return patt.test(item.VariCode) || patt.test(item.VariCode.toLowerCase()) || patt.test(item.VariName)
            })
            return result
        },
        dlVariDict: function () {
            var patt = new RegExp(this.filterVariCode, 'i')
            var result = this.dlVari.filter((item) => {
                return patt.test(item.VariCode) || patt.test(item.VariCode.toLowerCase()) || patt.test(item.VariName)
            })
            return result
        },
        chartTitle1: function () {
            if (this.filterType === '1') {
                return '持买单量'
            } else if (this.filterType === '2') {
                return '买单增量'
            } else if (this.filterType === '3') {
                return '卖单增量'
            }
        },
        chartTitle2: function () {
            if (this.filterType === '1') {
                return '持卖单量'
            } else if (this.filterType === '2') {
                return '买单减量'
            } else if (this.filterType === '3') {
                return '卖单减量'
            }
        },
        delivList2: function () {
            if (this.startDate && this.endDate) {
                this.getAllDeliv()
            }
        }
    },
    updated () {
        // 设置宽度
        let wrapWidth = $('.ivu-table-wrapper').width()
        let tableWidth = $('.ivu-table-header table').width()
        if (tableWidth < wrapWidth) {
            $('.ivu-table-wrapper').width(tableWidth)
        }
    },
    methods: {
        tableFn () {
            return {}
        },
        addFn () {
            return {}
        },
        back: function () {
            this.$router.push({name: 'FutureHoldData', params: {VariCode: this.variCode}, query: {filterType: this.$route.query.filterType}})
        },
        initData: function () {
            if (this.fdLastDate) {
                this.endDate = new Date(this.fdLastDate)
                var startDate = new Date(this.fdLastDate)
                startDate.setDate(startDate.getDate() - 30)
                this.startDate = new Date(startDate)
                this.getAllDeliv()
            } else {
                var _this = this
                var url = getExchODataApi(`FutureHoldData?$select=Date&$orderby=Date desc&$top=1`)
                o(url).get().then(
                    (response) => {
                        if (response.data.length > 0) {
                            _this.endDate = new Date(response.data[0].Date.substr(0, 10))
                            let startDate = new Date(response.data[0].Date.substr(0, 10))
                            startDate.setDate(startDate.getDate() - 30)
                            _this.startDate = new Date(startDate)
                            _this.getAllDeliv()
                        } else {
                            _this.endDate = new Date()
                            let startDate = new Date()
                            startDate.setDate(startDate.getDate() - 30)
                            _this.startDate = new Date(startDate)
                            _this.getAllDeliv()
                        }
                    }
                ).fail(function (ex) {
                    this.$Message.error('数据调用异常', 1)
                })
            }
        },
        // 获取所有的交割期
        getAllDeliv: function () {
            if (!this.selectVari) {
                this.variCode = this.$route.params.VariCode
                var variArr = [this.shVari, this.dlVari, this.zzVari]
                for (var i = 0; i < variArr.length; i++) {
                    for (var j = 0; j < variArr[i].length; j++) {
                        if (variArr[i][j].VariCode === this.variCode) {
                            this.selectVari = variArr[i][j]
                        }
                    }
                }
            }
            var variCode = this.variCode
            var custName = this.custName
            var startDate = this.setDate(this.startDate)
            var endDate = this.setDate(this.endDate)
            var delivUrl = getExchODataApi(`FutureHoldData?$select=DelivDate&$filter=(VariCode eq '${variCode}' and CustName eq '${custName}' and Date ge ${startDate} and Date le ${endDate} and (PurNum ne 0 or PurNum_CHG ne 0 or SellNum ne 0 or SellNum_CHG ne 0))&$orderby=DelivDate`)
            o(delivUrl).get().then(
                (response) => {
                    var data = response.data
                    var dataArr = []
                    for (var i = 0; i < data.length; i++) {
                        dataArr.push(this.variCode + data[i].DelivDate)
                    }
                    dataArr = Array.from(new Set(dataArr))
                    this.delivList = dataArr
                    this.setDelivDate()
                    this.getEnabledDateAndGetAllTab()
                }
            ).fail(function (ex) {
                this.$Message.error('数据调用异常', 1)
            })
        },
        // 搜索
        searchData: function () {
            if (!this.selectVari) {
                this.variCode = this.$route.params.VariCode
                var variArr = [this.shVari, this.dlVari, this.zzVari]
                for (var i = 0; i < variArr.length; i++) {
                    for (var j = 0; j < variArr[i].length; j++) {
                        if (variArr[i][j].VariCode === this.variCode) {
                            this.selectVari = variArr[i][j]
                        }
                    }
                }
            }
            var variCode = this.variCode
            var custName = this.custName
            var startDate = this.setDate(this.startDate)
            var endDate = this.setDate(this.endDate)
            var delivUrl = getExchODataApi(`FutureHoldData?$select=DelivDate&$filter=(VariCode eq '${variCode}' and CustName eq '${custName}' and Date ge ${startDate} and Date le ${endDate})&$orderby=DelivDate`)
            o(delivUrl).get().then(
                (response) => {
                    var data = response.data
                    var dataArr = []
                    for (var i = 0; i < data.length; i++) {
                        dataArr.push(this.variCode + data[i].DelivDate)
                    }
                    dataArr = Array.from(new Set(dataArr))
                    this.delivList = dataArr
                    this.getEnabledDateAndGetAllTab()
                }
            ).fail(function (ex) {
                this.$Message.error('数据调用异常', 1)
            })
        },
        setDelivDate: function () {
            var year = ''
            if (this.startDate instanceof Date) {
                year = this.startDate.getFullYear()
            } else {
                year = parseInt(this.startDate.split('-')[0])
            }
            var deliv1 = ''
            var deliv2 = ''
            var deliv3 = ''
            if (this.selectVari.ExchCode === 'C') {
                deliv1 = this.variCode + year.toString().substr(3, 3) + '05'
                deliv2 = this.variCode + year.toString().substr(3, 3) + '09'
                deliv3 = this.variCode + (year + 1).toString().substr(3, 3) + '01'
            } else {
                deliv1 = this.variCode + year.toString().substr(2, 4) + '05'
                deliv2 = this.variCode + year.toString().substr(2, 4) + '09'
                deliv3 = this.variCode + (year + 1).toString().substr(2, 4) + '01'
            }
            var dataStr = this.delivList.join(',')
            if (dataStr.indexOf(deliv1) === -1) {
                this.deliv1 = ''
            } else {
                this.deliv1 = deliv1
            }
            if (dataStr.indexOf(deliv2) === -1) {
                this.deliv2 = ''
            } else {
                this.deliv2 = deliv2
            }
            if (dataStr.indexOf(deliv3) === -1) {
                this.deliv3 = ''
            } else {
                this.deliv3 = deliv3
            }
            this.oldYear = year
        },
        getEnabledDateAndGetAllTab: function () {
            var variCode = this.variCode
            var custName = this.custName
            var startDate = this.setDate(this.startDate)
            var endDate = this.setDate(this.endDate)
            var delivUrl = getExchODataApi(`FutureHoldData?$select=Date&$filter=(VariCode eq '${variCode}' and CustName eq '${custName}' and Date ge ${startDate} and Date le ${endDate} and (PurNum ne 0 or PurNum_CHG ne 0 or SellNum ne 0 or SellNum_CHG ne 0))&$orderby=Date`)
            o(delivUrl).get().then(
                (response) => {
                    var data = response.data
                    var dateArr = []
                    for (var i = 0; i < data.length; i++) {
                        dateArr.push(data[i].Date)
                    }
                    dateArr = Array.from(new Set(dateArr))
                    this.enabledDate = dateArr
                    this.totalCount = dateArr.length
                    this.currentPage = 1
                    if (this.totalCount === 0) {
                        this.tabDatas = []
                    }
                    this.getAllTabData()
                }
            ).fail(function (ex) {
                this.$Message.error('数据调用异常', 1)
            })
        },
        query: function () {
            if (this.startDate) {
                var year = ''
                if (this.startDate instanceof Date) {
                    year = this.startDate.getFullYear()
                } else {
                    year = parseInt(this.startDate.split('-')[0])
                }
                if (this.oldYear.toString() !== year.toString()) {
                    this.oldYear = year
                    this.getAllDeliv()
                } else {
                    this.getAllTabData()
                }
            }
        },
        changeCurPage: function (currentPage) {
            this.currentPage = currentPage
            this.getAllTabData()
        },
        changePageSize: function (pageSize) {
            this.pageSize = pageSize
            this.getAllTabData()
        },
        setDate: function (date) {
            if (date) {
                if (date instanceof Date) {
                    let year = date.getFullYear()
                    let month = date.getMonth() + 1
                    let day = date.getDate()
                    if (parseInt(month) < 10) {
                        month = '0' + month
                    }
                    date = year + '-' + month + '-' + day
                }
                date = this.toDateTime(date)
            }
            return date
        },
        setFilterDate: function () {
            var start = this.pageSize * (this.currentPage - 1)
            var end = start + (this.pageSize - 1)
            if (end > (this.enabledDate.length - 1)) {
                end = this.enabledDate.length - 1
            }
            var startDate = ''
            var endDate = ''
            if (this.enabledDate.length > 0) {
                startDate = this.setDate(this.enabledDate[start].substr(0, 10))
                endDate = this.setDate(this.enabledDate[end].substr(0, 10))
                return [startDate, endDate]
            } else {
                return false
            }
        },
        getAllTabData: function () {
            var oldUrl = ''
            var oldUrl2 = ''
            var oldUrl3 = ''
            var oldUrl4 = ''
            var deliv1 = this.getDelivDate(this.deliv1)
            var deliv2 = this.getDelivDate(this.deliv2)
            var deliv3 = this.getDelivDate(this.deliv3)
            var variCode = this.variCode
            var custName = this.custName
            var startDate = this.startDate
            var endDate = this.endDate
            if (this.startDate > this.endDate) {
                this.$Message.info('结束日期不得小于开始日期', 1)
                return
            }
            if (this.startDate && this.endDate) {
                var dateArr = this.setFilterDate()
                startDate = dateArr[0]
                endDate = dateArr[1]
                if (startDate && endDate) {
                    if (deliv1) {
                        oldUrl = this.api + `?$filter=(VariCode eq '${variCode}' and CustName eq '${custName}' and contains(DelivDate, '${deliv1}') and Date ge ${startDate} and Date le ${endDate} and (PurNum ne 0 or PurNum_CHG ne 0 or SellNum ne 0 or SellNum_CHG ne 0))&$orderby=Date asc`
                    }
                    if (deliv2) {
                        oldUrl2 = this.api + `?$filter=(VariCode eq '${variCode}' and CustName eq '${custName}' and contains(DelivDate, '${deliv2}') and Date ge ${startDate} and Date le ${endDate} and (PurNum ne 0 or PurNum_CHG ne 0 or SellNum ne 0 or SellNum_CHG ne 0))&$orderby=Date asc`
                    }
                    if (deliv3) {
                        oldUrl3 = this.api + `?$filter=(VariCode eq '${variCode}' and CustName eq '${custName}' and contains(DelivDate, '${deliv3}') and Date ge ${startDate} and Date le ${endDate} and (PurNum ne 0 or PurNum_CHG ne 0 or SellNum ne 0 or SellNum_CHG ne 0))&$orderby=Date asc`
                    }
                    if (this.delivList) {
                        oldUrl4 = this.api + `?$filter=(VariCode eq '${variCode}' and CustName eq '${custName}' and Date ge ${startDate} and Date le ${endDate} and (PurNum ne 0 or PurNum_CHG ne 0 or SellNum ne 0 or SellNum_CHG ne 0))&$orderby=Date asc`
                    }
                }
            }
            var tableData = []
            this.loadingTab = false
            var _this = this
            // 获取echart
            if (oldUrl) {
                o(oldUrl).get().then(
                    (response) => {
                        tableData = response.data
                        _this.setChartData(tableData, _this.chartOption1_1, _this.chartOption1_2, _this.chartOption1_3)
                        var tableData2 = []
                        // 获取echart
                        if (oldUrl2) {
                            o(oldUrl2).get().then(
                                (response) => {
                                    tableData2 = response.data
                                    _this.setChartData(tableData2, _this.chartOption2_1, _this.chartOption2_2, _this.chartOption2_3)
                                    var tableData3 = []
                                    // 获取echart
                                    if (oldUrl3) {
                                        o(oldUrl3).get().then(
                                            (response) => {
                                                tableData3 = response.data
                                                _this.tabData = [tableData, tableData2, tableData3]
                                                _this.setChartData(tableData3, _this.chartOption3_1, _this.chartOption3_2, _this.chartOption3_3)
                                                var tableData4 = []
                                                if (oldUrl4) {
                                                    o(oldUrl4).get().then(
                                                        (response) => {
                                                            tableData4 = response.data
                                                            tableData4 = _this.sumAllData(tableData4)
                                                            _this.tabData = [tableData, tableData2, tableData3, tableData4]
                                                            _this.setTabData(_this.tabData)
                                                            _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                                                            _this.loadingTab = true
                                                        }
                                                    ).fail(function (ex) {
                                                        _this.$Message.error('数据调用异常', 1)
                                                        _this.loadingTab = true
                                                    })
                                                } else {
                                                    _this.tabData = [tableData, tableData2, tableData3, tableData4]
                                                    _this.setTabData(_this.tabData)
                                                    _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                                                    _this.loadingTab = true
                                                }
                                            }
                                        ).fail(function (ex) {
                                            _this.$Message.error('数据调用异常', 1)
                                            _this.loadingTab = true
                                        })
                                    } else {
                                        _this.tabData = [tableData, tableData2, tableData3]
                                        _this.setChartData(tableData3, _this.chartOption3_1, _this.chartOption3_2, _this.chartOption3_3)
                                        var tableData4 = []
                                        if (oldUrl4) {
                                            o(oldUrl4).get().then(
                                                (response) => {
                                                    tableData4 = response.data
                                                    tableData4 = _this.sumAllData(tableData4)
                                                    _this.tabData = [tableData, tableData2, tableData3, tableData4]
                                                    _this.setTabData(_this.tabData)
                                                    _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                                                    _this.loadingTab = true
                                                }
                                            ).fail(function (ex) {
                                                _this.$Message.error('数据调用异常', 1)
                                                _this.loadingTab = true
                                            })
                                        } else {
                                            _this.tabData = [tableData, tableData2, tableData3, tableData4]
                                            _this.setTabData(_this.tabData)
                                            _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                                            _this.loadingTab = true
                                        }
                                    }
                                }
                            ).fail(function (ex) {
                                _this.$Message.error('数据调用异常', 1)
                                _this.loadingTab = true
                            })
                        } else {
                            _this.setChartData(tableData2, _this.chartOption2_1, _this.chartOption2_2, _this.chartOption2_3)
                            var tableData3 = []
                            // 获取echart
                            if (oldUrl3) {
                                o(oldUrl3).get().then(
                                    (response) => {
                                        tableData3 = response.data
                                        _this.tabData = [tableData, tableData2, tableData3]
                                        _this.setChartData(tableData3, _this.chartOption3_1, _this.chartOption3_2, _this.chartOption3_3)
                                        var tableData4 = []
                                        if (oldUrl4) {
                                            o(oldUrl4).get().then(
                                                (response) => {
                                                    tableData4 = response.data
                                                    tableData4 = _this.sumAllData(tableData4)
                                                    _this.tabData = [tableData, tableData2, tableData3, tableData4]
                                                    _this.setTabData(_this.tabData)
                                                    _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                                                    _this.loadingTab = true
                                                }
                                            ).fail(function (ex) {
                                                _this.$Message.error('数据调用异常', 1)
                                                _this.loadingTab = true
                                            })
                                        } else {
                                            _this.tabData = [tableData, tableData2, tableData3, tableData4]
                                            _this.setTabData(_this.tabData)
                                            _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                                            _this.loadingTab = true
                                        }
                                    }
                                ).fail(function (ex) {
                                    _this.$Message.error('数据调用异常', 1)
                                    _this.loadingTab = true
                                })
                            } else {
                                _this.tabData = [tableData, tableData2, tableData3]
                                _this.setChartData(tableData3, _this.chartOption3_1, _this.chartOption3_2, _this.chartOption3_3)
                                var tableData4 = []
                                if (oldUrl4) {
                                    o(oldUrl4).get().then(
                                        (response) => {
                                            tableData4 = response.data
                                            tableData4 = _this.sumAllData(tableData4)
                                            _this.tabData = [tableData, tableData2, tableData3, tableData4]
                                            _this.setTabData(_this.tabData)
                                            _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                                            _this.loadingTab = true
                                        }
                                    ).fail(function (ex) {
                                        _this.$Message.error('数据调用异常', 1)
                                        _this.loadingTab = true
                                    })
                                } else {
                                    _this.tabData = [tableData, tableData2, tableData3, tableData4]
                                    _this.setTabData(_this.tabData)
                                    _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                                    _this.loadingTab = true
                                }
                            }
                        }
                    }
                ).fail(function (ex) {
                    _this.$Message.error('数据调用异常', 1)
                    _this.loadingTab = true
                })
            } else {
                var tableData2 = []
                // 获取echart
                if (oldUrl2) {
                    o(oldUrl2).get().then(
                        (response) => {
                            tableData2 = response.data
                            _this.setChartData(tableData2, _this.chartOption2_1, _this.chartOption2_2, _this.chartOption2_3)
                            var tableData3 = []
                            // 获取echart
                            if (oldUrl3) {
                                o(oldUrl3).get().then(
                                    (response) => {
                                        tableData3 = response.data
                                        _this.tabData = [tableData, tableData2, tableData3]
                                        _this.setChartData(tableData3, _this.chartOption3_1, _this.chartOption3_2, _this.chartOption3_3)
                                        var tableData4 = []
                                        if (oldUrl4) {
                                            o(oldUrl4).get().then(
                                                (response) => {
                                                    tableData4 = response.data
                                                    tableData4 = _this.sumAllData(tableData4)
                                                    _this.tabData = [tableData, tableData2, tableData3, tableData4]
                                                    _this.setTabData(_this.tabData)
                                                    _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                                                    _this.loadingTab = true
                                                }
                                            ).fail(function (ex) {
                                                _this.$Message.error('数据调用异常', 1)
                                                _this.loadingTab = true
                                            })
                                        } else {
                                            _this.tabData = [tableData, tableData2, tableData3, tableData4]
                                            _this.setTabData(_this.tabData)
                                            _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                                            _this.loadingTab = true
                                        }
                                    }
                                ).fail(function (ex) {
                                    _this.$Message.error('数据调用异常', 1)
                                    _this.loadingTab = true
                                })
                            } else {
                                _this.tabData = [tableData, tableData2, tableData3]
                                _this.setChartData(tableData3, _this.chartOption3_1, _this.chartOption3_2, _this.chartOption3_3)
                                var tableData4 = []
                                if (oldUrl4) {
                                    o(oldUrl4).get().then(
                                        (response) => {
                                            tableData4 = response.data
                                            tableData4 = _this.sumAllData(tableData4)
                                            _this.tabData = [tableData, tableData2, tableData3, tableData4]
                                            _this.setTabData(_this.tabData)
                                            _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                                            _this.loadingTab = true
                                        }
                                    ).fail(function (ex) {
                                        _this.$Message.error('数据调用异常', 1)
                                        _this.loadingTab = true
                                    })
                                } else {
                                    _this.tabData = [tableData, tableData2, tableData3, tableData4]
                                    _this.setTabData(_this.tabData)
                                    _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                                    _this.loadingTab = true
                                }
                            }
                        }
                    ).fail(function (ex) {
                        _this.$Message.error('数据调用异常', 1)
                        _this.loadingTab = true
                    })
                } else {
                    var tableData3 = []
                    // 获取echart
                    if (oldUrl3) {
                        o(oldUrl3).get().then(
                            (response) => {
                                tableData3 = response.data
                                _this.tabData = [tableData, tableData2, tableData3]
                                _this.setChartData(tableData3, _this.chartOption3_1, _this.chartOption3_2, _this.chartOption3_3)
                                var tableData4 = []
                                if (oldUrl4) {
                                    o(oldUrl4).get().then(
                                        (response) => {
                                            tableData4 = response.data
                                            tableData4 = _this.sumAllData(tableData4)
                                            _this.tabData = [tableData, tableData2, tableData3, tableData4]
                                            _this.setTabData(_this.tabData)
                                            _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                                            _this.loadingTab = true
                                        }
                                    ).fail(function (ex) {
                                        _this.$Message.error('数据调用异常', 1)
                                        _this.loadingTab = true
                                    })
                                } else {
                                    _this.tabData = [tableData, tableData2, tableData3, tableData4]
                                    _this.setTabData(_this.tabData)
                                    _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                                    _this.loadingTab = true
                                }
                            }
                        ).fail(function (ex) {
                            this.$Message.error('数据调用异常', 1)
                            _this.loadingTab = true
                        })
                    } else {
                        _this.tabData = [tableData, tableData2, tableData3]
                        _this.setChartData(tableData3, _this.chartOption3_1, _this.chartOption3_2, _this.chartOption3_3)
                        var tableData4 = []
                        if (oldUrl4) {
                            o(oldUrl4).get().then(
                                (response) => {
                                    tableData4 = response.data
                                    tableData4 = _this.sumAllData(tableData4)
                                    _this.tabData = [tableData, tableData2, tableData3, tableData4]
                                    _this.setTabData(_this.tabData)
                                    _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                                    _this.loadingTab = true
                                }
                            ).fail(function (ex) {
                                _this.$Message.error('数据调用异常', 1)
                                _this.loadingTab = true
                            })
                        } else {
                            _this.tabData = [tableData, tableData2, tableData3, tableData4]
                            _this.setTabData(_this.tabData)
                            _this.setChartData(tableData4, _this.chartOption4_1, _this.chartOption4_2, _this.chartOption4_3)
                            _this.loadingTab = true
                        }
                    }
                }
            }
        },
        sumAllData: function (data) {
            var dateArr = []
            for (let i = 0; i < data.length; i++) {
                dateArr.push(data[i].Date)
            }
            dateArr = Array.from(new Set(dateArr))
            var tabDatas = []
            for (var k = 0; k < dateArr.length; k++) {
                var obj = {
                    Date: dateArr[k],
                    PurNum: 0,
                    PurNum_CHG: 0,
                    SellNum: 0,
                    SellNum_CHG: 0
                }
                for (let i = 0; i < data.length; i++) {
                    if (data[i].Date === dateArr[k]) {
                        obj.PurNum = this.isNumber(obj.PurNum) + this.isNumber(data[i].PurNum)
                        obj.PurNum_CHG = this.isNumber(obj.PurNum_CHG) + this.isNumber(data[i].PurNum_CHG)
                        obj.SellNum = this.isNumber(obj.SellNum) + this.isNumber(data[i].SellNum)
                        obj.SellNum_CHG = this.isNumber(obj.SellNum_CHG) + this.isNumber(data[i].SellNum_CHG)
                    }
                }
                obj.PurNum = obj.PurNum !== 0 || obj.PurNum_CHG !== 0 ? obj.PurNum : ''
                obj.PurNum_CHG = this.isNumber(obj.PurNum) !== 0 || obj.PurNum_CHG !== 0 ? obj.PurNum_CHG : ''
                obj.SellNum = obj.SellNum !== 0 || obj.SellNum_CHG !== 0 ? obj.SellNum : ''
                obj.SellNum_CHG = this.isNumber(obj.SellNum) !== 0 || obj.SellNum_CHG !== 0 ? obj.SellNum_CHG : ''
                tabDatas.push(obj)
            }
            return tabDatas
        },
        setTabData: function (tabData) {
            this.tabData = tabData
            var dateArr = []
            for (let i = 0; i < tabData.length; i++) {
                if (tabData[i]) {
                    for (let j = 0; j < tabData[i].length; j++) {
                        dateArr.push(tabData[i][j].Date)
                    }
                }
            }
            dateArr = Array.from(new Set(dateArr))
            dateArr.sort()
            var tabDatas = []
            for (var k = 0; k < dateArr.length; k++) {
                var obj = {
                    Date: '',
                    CustName: '',
                    PurNum: '',
                    PurNum_CHG: '',
                    SellNum: '',
                    SellNum_CHG: '',
                    CustName2: '',
                    PurNum2: '',
                    PurNum_CHG2: '',
                    SellNum2: '',
                    SellNum_CHG2: '',
                    CustName3: '',
                    PurNum3: '',
                    PurNum_CHG3: '',
                    SellNum3: '',
                    SellNum_CHG3: '',
                    PurNum4: '',
                    PurNum_CHG4: '',
                    SellNum4: 0,
                    SellNum_CHG4: 0,
                    cellClassName: {
                        PurNum_CHG: '',
                        SellNum_CHG: '',
                        PurNum_CHG2: '',
                        SellNum_CHG2: '',
                        PurNum_CHG3: '',
                        SellNum_CHG3: '',
                        PurNum_CHG4: '',
                        SellNum_CHG4: ''
                    }
                }
                obj.Date = dateArr[k].substr(0, 10)
                for (let i = 0; i < tabData[0].length; i++) {
                    if (this.tabData[0][i].Date === dateArr[k]) {
                        obj.PurNum = this.tabData[0][i].PurNum !== 0 || this.tabData[0][i].PurNum_CHG !== 0 ? this.tabData[0][i].PurNum : ''
                        obj.PurNum_CHG = this.tabData[0][i].PurNum !== 0 || this.tabData[0][i].PurNum_CHG !== 0 ? this.tabData[0][i].PurNum_CHG : ''
                        obj.SellNum = this.tabData[0][i].SellNum !== 0 || this.tabData[0][i].SellNum_CHG !== 0 ? this.tabData[0][i].SellNum : ''
                        obj.SellNum_CHG = this.tabData[0][i].SellNum !== 0 || this.tabData[0][i].SellNum_CHG !== 0 ? this.tabData[0][i].SellNum_CHG : ''
                        obj.cellClassName.PurNum_CHG = this.tabData[0][i].PurNum_CHG >= 0 ? 'cell-red' : 'cell-green'
                        obj.cellClassName.SellNum_CHG = this.tabData[0][i].SellNum_CHG >= 0 ? 'cell-red' : 'cell-green'
                    }
                }
                for (let i = 0; i < this.tabData[1].length; i++) {
                    if (this.tabData[1][i].Date === dateArr[k]) {
                        obj.PurNum2 = this.tabData[1][i].PurNum !== 0 || this.tabData[1][i].PurNum_CHG !== 0 ? this.tabData[1][i].PurNum : ''
                        obj.PurNum_CHG2 = this.tabData[1][i].PurNum !== 0 || this.tabData[1][i].PurNum_CHG !== 0 ? this.tabData[1][i].PurNum_CHG : ''
                        obj.SellNum2 = this.tabData[1][i].SellNum !== 0 || this.tabData[1][i].SellNum_CHG !== 0 ? this.tabData[1][i].SellNum : ''
                        obj.SellNum_CHG2 = this.tabData[1][i].SellNum !== 0 || this.tabData[1][i].SellNum_CHG !== 0 ? this.tabData[1][i].SellNum_CHG : ''
                        obj.cellClassName.PurNum_CHG2 = this.tabData[1][i].PurNum_CHG >= 0 ? 'cell-red' : 'cell-green'
                        obj.cellClassName.SellNum_CHG2 = this.tabData[1][i].SellNum_CHG >= 0 ? 'cell-red' : 'cell-green'
                    }
                }
                for (let i = 0; i < this.tabData[2].length; i++) {
                    if (this.tabData[2][i].Date === dateArr[k]) {
                        obj.PurNum3 = this.tabData[2][i].PurNum !== 0 || this.tabData[2][i].PurNum_CHG !== 0 ? this.tabData[2][i].PurNum : ''
                        obj.PurNum_CHG3 = this.tabData[2][i].PurNum !== 0 || this.tabData[2][i].PurNum_CHG !== 0 ? this.tabData[2][i].PurNum_CHG : ''
                        obj.SellNum3 = this.tabData[2][i].SellNum !== 0 || this.tabData[2][i].SellNum_CHG !== 0 ? this.tabData[2][i].SellNum : ''
                        obj.SellNum_CHG3 = this.tabData[2][i].SellNum !== 0 || this.tabData[2][i].SellNum_CHG !== 0 ? this.tabData[2][i].SellNum_CHG : ''
                        obj.cellClassName.PurNum_CHG3 = this.tabData[2][i].PurNum_CHG >= 0 ? 'cell-red' : 'cell-green'
                        obj.cellClassName.SellNum_CHG3 = this.tabData[2][i].SellNum_CHG >= 0 ? 'cell-red' : 'cell-green'
                    }
                }
                for (let i = 0; i < this.tabData[3].length; i++) {
                    if (this.tabData[3][i].Date === dateArr[k]) {
                        obj.PurNum4 = this.tabData[3][i].PurNum
                        obj.PurNum_CHG4 = this.tabData[3][i].PurNum_CHG
                        obj.SellNum4 = this.tabData[3][i].SellNum
                        obj.SellNum_CHG4 = this.tabData[3][i].SellNum_CHG
                        obj.cellClassName.PurNum_CHG4 = this.isNumber(this.tabData[3][i].PurNum_CHG) >= 0 ? 'cell-red' : 'cell-green'
                        obj.cellClassName.SellNum_CHG4 = this.isNumber(this.tabData[3][i].SellNum_CHG) >= 0 ? 'cell-red' : 'cell-green'
                    }
                }
                tabDatas.push(obj)
            }
            this.tabDatas = tabDatas
            this.initVal = false // 非初始化
            // this.totalCount = dateArr.length
            this.loadingTab = true
        },
        setChartData: function (tableData, chartOption1, chartOption2, chartOption3) {
            var data1 = []
            var data2 = []
            var pData = []
            var sData = []
            var xAxisData = []
            for (let i = 0; i < tableData.length; i++) {
                if (tableData[i].PurNum === 0) {
                    data1.push('')
                } else {
                    data1.push(tableData[i].PurNum)
                }
                if (tableData[i].SellNum === 0) {
                    data2.push('')
                } else {
                    data2.push(tableData[i].SellNum)
                }
                pData.push(tableData[i].PurNum_CHG)
                sData.push(tableData[i].SellNum_CHG)
                xAxisData.push((tableData[i].Date.substr(0, 10)).replace(/-/g, ''))
            }
            chartOption1.xAxis[0].data = xAxisData
            chartOption1.series[0].data = data1
            chartOption1.series[1].data = data2
            chartOption2.xAxis.data = xAxisData
            chartOption2.series[0].data = pData
            chartOption3.xAxis.data = xAxisData
            chartOption3.series[0].data = sData
        },
        isNumber: function (val) {
            if (val === '') {
                return 0
            } else {
                return parseInt(val)
            }
        },
        getDelivDate: function (deliv) {
            if (deliv) {
                deliv = deliv.replace(/[^0-9]/ig, '')
            }
            return deliv
        },
        getTableData1: function () {
            var oldUrl = this.api
            var deliv1 = this.getDelivDate(this.deliv1)
            var variCode = this.variCode
            var custName = this.custName
            var startDate = this.startDate
            var endDate = this.endDate
            if (startDate && endDate && deliv1) {
                if (this.enabledDate.length > 0) {
                    var dateArr = this.setFilterDate()
                    startDate = dateArr[0]
                    endDate = dateArr[1]
                    oldUrl += `?$filter=(VariCode eq '${variCode}' and CustName eq '${custName}' and contains(DelivDate, '${deliv1}') and Date ge ${startDate} and Date le ${endDate} and (PurNum ne 0 or PurNum_CHG ne 0 or SellNum ne 0 or SellNum_CHG ne 0))&$orderby=Date asc`
                } else {
                    oldUrl = ''
                }
            } else {
                oldUrl = ''
            }
            var tableData = []
            var _this = this
            // 获取echart
            if (oldUrl) {
                o(oldUrl).get().then(
                    (response) => {
                        tableData = response.data
                        _this.tabData[0] = tableData
                        _this.setTabData(_this.tabData)
                        _this.setChartData(tableData, this.chartOption1_1, this.chartOption1_2, this.chartOption1_3)
                    }
                ).fail(function (ex) {
                    this.$Message.error('数据调用异常', 1)
                })
            } else {
                _this.tabData[0] = tableData
                _this.setTabData(_this.tabData)
                _this.setChartData(tableData, this.chartOption1_1, this.chartOption1_2, this.chartOption1_3)
            }
        },
        getTableData2: function () {
            var oldUrl = this.api
            var deliv2 = this.getDelivDate(this.deliv2)
            var variCode = this.variCode
            var custName = this.custName
            var startDate = this.startDate
            var endDate = this.endDate
            if (startDate && endDate && deliv2) {
                if (this.enabledDate.length > 0) {
                    var dateArr = this.setFilterDate()
                    startDate = dateArr[0]
                    endDate = dateArr[1]
                    oldUrl += `?$filter=(VariCode eq '${variCode}' and CustName eq '${custName}' and contains(DelivDate, '${deliv2}') and Date ge ${startDate} and Date le ${endDate} and (PurNum ne 0 or PurNum_CHG ne 0 or SellNum ne 0 or SellNum_CHG ne 0))&$orderby=Date asc`
                } else {
                    oldUrl = ''
                }
            } else {
                oldUrl = ''
            }
            // this.$store.dispatch(this.options2.gridKey + '_set_state_data', {url: oldUrl})
            var tableData = []
            var _this = this
            // 获取echart
            if (oldUrl) {
                o(oldUrl).get().then(
                    (response) => {
                        tableData = response.data
                        _this.tabData[1] = tableData
                        _this.setTabData(_this.tabData)
                        _this.setChartData(tableData, this.chartOption2_1, this.chartOption2_2, this.chartOption2_3)
                    }
                ).fail(function (ex) {
                    this.$Message.error('数据调用异常', 1)
                })
            } else {
                _this.tabData[1] = tableData
                _this.setTabData(_this.tabData)
                _this.setChartData(tableData, this.chartOption2_1, this.chartOption2_2, this.chartOption2_3)
            }
        },
        getTableData3: function () {
            var oldUrl = this.api
            var deliv3 = this.getDelivDate(this.deliv3)
            var variCode = this.variCode
            var custName = this.custName
            var startDate = this.startDate
            var endDate = this.endDate
            if (startDate && endDate && deliv3) {
                if (this.enabledDate.length > 0) {
                    var dateArr = this.setFilterDate()
                    startDate = dateArr[0]
                    endDate = dateArr[1]
                    oldUrl += `?$filter=(VariCode eq '${variCode}' and CustName eq '${custName}' and contains(DelivDate, '${deliv3}') and Date ge ${startDate} and Date le ${endDate} and (PurNum ne 0 or PurNum_CHG ne 0 or SellNum ne 0 or SellNum_CHG ne 0))&$orderby=Date asc`
                } else {
                    oldUrl = ''
                }
            } else {
                oldUrl = ''
            }
            // this.$store.dispatch(this.options3.gridKey + '_set_state_data', {url: oldUrl})
            var tableData = []
            var _this = this
            // 获取echart
            if (oldUrl) {
                o(oldUrl).get().then(
                    (response) => {
                        tableData = response.data
                        _this.tabData[2] = tableData
                        _this.setTabData(_this.tabData)
                        _this.setChartData(tableData, this.chartOption3_1, this.chartOption3_2, this.chartOption3_3)
                    }
                ).fail(function (ex) {
                    this.$Message.error('数据调用异常', 1)
                })
            } else {
                _this.tabData[2] = tableData
                _this.setTabData(_this.tabData)
                _this.setChartData(tableData, this.chartOption3_1, this.chartOption3_2, this.chartOption3_3)
            }
        },
        getTableData4: function () {
            var oldUrl = this.api
            var variCode = this.variCode
            var custName = this.custName
            var startDate = this.startDate
            var endDate = this.endDate
            if (startDate && endDate) {
                if (this.enabledDate.length > 0) {
                    var dateArr = this.setFilterDate()
                    startDate = dateArr[0]
                    endDate = dateArr[1]
                    oldUrl += `?$filter=(VariCode eq '${variCode}' and CustName eq '${custName}' and Date ge ${startDate} and Date le ${endDate} and (PurNum ne 0 or PurNum_CHG ne 0 or SellNum ne 0 or SellNum_CHG ne 0))&$orderby=Date asc`
                } else {
                    oldUrl = ''
                }
            } else {
                oldUrl = ''
            }
            // this.$store.dispatch(this.options3.gridKey + '_set_state_data', {url: oldUrl})
            var tableData = []
            var _this = this
            // 获取echart
            if (oldUrl) {
                o(oldUrl).get().then(
                    (response) => {
                        tableData = response.data
                        _this.tabData[3] = tableData
                        _this.setTabData(_this.tabData)
                        _this.setChartData(tableData, this.chartOption4_1, this.chartOption4_2, this.chartOption4_3)
                    }
                ).fail(function (ex) {
                    this.$Message.error('数据调用异常', 1)
                })
            } else {
                _this.tabData[3] = tableData
                _this.setTabData(_this.tabData)
                _this.setChartData(tableData, this.chartOption4_1, this.chartOption4_2, this.chartOption4_3)
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
        },
        stringToDate: function (dateStr, separator) {
            if (!separator) {
                separator = '-'
            }
            var dateArr = dateStr.split(separator)
            var year = parseInt(dateArr[0])
            var month
            // 处理月份为04这样的情况
            if (dateArr[1].indexOf('0') === 0) {
                month = parseInt(dateArr[1].substring(1))
            } else {
                month = parseInt(dateArr[1])
            }
            var day = parseInt(dateArr[2])
            var date = new Date(year, month - 1, day)
            return date
        },
        // 选择品种
        changeVari: function (name) {
            this.initVal = true
            this.variCode = name
            var variArr = [this.shVari, this.dlVari, this.zzVari]
            for (var i = 0; i < variArr.length; i++) {
                for (var j = 0; j < variArr[i].length; j++) {
                    if (variArr[i][j].VariCode === name) {
                        this.selectVari = variArr[i][j]
                    }
                }
            }
            this.$router.push({name: 'FutureHoldDataDetail', params: {VariCode: this.variCode, CustName: this.custName}})
            this.getAllDeliv()
        },
        exportData: function (item) {
            var url = getExchODataApi('Variety') + '/RCDC.ExportVariety'
            o(url).post({ VarietyName: item.EnglishName }).save().then(
                (response) => {
                    httpUtility.download(this, response.data.downloadUrl)
                }
            )
        },
        handleChange (date) {
            if (!this.initVal) {
                this.deliv1 = date
                this.loadingTab = false
                this.getTableData1()
            }
        },
        handleChange2 (date) {
            if (!this.initVal) {
                this.deliv2 = date
                this.loadingTab = false
                this.getTableData2()
            }
        },
        handleChange3 (date) {
            if (!this.initVal) {
                this.deliv3 = date
                this.loadingTab = false
                this.getTableData3()
            }
        },
        downExl () {
            // let filterUrl = this.$store.state[this.options.gridKey].url
            // let downFilterUrl = filterUrl.split('&$filter')[1]
            let variCode = this.variCode
            let custName = this.custName
            let startDate = this.startDate
            let endDate = this.endDate
            if (this.startDate instanceof Date) {
                let year = startDate.getFullYear()
                let month = startDate.getMonth() + 1
                let day = startDate.getDate()
                if (parseInt(month) < 10) {
                    month = '0' + month
                }
                startDate = year + '-' + month + '-' + day
            }
            startDate = this.toDateTime(startDate)
            if (this.endDate instanceof Date) {
                let year = endDate.getFullYear()
                let month = endDate.getMonth() + 1
                let day = endDate.getDate()
                if (parseInt(month) < 10) {
                    month = '0' + month
                }
                endDate = year + '-' + month + '-' + day
            }
            var deliv1 = this.getDelivDate(this.deliv1)
            var deliv2 = this.getDelivDate(this.deliv2)
            var deliv3 = this.getDelivDate(this.deliv3)
            var delivFilter = ''
            var delivArr = []
            if (deliv1) {
                delivArr.push(deliv1)
            }
            if (deliv2) {
                delivArr.push(deliv2)
            }
            if (deliv3) {
                delivArr.push(deliv3)
            }
            if (delivArr.length === 1) {
                delivFilter = "and(contains(DelivDate, '" + delivArr[0] + "'))"
            }
            if (delivArr.length === 2) {
                delivFilter = "and(contains(DelivDate, '" + delivArr[0] + "') or contains(DelivDate, '" + delivArr[1] + "'))"
            }
            if (delivArr.length === 3) {
                delivFilter = "and(contains(DelivDate, '" + delivArr[0] + "') or contains(DelivDate, '" + delivArr[1] + "') or contains(DelivDate, '" + delivArr[2] + "'))"
            }
            if (!deliv1 && deliv2 && deliv3) {
                delivFilter = `and(contains(DelivDate, '${deliv2}') or contains(DelivDate, '${deliv3}'))`
            }
            endDate = this.toDateTime(endDate)
            let downFilterUrl = `(VariCode eq '${variCode}' and CustName eq '${custName}'and Date ge ${startDate} and Date le ${endDate} ${delivFilter})`
            let url
            if (downFilterUrl) {
                url = getExchODataApi(`/FutureHoldData/ExchData.ExportExecl?$filter=${downFilterUrl}&$orderby=DelivDate,Date`)
            } else {
                url = getExchODataApi(`/FutureHoldData/ExchData.ExportExecl`)
            }
            var xhr = new XMLHttpRequest()
            xhr.open('post', url)
            xhr.onreadystatechange = handler
            xhr.responseType = 'blob'
            xhr.setRequestHeader('Authorization', 'Bearer')
            xhr.send()
            function handler () {
                if (this.readyState === this.DONE) {
                    if (this.status === 200) {
                        var link = document.createElement('a')
                        link.href = window.URL.createObjectURL(this.response)
                        link.download = '持仓排名信息.xlsx'
                        link.click()
                    } else {
                        console.error('no pdf :(')
                    }
                }
            }
        }
    },
    components: {
    }
}
</script>
<style >
    .ivu-table table{
        width: 100%;
    }
    .tip-text{
        padding: 12px;
    }
    .exch-filter{
        padding: 12px 12px 12px 0;
    }
    .btn-download{
        float: right;
        font-size: 14px!important;
    }
    .icon-chevron{
        padding: 8px 12px;
        font-size: 14px;
    }
    .btn-back{
        padding: 12px;
    }
    .breadcrumb{
        padding: 12px;
        border-bottom: 1px solid #eee;
    }
    .exch-list.ivu-col-span-2{
        padding-right: 10px;
        width: 10%!important;
    }
    .exch-list .ivu-menu-submenu-title-icon{
        display: block;
    }
    .filter-vari{
        /* padding: 6px;*/
    }
    .exch-content.ivu-col-span-22{
        width: 90%!important;
    }
    .exch-content .header{
        margin-top: 0px!important;
    }
    .ecxh-table .p-r-sm{
        /* margin-top: 15px; */
    }
    .ecxh-table .p-r-sm:last-child{
        padding-right: 0px;
    }
    .ecxh-table .ivu-table-cell{
        padding-left: 6px!important;
        padding-right: 6px!important;
    }
    .exch-echart{
        margin-top: 15px;
    }
    .ivu-collapse>.ivu-collapse-item>.ivu-collapse-header{
        padding-left: 6px!important;
    }
    .ivu-menu {
        width: 100%!important;
    }
    .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title{
        padding: 6px!important;
    }
    .ivu-table-wrapper{
        width: 100%!important;
    }
    .header h2{
        border-left: 0px;
    }
    .table-title {
        padding: 15px;
        text-align: center;
        height: 61px;
    }
    .table-title .info {
        border: 1px solid #dddee1;
        color: #495060;
    }
    .table-title a{
        padding: 6px 12px;
        font-size: 16px;
        border-radius: 4px;
    }
    .table-title .primary{
        background: #2d8cf0;
        color: #ffffff;
    }
    .table-title .success{
        background: #19be6b;
        color: #ffffff;
    }
    .table-title .warning{
        background: #f90;
        color: #ffffff;
    }
    .table-title .red{
        background: #ed3f14;
        color: #ffffff;
    }
    .loading-icon{
        padding:80px;
        margin:80px;
        position: relative;
    }
    .ivu-col-span-8 .echarts{
        width: 525px!important;
        height: 350px!important;
    }
    .m-l{
        margin-left: 15px;
    }
    .vari-text{
        padding-left: 16px;
    }
    .search{
        padding: 0 12px;
    }
    .tablePager .ivu-page{
        text-align: center;
    }
    .no-border, .header.no-border h2{
        border: 0px!important;
    }
    .pull-right{
        float: right;
    }
    .p-r-cont{
        padding-right: 12px;
    }
    .tab-page{
        padding: 12px;
        float: right;
    }
    .fd-detail-tab .ivu-table-body tr td:nth-child(1){
        width: 8.8%;
    }
    .fd-detail-tab .ivu-table-body tr td:nth-child(n+2)
    {
        width: 5.7%;
        text-align: right;
    }
    .filter-1.ivu-col-span-1{
        width: 8.8%;
    }
    .filter-2.ivu-col-span-4,
    .filter-3.ivu-col-span-4,
    .filter-4.ivu-col-span-4,
    .filter-5.ivu-col-span-2
    {
        width: 22.8%;
    }
    /*'#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B'*/
    .fd-detail-tab .ivu-table th:nth-child(1)
    {
        background: #3399CC;
        color: #ffffff;
    }
    .fd-detail-tab .ivu-table th:nth-child(2),
    .fd-detail-tab .ivu-table th:nth-child(3),
    .fd-detail-tab .ivu-table th:nth-child(4),
    .fd-detail-tab .ivu-table th:nth-child(5)
    {
        background: #60C0DD;
        color: #ffffff;
    }
    .fd-detail-tab .ivu-table th:nth-child(6),
    .fd-detail-tab .ivu-table th:nth-child(7),
    .fd-detail-tab .ivu-table th:nth-child(8),
    .fd-detail-tab .ivu-table th:nth-child(9)
    {
        background: #9BCA63;
        color: #ffffff;
    }
    .fd-detail-tab .ivu-table th:nth-child(10),
    .fd-detail-tab .ivu-table th:nth-child(11),
    .fd-detail-tab .ivu-table th:nth-child(12),
    .fd-detail-tab .ivu-table th:nth-child(13)
    {
        background: #F3A43B;
        color: #ffffff;
    }
    .fd-detail-tab .ivu-table th:nth-child(14),
    .fd-detail-tab .ivu-table th:nth-child(15),
    .fd-detail-tab .ivu-table th:nth-child(16),
    .fd-detail-tab .ivu-table th:nth-child(17)
    {
        background: #D7504B;
        color: #ffffff;
    }
    .ivu-table .cell-red {
        color: #ed3f14;
    }
    .ivu-table .cell-green {
        color: #00CC66;
    }
    @media screen and (max-width: 1400px) {
    .ivu-table-cell {
        padding-left: 6px!important;
        padding-right: 6px!important;
    }
    }
</style>
