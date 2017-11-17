<template>
    <div>
        <div class="layout-logo-left">RCDC</div>
        <ul class="menu-list" ref="menulist">
            <template v-for="(menuItems, index) in menu">
                <li v-if="!menuItems.child && routerRole(menuItems.role)" class="menu-list-item inactive">
            <span class="menu-list-text" @click.stop="[menuShow($event),routerChange(menuItems.name)]">
               <Tooltip :content="menuItems.text" placement="right">
                <Icon :type="menuItems.icon" :size="iconSize" class="icon-left item-icon"></Icon>
                <span class="layout-text item-text">{{menuItems.text}}</span>
               </Tooltip>
            </span>
                </li>
                <li v-else-if="routerRole(menuItems.role)" class="menu-list-item inactive list-none">
                    <span class="menu-list-text" @click.stop="menuShow($event)">
                      <Tooltip :content="menuItems.text" placement="right">
                        <Icon :type="menuItems.icon" :size="iconSize" class="icon-left item-icon"></Icon>
                        <span class="layout-text item-text">{{menuItems.text}}</span>
                      </Tooltip>
                      <Icon type="arrow-down-b" :size="iconSize" class="layout-text item-icon active-icon" style="padding-right: 5px"></Icon>
                    </span>
                    <ul class="sub-menu-list list-none">
                        <template v-for="(item, val) in menuItems.child">
                            <li v-if="!item.child && routerRole(item.role)" class="subinactive sub-item">
                        <span class="sub-list-text"
                              @click.stop="[menuShow($event),routerChange(item.name)]">
                          <Tooltip :content="item.text" placement="right">
                            <Icon :type="item.icon" :size="iconSize" class="icon-left sub-item-icon sub-icon"></Icon>
                            <span class="layout-text sub-item-text">{{item.text}}</span>
                        </Tooltip>
                    </span>
                            </li>
                            <li v-else-if="routerRole(item.role)" class="subinactive sub-item">
                    <span @click.stop="menuShow($event)" class="sub-list-text">
                      <Tooltip :content="item.text" placement="right">
                        <Icon :type="item.icon" :size="iconSize" class="icon-left sub-item-icon sub-icon"></Icon>
                        <span class="layout-text sub-item-text">{{item.text}}</span>
                      </Tooltip>
                      <Icon type="arrow-down-b" :size="iconSize" class="layout-text active-icon" style="padding-right: 5px"></Icon>
                    </span>
                                <ul class="list-none">
                                    <template v-for="(subItem,endIndex) in item.child">
                                        <li v-if="routerRole(subItem.role)">
                        <span class="end-list-text end-left"
                              @click.stop="[endSelect(val, index, endIndex), routerChange(subItem.name)]">
                          <Tooltip :content="subItem.text" placement="right">
                            <Icon :type="subItem.icon" :size="iconSize" class="icon-left sub-item-icon sub-icon"></Icon>
                            <span class="layout-text sub-item-text">{{subItem.text}}</span>
                          </Tooltip>
                        </span>
                                        </li>
                                    </template>
                                </ul>
                            </li>
                        </template>
                    </ul>
                </li>
            </template>
        </ul>
    </div>
