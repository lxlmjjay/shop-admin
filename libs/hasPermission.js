import store from '@/store'
const has = {
    install(Vue, options) {
        Vue.directive('has', {
            inserted(el, binding, vnode) {
                let permissionList = store.state.user.access
                //binding.value 绑定的元素权限 permissionList用户拥有权限数组
                if (!permissionList.includes(binding.value)) {
                    el.remove()
                }
            }
        });
    },
    install(Vue, options) {
        Vue.directive('button_access', {
            inserted(el, binding, vnode) {
                // 判断table 按钮权限
                if (binding.access) {
                    let access = binding.access
                    if (!store.state.user.access.includes(access)) {
                        el.remove()
                    }
                }
            }
        });
    }
};
export default has;