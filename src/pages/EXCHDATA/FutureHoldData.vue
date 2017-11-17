<template>
<div class="template">
    <Row>
        <Col span="2" class="exch-list">
            <Input v-model="filterVariCode" placeholder="请输入品种..." class="filter-vari"></Input>
            <Menu ref="leftMenu" :accordion="accordion" :active-name="variCode" :open-names="openNames" @on-select="changeVari" style="width: 100">
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
            <div class="header no-border">
                <h2>会员交易数据排名
                <Button class="pull-right" @click="getLastDate()" title="刷新"> <Icon type="refresh"></Icon> </Button>
                </h2>
            </div>
            <template v-if="selectVari">
                <!-- <template  v-if="filterDate"> -->
                    <Row class="exch-filter">
                        <Col span="6">
                            <a @click="changeDate(-1)" class="icon-chevron"> <Icon type="chevron-left"></Icon> </a>
                            <Date-picker type="date" :options="dateOption" :editable="editable" :clearable="clearable" v-model="filterDate" placeholder="选择日期"></Date-picker>
                            <a @click="changeDate(1)" class="icon-chevron"> <Icon type="chevron-right"></Icon> </a>
                        </Col>
                        <Col span="6">
                            <Radio-group v-model="filterType" @on-change="changeType">
                                <Radio label="1">持仓量</Radio>
                                <Radio label="2">买单增减</Radio>
                                <Radio label="3">卖单增减</Radio>
                            </Radio-group>
                        </Col>
                    </Row>
                    <Row class="ecxh-table">
                        <Col span="6" class="p-r-sm">
                            <div class="table-title">
                            <Select v-model="deliv1" class="select1" filterable style="width:120px" @on-change="handleChange">
                                <Option v-for="(item, index) in delivList" :value="item" :key="item">{{item}}</Option>
                            </Select>
                            </div>
                            <template v-if="tabShow1">
                                <Table border :disabled-hover="tabHover" class="tab1" v-if="filterType=='1'" :columns="columns" :data="data" :row-class-name="rowClassName"></Table>
                                <Table border :disabled-hover="tabHover" class="tab2" v-if="filterType=='2'" :columns="columns2" :data="data" :row-class-name="rowClassName"></Table>
                                <Table border :disabled-hover="tabHover" class="tab2" v-if="filterType=='3'" :columns="columns3" :data="data" :row-class-name="rowClassName"></Table>
                            </template>
                            <template v-else>
                                <div class="loading-icon">
                                    <Spin fix>
                                        <Icon type="load-c" size=40 class="icon-load"></Icon>
                                        <div>Loading</div>
                                    </Spin>
                                </div>
                            </template>
                        </Col>
                        <Col span="6" class="p-r-sm">
                            <div class="table-title">
                                <Select v-model="deliv2" class="select2" filterable style="width:120px" @on-change="handleChange2">
                                    <Option v-for="(item, index) in delivList" :value="item" :key="item">{{item}}</Option>
                                </Select>
                            </div>
                            <template v-if="tabShow2">
                                <Table border :disabled-hover="tabHover" class="tab1" v-if="filterType=='1'" :columns="columns" :data="data2" :row-class-name="rowClassName"></Table>
                                <Table border :disabled-hover="tabHover" class="tab2" v-if="filterType=='2'" :columns="columns2" :data="data2" :row-class-name="rowClassName"></Table>
                                <Table border :disabled-hover="tabHover" class="tab2" v-if="filterType=='3'" :columns="columns3" :data="data2" :row-class-name="rowClassName"></Table>
                            </template>
                            <template v-else>
                                <div class="loading-icon">
                                    <Spin fix>
                                        <Icon type="load-c" size=40 class="icon-load"></Icon>
                                        <div>Loading</div>
                                    </Spin>
                                </div>
                            </template>
                        </Col>
                        <Col span="6" class="p-r-sm">
                            <div class="table-title">
                                <Select v-model="deliv3" class="select3" filterable style="width:120px" @on-change="handleChange3">
                                    <Option v-for="(item, index) in delivList" :value="item" :key="item">{{item}}</Option>
                                </Select>
                            </div>
                            <template v-if="tabShow3">
                                <Table border :disabled-hover="tabHover" class="tab1" v-if="filterType=='1'" :columns="columns" :data="data3" :row-class-name="rowClassName"></Table>
                                <Table border :disabled-hover="tabHover" class="tab2" v-if="filterType=='2'" :columns="columns2" :data="data3" :row-class-name="rowClassName"></Table>
                                <Table border :disabled-hover="tabHover" class="tab2" v-if="filterType=='3'" :columns="columns3" :data="data3" :row-class-name="rowClassName"></Table>
                            </template>
                            <template v-else>
                                <div class="loading-icon">
                                    <Spin fix>
                                        <Icon type="load-c" size=40 class="icon-load"></Icon>
                                        <div>Loading</div>
                                    </Spin>
                                </div>
                            </template>
                        </Col>
                        <Col span="6" class="p-r-sm">
                            <div class="table-title">
                                <a class="info" href="javascript:void(0)">
                                    <template>所有交割月份合约</template>
                                </a>
                            </div>
                            <template v-if="tabShow4">
                                <Table border :disabled-hover="tabHover" class="tab1" v-if="filterType=='1'" :columns="columns" :data="data4" :row-class-name="rowClassName"></Table>
                                <Table border :disabled-hover="tabHover" class="tab2" v-if="filterType=='2'" :columns="columns2" :data="data4" :row-class-name="rowClassName"></Table>
                                <Table border :disabled-hover="tabHover" class="tab2" v-if="filterType=='3'" :columns="columns3" :data="data4" :row-class-name="rowClassName"></Table>
                            </template>
                            <template v-else>
                                <div class="loading-icon">
                                    <Spin fix>
                                        <Icon type="load-c" size=40 class="icon-load"></Icon>
                                        <div>Loading</div>
                                    </Spin>
                                </div>
                            </template>
                        </Col>
                    </Row>
                    <Row class="exch-echart">
                        <Row>
                            <div class="header no-border">
                                <h2 class="m-t-md">{{chartTitle1}}</h2>
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
                                <h2 class="m-t-md">{{chartTitle2}}</h2>
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
                    </Row>
            </template>
            <template v-else>
                <p class="tip-text">请先选择品种...</p>
            </template>
        </Col>
    </Row>
