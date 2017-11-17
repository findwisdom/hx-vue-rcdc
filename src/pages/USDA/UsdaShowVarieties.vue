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
                        <h2>{{options.title}}</h2>
                        </Col>
                        <!--<Col span="2">-->
                        <!--<Button class="pull-right" title="刷新"> <Icon type="refresh"></Icon> </Button>-->
                        <!--</Col>-->
                    </Row>
                </div>
                <div class="content-wrap">
                    <div class="pagerHead">
                        <Row>
                            <Col span="19">
                            <search-components :options="options"></search-components>
                            </Col>
                            <Col span="5" style="text-align: right">
                            <Button  @click="exportData" title="刷新">导出 <Icon type="clipboard"></Icon></Button>
                            <Button type="primary" @click="searchFn (1)" title="刷新"><Icon type="refresh"></Icon></Button>
                            </Col>
                        </Row>
                    </div>
                    <!--新增-->
                    <!--<add-components :options="options"></add-components>-->
                    <!--修改-->
                    <!--<edit-components :options="options"></edit-components>-->
                    <!--详情-->
                    <!--<details-components :options="options"></details-components>-->
                    <!--列表-->
                    <template v-if="ready">
                        <list :options="options"></list>
                    </template>
                    <template v-else>
                        <div style="padding:80px;margin:80px;position: relative;">
                            <Spin fix>
                                <Icon type="load-c" size=40 class="icon-load"></Icon>
                                <div>Loading</div>
                            </Spin>
                        </div>
                    </template>
                    <!--分页-->
                    <pagers-components :options="options"></pagers-components>
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import o from 'o.js'
    import list from '../../components/tableComponents/table.vue'
    import { WsdeVari, getODataApi } from './../../config/apiConfig.js'
    import httpUtility from './../../utility/httpUtility.js'
    import usdaColumns from './../../config/Usda/usdaColumns.js'
//    import addComponents from '../../components/tableComponents/add-components.vue'
//    import editComponents from '../../components/tableComponents/edit-components.vue'
    import searchComponents from '../../components/tableComponents/search-components.vue'
    import pagersComponents from '../../components/tableComponents/pagers-components.vue'
