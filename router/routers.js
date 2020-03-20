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

// export default [
//   {
//     path: '/login',
//     name: 'login',
//     meta: {
//       title: 'Login - 登录',
//       hideInMenu: true
//     },
//     component: () => import('@/view/login/login.vue')
//   },
//   {
//     path: '/',
//     name: '_home',
//     redirect: '/home',
//     component: Main,
//     meta: {
//       hideInMenu: true,
//       notCache: true
//     },
//     children: [
//       {
//         path: '/home',
//         name: 'home',
//         meta: {
//           hideInMenu: true,
//           title: '首页',
//           notCache: true,
//           icon: 'md-home'
//         },
//         component: () => import('@/view/single-page/home')
//       }
//     ]
//   },
// {
//   path: '',
//   name: 'doc',
//   meta: {
//     title: '文档',
//     href: 'https://lison16.github.io/iview-admin-doc/#/',
//     icon: 'ios-book'
//   }
// },
// {
//   path: '/join',
//   name: 'join',
//   component: Main,
//   meta: {
//     hideInBread: true
//   },
//   children: [
//     {
//       path: 'join_page',
//       name: 'join_page',
//       meta: {
//         icon: '_qq',
//         title: 'QQ群'
//       },
//       component: () => import('@/view/join-page.vue')
//     }
//   ]
// },
// {
//   path: '/message',
//   name: 'message',
//   component: Main,
//   meta: {
//     hideInBread: true,
//     hideInMenu: true
//   },
//   children: [
//     {
//       path: 'message_page',
//       name: 'message_page',
//       meta: {
//         icon: 'md-notifications',
//         title: '消息中心'
//       },
//       component: () => import('@/view/single-page/message/index.vue')
//     }
//   ]
// },
// {
//   path: '/components',
//   name: 'components',
//   meta: {
//     icon: 'logo-buffer',
//     title: '组件'
//   },
//   component: Main,
//   children: [
//     {
//       path: 'tree_select_page',
//       name: 'tree_select_page',
//       meta: {
//         icon: 'md-arrow-dropdown-circle',
//         title: '树状下拉选择器'
//       },
//       component: () => import('@/view/components/tree-select/index.vue')
//     },
//     {
//       path: 'count_to_page',
//       name: 'count_to_page',
//       meta: {
//         icon: 'md-trending-up',
//         title: '数字渐变'
//       },
//       component: () => import('@/view/components/count-to/count-to.vue')
//     },
//     {
//       path: 'drag_list_page',
//       name: 'drag_list_page',
//       meta: {
//         icon: 'ios-infinite',
//         title: '拖拽列表'
//       },
//       component: () => import('@/view/components/drag-list/drag-list.vue')
//     },
//     {
//       path: 'drag_drawer_page',
//       name: 'drag_drawer_page',
//       meta: {
//         icon: 'md-list',
//         title: '可拖拽抽屉'
//       },
//       component: () => import('@/view/components/drag-drawer')
//     },
//     {
//       path: 'org_tree_page',
//       name: 'org_tree_page',
//       meta: {
//         icon: 'ios-people',
//         title: '组织结构树'
//       },
//       component: () => import('@/view/components/org-tree')
//     },
//     {
//       path: 'tree_table_page',
//       name: 'tree_table_page',
//       meta: {
//         icon: 'md-git-branch',
//         title: '树状表格'
//       },
//       component: () => import('@/view/components/tree-table/index.vue')
//     },
//     {
//       path: 'cropper_page',
//       name: 'cropper_page',
//       meta: {
//         icon: 'md-crop',
//         title: '图片裁剪'
//       },
//       component: () => import('@/view/components/cropper/cropper.vue')
//     },
//     {
//       path: 'tables_page',
//       name: 'tables_page',
//       meta: {
//         icon: 'md-grid',
//         title: '多功能表格'
//       },
//       component: () => import('@/view/components/tables/tables.vue')
//     },
//     {
//       path: 'split_pane_page',
//       name: 'split_pane_page',
//       meta: {
//         icon: 'md-pause',
//         title: '分割窗口'
//       },
//       component: () => import('@/view/components/split-pane/split-pane.vue')
//     },
//     {
//       path: 'markdown_page',
//       name: 'markdown_page',
//       meta: {
//         icon: 'logo-markdown',
//         title: 'Markdown编辑器'
//       },
//       component: () => import('@/view/components/markdown/markdown.vue')
//     },
//     {
//       path: 'editor_page',
//       name: 'editor_page',
//       meta: {
//         icon: 'ios-create',
//         title: '富文本编辑器'
//       },
//       component: () => import('@/view/components/editor/editor.vue')
//     },
//     {
//       path: 'icons_page',
//       name: 'icons_page',
//       meta: {
//         icon: '_bear',
//         title: '自定义图标'
//       },
//       component: () => import('@/view/components/icons/icons.vue')
//     }
//   ]
// },
// {
//   path: '/update',
//   name: 'update',
//   meta: {
//     icon: 'md-cloud-upload',
//     title: '数据上传'
//   },
//   component: Main,
//   children: [
//     {
//       path: 'update_table_page',
//       name: 'update_table_page',
//       meta: {
//         icon: 'ios-document',
//         title: '上传Csv'
//       },
//       component: () => import('@/view/update/update-table.vue')
//     },
//     {
//       path: 'update_paste_page',
//       name: 'update_paste_page',
//       meta: {
//         icon: 'md-clipboard',
//         title: '粘贴表格数据'
//       },
//       component: () => import('@/view/update/update-paste.vue')
//     }
//   ]
// },
// {
//   path: '/excel',
//   name: 'excel',
//   meta: {
//     icon: 'ios-stats',
//     title: 'EXCEL导入导出'
//   },
//   component: Main,
//   children: [
//     {
//       path: 'upload-excel',
//       name: 'upload-excel',
//       meta: {
//         icon: 'md-add',
//         title: '导入EXCEL'
//       },
//       component: () => import('@/view/excel/upload-excel.vue')
//     },
//     {
//       path: 'export-excel',
//       name: 'export-excel',
//       meta: {
//         icon: 'md-download',
//         title: '导出EXCEL'
//       },
//       component: () => import('@/view/excel/export-excel.vue')
//     }
//   ]
// },
// {
//   path: '/tools_methods',
//   name: 'tools_methods',
//   meta: {
//     hideInBread: true
//   },
//   component: Main,
//   children: [
//     {
//       path: 'tools_methods_page',
//       name: 'tools_methods_page',
//       meta: {
//         icon: 'ios-hammer',
//         title: '工具方法',
//         beforeCloseName: 'before_close_normal'
//       },
//       component: () => import('@/view/tools-methods/tools-methods.vue')
//     }
//   ]
// },
// {
//   path: '/i18n',
//   name: 'i18n',
//   meta: {
//     hideInBread: true
//   },
//   component: Main,
//   children: [
//     {
//       path: 'i18n_page',
//       name: 'i18n_page',
//       meta: {
//         icon: 'md-planet',
//         title: 'i18n - {{ i18n_page }}'
//       },
//       component: () => import('@/view/i18n/i18n-page.vue')
//     }
//   ]
// },
// {
//   path: '/error_store',
//   name: 'error_store',
//   meta: {
//     hideInBread: true
//   },
//   component: Main,
//   children: [
//     {
//       path: 'error_store_page',
//       name: 'error_store_page',
//       meta: {
//         icon: 'ios-bug',
//         title: '错误收集'
//       },
//       component: () => import('@/view/error-store/error-store.vue')
//     }
//   ]
// },
// {
//   path: '/error_logger',
//   name: 'error_logger',
//   meta: {
//     hideInBread: true,
//     hideInMenu: true
//   },
//   component: Main,
//   children: [
//     {
//       path: 'error_logger_page',
//       name: 'error_logger_page',
//       meta: {
//         icon: 'ios-bug',
//         title: '错误收集'
//       },
//       component: () => import('@/view/single-page/error-logger.vue')
//     }
//   ]
// },
// {
//   path: '/directive',
//   name: 'directive',
//   meta: {
//     hideInBread: true
//   },
//   component: Main,
//   children: [
//     {
//       path: 'directive_page',
//       name: 'directive_page',
//       meta: {
//         icon: 'ios-navigate',
//         title: '指令'
//       },
//       component: () => import('@/view/directive/directive.vue')
//     }
//   ]
// },
// {
//   path: '/multilevel',
//   name: 'multilevel',
//   meta: {
//     icon: 'md-menu',
//     title: '多级菜单'
//   },
//   component: Main,
//   children: [
//     {
//       path: 'level_2_1',
//       name: 'level_2_1',
//       meta: {
//         icon: 'md-funnel',
//         title: '二级-1'
//       },
//       component: () => import('@/view/multilevel/level-2-1.vue')
//     },
//     {
//       path: 'level_2_2',
//       name: 'level_2_2',
//       meta: {
//         access: ['super_admin'],
//         icon: 'md-funnel',
//         showAlways: true,
//         title: '二级-2'
//       },
//       component: parentView,
//       children: [
//         {
//           path: 'level_2_2_1',
//           name: 'level_2_2_1',
//           meta: {
//             icon: 'md-funnel',
//             title: '三级'
//           },
//           component: () => import('@/view/multilevel/level-2-2/level-2-2-1.vue')
//         },
//         {
//           path: 'level_2_2_2',
//           name: 'level_2_2_2',
//           meta: {
//             icon: 'md-funnel',
//             title: '三级'
//           },
//           component: () => import('@/view/multilevel/level-2-2/level-2-2-2.vue')
//         }
//       ]
//     },
//     {
//       path: 'level_2_3',
//       name: 'level_2_3',
//       meta: {
//         icon: 'md-funnel',
//         title: '二级-3'
//       },
//       component: () => import('@/view/multilevel/level-2-3.vue')
//     }
//   ]
// },
//   {
//     path: '/argu',
//     name: 'argu',
//     meta: {
//       hideInMenu: true
//     },
//     component: Main,
//     children: [
//       {
//         path: 'params/:id',
//         name: 'params',
//         meta: {
//           icon: 'md-flower',
//           title: route => `{{ params }}-${route.params.id}`,
//           notCache: true,
//           beforeCloseName: 'before_close_normal'
//         },
//         component: () => import('@/view/argu-page/params.vue')
//       },
//       {
//         path: 'query',
//         name: 'query',
//         meta: {
//           icon: 'md-flower',
//           title: route => `{{ query }}-${route.query.id}`,
//           notCache: true
//         },
//         component: () => import('@/view/argu-page/query.vue')
//       }
//     ]
//   },
//   {
//     path: '/401',
//     name: 'error_401',
//     meta: {
//       hideInMenu: true
//     },
//     component: () => import('@/view/error-page/401.vue')
//   },
//   {
//     path: '/500',
//     name: 'error_500',
//     meta: {
//       hideInMenu: true
//     },
//     component: () => import('@/view/error-page/500.vue')
//   },
//   {
//     path: '*',
//     name: 'error_404',
//     meta: {
//       hideInMenu: true
//     },
//     component: () => import('@/view/error-page/404.vue')
//   }
// ]

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
        component: () => import('@/view/admin/role_list')
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
        component: () => import('@/view/information/add.vue')
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
        path: 'base-attr',
        name: 'base_attr',
        meta: {
          icon: 'md-funnel',
          title: '平台属性'
        },
        component: () => import('@/view/shop/base_attr.vue')
      },
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
        component: () => import('@/view/shopper/goods_list.vue')
      },
      {
        path: 'goods-add',
        name: 'goods_add',
        meta: {
          icon: 'md-funnel',
          title: '商品添加'
        },
        component: () => import('@/view/shopper/goods_add.vue')
      },
      {
        path: 'goods-edit',
        name: 'goods_edit',
        meta: {
          icon: 'md-funnel',
          title: '修改商品',
          hideInMenu: true,
        },
        component: () => import('@/view/shopper/goods_edit.vue')
      },
      {
        path: 'goods-sku',
        name: 'goods_sku',
        meta: {
          icon: 'md-funnel',
          title: '商品sku',
          hideInMenu: true,
        },
        component: () => import('@/view/shopper/goods_sku.vue')
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