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
                    <h2>{{ this.$route.query.name }} 报表</h2>
                    </Col>
                    <!--<Col span="2">-->
                    <!--<Button class="pull-right" title="刷新"> <Icon type="refresh"></Icon> </Button>-->
                    <!--</Col>-->
                </Row>
            </div>
            <div class="content-wrap">
                <Tabs v-model="name" @on-click="tabChange">
                    <Tab-pane label="月度报告调整统计" name="name1">
                        <month-adjustment-plan></month-adjustment-plan>
                    </Tab-pane>
                    <Tab-pane label="最新年度数据展示" name="name2">
                        <yearly-data></yearly-data>
                    </Tab-pane>
                    <Tab-pane label="项目调整路径" name="name3">
                        <adjustment-path></adjustment-path>
                    </Tab-pane>
                    <Tab-pane label="优良率种植进度" name="name4">
                        <plant></plant>
                    </Tab-pane>
                </Tabs>
            </div>
            </Col>
        </Row>
    </div>
</template>
<style>
    .ivu-tabs-tabpane{
        overflow: hidden!important;
    }
</style>
<script>
import MonthAdjustmentPlan from './UsdaChart-MonthAdjustmentPlan.vue'
import YearlyData from './UsdaChart-YearlyData.vue'
import AdjustmentPath from './UsdaChart-AdjustmentPath.vue'
import Plant from './UsdaChart-Plant.vue'
import { WsdeVari, ExcellentRateVari } from './../../config/apiConfig.js'
import {mapActions, mapGetters} from 'vuex'

export default {
    components: {
        'month-adjustment-plan': MonthAdjustmentPlan,
        'yearly-data': YearlyData,
        'adjustment-path': AdjustmentPath,
        'plant': Plant
    },
    data () {
        // let _this = this
        return {
            name: 'name1',
            accordion: true,
            openNames: [],
            selectVari: null,
            variCode: '',
            filterVariCode: '',
            TradeVari: []
        }
    },
    created () {
        var variCode = this.$route.params.TradeVariCode
        if (this.name === 'name4') {
            this.TradeVari = ExcellentRateVari
        } else {
            this.TradeVari = WsdeVari
        }
        this.variCode = variCode
        if (variCode) {
            if (variCode === 'Winter Wheat' || variCode === 'Spring Wheat') {
                variCode = 'Wheat'
            }
            this.variCode = variCode
            this.$router.push({
                name: 'UsdaChart',
                params: {TradeVariCode: this.variCode},
                query: {name: this.variCode}
            })
            var variArr = [this.TradeVari]
            for (var i = 0; i < variArr.length; i++) {
                for (var j = 0; j < variArr[i].length; j++) {
                    if (variArr[i][j].VariCode === variCode) {
                        this.selectVari = variArr[i][j]
                    }
                }
            }
        }
        this.setPlantVariData(this.selectVari)
        if (this.name === 'name4') {
            this.setPlantLocalList()
        }
    },
    mounted: function () {
        this.setPlantYearList()
//        let _self = this
    },
    computed: {
        ...mapGetters([
            'getPlantVariData'
        ]),
        shVariDict: function () {
            if (this.TradeVari.filter) {
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
        }
    },
    methods: {
        ...mapActions([
            'setPlantVariData',
            'setPlantLocalList',
            'setPlantYearList'
        ]),
        // 选择品种
        changeVari: function (name) {
            if (this.name === 'name4') {
                this.TradeVari = ExcellentRateVari
            } else {
                this.TradeVari = WsdeVari
            }
            this.$router.push({name: 'UsdaChart', params: {TradeVariCode: name}, query: {name: name}})
            this.variCode = name
            var variArr = [this.TradeVari]
            for (var i = 0; i < variArr.length; i++) {
                for (var j = 0; j < variArr[i].length; j++) {
                    if (variArr[i][j].VariCode === name) {
                        this.selectVari = variArr[i][j]
                    }
                }
            }
            if (this.name === 'name4') {
                this.setPlantLocalList()
            }
            this.setPlantVariData(this.selectVari)
        },
        tabChange () {
            let name = this.$route.params.TradeVariCode
            let variCode = this.$route.params.TradeVariCode
            this.variCode = variCode
            if (this.name === 'name4') {
                if (variCode === 'SoybeanOils' || variCode === 'SoybeanMeals' || variCode === 'Wheat') {
                    this.$router.push({name: 'UsdaChart', params: {TradeVariCode: 'Soybeans'}, query: {name: 'Soybeans'}})
                    this.variCode = 'Soybeans'
                }
                this.TradeVari = ExcellentRateVari
            } else {
                if (this.$route.params.TradeVariCode === 'Winter Wheat' || this.$route.params.TradeVariCode === 'Spring Wheat') {
                    this.$router.push({name: 'UsdaChart', params: {TradeVariCode: 'Soybeans'}, query: {name: 'Soybeans'}})
                    this.variCode = 'Soybeans'
                }
                this.TradeVari = WsdeVari
            }
            var variArr = [this.TradeVari]
            for (var i = 0; i < variArr.length; i++) {
                for (var j = 0; j < variArr[i].length; j++) {
                    if (variArr[i][j].VariCode === name) {
                        this.selectVari = variArr[i][j]
                    }
                }
            }
            if (this.name === 'name4') {
                this.setPlantLocalList()
            }
            this.setPlantVariData(this.selectVari)
        }
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