</div>
</template>
<script>
import o from 'o.js'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
// import * as exchDict from './../../config/ExchData/exchDict.js'

import { zzVari, dlVari, shVari, getExchODataApi } from './../../config/apiConfig.js'
import $ from 'jquery'
import { mapActions, mapGetters } from 'vuex'
export default {
    created () {
        if (this.$route.query.filterType) {
            this.filterType = this.$route.query.filterType
        }
    },
    data () {
        return {
            accordion: true,
            openNames: [],
            selectVari: null,
            variCode: '',
            tabShow1: false,
            tabShow2: false,
            tabShow3: false,
            tabShow4: false,
            filterVariCode: '',
            lastDate: '',
            editable: false,
            clearable: false,
            states: {},
            filterDate: '',
            oldYear: '',
            filterType: '1',
            isDetail: false,
            deliv1: '',
            open1: false,
            deliv2: '',
            open2: false,
            deliv3: '',
            open3: false,
            model1: '',
            model2: '',
            model3: '',
            delivList: [],
            dateOption: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now()
                }
            },
            delivdateArr: [],
            delivDateOption: {
                disabledDate (date) {
                    // return date
                }
            },
            zzVari: [],
            dlVari: [],
            shVari: [],
            tabHover: true,
            columns: [
                {
                    title: '会员简称',
                    key: 'CustName',
                    render: (h, params) => {
                        return h(
                            'a',
                            [
                                h('a', {
                                    attrs: {
                                        title: '点击查看详细'
                                    },
                                    on: {
                                        click: () => {
                                            this.showDetails(params.row.CustName)
                                        }
                                    }
                                }, params.row.PurNum === 0 && params.row.PurNum_CHG === 0 ? '' : params.row.CustName)
                            ]
                        )
                    }
                }, {
                    title: '持买单量',
                    key: 'PurNum',
                    render: (h, params) => {
                        return h(
                            'div', {
                            },
                            [
                                h('span', {
                                    style: {
                                        float: 'right'
                                    }
                                }, params.row.PurNum === 0 && params.row.PurNum_CHG === 0 ? '' : params.row.PurNum)
                            ]
                        )
                    }
                }, {
                    title: '增减',
                    key: 'PurNum_CHG',
                    render: (h, params) => {
                        return h(
                            'div', {
                            },
                            [
                                h('span', {
                                    style: {
                                        color: (params.row.PurNum_CHG >= 0) ? '#ed3f14' : '#00CC66',
                                        float: 'right'
                                    }
                                }, params.row.PurNum === 0 && params.row.PurNum_CHG === 0 ? '' : params.row.PurNum_CHG)
                            ]
                        )
                    }
                }, {
                    title: '会员简称',
                    key: 'CustName2',
                    render: (h, params) => {
                        return h(
                            'a',
                            [
                                h('a', {
                                    attrs: {
                                        title: '点击查看详细'
                                    },
                                    on: {
                                        click: () => {
                                            this.showDetails(params.row.CustName2)
                                        }
                                    }
                                }, params.row.SellNum === 0 && params.row.SellNum_CHG === 0 ? '' : params.row.CustName2)
                            ]
                        )
                    }
                }, {
                    title: '持卖单量',
                    key: 'SellNum',
                    render: (h, params) => {
                        return h(
                            'div', {
                            },
                            [
                                h('span', {
                                    style: {
                                        float: 'right'
                                    }
                                }, params.row.SellNum === 0 && params.row.SellNum_CHG === 0 ? '' : params.row.SellNum)
                            ]
                        )
                    }
                }, {
                    title: '增减',
                    key: 'SellNum_CHG',
                    render: (h, params) => {
                        return h(
                            'div', {
                            },
                            [
                                h('span', {
                                    style: {
                                        color: (params.row.SellNum_CHG >= 0) ? '#ed3f14' : '#00CC66',
                                        float: 'right'
                                    }
                                }, params.row.SellNum === 0 && params.row.SellNum_CHG === 0 ? '' : params.row.SellNum_CHG)
                            ]
                        )
                    }
                }
            ],
            columns2: [
                {
                    title: '会员简称',
                    key: 'CustName',
                    // width: 60,
                    render: (h, params) => {
                        return h(
                            'a',
                            [
                                h('a', {
                                    attrs: {
                                        title: '点击查看详细'
                                    },
                                    on: {
                                        click: () => {
                                            this.showDetails(params.row.CustName)
                                        }
                                    }
                                }, params.row.CustName)
                            ]
                        )
                    }
                },
                {
                    title: '增量',
                    key: 'PurNum_CHG',
                    render: (h, params) => {
                        return h(
                            'div', {
                            },
                            [
                                h('span', {
                                    style: {
                                        float: 'right',
                                        color: (params.row.PurNum_CHG >= 0) ? '#ed3f14' : '#00CC66'
                                    }
                                }, params.row.PurNum_CHG)
                            ]
                        )
                    }
                }, {
                    title: '会员简称',
                    key: 'CustName2',
                    // width: 60,
                    render: (h, params) => {
                        return h(
                            'a',
                            [
                                h('a', {
                                    attrs: {
                                        title: '点击查看详细'
                                    },
                                    on: {
                                        click: () => {
                                            this.showDetails(params.row.CustName2)
                                        }
                                    }
                                }, params.row.CustName2)
                            ]
                        )
                    }
                },
                {
                    title: '减量',
                    key: 'PurNum_CHG2',
                    render: (h, params) => {
                        return h(
                            'div', {
                            },
                            [
                                h('span', {
                                    style: {
                                        float: 'right',
                                        color: (params.row.PurNum_CHG2 >= 0) ? '#ed3f14' : '#00CC66'
                                    }
                                }, params.row.PurNum_CHG2)
                            ]
                        )
                    }
                }
            ],
            columns3: [
                {
                    title: '会员简称',
                    key: 'CustName',
                    // width: 60,
                    render: (h, params) => {
                        return h(
                            'a',
                            [
                                h('a', {
                                    attrs: {
                                        title: '点击查看详细'
                                    },
                                    on: {
                                        click: () => {
                                            this.showDetails(params.row.CustName)
                                        }
                                    }
                                }, params.row.CustName)
                            ]
                        )
                    }
                },
                {
                    title: '增量',
                    key: 'SellNum_CHG',
                    render: (h, params) => {
                        return h(
                            'div', {
                            },
                            [
                                h('span', {
                                    style: {
                                        float: 'right',
                                        color: (params.row.SellNum_CHG >= 0) ? '#ed3f14' : '#00CC66'
                                    }
                                }, params.row.SellNum_CHG)
                            ]
                        )
                    }
                }, {
                    title: '会员简称',
                    key: 'CustName2',
                    // width: 60,
                    render: (h, params) => {
                        return h(
                            'a',
                            [
                                h('a', {
                                    attrs: {
                                        title: '点击查看详细'
                                    },
                                    on: {
                                        click: () => {
                                            this.showDetails(params.row.CustName2)
                                        }
                                    }
                                }, params.row.CustName2)
                            ]
                        )
                    }
                },
                {
                    title: '减量',
                    key: 'SellNum_CHG2',
                    render: (h, params) => {
                        return h(
                            'div', {
                            },
                            [
                                h('span', {
                                    style: {
                                        float: 'right',
                                        color: (params.row.SellNum_CHG2 >= 0) ? '#ed3f14' : '#00CC66'
                                    }
                                }, params.row.SellNum_CHG2)
                            ]
                        )
                    }
                }
            ],
            data: [],
            data2: [],
            data3: [],
            data4: [],
            chartOption1_1: {
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
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
                },
                yAxis: {
                    axisLabel: {
                        formatter: null
                    }
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisLabel: {
                        alignWithLabel: true,
                        interval: 0,
                        rotate: 30
                    }
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = [
                                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B'
                                ]
                                return colorList[params.dataIndex]
                            },
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
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
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
                        interval: 0,
                        rotate: 30
                    }
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = [
                                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B'
                                ]
                                return colorList[params.dataIndex]
                            },
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
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
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
                        interval: 0,
                        rotate: 30
                    }
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = [
                                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B'
                                ]
                                return colorList[params.dataIndex]
                            },
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
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
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
                        interval: 0,
                        rotate: 30
                    }
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = [
                                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B'
                                ]
                                return colorList[params.dataIndex]
                            },
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
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
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
                        interval: 0,
                        rotate: 30
                    }
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = [
                                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B'
                                ]
                                return colorList[params.dataIndex]
                            },
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
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
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
                        interval: 0,
                        rotate: 30
                    }
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = [
                                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B'
                                ]
                                return colorList[params.dataIndex]
                            },
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
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
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
                        interval: 0,
                        rotate: 30
                    }
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = [
                                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B'
                                ]
                                return colorList[params.dataIndex]
                            },
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
                grid: {
                    x: '50px',
                    x2: '50px',
                    y: '50px'
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
                        interval: 0,
                        rotate: 30
                    }
                },
                series: [{
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = [
                                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                ]
                                return colorList[params.dataIndex]
                            },
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
        this.zzVari = zzVari
        this.dlVari = dlVari
        this.shVari = shVari
        var variCode = this.$route.params.VariCode
        this.variCode = variCode
        if (variCode) {
            this.variCode = variCode
            if (this.$route.query.filterType) {
                this.$router.push({name: 'FutureHoldData', params: {VariCode: this.variCode}, query: {filterType: this.$route.query.filterType}})
            } else {
                this.$router.push({name: 'FutureHoldData', params: {VariCode: this.variCode}})
            }
            var variArr = [this.shVari, this.dlVari, this.zzVari]
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
        this.getLastDate()
        // 数组去重
        // var set1 = Array.from(new Set([1, 1, 2, 2, 33, '33', 44, 44, '44']))
    },
    watch: {
        'filterDate': {
            handler: function (val, oldVal) {
                var year = ''
                if (val) {
                    if (val instanceof Date) {
                        year = val.getFullYear()
                    } else {
                        year = parseInt(val.split('-')[0])
                    }
                    if (oldVal === '') {
                        this.oldYear = year
                    }
                    if (this.oldYear.toString() !== year.toString()) {
                        this.oldYear = year
                        this.deliv1 = this.variCode + year.toString() + '05'
                        this.deliv2 = this.variCode + year.toString() + '09'
                        this.deliv3 = this.variCode + (year + 1).toString() + '01'
                    }
                    if (this.selectVari) {
                        this.getAllDelivAndQuery()
                    }
                }
            },
            deep: true
        }
    },
    computed: {
        ...mapGetters({
            fdLastDate: 'fdLastDate'
        }),
        fdDate: function () {
            return this.fdLastDate
        },
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
        ...mapActions({
            getFDLastDate: 'getFDLastDate'
        }),
        rowClassName (row, index) {
            if (row.CustName === '前5名' || row.CustName === '前10名' || row.CustName === '前20名') {
                return 'demo-row'
            } else {
                return ''
            }
        },
        query: function () {
            this.getTableData1()
            this.getTableData2()
            this.getTableData3()
            this.getTableData4()
        },
        setDelivDate: function () {
            var year = ''
            if (this.filterDate instanceof Date) {
                year = this.filterDate.getFullYear()
            } else {
                year = parseInt(this.filterDate.split('-')[0])
            }
            if (this.selectVari.ExchCode === 'C') {
                this.deliv1 = this.variCode + year.toString().substr(3, 3) + '05'
                this.deliv2 = this.variCode + year.toString().substr(3, 3) + '09'
                this.deliv3 = this.variCode + (year + 1).toString().substr(3, 3) + '01'
            } else {
                this.deliv1 = this.variCode + year.toString().substr(2, 4) + '05'
                this.deliv2 = this.variCode + year.toString().substr(2, 4) + '09'
                this.deliv3 = this.variCode + (year + 1).toString().substr(2, 4) + '01'
            }
            var dataStr = this.delivList.join(',')
            if (dataStr.indexOf(this.deliv1) === -1) {
                this.deliv1 = ''
            }
            if (dataStr.indexOf(this.deliv2) === -1) {
                this.deliv2 = ''
            }
            if (dataStr.indexOf(this.deliv3) === -1) {
                this.deliv3 = ''
            }
        },
        getLastDate: function () {
            if (this.fdDate) {
                this.lastDate = this.fdDate
                this.filterDate = this.lastDate
                this.getAllDelivAndQuery()
            } else {
                var url = getExchODataApi(`FutureHoldData?$select=Date&$orderby=Date desc&$top=1`)
                o(url).get().then(
                    (response) => {
                        if (response.data.length > 0) {
                            this.lastDate = response.data[0].Date.substr(0, 10)
                        } else {
                            var dt = new Date()
                            this.lastDate = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
                        }
                        this.filterDate = this.lastDate
                        this.getAllDelivAndQuery()
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
            var filterDate = this.setFilterDate()
            var delivUrl = getExchODataApi(`FutureHoldData?$select=DelivDate&$filter=((VariCode eq '${variCode}') and Date eq ${filterDate})&$orderby=Date desc, DelivDate`)
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
                }
            ).fail(function (ex) {
                this.$Message.error('数据调用异常', 1)
            })
        },
        // 获取所有的交割期
        getAllDelivAndQuery: function () {
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
            var filterDate = this.setFilterDate()
            var delivUrl = getExchODataApi(`FutureHoldData?$select=DelivDate&$filter=((VariCode eq '${variCode}') and Date eq ${filterDate})&$orderby=Date desc, DelivDate`)
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
                    this.query()
                }
            ).fail(function (ex) {
                this.$Message.error('数据调用异常', 1)
            })
        },
        // 选择品种
        changeVari: function (name) {
            this.$router.push({name: 'FutureHoldData', params: {VariCode: name}})
            this.variCode = name
            var variArr = [this.shVari, this.dlVari, this.zzVari]
            for (var i = 0; i < variArr.length; i++) {
                for (var j = 0; j < variArr[i].length; j++) {
                    if (variArr[i][j].VariCode === name) {
                        this.selectVari = variArr[i][j]
                    }
                }
            }
            this.tabShow1 = false
            this.tabShow2 = false
            this.tabShow3 = false
            this.tabShow4 = false
            this.getAllDelivAndQuery()
        },
        // 字符串转日期
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
        // 选择日期
        changeDate: function (value) {
            var date = this.filterDate
            if (!(this.filterDate instanceof Date)) {
                date = this.stringToDate(date)
            }
            if (value === -1) {
                date.setTime(date.getTime() - 3600 * 1000 * 24)
            } else if (value === 1) {
                date.setTime(date.getTime() + 3600 * 1000 * 24)
            }
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()
            this.filterDate = this.stringToDate(year + '-' + month + '-' + day)
        },
        // 选择类型
        changeType: function () {
            this.tabShow1 = false
            this.tabShow2 = false
            this.tabShow3 = false
            this.tabShow4 = false
            this.query()
        },
        DateToString: function (date) {
            if (date instanceof Date) {
                var year = date.getFullYear()
                var month = date.getMonth() + 1
                var day = date.getDate()
                if (parseInt(month) < 10) {
                    month = '0' + month
                }
                date = year + '-' + month + '-' + day
            }
            return date
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
        setFilterDate: function () {
            var filterDate = this.filterDate
            if (this.filterDate instanceof Date) {
                var year = filterDate.getFullYear()
                var month = filterDate.getMonth() + 1
                var day = filterDate.getDate()
                if (parseInt(month) < 10) {
                    month = '0' + month
                }
                filterDate = year + '-' + month + '-' + day
            }
            filterDate = this.toDateTime(filterDate)
            return filterDate
        },
        getSelectAndOrder: function () {
            var order1 = ''
            var order2 = ''
            var selectName1 = ''
            var selectName2 = ''
            var filter1 = ''
            var filter2 = ''
            if (this.filterType === '1') {
                order1 = 'PurNum desc'
                order2 = 'SellNum desc'
                selectName1 = 'CustName, PurNum, PurNum_CHG'
                selectName2 = 'CustName, SellNum, SellNum_CHG'
                filter1 = 'and (PurNum ne 0 or PurNum_CHG ne 0)'
                filter2 = 'and (SellNum ne 0 or SellNum_CHG ne 0)'
            } else if (this.filterType === '2') {
                order1 = 'PurNum_CHG desc'
                order2 = 'PurNum_CHG asc'
                selectName1 = 'CustName, PurNum, PurNum_CHG'
                selectName2 = selectName1
                filter1 = 'and PurNum_CHG gt 0'
                filter2 = 'and PurNum_CHG lt 0'
            } else if (this.filterType === '3') {
                order1 = 'SellNum_CHG desc'
                order2 = 'SellNum_CHG asc'
                selectName1 = 'CustName, SellNum, SellNum_CHG'
                selectName2 = selectName1
                filter1 = 'and SellNum_CHG gt 0'
                filter2 = 'and SellNum_CHG lt 0'
            }
            return [order1, order2, selectName1, selectName2, filter1, filter2]
        },
        getDelivDate: function (deliv) {
            if (deliv) {
                deliv = deliv.replace(/[^0-9]/ig, '')
            }
            /* var deliv = deliv.replace(/[^0-9]/ig, "")
            if (this.selectVari.ExchCode === 'C') {
                deliv = deliv.replace('-', '').substr(3, 3)
            } else {
                deliv = deliv.replace('-', '').substr(2, 4)
            } */
            return deliv
        },
        setRankDate (type, variCode, DelivDate, newArr) {
            let _self = this
            let data = []
            let deliv = DelivDate
            let filterDate = this.setFilterDate()
            let rankingUrlPurNum = ''
            let rankingUrlSellNum = ''
            let leftData = []
            let rightData = []
            if (DelivDate === '') {
                return
            }
            if (DelivDate === 'all') {
                deliv = 'all'
            }
            if (this.filterType === '1') {
                rankingUrlPurNum = getExchODataApi(`FutureHoldDataReport/?$filter=((VariCode eq '${variCode}') and contains(DelivDate, '${deliv}') and Date eq ${filterDate} and (Count eq 5 or Count eq 10 or Count eq 20) and Type eq 'PurNum')`)
                rankingUrlSellNum = getExchODataApi(`FutureHoldDataReport/?$filter=((VariCode eq '${variCode}') and contains(DelivDate, '${deliv}') and Date eq ${filterDate} and (Count eq 5 or Count eq 10 or Count eq 20) and Type eq 'SellNum')`)
            } else if (this.filterType === '2') {
                rankingUrlPurNum = getExchODataApi(`FutureHoldDataReport/?$filter=((VariCode eq '${variCode}') and contains(DelivDate, '${deliv}') and Date eq ${filterDate} and (Count eq 5 or Count eq 10 or Count eq 20) and Type eq 'PurNum_Up')`)
                rankingUrlSellNum = getExchODataApi(`FutureHoldDataReport/?$filter=((VariCode eq '${variCode}') and contains(DelivDate, '${deliv}') and Date eq ${filterDate} and (Count eq 5 or Count eq 10 or Count eq 20) and Type eq 'PurNum_Down')`)
            } else if (this.filterType === '3') {
                rankingUrlPurNum = getExchODataApi(`FutureHoldDataReport/?$filter=((VariCode eq '${variCode}') and contains(DelivDate, '${deliv}') and Date eq ${filterDate} and (Count eq 5 or Count eq 10 or Count eq 20) and Type eq 'SellNum_Up')`)
                rankingUrlSellNum = getExchODataApi(`FutureHoldDataReport/?$filter=((VariCode eq '${variCode}') and contains(DelivDate, '${deliv}') and Date eq ${filterDate} and (Count eq 5 or Count eq 10 or Count eq 20) and Type eq 'SellNum_Down')`)
            }
            if (this.filterType === '1') {
                o(rankingUrlPurNum).get().then(
                    (response) => {
                        let PurNumdata = response.data
                        PurNumdata.forEach(function (item) {
                            let PurNumdataItem = {}
                            PurNumdataItem.CustName = '前' + item.Count + '名'
                            PurNumdataItem.PurNum = item.PurNum
                            PurNumdataItem.PurNum_CHG = item.PurNum_CHG
                            leftData.push(PurNumdataItem)
                        })
                        o(rankingUrlSellNum).get().then(
                            (response) => {
                                let SellNumdata = response.data
                                SellNumdata.forEach(function (item) {
                                    let SellNumdataItem = {}
                                    SellNumdataItem.CustName2 = '前' + item.Count + '名'
                                    SellNumdataItem.SellNum = item.SellNum
                                    SellNumdataItem.SellNum_CHG = item.SellNum_CHG
                                    rightData.push(SellNumdataItem)
                                })
                                if (newArr.length === 0) {
                                    data = []
                                } else {
                                    for (let i = 0; i < 3; i++) {
                                        let obj = Object.assign({}, leftData[i], rightData[i])
                                        data.push(obj)
                                    }
                                }
                                if (type === 1) {
                                    _self.data = [...newArr, ...data]
                                    _self.tabShow1 = true
                                } else if (type === 2) {
                                    _self.data2 = [...newArr, ...data]
                                    _self.tabShow2 = true
                                } else if (type === 3) {
                                    _self.data3 = [...newArr, ...data]
                                    _self.tabShow3 = true
                                } else if (type === 4) {
                                    _self.data4 = [...newArr, ...data]
                                    _self.tabShow4 = true
                                }
                            })
                    }
                )
            } else if (this.filterType === '2') {
                o(rankingUrlPurNum).get().then(
                    (response) => {
                        let PurNumdata = response.data
                        PurNumdata.forEach(function (item) {
                            let PurNumdataItem = {}
                            PurNumdataItem.CustName = '前' + item.Count + '名'
                            PurNumdataItem.PurNum_CHG = item.PurNum_CHG
                            leftData.push(PurNumdataItem)
                        })
                        o(rankingUrlSellNum).get().then(
                            (response) => {
                                let SellNumdata = response.data
                                SellNumdata.forEach(function (item) {
                                    let SellNumdataItem = {}
                                    SellNumdataItem.CustName2 = '前' + item.Count + '名'
                                    SellNumdataItem.PurNum_CHG2 = item.PurNum_CHG
                                    rightData.push(SellNumdataItem)
                                })
                                if (newArr.length === 0) {
                                    data = []
                                } else {
                                    for (let i = 0; i < 3; i++) {
                                        let obj = Object.assign({}, leftData[i], rightData[i])
                                        data.push(obj)
                                    }
                                }
                                if (type === 1) {
                                    _self.data = [...newArr, ...data]
                                    _self.tabShow1 = true
                                } else if (type === 2) {
                                    _self.data2 = [...newArr, ...data]
                                    _self.tabShow2 = true
                                } else if (type === 3) {
                                    _self.data3 = [...newArr, ...data]
                                    _self.tabShow3 = true
                                } else if (type === 4) {
                                    _self.data4 = [...newArr, ...data]
                                    _self.tabShow4 = true
                                }
                            })
                    }
                )
            } else if (this.filterType === '3') {
                o(rankingUrlPurNum).get().then(
                    (response) => {
                        let PurNumdata = response.data
                        PurNumdata.forEach(function (item) {
                            let PurNumdataItem = {}
                            PurNumdataItem.CustName = '前' + item.Count + '名'
                            PurNumdataItem.SellNum_CHG = item.SellNum_CHG
                            leftData.push(PurNumdataItem)
                        })
                        o(rankingUrlSellNum).get().then(
                            (response) => {
                                let SellNumdata = response.data
                                SellNumdata.forEach(function (item) {
                                    let SellNumdataItem = {}
                                    SellNumdataItem.CustName2 = '前' + item.Count + '名'
                                    SellNumdataItem.SellNum_CHG2 = item.SellNum_CHG
                                    rightData.push(SellNumdataItem)
                                })
                                if (newArr.length === 0) {
                                    data = []
                                } else {
                                    for (let i = 0; i < 3; i++) {
                                        let obj = Object.assign({}, leftData[i], rightData[i])
                                        data.push(obj)
                                    }
                                }
                                if (type === 1) {
                                    _self.data = [...newArr, ...data]
                                    _self.tabShow1 = true
                                } else if (type === 2) {
                                    _self.data2 = [...newArr, ...data]
                                    _self.tabShow2 = true
                                } else if (type === 3) {
                                    _self.data3 = [...newArr, ...data]
                                    _self.tabShow3 = true
                                } else if (type === 4) {
                                    _self.data4 = [...newArr, ...data]
                                    _self.tabShow4 = true
                                }
                            })
                    }
                )
            }
        },
        setChartData: function (type, rightData, leftData, deliv, variCode) {
            var newArr = []
            var seriesData1 = []
            var seriesData2 = []
            var xAxisData = []
            var xAxisData2 = []
            var text = ''
//            var soArr = this.getSelectAndOrder()
//            var filter2 = soArr[5]
            if (deliv && deliv !== 'all') {
                text = variCode + deliv
            }
            if (this.filterType === '1') {
                for (let i = 0; i < 8; i++) {
                    let obj
                    let rightObj
                    let leftObj

                    if (rightData.length > i) {
                        rightData[i].CustName2 = rightData[i].CustName
                        delete rightData[i].CustName
                        rightObj = rightData[i]
                    }
                    if (leftData.length > i) {
                        leftObj = leftData[i]
                    }
                    if (rightObj || leftObj) {
                        if (!leftObj) {
                            leftObj = {}
                        }
                        if (!rightObj) {
                            rightObj = {}
                        }
                        obj = Object.assign(leftObj, rightObj)
                        newArr.push(obj)
                        seriesData1.push(obj.PurNum ? obj.PurNum : '')
                        seriesData2.push(obj.SellNum ? obj.SellNum : '')
                        xAxisData.push(obj.CustName ? obj.CustName : '')
                        xAxisData2.push(obj.CustName2 ? obj.CustName2 : '')
                    }
                }
            } else if (this.filterType === '2') {
                for (let i = 0; i < 8; i++) {
                    let obj
                    let rightObj
                    let leftObj
                    if (rightData.length > i) {
                        rightData[i].CustName2 = rightData[i].CustName
                        rightData[i].PurNum2 = rightData[i].PurNum
                        rightData[i].PurNum_CHG2 = rightData[i].PurNum_CHG
                        delete rightData[i].CustName
                        delete rightData[i].PurNum
                        delete rightData[i].PurNum_CHG
                        rightObj = rightData[i]
                    }
                    if (leftData.length > i) {
                        leftObj = leftData[i]
                    }
                    if (rightObj || leftObj) {
                        if (!leftObj) {
                            leftObj = {}
                        }
                        if (!rightObj) {
                            rightObj = {}
                        }
                        obj = Object.assign(leftObj, rightObj)
                        newArr.push(obj)
                        seriesData1.push(obj.PurNum_CHG ? obj.PurNum_CHG : '')
                        seriesData2.push(obj.PurNum_CHG2 ? obj.PurNum_CHG2 : '')
                        xAxisData.push(obj.CustName ? obj.CustName : '')
                        xAxisData2.push(obj.CustName2 ? obj.CustName2 : '')
                    }
                }
            } else if (this.filterType === '3') {
                for (let i = 0; i < 8; i++) {
                    let obj
                    let rightObj
                    let leftObj
                    if (rightData.length > i) {
                        rightData[i].CustName2 = rightData[i].CustName
                        rightData[i].SellNum2 = rightData[i].SellNum
                        rightData[i].SellNum_CHG2 = rightData[i].SellNum_CHG
                        delete rightData[i].CustName
                        delete rightData[i].SellNum
                        delete rightData[i].SellNum_CHG
                        rightObj = rightData[i]
                    }
                    if (leftData.length > i) {
                        leftObj = leftData[i]
                    }
                    if (rightObj || leftObj) {
                        if (!leftObj) {
                            leftObj = {}
                        }
                        if (!rightObj) {
                            rightObj = {}
                        }
                        obj = Object.assign(leftObj, rightObj)
                        newArr.push(obj)
                        seriesData1.push(obj.SellNum_CHG ? obj.SellNum_CHG : '')
                        seriesData2.push(obj.SellNum_CHG2 ? obj.SellNum_CHG2 : '')
                        xAxisData.push(obj.CustName ? obj.CustName : '')
                        xAxisData2.push(obj.CustName2 ? obj.CustName2 : '')
                    }
                }
            }
            if (type === 1) {
                if (newArr.length !== 0) {
                    this.setRankDate(type, variCode, deliv, newArr)
                } else {
                    this.data = newArr
                    this.tabShow1 = true
                }
                this.chartOption1_1.title.text = text
                this.chartOption1_1.xAxis.data = xAxisData
                this.chartOption1_1.series[0].data = seriesData1

                this.chartOption1_2.title.text = text
                this.chartOption1_2.xAxis.data = xAxisData2
                this.chartOption1_2.series[0].data = seriesData2
            } else if (type === 2) {
                if (newArr.length !== 0) {
                    this.setRankDate(type, variCode, deliv, newArr)
                } else {
                    this.data2 = newArr
                    this.tabShow2 = true
                }
                this.data2 = newArr
                this.chartOption2_1.title.text = text
                this.chartOption2_1.xAxis.data = xAxisData
                this.chartOption2_1.series[0].data = seriesData1
                this.chartOption2_2.title.text = text
                this.chartOption2_2.xAxis.data = xAxisData2
                this.chartOption2_2.series[0].data = seriesData2
            } else if (type === 3) {
                if (newArr.length !== 0) {
                    this.setRankDate(type, variCode, deliv, newArr)
                } else {
                    this.data3 = newArr
                    this.tabShow3 = true
                }
                this.chartOption3_1.title.text = text
                this.chartOption3_1.xAxis.data = xAxisData
                this.chartOption3_1.series[0].data = seriesData1

                this.chartOption3_2.title.text = text
                this.chartOption3_2.xAxis.data = xAxisData2
                this.chartOption3_2.series[0].data = seriesData2
            } else if (type === 4) {
                text = variCode + '所有交割月份'
                if (newArr.length !== 0) {
                    this.setRankDate(type, variCode, 'all', newArr)
                } else {
                    this.data4 = newArr
                    this.tabShow4 = true
                }
                this.chartOption4_1.title.text = text
                this.chartOption4_1.xAxis.data = xAxisData
                this.chartOption4_1.series[0].data = seriesData1

                this.chartOption4_2.title.text = text
                this.chartOption4_2.xAxis.data = xAxisData2
                this.chartOption4_2.series[0].data = seriesData2
            }
        },
        getTableData1: function () {
            var _this = this
            var variCode = this.selectVari.VariCode
            var filterDate = this.setFilterDate()
            var soArr = this.getSelectAndOrder()
            var order1 = soArr[0]
            var order2 = soArr[1]
            var selectName = soArr[2]
            var selectName2 = soArr[3]
            var filter1 = soArr[4]
            var filter2 = soArr[5]
            var deliv = this.getDelivDate(this.deliv1)
            var leftData = []
            var rightData = []
            if (deliv) {
                var leftUrl = getExchODataApi(`FutureHoldData?$select=${selectName}&$filter=((VariCode eq '${variCode}') and contains(DelivDate, '${deliv}') and Date eq ${filterDate} ${filter1})&$orderby=${order1}&$top=5`)
                this.tabShow1 = false
                o(leftUrl).get().then(
                    (response) => {
                        leftData = response.data
                        var rUrl = getExchODataApi(`FutureHoldData?$select=${selectName2}&$filter=((VariCode eq '${variCode}') and contains(DelivDate, '${deliv}') and Date eq ${filterDate} ${filter2})&$orderby=${order2}&$top=5`)
                        o(rUrl).get().then(
                            (response) => {
                                rightData = response.data
                                this.setChartData(1, rightData, leftData, deliv, variCode)
                            }
                        ).fail(function (ex) {
                            _this.$Message.error('数据调用异常', 1)
                            _this.tabShow3 = true
                        })
                    }
                ).fail(function (ex) {
                    _this.$Message.error('数据调用异常', 1)
                    _this.tabShow1 = true
                })
            } else {
                this.setChartData(1, [], [], deliv, variCode)
            }
        },
        getTableData2: function () {
            var _this = this
            var variCode = this.selectVari.VariCode
            var filterDate = this.setFilterDate()
            var soArr = this.getSelectAndOrder()
            var order1 = soArr[0]
            var order2 = soArr[1]
            var selectName = soArr[2]
            var selectName2 = soArr[3]
            var filter1 = soArr[4]
            var filter2 = soArr[5]
            var deliv = this.getDelivDate(this.deliv2)
            var leftData2 = []
            var rightData2 = []
            if (deliv) {
                var leftUrl2 = getExchODataApi(`FutureHoldData?$select=${selectName}&$filter=(VariCode eq '${variCode}'  and contains(DelivDate, '${deliv}') and Date eq ${filterDate} ${filter1})&$orderby=${order1}&$top=5`)
                this.tabShow2 = false
                o(leftUrl2).get().then(
                    (response) => {
                        leftData2 = response.data
                        var rUrl2 = getExchODataApi(`FutureHoldData?$select=${selectName2}&$filter=(VariCode eq '${variCode}' and contains(DelivDate, '${deliv}') and Date eq ${filterDate} ${filter2})&$orderby=${order2}&$top=5`)
                        o(rUrl2).get().then(
                            (response) => {
                                rightData2 = response.data
                                this.setChartData(2, rightData2, leftData2, deliv, variCode)
                            }
                        ).fail(function (ex) {
                            _this.$Message.error('数据调用异常2', 1)
                            _this.tabShow2 = true
                        })
                    }
                ).fail(function (ex) {
                    _this.$Message.error('数据调用异常', 1)
                    _this.tabShow2 = true
                })
            } else {
                this.setChartData(2, [], [], deliv, variCode)
            }
        },
        getTableData3: function () {
            var _this = this
            var variCode = this.selectVari.VariCode
            var filterDate = this.setFilterDate()
            var soArr = this.getSelectAndOrder()
            var order1 = soArr[0]
            var order2 = soArr[1]
            var selectName = soArr[2]
            var selectName2 = soArr[3]
            var filter1 = soArr[4]
            var filter2 = soArr[5]
            var deliv = this.getDelivDate(this.deliv3)
            var leftData3 = []
            var rightData3 = []
            if (deliv) {
                var leftUrl3 = getExchODataApi(`FutureHoldData?$select=${selectName}&$filter=(VariCode eq '${variCode}' and contains(DelivDate, '${deliv}') and Date eq ${filterDate} ${filter1})&$orderby=${order1}&$top=5`)
                this.tabShow3 = false
                o(leftUrl3).get().then(
                    (response) => {
                        leftData3 = response.data
                        var rUrl = getExchODataApi(`FutureHoldData?$select=${selectName2}&$filter=(VariCode eq '${variCode}' and contains(DelivDate, '${deliv}') and Date eq ${filterDate} ${filter2})&$orderby=${order2}&$top=5`)
                        o(rUrl).get().then(
                            (response) => {
                                rightData3 = response.data
                                this.setChartData(3, rightData3, leftData3, deliv, variCode)
                            }
                        ).fail(function (ex) {
                            _this.$Message.error('数据调用异常', 1)
                            _this.tabShow3 = true
                        })
                    }
                ).fail(function (ex) {
                    _this.$Message.error('数据调用异常', 1)
                    _this.tabShow3 = true
                })
            } else {
                this.setChartData(3, [], [], deliv, variCode)
            }
        },
        getTableData4: function () {
            var _this = this
            var variCode = this.selectVari.VariCode
            var filterDate = this.setFilterDate()
            var soArr = this.getSelectAndOrder()
            var order1 = soArr[0]
            var order2 = soArr[1]
            var selectName = soArr[2]
            var selectName2 = soArr[3]
            var filter1 = soArr[4]
            var filter2 = soArr[5]
            var leftData4 = []
            var rightData4 = []
            var leftUrl4 = getExchODataApi(`FutureHoldData?$select=${selectName}&$filter=(VariCode eq '${variCode}' and Date eq ${filterDate} ${filter1})&$orderby=${order1}&$top=5`)
            this.tabShow4 = false
            o(leftUrl4).get().then(
                (response) => {
                    leftData4 = response.data
                    var rUrl = getExchODataApi(`FutureHoldData?$select=${selectName2}&$filter=(VariCode eq '${variCode}' and Date eq ${filterDate} ${filter2})&$orderby=${order2}&$top=5`)
                    o(rUrl).get().then(
                        (response) => {
                            rightData4 = response.data
                            this.setChartData(4, rightData4, leftData4, '', variCode)
                        }
                    ).fail(function (ex) {
                        _this.$Message.error('数据调用异常', 1)
                        _this.tabShow4 = true
                    })
                }
            ).fail(function (ex) {
                _this.$Message.error('数据调用异常', 1)
                _this.tabShow4 = true
            })
        },
        handleClick () {
            this.open1 = !this.open1
        },
        handleChange (date) {
            this.deliv1 = date
            this.open1 = !this.open1
            this.tabShow1 = false
            this.getTableData1()
        },
        handleClick2 () {
            this.open2 = !this.open2
        },
        handleChange2 (date) {
            this.deliv2 = date
            this.open2 = !this.open2
            this.tabShow2 = false
            this.getTableData2()
        },
        handleClick3 () {
            this.open3 = !this.open3
        },
        handleChange3 (date) {
            this.deliv3 = date
            this.open3 = !this.open3
            this.tabShow3 = false
            this.getTableData3()
        },
        showDetails: function (custName) {
            if (custName === '前5名' || custName === '前10名' || custName === '前20名') {
                let query = 5
                if (custName === '前5名') {
                    query = 5
                } else if (custName === '前10名') {
                    query = 10
                } else if (custName === '前20名') {
                    query = 20
                }
                this.$router.push({name: 'FutureHoldDataRankDetail', params: {VariCode: this.selectVari.VariCode, CustName: custName}, query: {Count: query, Type: this.filterType, filterType: this.filterType}})
            } else {
                this.$router.push({name: 'FutureHoldDataDetail', params: {VariCode: this.selectVari.VariCode, CustName: custName}, query: {filterType: this.filterType}})
            }
        }
    },
    components: {
    }
}
</script>
<style>
    .chart
    .template{
        padding: 20px!important;
    }
    .ivu-table table{
        width: 100%;
    }
    .tip-text{
        padding: 12px;
    }
    .exch-filter{
        padding: 12px 0;
    }
    .icon-chevron{
        padding: 8px 12px;
        font-size: 14px;
    }
    .exch-list.ivu-col-span-2{
        padding-right: 10px;
        width: 10%!important;
    }
    .exch-list .ivu-menu-submenu-title-icon{
        display: block;
    }
    .exch-content.ivu-col-span-22{
        width: 90%!important;
    }
    .ecxh-table .p-r-sm{
        padding-right: 10px;
    }
    .ecxh-table .p-r-sm:last-child{
        padding-right: 0px;
    }
    .ecxh-table .ivu-table-cell{
        padding-left: 6px!important;
        padding-right: 6px!important;
    }
    .ecxh-table table a{
        color: #495060!important;
    }
    .tab1 table span{
        font-size: 8px!important;
        -webkit-text-size-adjust:none;
    }
    .tab1 table tr th:nth-child(1),
    .tab1 table tr th:nth-child(4),
    .tab1 table tr td:nth-child(1),
    .tab1 table tr td:nth-child(4)
    {
        width: 20%!important;
    }
    .tab1 table tr th:nth-child(2),
    .tab1 table tr th:nth-child(3),
    .tab1 table tr th:nth-child(5),
    .tab1 table tr th:nth-child(6),
    .tab1 table tr td:nth-child(2),
    .tab1 table tr td:nth-child(3),
    .tab1 table tr td:nth-child(5),
    .tab1 table tr td:nth-child(6)
    {
        width: 15%!important;
    }
    /* .ecxh-table .select1.ivu-select-single .ivu-select-selection{
        background: #0033CC;
    }
    .ecxh-table .select2.ivu-select-single .ivu-select-selection{
        background: #00CC66;
    }
    .ecxh-table .select3.ivu-select-single .ivu-select-selection{
        background: #FFCC00;
    }
    .ecxh-table .ivu-select-input{
        color: #ffffff;
    } */
    .tab1 .ivu-table th:nth-child(1),
    .tab1 .ivu-table th:nth-child(2),
    .tab1 .ivu-table th:nth-child(3),
    .tab2 .ivu-table th:nth-child(1),
    .tab2 .ivu-table th:nth-child(2){
        background-color: #ed3f14!important;
        color: #ffffff;
    }
    .tab1 .ivu-table th:nth-child(4),
    .tab1 .ivu-table th:nth-child(5),
    .tab1 .ivu-table th:nth-child(6),
    .tab2 .ivu-table th:nth-child(3),
    .tab2 .ivu-table th:nth-child(4){
        background-color: #19be6b!important;
        color: #ffffff;
    }
    .exch-echart{
        margin-top: 30px!important;
    }
    .exch-list .ivu-menu-vertical .ivu-menu-item-group-title{
        padding-left: 0px;
        width: 100%!important;
    }
    .exch-content .header h2{
        border-left: 0px;
    }
    .table-title{
        padding: 15px;
        text-align: center;
        height: 61px;
    }
    .table-title a{
        padding: 6px 12px;
        font-size: 16px;
        border-radius: 4px;
    }
    .table-title .info{
        border: 1px solid #dddee1;
        color: #495060;
    }
    .loading-icon{
        padding:80px;
        margin:80px;
        position: relative;
    }
    .exch-echart .ivu-col-span-6 .echarts{
        width: 390px!important;
        height: 260px!important;
    }
    .exch-echart .ivu-col-span-6 .echarts div canvas{
        /* padding-left: 10px!important; */
    }
    .ecxh-table .ivu-table:after{
        width: 0px;
    }
    .no-border,
    .header.no-border h2{
        border: 0px!important;
    }
    .m-t-md{
        margin-top: 30px;
    }
    .ivu-menu-light.ivu-menu-vertical .init-active:not(.ivu-menu-item-active){
        color: #2d8cf0;
        border-right: 2px solid #2d8cf0;
        z-index: 2;
    }
    .exch-echart .ivu-col-span-6 .echarts{
        width: 390px!important;
        height: 260px!important;
    }

    @media screen and (max-width: 1400px) {
        .exch-echart .ivu-col-span-6 .echarts{
            width: 285px!important;
            height: 190px!important;
        }
    }
    /* .tab1 table tbody tr td:nth-child(2) span,
    .tab1 table tbody tr td:nth-child(3) span{
        color: #ed3f14;
    }
    .tab1 table tbody tr td:nth-child(5) span,
    .tab1 table tbody tr td:nth-child(6) span{
        color: #00CC66;
    } */
    .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title {
        padding: 6px!important;
    }
</style>
