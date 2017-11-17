<template>
    <div class="template">
    <Row :gutter="60">
        <Col span="8">
        <div class="card-body" style="background:#19be6b;" @click="routerWASDE('UsdaShowVarieties')">
            <div class="left">
                <Icon type="earth" size="50" color="#fff"></Icon>
            </div>
            <div class="right">
                <div class="card-name">农产品供需数据</div>
                <div class="card-desc">WASDE 进出口数据</div>
            </div>
        </div>
        </Col>
        <Col span="8">
        <div class="card-body" style="background:#ed3f14;" @click="routerChange('FutureHoldData')">
            <div class="left">
                <Icon type="ios-home" size="50" color="#fff"></Icon>
            </div>
            <div class="right">
                <div class="card-name">交易所数据</div>
                <div class="card-desc">持有仓排名、仓单日报</div>
            </div>
        </div>
        </Col>
    </Row>
    </div>
</template>
<script>
    import {mapActions} from 'vuex'
    export default {
        mount () {
            this.setlocationList()
        },
        data () {
            return {}
        },
        components: {},
        methods: {
            ...mapActions([
                'setlocationList'
            ]),
            routerWASDE (name) {
                this.$router.push({name: name, params: {TradeVariCode: 'Soybeans'}, query: {englishName: 'Soybeans'}})
            },
            routerChange (name) {
                this.$router.push({name: name, params: {VariCode: 'cu'}})
            }
        }
    }
</script>
<style lang="css" type="text/css" rel="stylesheet/css" scoped>
    .template{
        padding: 15px;
    }
    .ivu-col-span-6 {
        min-width: 200px;
    }
    .card-body {
        cursor: pointer;
        margin: 8px 0px;
        background: rgb(45, 140, 240);
        overflow: hidden;
        border-radius: 3px;
        padding: 16px 8px;
        min-width: 200px;
    }
    .left {
        width: 30%;
        height: 100%;
        float: left;
        text-align: center;
        vertical-align: middle;
    }
    .right {
        float: left;
        color: #fff;
    }
    .card-name {
        font-size: 25px;
    }
    /* Icon Pulse Grow */
    @-webkit-keyframes card-body {
        to {
            -webkit-transform: scale(1.3);
            transform: scale(1.3);
        }
    }
    @keyframes card-body {
        to {
            -webkit-transform: scale(1.3);
            transform: scale(1.3);
        }
    }
    .card-body {
        -webkit-transform: perspective(1px) translateZ(0);
        transform: perspective(1px) translateZ(0);
        box-shadow: 0 0 1px transparent;
        position: relative;
    }
    .card-body .ivu-icon {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
    }
    .card-body:hover .ivu-icon, .card-body:focus .ivu-icon, .card-body:active .ivu-icon{
        -webkit-animation-name: card-body;
        animation-name: card-body;
        -webkit-animation-duration: 0.3s;
        animation-duration: 0.3s;
        -webkit-animation-timing-function: linear;
        animation-timing-function: linear;
        -webkit-animation-iteration-count: infinite;
        animation-iteration-count: infinite;
        -webkit-animation-direction: alternate;
        animation-direction: alternate;
    }
    /*.card-body:hover{*/
        /*.ivu-icon{*/
            /*color:#000!important;*/
        /*}*/
        /*.card-name{*/
            /*color:#000!important;*/
        /*}*/
        /*.card-desc{*/
            /*color:#000!important;*/
        /*}*/
    /*}*/
    .ivu-icon{
        color:#000!important;
    }
    .card-name{
        color:#000!important;
    }
    .card-desc{
        color:#000!important;
    }
</style>
