<template>
    <div class="template">
        <Row>
            <Col span="2" class="exch-list">
            <Input v-model="filterVariCode" placeholder="请输入品种..." class="filter-vari"></Input>
            <Menu ref="leftMenu" :accordion="accordion" :active-name="variCode" :open-names="openNames" @on-select="changeVari">
                <Submenu name="C">
                    <template slot="title">
                        郑州商品交易所
                    </template>
                    <Menu-item :class="{'init-active': variCode === vari.VariCode}" :name="vari.VariCode" :key="vari.VariCode" v-for="vari in zzVariDict">
                        {{vari.VariName}} ({{vari.VariCode}})
                    </Menu-item>
                </Submenu>
                <!--<Submenu name="C">-->
                <!--<template slot="title">-->
                <!--郑州商品交易所-->
                <!--</template>-->
                <!--<Menu-item :class="{'init-active': variCode === vari.VariCode}" :name="vari.VariCode" :key="vari.VariCode" v-for="vari in zzVariDict">-->
                <!--{{vari.VariName}} ({{vari.VariCode}})-->
                <!--</Menu-item>-->
                <!--</Submenu>-->
                <!--<Submenu name="B">-->
                <!--<template slot="title">-->
                <!--大连商品交易所-->
                <!--</template>-->
                <!--<Menu-item :class="{'init-active': variCode === vari.VariCode}" :name="vari.VariCode" :key="vari.VariCode" v-for="vari in dlVariDict">-->
                <!--{{vari.VariName}} ({{vari.VariCode}})-->
                <!--</Menu-item>-->
                <!--</Submenu>-->
            </Menu>
            </Col>
            <Col span="22" class="exch-content">
            <div class="header no-border">
                <h2 >仓单日报
                    <Button class="pull-right" @click="getrefresh()" title="刷新"> <Icon type="refresh"></Icon> </Button>
                </h2>
            </div>
            <Row class="exch-filter">
                <!--<span class="m-l">截止日期：</span>-->
                <Col span="5" class="search">
                <a @click="changeDate(-1)" class="icon-chevron"> <Icon type="chevron-left"></Icon> </a>
                <Date-picker type="date" :editable="editable" :clearable="clearable" v-model="endDate" placeholder="" :options="dateOption"></Date-picker>
                <a @click="changeDate(1)" class="icon-chevron"> <Icon type="chevron-right"></Icon> </a>
                </Col>
                <!--<Col  span="5">-->
                <!--<Button type="primary" icon="ios-search" @click="searchData()">查询</Button>-->
                <!--</Col>-->
                <Col span="19">
                <Button type="success" class="btn-download" v-on:click="downExl()" title="导出Excel" style="text-align: right">
                    <Icon type="ios-cloud-download-outline"></Icon>
                </Button>
                </Col>
            </Row>
            <Row>
                当前品种: {{selectVari.VariName}}
                </Row>
            <Row>
                <Col span="24">
                <template v-if="loadingTab">
                    <Col span="24">
                    <Table class="fd-detail-tab" border stripe :columns="tabColumns" :data="tabDatas " size="small" @on-row-dblclick="getwarehousedata" :row-class-name="rowClassName"></Table>
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
                </Col>
            </Row>
            <Row>
                <Col span="24">
                <chart :options="chartOption1" class="chart" auto-resize></chart>
                </Col>
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
    import format from 'polymer-filters-format'
    import * as exchDict from './../../../config/ExchData/exchDict.js'
    import { zhengzhou } from './../zhengzou-config.js'
    import { mapActions, mapGetters } from 'vuex'
    import { getExchODataApi } from './../../../config/apiConfig.js'
    import httpUtility from './../../../utility/httpUtility.js'
    //    import $ from 'jquery'
    // import clone from 'clone'
    export default {
        name: 'zzWarrant',
        created () {
            this.getWhsheetLastDate()
        },
        data () {
            let url = this.$baseUrl.exchDataApiUrl + 'futureDataWhsheet'
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
                totalCount: 0,
                currentPage: 1,
                pageSize: 20,
                dateOption: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now()
                    }
                },
                pageSizeOpts: [20, 50, 100],
                tabColumns: [
                    {
                        key: 'VariName',
                        title: '品种'
                    },
                    {
                        key: 'WarehouseName',
                        title: '仓库/分库',
                        render: (h, params) => {
                            if (params.row.ParentWName) {
                                if (params.row.WarehouseName || params.row.WarehouseType === '仓库') {
                                    return h('div',
                                        {
                                            class: 'WarehouseNametextRight'
                                        }, '--' + params.row.WarehouseName)
                                } else {
                                    return h('div',
                                        {
                                            class: 'WarehouseNametextRight'
                                        }, '--' + params.row.FactoryWName)
                                }
                            } else {
                                if (params.row.WarehouseName || params.row.WarehouseType === '仓库') {
                                    return h('div',
                                        {
                                            class: 'WarehouseNametext'
                                        }, params.row.WarehouseName)
                                } else {
                                    return h('div',
                                        {
                                            class: 'WarehouseNametext'
                                        }, params.row.FactoryWName)
                                }
                            }
                        }
                    },
                    {
                        key: 'PreWNum',
                        title: '昨日仓单量'
                    },
                    {
                        key: 'NowWNum',
                        title: '今日仓单量'
                    },
                    {
                        key: 'WNumChange',
                        title: '增减'
                    }
                ],
                chartOption1: {
                    title: {
                        x: 'center',
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                show: true
                            }
                        }
                    },
                    legend: {
                        // show: false,
                        data: ['昨日仓单量', '今日仓单量'],
                        itemGap: 5
                    },
