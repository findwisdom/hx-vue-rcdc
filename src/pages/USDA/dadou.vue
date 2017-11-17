<template>
    <div>
        <side-menu></side-menu>
    </div>
</template>
<script>
    import sideMenu from './../../components/menu.vue'
    export default {
        data () {
            return {
                message: 1
            }
        },
        computed: {
        },
        methods: {
            MenuClick () {
                this.$emit('toggleClick')
            }
        },
        components: {
            'sideMenu': sideMenu
        }
    }
</script>
<style lang="css" type="text/css">
</style>
