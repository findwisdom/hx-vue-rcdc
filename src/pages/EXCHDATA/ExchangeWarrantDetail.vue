<template>
    <div class="template">
        <Row>
            <Col span="2" class="exch-list">
            <Input v-model="filterVariCode" placeholder="请输入品种..." class="filter-vari"></Input>
            <Menu ref="leftMenu" :accordion="accordion" :active-name="variCode" :open-names="openNames" @on-select="changeVari">
                <Submenu name="A" v-if="ExchCode === 'A'">
                    <template slot="title">
                        上海期货交易所
                    </template>
                    <Menu-item :class="{'init-active': variCode === vari.VariCode}" :name="vari.VariCode" :key="vari.VariCode" v-for="vari in shVariDict">
                        {{vari.VariName}} ({{vari.VariCode}})
                    </Menu-item>
                </Submenu>
                <Submenu name="C" v-if="ExchCode === 'C'">
                    <template slot="title">
                        郑州商品交易所
                    </template>
                    <Menu-item :class="{'init-active': variCode === vari.VariCode}" :name="vari.VariCode" :key="vari.VariCode" v-for="vari in zzVariDict">
                        {{vari.VariName}} ({{vari.VariCode}})
                    </Menu-item>
                </Submenu>
                <Submenu name="B" v-if="ExchCode === 'B'">
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
                <h2 >仓库详情: {{WarehouseName}}
                    <Button type="primary" class="pull-right" @click="back()"> 返回</Button>
                </h2>
            </div>
            <Row class="exch-filter">
                <Col span="5" class="search">
                <span>开始日期：</span>
                <Date-picker type="date" :editable="editable" :clearable="clearable" v-model="startDate" placeholder="" :options="dateOptionstart"></Date-picker>
                </Col>
                <Col span="5" class="search">
                <span class="m-l">截止日期：</span>
                <Date-picker type="date" :editable="editable" :clearable="clearable" v-model="endDate" placeholder="" :options="dateOption"></Date-picker>
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
                当前品种: {{selectVari.VariName}}
                </Row>
            <Row>
                <Col span="12">
                <template v-if="loadingTab">
                    <Col span="24">
                    <Table class="fd-detail-tab" border stripe :columns="tabColumns" :data="tabDatas " size="small" :row-class-name="rowClassName"></Table>
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
                <Col span="12">
                    <div class="echart-header">今日仓单量</div>
                    <chart :options="chartOption1" class="chart" auto-resize></chart>
                    <div class="echart-header">仓单增减</div>
                    <chart :options="chartOption2" class="chart" auto-resize></chart>
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
    import * as exchDict from './../../config/ExchData/exchDict.js'
    import { mapActions, mapGetters } from 'vuex'
    import { getExchODataApi } from './../../config/apiConfig.js'
    import httpUtility from './../../utility/httpUtility.js'
    import $ from 'jquery'
    // import clone from 'clone'
    export default {
        name: 'FutureHoldDataDetail',
        created () {
            this.getWhsheetLastDate()
        },
        data () {
            let url = this.$baseUrl.exchDataApiUrl + 'futureDataWhsheet'
            let _self = this
            return {
                api: url,
                selectVari: {
                    VariName: ''
                },
                dateOption: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now()
                    }
                },
                dateOptionstart: {
                    disabledDate (date) {
                        let time = _self.endDate - 365 * 24 * 12 * 60 * 1000
                        return date && (date.valueOf() < time) || (date.valueOf() > _self.endDate)
                    }
                },
                ExchCode: '',
                openNames: [],
                WarehouseName: '',
                FactoryWName: '',
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
                pageSizeOpts: [20, 50, 100],
                tabColumns: [
                    {
                        key: 'Date',
                        title: '日期',
                        render: (h, params) => {
                            let time = new Date(params.row.Date)
                            return format.date(time, 'yyyy年MM月dd日')
                        }
                    },
                    {
                        key: 'WarehouseName',
                        title: '仓库名称'
                    },
                    {
                        key: 'NowWNum',
                        title: '仓单量'
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
                        formatter: function (params) {
                            let time = new Date(params[0].axisValue)
                            return format.date(time, 'yyyy-MM-dd') + ':' + params[0].value
                        }
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            show: true
                        }
                    ],
                    legend: {
                        // show: false,
                        data: [],
                        align: 'right',
                        right: '10%'
                    },
                    grid: {
                        bottom: '20%'
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
                            rotate: 90,
                            formatter: function (data) {
                                let time = new Date(data)
                                return format.date(time, 'MM/dd')
                            }
                        }
                    },
                    series: [{
                        name: '',
                        type: 'line',
//                        itemStyle: {
//                            normal: {
//                                color: function (params) {
//                                    var colorList = [
//                                        '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B'
//                                    ]
//                                    return colorList[params.dataIndex]
//                                },
//                                label: {
//                                    show: true,
//                                    position: 'top',
//                                    formatter: ''
//                                }
//                            }
//                        },
                        data: []
                    }]
                },
                chartOption2: {
                    title: {
                        x: 'center',
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            let time = new Date(params[0].axisValue)
                            return format.date(time, 'yyyy-MM-dd') + ':' + params[0].value
                        }
                    },
                    legend: {
                        // show: false,
                        data: [],
                        align: 'right',
                        right: '10%'
                    },
                    grid: {
                        bottom: '20%'
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
                            rotate: 90,
                            formatter: function (data) {
                                let time = new Date(data)
                                return format.date(time, 'MM/dd')
                            }
                        }
                    },
                    series: [{
                        name: '',
                        type: 'line',
//                        itemStyle: {
//                            normal: {
//                                color: function (params) {
//                                    var colorList = [
//                                        '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B'
//                                    ]
//                                    return colorList[params.dataIndex]
//                                },
//                                label: {
//                                    show: true,
//                                    position: 'top',
//                                    formatter: ''
//                                }
//                            }
//                        },
                        data: []
                    }]
                },
                data: []
            }
        },
        mounted: function () {
            this.shVari = exchDict.shVari
            this.dlVari = exchDict.dlVari
            this.zzVari = exchDict.zzVari
            var variCode = this.$route.params.VariCode
            this.ExchCode = this.$route.query.ExchCode
            this.variCode = variCode
            var ExchCode = this.ExchCode
            var variArr = []
            if (ExchCode === 'A') {
                variArr = [this.shVari]
            }
            if (ExchCode === 'B') {
                variArr = [this.dlVari]
            }
            if (ExchCode === 'C') {
                variArr = [this.zzVari]
            }
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
            this.WarehouseName = this.$route.query.WarehouseName
            this.FactoryWName = this.$route.query.FactoryWName
//            this.initVal = true
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
                console.log(result)
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
            let wrapWidth = $('.ivu-table-wrapper').width()
            let tableWidth = $('.ivu-table-header table').width()
            if (tableWidth < wrapWidth) {
                $('.ivu-table-wrapper').width(tableWidth)
            }
        },
        methods: {
            ...mapActions({
                getWhsheetLastDate: 'getWhsheetLastDate'
            }),
            rowClassName (row, index) {
                return 'demo-table-info-row'
            },
            getwarehousedata (data) {
                console.log(data)
            },
            tableFn () {
                return {}
            },
            addFn () {
                return {}
            },
            back: function () {
                if (this.ExchCode === 'A') {
                    this.$router.push({name: 'shWarrant', params: {VariCode: this.variCode}})
                }
                if (this.ExchCode === 'B') {
                    this.$router.push({name: 'dlWarrant', params: {VariCode: this.variCode}})
                }
                if (this.ExchCode === 'C') {
                    this.$router.push({name: 'zzWarrant', params: {VariCode: this.variCode}})
                }
            },
            // 选择品种
            changeVari: function (name) {
                this.initVal = true
                var variArr = [this.shVari, this.dlVari, this.zzVari]
                for (var i = 0; i < variArr.length; i++) {
                    for (var j = 0; j < variArr[i].length; j++) {
                        if (variArr[i][j].VariCode === name) {
                            this.selectVari = variArr[i][j]
                        }
                    }
                }
                this.variCode = name
                if (!this.variCode === name) {
                    this.$router.push({name: 'ExchangeWarrantDetail', params: {VariCode: this.variCode}, query: {WarehouseName: this.WarehouseName, FactoryWName: this.FactoryWName}})
                }
                this.currentPage = 1
                this.getAllDeliv()
            },
            initData: function () {
                let _self = this
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
                        let startDate = new Date(lastDate)
                        startDate.setDate(startDate.getDate() - 30)
                        _self.startDate = new Date(startDate)
                        // 改变menu
                        _self.getWarehouseNameMenu()
                        // 获取数据
                        _self.getAllDeliv()
                        this.$nextTick(function () {
                            this.$refs.leftMenu.updateOpened()
                            this.$refs.leftMenu.updateActiveName()
                        })
                    }
                ).fail(function (ex) {
                    this.$Message.error('数据调用异常', 1)
                })
            },
            // 获取仓单数据
            getWarehouseNameMenu () {
                var _self = this
                let WarehouseName = _self.$route.query.WarehouseName
//                if (this.WarehouseName) {
//                    WarehouseName = this.WarehouseName
//                } else {
//                    WarehouseName = _self.$route.query.WarehouseName
//                }
                let startDate = _self.startDate.toJSON()
                let endDate = _self.endDate.toJSON()
                let url = getExchODataApi(`FutureDataWhsheet/ExchData.GetVariList?$filter=(WarehouseName eq '${WarehouseName}' and Date ge ${startDate} and Date le ${endDate})`)
                o(url).post().save().then(
                    (response) => {
                        console.log(response)
                        if (_self.ExchCode === 'A') {
                            let shVari = exchDict.shVari.filter(function (data) {
                                let exchDictdata = response.data.some(function (VariName) {
                                    return data.VariName === VariName.VariName
                                })
                                return exchDictdata
                            })
                            _self.shVari = shVari
                        }
                        if (_self.ExchCode === 'C') {
                            let zzVariName = exchDict.zzVari.filter(function (data) {
                                let exchDictdataName = response.data.some(function (VariName) {
                                    return data.VariName === VariName.VariName
                                })
                                return exchDictdataName
                            })
                            let zzVariCode = exchDict.zzVari.filter(function (data) {
                                let exchDictdataCode = response.data.some(function (VariCode) {
                                    return data.VariCode === VariCode.VariCode
                                })
                                return exchDictdataCode
                            })
                            var zzVari = zzVariName.concat(zzVariCode)
                            zzVari = _self.dedupe(zzVari)
                            console.log(zzVari)
                            _self.zzVari = zzVari
                        }
                        if (_self.ExchCode === 'B') {
                            let dlVari = exchDict.dlVari.filter(function (data) {
                                let exchDictdata = response.data.some(function (VariName) {
                                    return data.VariName === VariName.VariName
                                })
                                return exchDictdata
                            })
                            _self.dlVari = dlVari
                        }
                    }
                ).fail(function (ex) {
                    this.$Message.error('数据调用异常', 1)
                })
            },
            // 数组去重
            dedupe (array) {
                return Array.from(new Set(array))
            },
            getWarrant () {
            },
            // 获取所有的交割期
            getAllDeliv: function () {
//                var variCode = this.variCode
                var _self = this
                var VariName = this.selectVari.VariName
                var VariCode = this.selectVari.VariCode
                var startDate = this.setDate(this.startDate)
                var endDate = this.setDate(this.endDate)
                let WarehouseName = ''
                let FactoryWName = ''
                if (this.$route.query.WarehouseName === null) {
                    WarehouseName = null
                } else {
                    WarehouseName = "'" + this.$route.query.WarehouseName + "'"
                }
                if (this.$route.query.FactoryWName === null) {
                    FactoryWName = null
                } else {
                    FactoryWName = "'" + this.$route.query.FactoryWName + "'"
                }
                var delivUrl = getExchODataApi(`FutureDataWhsheet?$filter=((VariName eq '${VariName}' or VariCode eq '${VariCode}') and (WarehouseName eq ${WarehouseName} and FactoryWName eq ${FactoryWName}) and Date ge ${startDate} and Date le ${endDate})&$orderby=Date asc`)
                o(delivUrl).get().then(
                    (response) => {
                        var arr = []
                        var data = response.data
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
                        if (VariCode === 'MA') {
                            data.forEach(function (item, key) {
                                data[key].NowWNum = item.WrtNumBS + item.WrtNumWS
                            })
                        }
                        var index = -1
                        for (var i = 0; i < data.length; i++) {
                            index = _self.findIndex(data[i].Date, arr)
                            if (index === -1) {
                                arr.push(data[i])
                            } else {
                                arr[index].NowWNum += data[i].NowWNum
                                arr[index].WNumChange += data[i].WNumChange
                            }
                        }
                        let chartoption1x = []
                        let chartoption1data = []
                        let chartoption2data = []
                        _self.tabDatas = arr
                        _self.totalCount = arr.length
                        let arr1 = []
                        for (let i = (_self.currentPage - 1) * _self.pageSize; i < _self.currentPage * _self.pageSize; i++) {
                            if (arr[i]) {
                                arr1.push(arr[i])
                            }
                        }
                        _self.tabDatas = arr1
                        if (arr.length > 25) {
                            _self.chartOption1.xAxis.axisLabel.interval = 10
                        } else {
                            _self.chartOption2.xAxis.axisLabel.interval = 0
                        }
                        arr.forEach(function (item) {
                            chartoption1x.push(item.Date)
                            chartoption1data.push(item.NowWNum)
                            chartoption2data.push(item.WNumChange)
                        })
                        _self.chartOption1.xAxis.data = chartoption1x
                        _self.chartOption1.series[0].data = chartoption1data
                        _self.chartOption2.xAxis.data = chartoption1x
                        _self.chartOption2.series[0].data = chartoption2data
                        _self.loadingTab = true
                    }
                ).fail(function (ex) {
                    this.$Message.error('数据调用异常', 1)
                })
            },
            findIndex (value, array) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i].Date === value) {
                        return i
                    }
                }
                return -1
            },
            // 搜索
            searchData: function () {
                let _self = this
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
                _self.getWarehouseNameMenu()
                _self.getAllDeliv()
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
                let VariCode = this.selectVari.VariCode
                let VariName = this.selectVari.VariName
                let ExchCode = this.selectVari.ExchCode
                let WarehouseName = this.WarehouseName
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
                endDate = this.toDateTime(endDate)
                let downFilterUrl = `((VariCode eq '${VariCode}' or VariName eq '${VariName}') and ExchCode eq '${ExchCode}' and WarehouseName eq '${WarehouseName}' and Date ge ${startDate} and Date le ${endDate})`
                let url = getExchODataApi(`/FutureDataWhsheet/ExchData.ExportDetailExecl?$filter=${downFilterUrl}&$orderby=Date asc`)
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
                            link.download = '仓库详情-' + WarehouseName + '.xlsx'
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
<style scoped>
    .echart-header{
        margin-left: 20px;
        font-size: 16px;
        font-weight: bold;
    }
    .chart{
        width: 100%;
    }
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

