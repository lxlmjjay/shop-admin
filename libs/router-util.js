/**
 * ①添
 * @@新增 定义初始化菜单
 */
import store from '@/store'
import { getToken, localSave, localRead } from '@/libs/util'
import { getRouterReq } from '@/api/routers'
// import config from '@/config'
import { lazyLoadingCop } from '@/libs/tools'
import { getMockMenuData } from '@/api/data'
import Main from '@/components/main' // Main 是架构组件，不在后台返回，在文件里单独引入
import parentView from '@/components/parent-view' // parentView 是二级架构组件，不在后台返回，在文件里单独引入
const _import = require('@/router/_import_' + process.env.NODE_ENV)// 获取组件的方法


// 初始化路由
export const initRouter = (vm) => {
  if (!getToken()) {
    return
  }
  var gotRouter = false
  var routerData
  console.log(666, gotRouter, vm, store, 'initRouter')
  if (!gotRouter) {
    getRouterReq().then(res => {
      routerData = res.data.menu // 后台拿到路由
      localSave('dynamicRouter', JSON.stringify(routerData)) // 存储路由到localStorage
      gotRouter = filterAsyncRouter(routerData) // 过滤路由,路由组件转换
      console.log(gotRouter, 'filterAsyncRouter')
      store.commit('updateMenuList', gotRouter);
      dynamicRouterAdd()
    })
  } else {
    gotRouter = dynamicRouterAdd()
  }
  return gotRouter
}

// 加载路由菜单,从localStorage拿到路由,在创建路由时使用
export const dynamicRouterAdd = () => {
  console.log(1111)
  let dynamicRouter = []
  let data = localRead('dynamicRouter')
  console.log(2222, data)
  if (!data) {
    return dynamicRouter
  }
  dynamicRouter = filterAsyncRouter(JSON.parse(data))
  return dynamicRouter
}

// @函数: 遍历后台传来的路由字符串，转换为组件对象
export const filterAsyncRouter = (asyncRouterMap) => {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Main') { // Main组件特殊处理
        route.component = Main
      } else if (route.component === 'parentView') { // parentView组件特殊处理
        route.component = parentView
      } else {
        // route.component = _import(route.component)
        route.component = lazyLoadingCop(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}