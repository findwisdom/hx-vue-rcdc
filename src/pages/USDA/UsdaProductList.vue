<template>
    <div class="template">
        <div class="header">
            <h2>品种列表</h2>
        </div>
        <template v-if="ready">
            <Table :columns="columns" :data="data" border style="width: 100%" size="small"></Table>
        </template>
        <template v-else>
            <div style="padding:80px;margin:80px;position: relative;">
                <Spin fix>
                    <Icon type="load-c" size=40 class="icon-load"></Icon>
                    <div>Loading</div>
                </Spin>
            </div>
        </template>
    </div>
</template>
<script>
import o from 'o.js'
import { getODataApi } from './../../config/apiConfig.js'
import httpUtility from './../../utility/httpUtility.js'
// import $ from 'jquery'
export default {
    data () {
        let _self = this
        return {
            ready: false,
            states: {},
            columns: [{
                title: '品种',
                key: 'Name'
            }, {
                title: '操作',
                key: 'action',
                width: 300,
                render: (h, params) => {
                    return h('div',
                        {
                            class: 'tableBtn'
                        }, [
//                            h('i-button', {
//                                title: '查看',
//                                props: {
//                                    type: 'ghost',
//                                    size: 'small'
//                                },
//                                on: {
//                                    click: () => {
//                                        _self.showVarieties(params.row)
//                                    }
//                                }
//                            }, [
//                                '查看'
//                            ]),
                            h('i-button', {
                                title: '报表',
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        _self.goToChart(params.row)
                                    }
                                }
                            }, [
                                '报表'
                            ]),
                            h('i-button', {
                                title: '导出',
                                props: {
                                    type: 'info',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        _self.exportData(params.row)
                                    }
                                }
                            }, [
                                h('span', {}, ['导出'])
                            ])
                        ])
                }
            }],
            data: []
        }
    },
    mounted: function () {
        this.query()
    },
    computed: {
    },
    updated () {
    },
    methods: {
        goToChart: function (item) {
            this.$router.push({ path: '/UsdaChart', params: { name: item.Name, englishName: item.EnglishName }, query: {name: item.EnglishName} })
        },
        query: function () {
            var url = getODataApi('Variety')
            o(url).get().then(
                (response) => {
                    this.data = response.data
                    this.ready = true
                }
            ).fail(function (ex) {
                this.$Message.error('数据调用异常', 1)
                this.ready = true
            })
        },
        showVarieties: function (item) {
            this.$router.push({ name: 'UsdaShowVarieties', params: {Variety_Id: item.Id, englishName: item.EnglishName}, query: {englishName: item.EnglishName} })
        },
        exportData: function (item) {
            var url = getODataApi('Variety') + '/RCDC.ExportVariety'
            o(url).post({ VarietyName: item.EnglishName }).save().then(
                (response) => {
                    httpUtility.download(this, response.data.downloadUrl)
                }
            )
        }
    },
    components: {
    }
}
</script>
<style>
    /*.ivu-table table{*/
        /*width: 100%;*/
    /*}*/
    .tableBtn .ivu-btn{
        display: inline-block;
        margin-right: 10px;
    }
    .template{
        padding: 15px;
    }
    .header {
        padding: 12px 0px;
    }
    .header h2 {
        border-left: 6px solid #39f;
        padding-left: 12px;
        font-size: 24px;
    }

</style>
