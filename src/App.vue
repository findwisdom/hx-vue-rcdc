
<template>
  <div class="main" :class="{'layout-hide-text': menushort}">
    <div class="layout-menu-left spanLeft" ref="menuLeft" id="menuLeft">
      <app-sidebar></app-sidebar>
    </div>
    <div class="spanRight">
      <app-header @toggleClick="toggleClick"></app-header>
      <app-content></app-content>
      <app-footer></app-footer>
    </div>
  </div>
</template>

<script>
    import Header from './pages/layout/Header.vue'
    import Footer from './pages/layout/Footer.vue'
    import SideBar from './pages/layout/SideBar.vue'
    import Content from './pages/layout/Content.vue'
    import { mapActions } from 'vuex'
    //  import * as roles from './config/role-map.js'

    export default {
        name: 'app',
        data () {
            return {
                fullHeight: window.innerHeight,
                menushort: false
//                spanLeft: 4,
//                spanRight: 20
            }
        },
        components: {
            'app-header': Header,
            'app-content': Content,
            'app-footer': Footer,
            'app-sidebar': SideBar
        },
        computed: {
        },
        methods: {
            ...mapActions({
                getFDLastDate: 'getFDLastDate'
            }),
            init: function () {
                this.getFDLastDate()
            },
            toggleClick () {
                this.menushort = !this.menushort
                if (this.menushort === true) {
//          $(this.$refs.menuLeft).animate({
//            'width': '70px!important'
//          })
                    let width = 230
                    let _this = this
                    let start = setInterval(function () {
                        if (width !== 70) {
                            width = width - 10
                            _this.$refs.menuLeft.style.cssText += 'width:' + width + 'px !important'
                        } else {
                            clearInterval(start)
                            if (document.createEvent) {
                                let event = document.createEvent('HTMLEvents')
                                event.initEvent('resize', true, true)
                                window.dispatchEvent(event)
                            } else if (document.createEventObject) {
                                window.fireEvent('onresize')
                            }
                        }
                    }, 10)
//          this.$refs.menuLeft.style.cssText += 'width:' + 70 + 'px !important'
                } else {
                    let width = 70
                    let _this = this
                    let start = setInterval(function () {
                        if (width !== 230) {
                            width = width + 10
                            _this.$refs.menuLeft.style.cssText += 'width:' + width + 'px !important'
                        } else {
                            clearInterval(start)
                            if (document.createEvent) {
                                let event = document.createEvent('HTMLEvents')
                                event.initEvent('resize', true, true)
                                window.dispatchEvent(event)
                            } else if (document.createEventObject) {
                                window.fireEvent('onresize')
                            }
                        }
                    }, 10)
//          this.$refs.menuLeft.style.cssText += 'width:' + 230 + 'px !important'
                }
            }
        },
        mounted () {
            // let width = document.getElementById('menuLeft').offsetWidth
            // console.log(width)
            this.init()
        }
    }
</script>
<style lang="css" type="text/css">
  .main {
    overflow: hidden;
    width: 100%;
    display: flex;
    background: #eee;
    position: relative;
  }

  .spanLeft {
    width: 230px;
  }

  .spanRight {
    overflow: hidden;
    flex: 1;
  }

  .layout {
    background: #eee;
    position: relative;
  }

  .layout-breadcrumb {
    padding: 10px 15px 0;
  }

  .layout-content {
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }

  .layout-content-main {
    padding: 10px;
  }

  .layout-copy {
    padding: 15px;
    color: #1c2438;
    border-top: 1px solid #d2d6de;
    background: #fff;
  }

  .layout-menu-left {
    background: #464c5b;
  }

  .layout-header {
    height: 50px;
    background: #80848f;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }

  .layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 10px auto;
  }

  .layout-ceiling-main a {
    color: #9ba7b5;
  }

  .layout-hide-text .layout-text {
    display: none;
  }

  .layout-hide-text .ivu-menu-submenu-title-icon {
    display: none;
  }

  .layout-hide-text .ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item {
    padding-left: 24px;
  }

  .layout-hide-text .layout-menu-left .layout-logo-left {
    font-size: 14px;
    letter-spacing: 0;
  }

  .menu-one .ivu-menu-submenu-title-icon {
    display: none;
  }

  .ivu-menu-submenu-title a .layout-text {
    color: #9ea7b4;
  }

  .ivu-menu-submenu-title a i.ivu-icon-ios-navigate {
    margin-right: 8px;
    color: #9ea7b4;
  }

  .ivu-col {
    transition: width .2s ease-in-out;
  }

  i.ivu-icon-ios-navigate {
    font-size: 14px;
  }
</style>
