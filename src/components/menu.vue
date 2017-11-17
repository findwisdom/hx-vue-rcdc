<template>
    <div>
        <ul class="menu-list">
            <template v-for="(menu, index) in message">
                <li v-if="!menu.child" class="menu-list-item inactive">
                    <span class="menu-list-text">{{menu.name}}</span>
                </li>
                <li v-else class="menu-list-item inactive" @click="menuShow(index)">
                    <span class="menu-list-text" @click="menuHiden(index)">{{menu.name}}</span>
                    <ul class="sub-menu-list" style="display: none">
                        <template v-for="(item, val) in menu.child">
                            <li v-if="!item.child" class="subinactive">
                                <span class="sub-list-text">{{item.name}}</span>
                            </li>
                            <li v-else class="subinactive" @click="submenuShow(val, index, $event)">
                                <span @click="submenuHiden(val, index)" class="sub-list-text">{{item.name}}</span>
                                <ul style="display: none">
                                    <template v-for="subItem in item.child">
                                        <li>
                                            <span>{{subItem.name}}</span>
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
// $(document).ready(function () {
//    $('.inactive').click(function () {
//        if ($(this).children('ul').css('display') === 'none') {
//            $(this).children('ul').slideDown(100)
//        } else {
//        }
//    })
// })
export default {
    data () {
        return {
            message: [{}]
        }
    },
    computed: {
    },
    methods: {
        menuShow (index) {
            let _self = $('.inactive').eq(index)
            if (_self.children('ul').css('display') === 'none') {
                _self.children('ul').slideDown(100)
                _self.siblings('li').children('ul').slideUp(100)
            } else {
//                _self.children('ul').slideUp(100)
            }
        },
        submenuShow (val, index) {
            let _self = $('.inactive').eq(index).children('ul').children('li').eq(val)
            if (_self.children('ul').css('display') === 'none') {
                _self.children('ul').slideDown(100)
                _self.siblings('li').children('ul').slideUp(100)
            } else {
                // _self.children('ul').slideUp(100)
            }
        },
        menuHiden (index) {
            let _self = $('.menu-list-text').eq(index)
            if (_self.siblings('ul').css('display') !== 'none') {
                _self.siblings('ul').slideUp(100)
            }
        },
        submenuHiden (val, index) {
            let _self = $('.inactive').eq(index).children('ul').children('li').eq(val).children('.sub-list-text')
            if (_self.siblings('ul').css('display') !== 'none') {
                _self.siblings('ul').slideUp(100)
            }
        }
    },
    components: {
    }
}
</script>
<style scoped="">
    .menu-list{
        color: #9ea7b4;
        width: 100%;
        background: #657180;
    }
    .menu-list-text{
        display: block;
        width: 100%;
        height: 100%;
    }
    .menu-list-item{
    }
    .sub-menu-list{
        padding-left: 15px;
        background: #464c5b;
    }
    /*.sub-menu-show{*/
        /*display: no;*/
    /*}*/
    .sub-menu-hiden{
        display: none;
    }
    .menu-item-select{
        color: #ffffff;
    }
</style>
