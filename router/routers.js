import Main from '@/components/main'
import parentView from '@/components/parent-view'
import { dynamicRouterAdd } from '@/libs/router-util' // ①添 引入加载菜单

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

// 不作为Main组件的子页面展示的页面单独写
export const otherRouter = [{
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录',
    hideInMenu: true
  },
  component: () => import('@/view/login/login.vue')
},
{
  path: '/401',
  name: 'error_401',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/401.vue')
},
{
  path: '/500',
  name: 'error_500',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/500.vue')
},
{
  path: '*',
  name: 'error_404',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/404.vue')
}
];

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在mainRouter里
export const mainRouter = [
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  }];
export const myRouter = [
  {
    path: '/admin',
    name: 'admin',
    component: Main,
    meta: {
      title: '管理员管理',
      icon: 'md-menu',
      access: ['admin'],
    },
    children: [
      {
        path: 'admin_list',
        name: 'admin_list',
        meta: {
          title: '管理员列表',
          icon: 'md-funnel'
        },
        component: () => import('@/view/admin/list')
      },
      {
        path: 'role_list',
        name: 'role_list',
        meta: {
          title: '角色列表',
          icon: 'md-funnel'
        },
        // component: () => import('@/view/admin/role_list')
        component: r => require.ensure([], () => r(require('@/view/admin/role_list')), 'role_list')
      },
    ]
  },
  {
    path: '/infomation',
    name: '资讯管理',
    meta: {
      icon: 'md-menu',
      title: '资讯管理',
      access: ['infomation'],
    },
    component: Main,
    children: [
      {
        path: 'add',
        name: 'infomation_add',
        meta: {
          icon: 'md-funnel',
          title: '添加资讯',
        },
        component: import('@/view/information/add.vue')
        // component: () => import('@/view/information/add.vue')
      },
      {
        path: 'edit',
        name: 'infomation_edit',
        meta: {
          icon: 'md-funnel',
          title: '编辑资讯',
          hideInMenu: true,
        },
        component: () => import('@/view/information/edit.vue')
      },
      {
        path: 'list',
        name: 'infomation_list',
        meta: {
          icon: 'md-funnel',
          title: '资讯列表'
        },
        component: () => import('@/view/information/list.vue')
      },
      {
        path: 'pending-list',
        name: 'infomation_pending_list',
        meta: {
          icon: 'md-funnel',
          title: '资讯审批',
          access: ['infomation_approve'],
        },
        component: () => import('@/view/information/list_pending.vue')
      },
      {
        path: 'category-list',
        name: 'category_list',
        meta: {
          icon: 'md-funnel',
          title: '资讯分类管理',
          access: ['infomation_category'],
        },
        component: () => import('@/view/information/list_category.vue')
      },
    ]
  },
  {
    path: '/user',
    name: 'user',
    component: Main,
    meta: {
      title: '用户管理',
      icon: 'md-menu',
      access: ['user'],
    },
    children: [
      {
        path: 'list',
        name: 'user_list',
        meta: {
          icon: 'md-funnel',
          title: '注册用户列表'
        },
        component: () => import('@/view/user/list.vue')
      },
      {
        path: 'list_confirm',
        name: 'confirm_list',
        meta: {
          icon: 'md-funnel',
          title: '待审批列表'
        },
        component: () => import('@/view/user/confirm_list.vue')
      },
    ]
  },
  {
    path: '/community',
    name: 'community',
    component: Main,
    meta: {
      title: '社群管理',
      icon: 'md-menu',
      access: ['community'],
    },
    children: [
      {
        path: 'list',
        name: 'community_list',
        meta: {
          icon: 'md-funnel',
          title: '社群管理'
        },
        component: () => import('@/view/community/list.vue')
      },
      {
        path: 'list_confirm',
        name: 'community_list_confirm',
        meta: {
          icon: 'md-funnel',
          title: '社群审批',
          access: ['community_approve'],
        },
        component: () => import('@/view/community/list_confirm.vue')
      },
    ]
  },
  {
    path: '/shop',
    name: 'shop',
    component: Main,
    meta: {
      title: '商城管理',
      icon: 'md-menu',
      access: ['shop'],
    },
    children: [
      {
        path: 'test',
        name: 'test',
        meta: {
          icon: 'md-funnel',
          title: '前台申请成为商家test'
        },
        component: () => import('@/view/shop/test.vue')
      },
      {
        path: 'goods-flag',
        name: 'goods_flag',
        meta: {
          icon: 'md-funnel',
          title: '商品认证管理'
        },
        component: () => import('@/view/shop/goods_flags.vue')
      },
      {
        path: 'goods-list-confirm',
        name: 'goods_list_confirm',
        meta: {
          icon: 'md-funnel',
          title: '待审核商品列表'
        },
        component: () => import('@/view/shop/goods_list_confirm.vue')
      },
      {
        path: 'goods-list-confirm-sku',
        name: 'goods_list_confirm_sku',
        meta: {
          icon: 'md-funnel',
          title: '待审核商品列表查看sku',
          hideInMenu: true,
        },
        component: () => import('@/view/shop/goods_list_confirm_sku.vue')
      },
      {
        path: 'shop_banner',
        name: 'shop_banner',
        meta: {
          icon: 'md-funnel',
          title: 'banner管理'
        },
        component: () => import('@/view/shop/banner.vue')
      },
      {
        path: 'goods-category',
        name: 'goods_category',
        meta: {
          icon: 'md-funnel',
          title: '商品分类管理'
        },
        component: () => import('@/view/shop/goods_category.vue')
      },
      {
        path: 'supplier-list',
        name: 'supplier_list',
        meta: {
          icon: 'md-funnel',
          title: '商家管理'
        },
        component: () => import('@/view/shop/supplier_list.vue')
      },
      {
        path: 'store-list',
        name: 'store_list',
        meta: {
          icon: 'md-funnel',
          title: '店铺管理'
        },
        component: () => import('@/view/shop/store_list.vue')
      },
      {
        path: 'category_is_home',
        name: 'category_is_home',
        meta: {
          icon: 'md-funnel',
          title: '设置分类页推荐'
        },
        component: () => import('@/view/shop/category_is_home.vue')
      },
      {
        path: 'sale_attr',
        name: 'sale_attr',
        meta: {
          icon: 'md-funnel',
          title: '设置商品销售属性'
        },
        component: () => import('@/view/shop/sale_attr.vue')
      },
      // {
      //   path: 'base-attr',
      //   name: 'base_attr',
      //   meta: {
      //     icon: 'md-funnel',
      //     title: '平台属性'
      //   },
      //   component: () => import('@/view/shop/base_attr.vue')
      // },
    ]
  },
  {
    path: '/store',
    name: 'store',
    component: Main,
    meta: {
      title: '店铺管理',
      icon: 'md-menu',
      access: ['store'],
    },
    children: [
      {
        path: 'order-admin',
        name: 'order_admin',
        meta: {
          icon: 'md-funnel',
          title: '订单管理'
        },
        component: () => import('@/view/shopper/order/list.vue')
      },
      {
        path: 'return-admin',
        name: 'return_admin',
        meta: {
          icon: 'md-funnel',
          title: '售后管理'
        },
        component: () => import('@/view/shopper/order/return_list.vue')
      },
      {
        path: 'my-store',
        name: 'my_store',
        meta: {
          icon: 'md-funnel',
          title: '我的店铺'
        },
        component: () => import('@/view/shopper/my_store.vue')
      },
      {
        path: 'goods-list',
        name: 'goods_list',
        meta: {
          icon: 'md-funnel',
          title: '商品管理'
        },
        component: () => import('@/view/shopper/goods/goods_list.vue')
      },
      {
        path: 'goods-add',
        name: 'goods_add',
        meta: {
          icon: 'md-funnel',
          title: '商品添加'
        },
        component: () => import('@/view/shopper/goods/goods_add.vue')
      },
      {
        path: 'goods-edit',
        name: 'goods_edit',
        meta: {
          icon: 'md-funnel',
          title: '修改商品',
          hideInMenu: true,
        },
        component: () => import('@/view/shopper/goods/goods_edit.vue')
      },
      {
        path: 'goods-sku',
        name: 'goods_sku',
        meta: {
          icon: 'md-funnel',
          title: '商品sku',
          hideInMenu: true,
        },
        component: () => import('@/view/shopper/goods/goods_sku.vue')
      },
      {
        path: 'coupon-admin',
        name: 'coupon_admin',
        meta: {
          icon: 'md-funnel',
          title: '优惠卷管理'
        },
        component: () => import('@/view/shopper/coupon/list.vue')
      },
      {
        path: 'tags-admin',
        name: 'tags_admin',
        meta: {
          icon: 'md-funnel',
          title: '标签管理'
        },
        component: () => import('@/view/shopper/goods/tags_admin.vue')
      },
    ]
  },
];
// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
// export const appRouter = [...dynamicRouterAdd()];

export const routes = [
  ...otherRouter,
  ...mainRouter,
  // ...appRouter
  ...myRouter
]

// 所有上面定义的路由都要写在下面输出
export default routes