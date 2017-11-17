<template>
    <div>
        <!--分页-->
        <div class="tablePager">
            <Page
                    :page-size="options.pager_Size"
                    :page-size-opts="options.pager_Opts"
                    :total="getOptions.pager_Total"
                    :current="options.pager_CurrentPage"
                    show-elevator
                    show-sizer
                    show-total
                    @on-change="handleCurrentChange"
                    @on-page-size-change="handleSizeChange"
            ></Page>
        </div>
    </div>
</template>
<script>
    export default {
        created () {
        },
        data () {
            return {
                states: {}
            }
        },
        props: ['options'],
        computed: {
            getOptions () {
                if (!this.$store.state[this.options.gridKey]) {
                    return {'pager_Total': 0}
                } else {
                    return this.$store.state[this.options.gridKey]
                }
            }
        },
        watch: {},
        methods: {
            handleSizeChange (val) {  // 每页显示条数变化事件
                this.$store.dispatch(this.options.gridKey + '_set_state_data', {pager_Size: val})
            },
            handleCurrentChange (val) {
                this.$store.dispatch(this.options.gridKey + '_set_state_data', {pager_CurrentPage: val})
            }
        }
    }
</script>
<style scoped>

</style>
