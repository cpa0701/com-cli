const staticStr = `
// 组件添加注册方法
components.forEach(component => {
    component.install = function( Vue ) {
        Vue.component(component.name, component);
    }
});

/**
 * 可全局注册使用
 */
const install = function(Vue) {
    components.forEach(component => {
        Vue.component(component.name, component);
    });
};
  
/* istanbul ignore if */
if ( typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
`;

const staticStrExport = `
export default {
    install
}
`;

const componentListStr = `
const components = [
`;

const exportStr = `
export {
    install,
`;

const appRouterStr = `<template>
<div class="hanzo-cli-demo-content">
    <div class="hanzo-cli-br-btn">
        <el-button @click="drawer = true" type="success" icon="el-icon-s-promotion" circle></el-button>
    </div>
    <el-drawer
        direction="ltr"
        :visible.sync="drawer"
        :with-header="false"
    >
        <div class="hanzo-cli-menu-content">
            <el-menu class="el-menu-vertical-demo" router>
                <el-menu-item v-for="( route, index ) in routes" :key="index" :index="route.path">{{ route.name }}</el-menu-item>
            </el-menu>
        </div>
    </el-drawer>

    <router-view/>
</div>
</template>
<script>
export default {
name: "app",
components: {
},
computed: {
    routes() {
        let routers = this.$router.options.routes.filter( ( route ) => {
            return route.name
        } );
        return routers
    }
},
data() {
    return {
        drawer: false
    };
},
};
</script>
<style>
.hanzo-cli-demo-content .el-menu-item, .el-submenu__title {
    height: 35px;
    line-height: 35px;
}
.hanzo-cli-br-btn {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 99999;
}
.el-drawer__body {
    height: 100%;
}

.hanzo-cli-menu-content {
    height: 100%;
    overflow: scroll;
}
</style>
`;

module.exports = {
    staticStr,
    staticStrExport,
    componentListStr,
    exportStr,
    appRouterStr
};