</template>
<script>
import $ from 'jquery'
import menu from './../../config/menu.js'
// const DEBOUNCE_TIME = 400
export default {
    data () {
        return {
            menu: menu,
            iconSize: 14,
            tId: null
        }
    },
    computed: {
    },
    methods: {
        routerRole (value) {
            if (value && value === '*') {
                return true
            }
        },
        routerChange (name) {
            if (name === 'FutureHoldData') {
                if (this.$route.params.VariCode) {
                    this.$router.push({name: name, params: {VariCode: this.$route.params.VariCode}})
                } else {
                    this.$router.push({name: name, params: {VariCode: 'cu'}})
                }
            } else if (name === 'AnalyzeRationality') {
                // 出口合理性分析
                this.$router.push({name: name, params: {TradeVariCode: 'Soybeans'}})
            } else if (name === 'WeekMarketReport') {
                // 周度出口销售
                this.$router.push({name: name, params: {TradeVariCode: 'Soybeans'}})
            } else if (name === 'WeekMarketInspect') {
                // 周度出口检验
                this.$router.push({name: name, params: {TradeVariCode: 'SOYBEANS'}})
            } else if (name === 'CustomsExit') {
                // 海关出口数据
                this.$router.push({name: name, params: {TradeVariCode: 'Soybeans'}})
            } else if (name === 'UsdaShowVarieties') {
                // 农产品供需数据查看
                this.$router.push({name: name, params: {TradeVariCode: 'Soybeans'}, query: {englishName: 'Soybeans'}})
            } else if (name === 'UsdaChart') {
                // 农产品供需数据查看
                this.$router.push({name: name, params: {TradeVariCode: 'Soybeans'}, query: {name: 'Soybeans'}})
            } else if (name === 'shWarrant') {
                // 上金所持仓排名
                this.$router.push({name: name, params: {VariCode: 'cu'}})
            } else if (name === 'zzWarrant') {
                // 郑商所持仓排名
                this.$router.push({name: name, params: {VariCode: 'CF'}})
            } else if (name === 'dlWarrant') {
                // 大商所持仓排名
                this.$router.push({name: name, params: {VariCode: 'a'}})
            } else {
                this.$router.push({name: name})
            }
        },
        menuShow (e) {
            let dom = e.currentTarget
            if ($(dom).parent().hasClass('activeLi')) {
//                $(dom).parents('.activeLi').removeClass('activeLi').siblings('li').children('.activeLi').removeClass('activeLi')
                $(dom).parent('.activeLi').removeClass('activeLi')
            } else {
                $(dom).parents('.menu-list-item').siblings('li').removeClass('activeLi')
                $(dom).parents('.menu-list-item').siblings('li').find('.activeLi').removeClass('activeLi')
//                $(dom).parents('.menu-list-item').siblings('li').children('span').children('.activeLi').removeClass('activeLi')
                $(dom).addClass('activeLi').parent().addClass('activeLi')
                $(dom).parent('.subinactive').siblings().removeClass('activeLi').children('span').removeClass('activeLi')
            }
        },
        endSelect (val, index, endIndex) {
            let _self = $('.inactive').eq(index).children('ul').children('li').eq(val).children('ul').children('li').eq(endIndex).children('.end-list-text')
            _self.addClass('active-end-item-select')
            $('.end-list-text').not(_self).removeClass('active-end-item-select')
        }
    },
    components: {
    }
}
</script>
<style scoped>
    .list-none>ul,ul.list-none{
        display: none!important;
    }
    .activeLi>ul,ul.activeLi{
        display: block!important;
    }
    span.activeLi{
        color: #ffffff;
    }
    a {
        color: #ffffff;
    }
    li{
        cursor: pointer;
    }

    a:link {
        text-decoration: none;
    }

    a:visited {
        text-decoration: none;
    }

    a:hover {
        color: #ffffff;
    }

    .end-left {
        margin-left: 8px;
    }

    .layout-text {
        padding-right: 32px;
    }

    .active-icon {
        position: absolute;
        right: 20px;
        top: 50%;
        margin-top: -7px;
    }

    .active-item-select {
        color: #2d8cf0;
    }

    .active-sub-item-select {
        color: #2d8cf0;
    }

    .active-end-item-select {
        color: #ffffff;
    }

    .layout-logo-left {
        color: #ffffff;
        text-align: center;
        font-weight: bold;
        font-size: 20px;
        letter-spacing: 4px;
        line-height: 30px;
    }

    .icon-left {
        margin-right: 8px
    }

    .item-text {
    }

    .menu-list {
        color: #9ea7b4;
        width: 100%;
    }

    .menu-list li {
        cursor: pointer;
    }

    .menu-list-text {
        position: relative;
        font-size: 13px;
        padding: 0 20px;
        display: block;
        width: 100%;
        height: 47px;
        line-height: 47px;
    }

    .menu-list-item {
        color: #9ea7b4;
        position: relative;
    }
    .menu-list-item ul{
        display: none;
    }
    .menu-list-item:hover .item-text {
        color: #ffffff;
    }

    .menu-list-item:hover .item-icon {
        color: #ffffff;
    }

    .sub-menu-list {
        background: #313540;
    }

    .sub-list-text {
        position: relative;
        padding: 14px 20px;
        display: block;
        width: 100%;
        font-size: 13px;
    }

    .end-list-text {
        position: relative;
        padding: 14px 20px;
        display: block;
        width: 100%;
        font-size: 13px;
    }

    .sub-list-text:hover {
        color: #ffffff;
    }

    .sub-item {
    }

    .sub-icon {
        margin-left: 12px;
    }

    .subinactive {
    }

    /*.sub-menu-show{*/
    /*display: no;*/
    /*}*/
    .sub-menu-hiden {
        display: none;
    }

    .menu-item-select {
        color: #ffffff;
    }
</style>
