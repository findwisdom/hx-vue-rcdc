<template>
    <div>
        <Row>
            <Col span="10">
            <Input
                    v-model="paramsValue"
                    placeholder="请输入..."
                    @keyup.enter="searchFn"
            >
            <Select :disabled="options.disabledSearch"
                    v-model="paramsSelect" slot="prepend" style="width: 80px">
                <template v-for="(item, key, val) in paramsOption">
                    <Option :value="key">{{item}}</Option>
                </template>
            </Select>
            <Button slot="append" icon="ios-search" @click="searchFn"></Button>
            </Input>
            </Col>
            <Col span="13" style="float: right;">
            <template v-if="options.timeSearch && timeSearchShow">
                <Col span="4">
                <div style="margin-right: 4px;">
                    <Select v-model="timeSelectKey">
                        <Option v-for="item in SelectOpints" :value="item.value" :key="item">{{ item.label }}</Option>
                    </Select>
                </div>
                </Col>
                <Col span="8">
                <Date-picker type="date" :editable="false" :options="startTime" @on-change="startTimeFn"
                             placeholder="选择开始时间"></Date-picker>
                </Col>
                <Col span="1">
                <div style="line-height: 32px;text-align: center">-</div>
                </Col>
                <Col span="8">
                <Date-picker type="date" :editable="false" :options="endTime" @on-change="endTimeFn"
                             placeholder="选择结束时间"></Date-picker>
                </Col>
                <Col span="2">
                <Button icon="search" @click="searchFn" style="margin-left: 4px;"></Button>
                </Col>
            </template>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                timeSearchShow: true,
                SelectOpints: [],
                timeSelectKey: '',
                startTime: {},
                endTime: {},
                paramsOption: {},
                paramsValue: '',
                paramsSelect: 'searchAll' // 默认搜索
            }
        },
        props: ['options'],
        mounted: function () {
            this.paramsOption = this.setOptions(this.options.arr)
            this.SelectOpints = this.setSelectOpints(this.options.arr)
            /**
             *   时间搜索是否显示：如果没有data属性则自动隐藏
             */
            if (this.SelectOpints.length === 0) {
                this.timeSearchShow = false
            }
            try {
                this.timeSelectKey = this.SelectOpints[0].value
            } catch (e) {

            }
            /**
             *  设置默认搜索
             */
            if (this.options.defaultSearch) {
                this.paramsSelect = this.options.defaultSearch
            }
        },
        computed: {
            getOptions () {
                return this.$store.state[this.options.gridKey]
            }
        },
        watch: {},
        methods: {
            setSelectOpints (data) {
                let arr = data
                let newArr = []
                arr.filter(function (e) {
                    let o = {}
                    if (e.type === 'data') {
                        o['value'] = e.key
                        o['label'] = e.title
                        newArr.push(o)
                    }
                })
                return newArr
            },
            startTimeFn (val) {
                this.$store.dispatch(this.getOptions.gridKey + '_set_state_data', {startTime: val})
            },
            endTimeFn (val) {
                this.$store.dispatch(this.getOptions.gridKey + '_set_state_data', {endTime: val})
            },
            searchFn () {
                let _self = this
                let reg = new RegExp(`[\`~!@#$^&*()=|{}':;',\\[\\]<>?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]`)
                if (this.paramsValue !== undefined && this.paramsValue !== null && !reg.test(this.paramsValue)) {
                    this.$store.dispatch(this.getOptions.gridKey + '_set_state_data', {timeSelectKey: this.timeSelectKey})
                    this.$store.dispatch(this.getOptions.gridKey + '_set_state_data', {searchBtn: !this.getOptions.searchBtn})
                    this.$store.dispatch(this.getOptions.gridKey + '_set_state_data', {searchVal: this.paramsValue.replace(/(^\s*)|(\s*$)/g, '')})
                    this.$store.dispatch(this.getOptions.gridKey + '_set_state_data', {searchKeys: [this.paramsSelect]})
                } else {
                    _self.$Modal.error({
                        title: '错误信息',
                        content: '请勿包含特殊字符，且字节不超过100'
                    })
                }
            },
            setOptions (data) {
                let o = {}
                o['searchAll'] = '全部'
                for (let item of data) {
                    if (item.search_hide !== 1) {
                        o[item.key] = item.title
                    }
                }
                return o
            }
        }
    }
</script>
<style scoped>

</style>