//                    dataZoom: [{
//                        show: true,
//                        type: 'slider',
//                        xAxisIndex: 0
//                    }],
                    dataZoom: {
                        type: 'slider',
                        show: 'true',
                        start: 94,
                        end: 100
                    },
                    grid: {
                        top: '12%',
                        left: '5%',
                        right: '10%',
                        bottom: '30%',
                        containLabel: true
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
                            rotate: 45
                        }
                    },
                    series: [{
                        name: '昨日仓单量',
                        type: 'bar',
                        data: []
                    }, {
                        name: '今日仓单量',
                        type: 'bar',
                        data: []
                    }]
                }
            }
        },
        mounted: function () {
//            this.shVari = exchDict.shVari
//            this.dlVari = exchDict.dlVari
            this.zzVari = exchDict.zzVari
            var variCode = this.$route.params.VariCode
            this.variCode = variCode
            if (variCode) {
                this.variCode = variCode
                this.$router.push({name: 'zzWarrant', params: {VariCode: this.variCode}})
                var variArr = [this.zzVari]
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
            switch (this.selectVari.VariCode) {
                case 'CF':
                    this.tabColumns = zhengzhou.CF
                    break
                case 'FG':
                    this.tabColumns = zhengzhou.FG
                    break
                case 'JR':
                    this.tabColumns = zhengzhou.JR
                    break
                case 'LR':
                    this.tabColumns = zhengzhou.LR
                    break
                case 'MA':
                    this.tabColumns = zhengzhou.MA
                    break
                case 'OI':
                    this.tabColumns = zhengzhou.OI
                    break
                case 'PM':
                    this.tabColumns = zhengzhou.PM
                    break
                case 'RI':
                    this.tabColumns = zhengzhou.RI
                    break
                case 'RM':
                    this.tabColumns = zhengzhou.RM
                    break
                case 'RS':
                    this.tabColumns = zhengzhou.RS
                    break
                case 'SF':
                    this.tabColumns = zhengzhou.SF
                    break
                case 'SM':
                    this.tabColumns = zhengzhou.SM
                    break
                case 'SR':
                    this.tabColumns = zhengzhou.SR
                    break
                case 'TA':
                    this.tabColumns = zhengzhou.TA
                    break
                case 'WH':
                    this.tabColumns = zhengzhou.WH
                    break
                case 'ZC':
                    this.tabColumns = zhengzhou.ZC
                    break
                case 'CY':
                    this.tabColumns = zhengzhou.CY
                    break
                case 'bu':
                    this.tabColumns = zhengzhou.bu
                    break
                default:
                    this.tabColumns = [
                        {
                            key: 'VariName',
                            title: '品种'
                        },
                        {
                            key: 'WarehouseName',
                            title: '仓库/分库',
                            render: (h, params) => {
                                if (params.row.ParentWName) {
                                    if (params.row.WarehouseName || params.row.WarehouseType === '仓库') {
                                        return h('div',
                                            {
                                                class: 'WarehouseNametextRight'
                                            }, '--' + params.row.WarehouseName)
                                    } else {
                                        return h('div',
                                            {
                                                class: 'WarehouseNametextRight'
                                            }, '--' + params.row.FactoryWName)
                                    }
                                } else {
                                    if (params.row.WarehouseName || params.row.WarehouseType === '仓库') {
                                        return h('div',
                                            {
                                                class: 'WarehouseNametext'
                                            }, params.row.WarehouseName)
                                    } else {
                                        return h('div',
                                            {
                                                class: 'WarehouseNametext'
                                            }, params.row.FactoryWName)
                                    }
                                }
                            }
                        },
                        {
                            key: 'PreWNum',
                            title: '昨日仓单量'
                        },
                        {
                            key: 'NowWNum',
                            title: '今日仓单量'
                        },
                        {
                            key: 'WNumChange',
                            title: '增减量'
                        }
                    ]
                    break
            }
//            this.initVal = true
            this.initData()
        },
        watch: {
            'endDate': {
                handler: function (val, oldVal) {
                    this.getAllDeliv()
                },
                deep: true
            }

        },
        computed: {
            ...mapGetters({
                whsheetLastDate: 'whsheetLastDate'
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
            }
        },
        updated () {
            // 设置宽度
//            let wrapWidth = $('.ivu-table-wrapper').width()
//            let tableWidth = $('.ivu-table-header table').width()
//            if (tableWidth < wrapWidth) {
//                $('.ivu-table-wrapper').width(tableWidth)
//            }
        },
        methods: {
            ...mapActions({
                getWhsheetLastDate: 'getWhsheetLastDate'
            }),
            getwarehousedata (data) {
                let WarehouseName = data.WarehouseName
                let FactoryWName = data.FactoryWName
                let ExchCode = this.selectVari.ExchCode
                this.$router.push({
                    name: 'ExchangeWarrantDetail',
                    params: {VariCode: this.variCode},
                    query: {
                        WarehouseName: WarehouseName,
                        FactoryWName: FactoryWName,
                        ExchCode: ExchCode
                    }
                })
            },
            rowClassName (row, index) {
                return 'demo-table-info-row'
            },
            tableFn () {
                return {}
            },
            addFn () {
                return {}
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
                this.$router.push({name: 'zzWarrant', params: {VariCode: this.variCode}})
                switch (this.selectVari.VariCode) {
                    case 'CF':
                        this.tabColumns = zhengzhou.CF
                        break
                    case 'FG':
                        this.tabColumns = zhengzhou.FG
                        break
                    case 'JR':
                        this.tabColumns = zhengzhou.JR
                        break
                    case 'LR':
                        this.tabColumns = zhengzhou.LR
                        break
                    case 'MA':
                        this.tabColumns = zhengzhou.MA
                        break
                    case 'OI':
                        this.tabColumns = zhengzhou.OI
                        break
                    case 'PM':
                        this.tabColumns = zhengzhou.PM
                        break
                    case 'RI':
                        this.tabColumns = zhengzhou.RI
                        break
                    case 'RM':
                        this.tabColumns = zhengzhou.RM
                        break
                    case 'RS':
                        this.tabColumns = zhengzhou.RS
                        break
                    case 'SF':
                        this.tabColumns = zhengzhou.SF
                        break
                    case 'SM':
                        this.tabColumns = zhengzhou.SM
                        break
                    case 'SR':
                        this.tabColumns = zhengzhou.SR
                        break
                    case 'TA':
                        this.tabColumns = zhengzhou.TA
                        break
                    case 'WH':
                        this.tabColumns = zhengzhou.WH
                        break
                    case 'ZC':
                        this.tabColumns = zhengzhou.ZC
                        break
                    case 'CY':
                        this.tabColumns = zhengzhou.CY
                        break
                    case 'bu':
                        this.tabColumns = zhengzhou.bu
                        break
                    default:
                        this.tabColumns = [
                            {
                                key: 'VariName',
                                title: '品种'
                            },
                            {
                                key: 'WarehouseName',
                                title: '仓库/分库',
                                render: (h, params) => {
                                    if (params.row.ParentWName) {
                                        if (params.row.WarehouseName || params.row.WarehouseType === '仓库') {
                                            return h('div',
                                                {
                                                    class: 'WarehouseNametextRight'
                                                }, '--' + params.row.WarehouseName)
                                        } else {
                                            return h('div',
                                                {
                                                    class: 'WarehouseNametextRight'
                                                }, '--' + params.row.FactoryWName)
                                        }
                                    } else {
                                        if (params.row.WarehouseName || params.row.WarehouseType === '仓库') {
                                            return h('div',
                                                {
                                                    class: 'WarehouseNametext'
                                                }, params.row.WarehouseName)
                                        } else {
                                            return h('div',
                                                {
                                                    class: 'WarehouseNametext'
                                                }, params.row.FactoryWName)
                                        }
                                    }
                                }
                            },
                            {
                                key: 'PreWNum',
                                title: '昨日仓单量'
                            },
                            {
                                key: 'NowWNum',
                                title: '今日仓单量'
                            },
                            {
                                key: 'WNumChange',
                                title: '增减'
                            }
                        ]
                        break
                }
                this.currentPage = 1
                this.getAllDeliv()
            },
            getrefresh () {
                let _self = this
                let endDate = this.whsheetLastDate
                if (endDate) {
                    this.endDate = new Date(this.whsheetLastDate)
                    var startDate = new Date(this.whsheetLastDate)
                    this.startDate = new Date(startDate)
                    this.getAllDeliv()
                } else {
                    var url = getExchODataApi(`FutureDataWhsheet?$select=Date&$orderby=Date desc&$top=1`)
                    o(url).get().then(
                        (response) => {
                            let lastDate = null
                            if (response.data.length > 0) {
                                lastDate = response.data[0].Date.substr(0, 10)
                            } else {
                                var dt = new Date()
                                lastDate = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
                            }
                            _self.endDate = new Date(lastDate)
                            this.getAllDeliv()
                        }
                    ).fail(function (ex) {
                        this.$Message.error('数据调用异常', 1)
                    })
                }
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
            changeDate: function (value) {
                var date = new Date(this.endDate)
                if (value === -1) {
                    date = date.setTime(date.getTime() - 3600 * 1000 * 24)
                } else if (value === 1) {
                    date = date.setTime(date.getTime() + 3600 * 1000 * 24)
                }
                var year = new Date(date).getFullYear()
                var month = new Date(date).getMonth() + 1
                var day = new Date(date).getDate()
                this.endDate = this.stringToDate(year + '-' + month + '-' + day)
                this.currentPage = 1
            },
            initData: function () {
                let _self = this
                let endDate = this.whsheetLastDate
                if (endDate) {
                    this.endDate = new Date(this.whsheetLastDate)
                    var startDate = new Date(this.whsheetLastDate)
                    this.startDate = new Date(startDate)
                    this.getAllDeliv()
                } else {
                    var url = getExchODataApi(`FutureDataWhsheet?$select=Date&$orderby=Date desc&$top=1`)
                    o(url).get().then(
                        (response) => {
                            let lastDate = null
                            if (response.data.length > 0) {
                                lastDate = response.data[0].Date.substr(0, 10)
                            } else {
                                var dt = new Date()
                                lastDate = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
                            }
                            _self.endDate = new Date(lastDate)
                            this.getAllDeliv()
                        }
                    ).fail(function (ex) {
                        this.$Message.error('数据调用异常', 1)
                    })
                }
            },
            // 获取仓单数据
            getWarrant () {
            },
            // 获取所有的数据
            getAllDeliv: function () {
//                var variCode = this.variCode
                var _self = this
                var variName = this.selectVari.VariName
                var variCode = this.selectVari.VariCode
                var endDate = this.setDate(this.endDate)
                var delivUrl = getExchODataApi(`FutureDataWhsheet?$filter=((VariName eq '${variName}' or VariCode eq '${variCode}') and Date eq ${endDate})&$orderby=Date asc`)
                o(delivUrl).count().get().then(
                    (response) => {
                        var data = response.data
                        _self.totalCount = data
                    }
                ).fail(function (ex) {
                    this.$Message.error('数据调用异常', 1)
                })
                o(delivUrl).skip((_self.currentPage - 1) * _self.pageSize).take(_self.pageSize).get().then(
                    (response) => {
                        let data = response.data
                        data.forEach(function (item, key) {
                            if (item.VariName === null || item.VariName === '') {
                                data[key].VariName = variName
                            }
                            if ((item.WarehouseName === null && item.FactoryWName === '') || (item.WarehouseName === '' && item.FactoryWName === null) || (item.WarehouseName === '' && item.FactoryWName === '') || (item.WarehouseName === null && item.FactoryWName === null)) {
                                data[key].VariName = item.VariName + '小计'
                            }
                            if ((item.WarehouseName === '' || item.WarehouseName === null) &&
                                (item.FactoryWName !== '' && item.FactoryWName !== null)) {
                                data[key].WarehouseName = item.FactoryWName
                            }
                            if (item.WarehouseNo === '' || item.WarehouseNo === null) {
                                data[key].WarehouseNo = item.FactoryWNo
                            }
                        })
                        if (variCode === 'MA') {
                            data.forEach(function (item, key) {
                                data[key].NowWNum = item.WrtNumWS + item.WrtNumBS
                            })
                            _self.tabDatas = data
                        } else {
                            _self.tabDatas = data
                        }
                    }
                ).fail(function (ex) {
                    this.$Message.error('数据调用异常', 1)
                })
                var delivUrltotal = getExchODataApi(`FutureDataWhsheet?$filter=((VariName eq '${variName}' or VariCode eq '${variCode}') and Date eq ${endDate})&$orderby=Date asc`)
                o(delivUrltotal).get().then(
                    (response1) => {
                        var data = response1.data
                        data.forEach(function (item, key) {
                            if (item.WarehouseName === '' || item.WarehouseName === null) {
                                data[key].WarehouseName = item.FactoryWName
                            }
                            if (item.WarehouseNo === '' || item.WarehouseNo === null) {
                                data[key].WarehouseNo = item.FactoryWNo
                            }
                        })
                        data.forEach(function (item, key) {
                            if ((item.WarehouseName === '' || item.WarehouseName === null) && (item.FactoryWName === '' || item.FactoryWName === null)) {
                                data.splice(key, 1)
                            }
                        })
                        if (variCode === 'MA') {
                            data.forEach(function (item, key) {
                                data[key].NowWNum = item.WrtNumBS + item.WrtNumWS
                            })
                        }
                        var arr = []
                        var index = -1
                        for (var i = 0; i < data.length; i++) {
                            index = _self.findIndex(data[i].WarehouseName, arr)
                            if (index === -1) {
                                arr.push(data[i])
                            } else {
                                arr[index].NowWNum += data[i].NowWNum
                                arr[index].PreWNum += data[i].PreWNum
                            }
                        }
                        let tabDatas = []
                        let predata = []
                        let todaydata = []
                        if (arr.length > 45) {
                            _self.chartOption1.xAxis.axisLabel.interval = 10
                        } else {
                            _self.chartOption1.xAxis.axisLabel.interval = 0
                        }
                        arr.forEach(function (item) {
                            if (item.WarehouseName) {
                                tabDatas.push(item.WarehouseName)
                            } else {
                                tabDatas.push(item.FactoryWName)
                            }
                            predata.push(item.PreWNum)
                            todaydata.push(item.NowWNum)
                        })
                        _self.loadingTab = true
                        _self.chartOption1.xAxis.data = tabDatas
                        _self.chartOption1.series[0].data = predata
                        _self.chartOption1.series[1].data = todaydata
                        // 棉花
                    }
                ).fail(function (ex) {
                    this.$Message.error('数据调用异常', 1)
                })
            },
            // 搜索
            findIndex (value, array) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i].WarehouseName === value) {
                        return i
                    }
                }
                return -1
            },
            changeCurPage: function (currentPage) {
                this.currentPage = currentPage
                this.getAllDeliv()
            },
            changePageSize: function (pageSize) {
                this.pageSize = pageSize
                this.currentPage = 1
                this.getAllDeliv()
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
            exportData: function (item) {
                var url = getExchODataApi('Variety') + '/RCDC.ExportVariety'
                o(url).post({ VarietyName: item.EnglishName }).save().then(
                    (response) => {
                        httpUtility.download(this, response.data.downloadUrl)
                    }
                )
            },
            downExl () {
                let _self = this
                // let filterUrl = this.$store.state[this.options.gridKey].url
                // let downFilterUrl = filterUrl.split('&$filter')[1]
                let variName = this.selectVari.VariName
                let variCode = this.selectVari.VariCode
                let exchCode = this.selectVari.ExchCode
                let endDate = this.endDate
                if (endDate instanceof Date) {
                    let year = endDate.getFullYear()
                    let month = endDate.getMonth() + 1
                    let day = endDate.getDate()
                    if (parseInt(month) < 10) {
                        month = '0' + month
                    }
                    endDate = year + '-' + month + '-' + day
                }
                endDate = this.toDateTime(endDate)
                let downFilterUrl = `((VariName eq '${variName}' or VariCode eq '${variCode}') and ExchCode eq '${exchCode}'and Date eq ${endDate})`
                let url
                if (downFilterUrl) {
                    url = getExchODataApi(`/FutureDataWhsheet/ExchData.ExportExecl?$filter=${downFilterUrl}&$orderby=Date asc`)
                } else {
                    url = getExchODataApi(`/FutureDataWhsheet/ExchData.ExportExecl&$orderby=Date asc`)
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
                            let time = new Date(_self.endDate)
                            let time1 = format.date(time, 'yyyyMMdd')
                            if (exchCode === 'A') {
                                link.download = `上海期货交易所仓单日报-${time1}.xlsx`
                            } else if (exchCode === 'B') {
                                link.download = `大连商品交易所仓单日报-${time1}.xlsx`
                            } else if (exchCode === 'C') {
                                link.download = `郑州商品交易所仓单日报-${time1}.xlsx`
                            }
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
<style>
    .chart{
        width: 100%;
    }
    .WarehouseNametext{
        text-align: left!important;
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