//    import detailsComponents from '../../components/tableComponents/details-components.vue'
    import * as cVuex from '../../components/tableComponents/cVuex.js'
    import * as common from '../../components/tableComponents/common.js'
    import urlAppend from 'url-append'
    export default {
        name: 'clientMsg',
        created () {
            console.log(this.$baseUrl.oDataApiBaseUrl)
        },
        data () {
            // let _this = this
            let url = this.$baseUrl.oDataApiBaseUrl
            return {
                ok: false,
                ready: true,  // 预加载中
                states: {},  // vux存入本地watch
                filterBox: {}, // 存储筛选信息
                options: Object.assign({}, cVuex.options, {   // options将存入vuex,基础配置看 cVuex.options
                    api: url,  // 原始地址，不会改动
                    url: url, // 计算存入的，初始值和api相同
                    title: '数据查看',  // 本页面名称
                    gridKey: 'WASDE',  // 本页面 Eng名，唯一
                    arr: usdaColumns[this.$route.query.englishName],
                    defaultSearch: 'Year',
                    disabledSearch: true // 是否禁用搜索下拉 true：禁用
                }),
                accordion: true,
                openNames: [],
                selectVari: null,
                variCode: '',
                filterVariCode: '',
                TradeVari: []
            }
        },
        mounted: function () {
            cVuex.registerModule(this, this.options, this.options.gridKey)
            let _self = this
            this.TradeVari = WsdeVari
            var variCode = this.$route.params.TradeVariCode
            this.variCode = variCode
            if (variCode) {
                this.variCode = variCode
                this.$router.push({name: 'UsdaShowVarieties', params: {TradeVariCode: this.variCode}, query: {englishName: this.variCode}})
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
            o().config({
                error: function (e, response) {
                    _self.$Modal.error({
                        title: '错误信息',
                        content: response
                    })
                    _self.ready = true
                    _self.$store.dispatch(_self.states.gridKey + '_set_state_data', {pager_Total: 0})
                    _self.$store.dispatch(_self.states.gridKey + '_set_table_data', [])
                }      // a function which is executed on error
            })
//            cVuex.registerModule(this, this.options, this.options.gridKey)
            this.urlchange()
            this.arrchange()
            this.states = this.$store.state[this.options.gridKey]
            this.refreshFn()  // 初始页面获取总页数
            this.searchFn(1)
            this.$Message.config({
                top: 80,
                duration: 1.5
            })
        },
        computed: {
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
            }
        },
        watch: {
            'states.refresh': {
                handler: function (val, oldVal) {
                    this.refreshFn()
                },
                deep: true
            },
            'states.searchBtn': {
                handler: function (val, oldVal) {
                    this.searchFn()
                },
                deep: true
            },
            'states.pager_Size': {
                handler: function (val, oldVal) {
                    this.getList(val, 0)
                },
                deep: true
            },
            'states.pager_CurrentPage': {
                handler: function (val, oldVal) {
                    this.refreshFn()
                },
                deep: true
            }
        },
        methods: {
            // 选择品种
            changeVari: function (name) {
                this.$router.push({name: 'UsdaShowVarieties', params: {TradeVariCode: name}, query: {englishName: name}})
                this.variCode = name
                var variArr = [this.TradeVari]
                for (var i = 0; i < variArr.length; i++) {
                    for (var j = 0; j < variArr[i].length; j++) {
                        if (variArr[i][j].VariCode === name) {
                            this.selectVari = variArr[i][j]
                        }
                    }
                }
                console.log(this.$store)
//                this.options.api = this.$baseUrl.oDataApiBaseUrl
//                this.options.url = this.$baseUrl.oDataApiBaseUrl
                this.$store.dispatch(this.options.gridKey + '_set_state_data', {pager_CurrentPage: 1})
                this.$store.dispatch(this.options.gridKey + '_set_state_data', {api: this.$baseUrl.oDataApiBaseUrl + this.$route.query.englishName})
                this.$store.dispatch(this.options.gridKey + '_set_state_data', {url: this.$baseUrl.oDataApiBaseUrl + this.$route.query.englishName})
//                this.urlchange()
                this.arrchange()
                this.refreshFn()
//                this.searchFn(1)
            },
            urlchange () {
                this.$store.dispatch(this.options.gridKey + '_set_state_data', {api: this.options.api + this.$route.query.englishName})
                this.$store.dispatch(this.options.gridKey + '_set_state_data', {url: this.options.url + this.$route.query.englishName})
            },
            arrchange () {
                this.$store.dispatch(this.options.gridKey + '_set_state_data', {arr: usdaColumns[this.$route.query.englishName]})
            },
            setAddVisible () {
                this.$store.dispatch(this.options.gridKey + '_add_Window_Visible')
            },
            searchUrl (val) {
                let _self = this
                if (_self.states.searchKeys[0] === 'searchAll') {
                    _self.$store.dispatch(_self.states.gridKey + '_set_state_data', {searchKeys: common.getAllKeys(_self.options.arr)})
                }
                let Keys = _self.states.searchKeys  // 搜索 键
                let opts = _self.states.arr  // 匹配类型
                let sUrl = _self.states.api  // url
                let urlObj = {}
                /**
                 *  时间搜索
                 *
                 */
                let startTime = _self.states.startTime
                let endTime = _self.states.endTime
                let timeSelectKey = _self.states.timeSelectKey
                if (startTime && endTime) {
                    let timeUrl = `${timeSelectKey} ge ${startTime}T00:00:00Z and ${timeSelectKey} le ${endTime}T00:00:00Z`
                    urlObj['timeUrl'] = `(${timeUrl})`
                }
                /**
                 *  条件筛选
                 */
                let filterUrl = ``
                for (let filters in _self.filterBox) {
                    let filtersHtmls = ``
                    _self.filterBox[filters].forEach(function (key, val) {
                        filtersHtmls += `${key}or`
                    })
                    filterUrl += `(${filtersHtmls.slice(0, -2)})and`
                }
                if (filterUrl !== '') {
                    urlObj['filterUrl'] = `(${filterUrl.slice(0, -3)})`
                }

                /**
                 *  关键词搜索
                 */
                if (val) {  // 如果搜索有值
                    let valUrl = ``
                    for (let key of Keys) {
                        for (let item of opts) {
                            if (key === item['key']) {
                                if (item.type === 'number') {
                                    if (Number(val)) {
                                        valUrl += `(${key} eq ${val})or`
                                    }
                                }
                                if (item.type === '') {
                                    valUrl += `(contains(${key},'${val}'))or`
                                }
                            }
                        }
                    }
                    urlObj['keyWorkUrl'] = `(${valUrl.slice(0, -2)})`
                }
                /**
                 *  url 拼接
                 */
                let searchUrlString = ``
                let lastUrl = ``
                for (let key in urlObj) {
                    lastUrl += `${urlObj[key]}and`
                }
                if (lastUrl !== '') {
                    searchUrlString = (sUrl + `?$filter=` + `${lastUrl.slice(0, -3)}`)
//                    if (startTime && endTime) {
//                        searchUrlString += `&$orderby=${timeSelectKey} desc`
//                    }
                    console.log(searchUrlString)
                    _self.$store.dispatch(_self.states.gridKey + '_set_state_data', {url: encodeURI(searchUrlString)})
                } else {
                    _self.$store.dispatch(_self.states.gridKey + '_set_state_data', {url: sUrl})
                }
//                console.log('===================================')
//                console.log(searchUrlString)
            },
            searchFn (val) {
                let _self = this
                if (val === 1) {
                    _self.$store.dispatch(_self.states.gridKey + '_set_state_data', {url: encodeURI(this.states.api)})
                    this.$store.dispatch(_self.states.gridKey + '_set_state_data', {searchVal: ''})
                } else {
                    _self.searchUrl(_self.states.searchVal)
                }
                _self.ready = false
                o(urlAppend(_self.states.url, {r: Math.random()})).count().get().then(function (res) {
                    let lengths = res.data
                    if (lengths === 0) {
                        _self.$Message.warning('无符合要求数据')
                        _self.$store.dispatch(_self.options.gridKey + '_set_table_data', [])
                        _self.$store.dispatch(_self.states.gridKey + '_set_state_data', {pager_Total: 0})
                        _self.ready = true
                        return
                    }
                    let ordby = ''
                    if (_self.states.url.indexOf('?') === -1) {
                        ordby = `?$orderby=Date asc,Index asc`
                    } else {
                        ordby = `&$orderby=Date asc,Index asc`
                    }
                    _self.$store.dispatch(_self.states.gridKey + '_set_state_data', {pager_Total: lengths})
                    _self.$store.dispatch(_self.states.gridKey + '_set_state_data', {pager_CurrentPage: 1})
                    console.log(_self.states.url + ordby)
                    o(urlAppend(_self.states.url + ordby, {r: Math.random()})).take(_self.states.pager_Size).skip(_self.states.pager_Size * (_self.states.pager_CurrentPage - 1)).get(function (data) {
                        console.log(_self.states.url + ordby)
                        let datas = _self.formatDate(data)
                        _self.$store.dispatch(_self.options.gridKey + '_set_table_data', datas)
                        _self.ready = true
                    })
                    // 关注
                })
            },
            formatDate (data) {  // 数据处理
                for (var item of data) {
                    if (item['UnitOfNet'] < item['EarlyWarningLine']) {
                        item['cellClassName'] = common.setCellClassName(this.options.arr, 'ivu-icon warning-row')
//            item['cellClassName'] = {
//              Name: 'ivu-icon warning-row'
//            }
                    }
                }
                return data
            },
            refreshFn () {
                this.pagers()
                this.getList(this.states.pager_Size, this.states.pager_Size * (this.states.pager_CurrentPage - 1))  // 初始页面取前 10条
            },
            //  分页 获取总页数
            pagers () {
                let _self = this
                o(urlAppend(_self.states.url, {r: Math.random()})).count().get().then(function (response) {
                    _self.$store.dispatch(_self.states.gridKey + '_set_state_data', {pager_Total: response.data})
                })
            },
            //        获取表格数据
            getList (size, skip) {
                let _self = this
                _self.ready = false
                let ordby = ''
                if (_self.states.url.indexOf('?') === -1) {
                    ordby = `?$orderby=Date asc,Index asc`
                } else {
                    ordby = `&$orderby=Date asc,Index asc`
                }
                o(urlAppend(_self.states.url + ordby, {r: Math.random()})).take(size).skip(skip).get().then(function (response) {
                    let data = _self.formatDate(response.data)
                    _self.$store.dispatch(_self.states.gridKey + '_set_table_data', data)
                    _self.ready = true
                })
            },
            exportData: function (item) {
                let _self = this
                var url = getODataApi('Variety') + '/RCDC.ExportVariety'
                o(url).post({ VarietyName: _self.$route.query.englishName }).save().then(
                    (response) => {
                        httpUtility.download(this, response.data.downloadUrl)
                    }
                )
            }
        },
        components: {
            'list': list,
//            'add-components': addComponents,
//            'edit-components': editComponents,
            'search-components': searchComponents,
//            'details-components': detailsComponents,
            'pagers-components': pagersComponents
        }
    }
</script>
<style lang="css" type="text/css" rel="stylesheet/css" scoped>
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
        padding-left: 20px;
    }
</style>
