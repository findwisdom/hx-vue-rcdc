<template>
    <div>
        <Modal
                v-model="show"
                :title="'编辑 - '+ title"
                @on-cancel="setVisible"
                :mask-closable="false"
                width="980"
        >
            <div class="edit">
                <Row>
                    <Col span="24">
                    <div class="box-body">
                        <div class="row item_input_row">
                            <Form ref="editForm"
                                  :model="eidtData"
                                  :label-width="120">
                                <template v-for="(item, key, index) in options.arr" v-if="item.edit_hide!==1">
                                    <div style="width:50%; float: left;height: 57px;">
                                        <template v-if="item.type ==='data'">
                                            <Form-item
                                                    :prop="item.key"
                                                    :label="item.title"
                                                    :rules="item.rules"
                                            >
                                                <Date-picker
                                                        :disabled="item.disabled"
                                                        :editable="false"
                                                        type="date"
                                                        placeholder="选择日期"
                                                        v-model="eidtData[item.key]">
                                                </Date-picker>
                                            </Form-item>
                                        </template>
                                        <template v-else-if="item.type ==='select'">
                                            <Form-item
                                                    :prop="item.key"
                                                    :label="item.title"
                                                    :rules="item.rules"
                                            >
                                                <Select
                                                        :disabled="item.disabled"
                                                        v-model="eidtData[item.key]" placeholder="请输入内容">
                                                    <Option
                                                            :key="key"
                                                            v-for="a in options[item.key]"
                                                            :label="a.label"
                                                            :value="a.values">
                                                    </Option>
                                                </Select>
                                            </Form-item>
                                        </template>
                                        <template v-else-if="item.type ==='number'">
                                            <Form-item
                                                    :prop="item.key"
                                                    :label="item.title"
                                                    :rules="item.rules"
                                            >
                                                <Input-number
                                                        :disabled="item.disabled"
                                                        v-model="eidtData[item.key]"
                                                        placeholder="请输入内容"
                                                ></Input-number>
                                            </Form-item>
                                        </template>
                                        <template v-else>
                                            <Form-item
                                                    :prop="item.key"
                                                    :label="item.title"
                                                    :rules="item.rules"
                                            >
                                                <Input
                                                        :disabled="item.disabled"
                                                        v-model="eidtData[item.key]"
                                                        placeholder="请输入内容"
                                                ></Input>
                                            </Form-item>
                                        </template>
                                    </div>
                                </template>
                            </Form>
                        </div>
                    </div>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Button @click="setVisible">取消</Button>
                <Button type="primary" @click="handleSubmit('editForm')">提交修改</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import o from 'o.js'
    export default {
        data () {
            return {
                show: false,
                eidtData: {},
                title: ''
            }
        },
        props: ['options'],
        mounted: function () {
            this.title = this.getOptions.edit_Window_Data.Name || this.options.title
        },
        computed: {
            getOptions () {
                return this.$store.state[this.options.gridKey]
            }
        },
        watch: {
            'getOptions.edit_Window_Visible': {
                handler: function (val, oldVal) {
                    this.show = val
                    if (val === true) {
                        /**
                         * 编辑对象，从this.getOptions.arr 筛选出必须的传给后台，过滤调其他方法新加的一些属性
                         * @type {{}}
                         */
                        let o = {}
                        for (let attr in this.getOptions.edit_Window_Data) {
                            for (let item of this.getOptions.arr) {
                                if (item.key) {
                                    if (item.key === attr) {
                                        o[item.key] = this.getOptions.edit_Window_Data[item.key]
                                    }
                                }
                            }
                        }
                        this.eidtData = Object.assign({}, o)
                    } else {
                        this.eidtData = {}
                    }
                },
                deep: false
            }
        },
        methods: {
            setVisible () {
                this.$store.dispatch(this.options.gridKey + '_edit_Window_Visible')
            },
            handleSubmit (formName) {
                let _self = this
                this.$refs[formName].validate((valid) => {
                    console.log(valid)
                    if (valid) {
                        o(_self.options.api).find(_self.eidtData.Id).patch(_self.eidtData).save().then(function (data) {
                            _self.$Message.success('修改成功')
                            _self.$store.dispatch(_self.options.gridKey + '_set_refresh')
                            _self.setVisible() // 关闭弹窗
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields()
            }
        }
    }
</script>
<style scoped>

</style>
