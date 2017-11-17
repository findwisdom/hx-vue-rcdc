<template>
    <div>
        <div class="tabletemplate">
            <Table
                    stripe
                    border
                    :columns="columns"
                    :data="getOptions.tableData"
                    @on-row-dblclick="showDetails"
                    @on-selection-change="selectionFn"
                    size="small"
            ></Table>
        </div>
    </div>
</template>
<script>
    import o from 'o.js'
    import $ from 'jquery'
    export default {
        data () {
            return {
                columns: []
            }
        },
        props: {
            // api接口
            options: Object
        },
        watch: {
//        'getOptions.tableData': {
//            handler: function (val, oldVal) {
//                console.log(val)
//            },
//            deep: true
//        }
        },
        computed: {
            getOptions () {
                if (!this.$store.state[this.options.gridKey]) {
                    return {}
                } else {
                    return this.$store.state[this.options.gridKey]
                }
            }
        },
        mounted () {
            this.setColumns()
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
            unfollow (row) {
                let _self = this
                let id = []
                id.push(row.Id)
                console.log(_self.getOptions)
                o(_self.getOptions.followDelApi).post({ProductIds: id}).save().then(function (data) {
                    let msg = '已取消关注'
                    _self.$Message.success(msg)
                    _self.$store.dispatch(_self.options.gridKey + '_set_refresh')
                })
            },
            follow (row) {
                let _self = this
                let id = []
                id.push(row.Id)
                o(_self.getOptions.followAddApi).post({ProductIds: id}).save().then(function (data) {
                    let msg = '关注成功'
                    _self.$Message.success(msg)
                    _self.$store.dispatch(_self.options.gridKey + '_set_refresh')
                })
            },
            showDetails (val) { // 详情页
                this.$store.dispatch(this.options.gridKey + '_details_Window_Visible', val)
            },
            selectionFn (selection) {
                this.$store.dispatch(this.options.gridKey + '_set_del_data', selection)
            },
            setData (data) { // 设置修改弹窗数据
                if (data) {
                    for (let item of this.getOptions.arr) {
                        if (item.type === 'select') {
                            this.getOptions[item.key].filter(function (e) {
                                if (e.label === data[item.key]) {
                                    data[item.key] = e.values
                                }
                            })
                        }
                    }
                    this.$store.dispatch(this.options.gridKey + '_edit_Window_Visible', data)
                }
            },
            setColumns () {  // 设置列表属性
                this.columns = this.options.arr.filter(function (item) {
                    if (item.list_hide !== 1) {
                        return item
                    }
                })
            },
            //        删除数据()
            delData (row, column) {
                let newROw = Object.assign({}, row, {IsDelete: '1'})
                delete newROw['_index']  // 莫名多出了个——index 删了
                let _self = this
                _self.$Modal.confirm({
                    title: '批量删除确认',
                    content: '此操作将删除该文件, 是否继续?',
                    onOk: function () {
                        o(_self.options.api).find(row['Id']).remove().save().then(function (data) {
                            let msg = row.Name ? row.Name + '删除成功' : '删除成功'
                            _self.$Message.info(msg)
                            _self.$store.dispatch(_self.options.gridKey + '_set_refresh')
                        })
                    }
                })
            }
        },
        filters: {}
    }
</script>
<style lang="css" type="text/css" rel="stylesheet/scss">
    .tablePager {
        padding: 12px 0px 30px!important;
        overflow: hidden;
        width: 100%;
        .ivu-page {
            float: right;
            margin-right: 20px;
        }
    }
    .ivu-table .warning-row {
        color: red;
        display: table-cell;
        /*border-bottom-color: red;*/
    }

    .ivu-table .warning-row:before {
        /*content: "\F100";*/
        /*color: red;*/
        /*float: left;*/
        /*position: absolute;*/
        /*margin-left:5px;*/
    }

    .ivu-table .warning-row td {
        background-color: #ff6600;
        color: #fff;
    }

</style>
