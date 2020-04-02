import axios from '@/libs/api.request'

//商品列表
export const findGoods = (data) => {
    return axios.request({
        url: '/api/admin/shopper/goods-find',
        data,
        method: 'post'
    })
}

//商品认证列表
export const findGoodsFlag = (data) => {
    return axios.request({
        url: '/api/admin/shop/find-flag',
        data,
        method: 'post'
    })
}
//添加商品认证
export const addGoodsFlag = (data) => {
    return axios.request({
        url: '/api/admin/shop/add-flag',
        data,
        method: 'post'
    })
}
//删除商品认证
export const delGoodsFlag = (data) => {
    return axios.request({
        url: '/api/admin/shop/del-flag',
        data,
        method: 'post'
    })
}
//商品分类管理员权限
export const findGoodsCategory = (data) => {
    return axios.request({
        url: '/api/admin/shop/findc',
        data,
        method: 'post'
    })
}
//商品分类商家权限
export const findGoodsCategory2 = (data) => {
    return axios.request({
        url: '/api/admin/shopper/findc',
        data,
        method: 'post'
    })
}
// 修改分类
export const editGoodsCategory = (data) => {
    return axios.request({
        url: '/api/admin/shop/editc',
        data,
        method: 'post'
    })
}
// 添加子分类
export const addGoodsCategory = (data) => {
    return axios.request({
        url: '/api/admin/shop/addc',
        data,
        method: 'post'
    })
}

// 修改分类
export const delGoodsCategory = (data) => {
    return axios.request({
        url: '/api/admin/shop/delc',
        data,
        method: 'post'
    })
}


//商家列表
export const findSupplier = (data) => {
    return axios.request({
        url: '/api/admin/shop/find-supplier',
        data,
        method: 'post'
    })
}
//待审核商家列表
export const findSupplierPending = (data) => {
    return axios.request({
        url: '/api/admin/shop/find-supplier-pending',
        data,
        method: 'post'
    })
}
//查看商家资质文件
export const getSupplierFile = (data) => {
    return axios.request({
        url: '/api/admin/shop/get-supplier-file',
        data,
        method: 'post'
    })
}
//商家审核 {"id":1,"status":1} id申请id status：1通过 2拒绝
export const approvalSupplier = (data) => {
    return axios.request({
        url: '/api/admin/shop/approval-supplier',
        data,
        method: 'post'
    })
}

//店铺列表
export const findStore = (data) => {
    return axios.request({
        url: '/api/admin/shop/find-store',
        data,
        method: 'post'
    })
}
//店铺待审核列表
export const findStorePending = (data) => {
    return axios.request({
        url: '/api/admin/shop/find-store-pending',
        data,
        method: 'post'
    })
}
//获取二次修改后待审核信息 {"id":1} 店铺id 状态为4时显示此按钮
export const getStorePending = (data) => {
    return axios.request({
        url: '/api/admin/shop/get-store-pending',
        data,
        method: 'post'
    })
}

//店铺信息审核 {"id":1, "status":2}  2通过 3拒绝
export const approveStore = (data) => {
    return axios.request({
        url: '/api/admin/shop/approve-store',
        data,
        method: 'post'
    })
}


//设置库存
export const setGoodsSkuStock = (data) => {
    return axios.request({
        url: '/api/admin/shopper/set-goods-stock',
        data,
        method: 'post'
    })
}

//获取库存
export const getGoodsSkuStock = (data) => {
    return axios.request({
        url: '/api/admin/shopper/get-goods-stock',
        data,
        method: 'post'
    })
}

//查找商品平台属性 为添加sku
export const findGoodsBaseAttrForSku = (data) => {
    return axios.request({
        url: '/api/admin/shopper/find-base-attr',
        data,
        method: 'post'
    })
}

//查找商品平台属性 为添加sku
export const findSkuByGid = (data) => {
    return axios.request({
        url: '/api/admin/shopper/find-attrs-gid',
        data,
        method: 'post'
    })
}

//查找商标签
export const findTags = (data) => {
    return axios.request({
        url: '/api/admin/shopper/find-tags',
        data,
        method: 'post'
    })
}

//查找商标签
export const addTag = (data) => {
    return axios.request({
        url: '/api/admin/shopper/add-tag',
        data,
        method: 'post'
    })
}

//查找商标签
export const delTag = (data) => {
    return axios.request({
        url: '/api/admin/shopper/del-tag',
        data,
        method: 'post'
    })
}

//查找销售属性
export const findSaleAttrs = (data) => {
    return axios.request({
        url: '/api/admin/shopper/find-sale-attrs',
        data,
        method: 'post'
    })
}

//查找sku图片
export const getSkuImages = (data) => {
    return axios.request({
        url: '/api/admin/shopper/sku-images-get',
        data,
        method: 'post'
    })
}

//添加sku图片
export const addSkuImages = (data) => {
    return axios.request({
        url: '/api/admin/shopper/sku-images-add',
        data,
        method: 'post'
    })
}

//查找sku详情
export const getSkuDetail = (data) => {
    return axios.request({
        url: '/api/admin/shopper/sku-detail-get',
        data,
        method: 'post'
    })
}

//添加sku详情
export const addSkuDetail = (data) => {
    return axios.request({
        url: '/api/admin/shopper/sku-detail-add',
        data,
        method: 'post'
    })
}


//查找sku详情
export const getSkuGoods = (data) => {
    return axios.request({
        url: '/api/admin/shopper/sku-goods-get',
        data,
        method: 'post'
    })
}

//添加sku详情
export const addSkuGoods = (data) => {
    return axios.request({
        url: '/api/admin/shopper/sku-goods-add',
        data,
        method: 'post'
    })
}

//添加sku 平台属性
export const addSkuBaseAttr = (data) => {
    return axios.request({
        url: '/api/admin/shopper/sku-base-attr-add',
        data,
        method: 'post'
    })
}

//获取sku 平台属性
export const getSkuBaseAttr = (data) => {
    return axios.request({
        url: '/api/admin/shopper/base-attr-get',
        data,
        method: 'post'
    })
}

//添加商品
export const addGoods = (data) => {
    return axios.request({
        url: '/api/admin/shopper/goods-add',
        data,
        method: 'post'
    })
}

//get商品
export const getGoods = (data) => {
    return axios.request({
        url: '/api/admin/shopper/goods-get',
        data,
        method: 'post'
    })
}

//edit商品
export const editGoods = (data) => {
    return axios.request({
        url: '/api/admin/shopper/goods-edit',
        data,
        method: 'post'
    })
}

//商品提交审核
export const submitGoods = (data) => {
    return axios.request({
        url: '/api/admin/shopper/goods-submit',
        data,
        method: 'post'
    })
}

//商品变为草稿
export const downGoods = (data) => {
    return axios.request({
        url: '/api/admin/shopper/goods-down',
        data,
        method: 'post'
    })
}
// 平台属性
export const findBaseAttr = (data) => {
    return axios.request({
        url: '/api/admin/shop/find-base-attrs',
        data,
        method: 'post'
    })
}
// 平台属性
export const editBaseAttr = (data) => {
    return axios.request({
        url: '/api/admin/shop/edit-base-attr',
        data,
        method: 'post'
    })
}
// 添加平台属性
export const addBaseAttr = (data) => {
    return axios.request({
        url: '/api/admin/shop/add-base-attr',
        data,
        method: 'post'
    })
}

// 根据平台属性id  获取平台属性值
export const getBaseAttr = (data) => {
    return axios.request({
        url: '/api/admin/shop/get-base-attr',
        data,
        method: 'post'
    })
}

// 添加平台属性值
export const addBaseAttrVal = (data) => {
    return axios.request({
        url: '/api/admin/shop/add-base-attr-value',
        data,
        method: 'post'
    })
}

// 添加平台属性值
export const editBaseAttrVal = (data) => {
    return axios.request({
        url: '/api/admin/shop/edit-base-attr-value',
        data,
        method: 'post'
    })
}

// 删除平台属性值
export const delBaseAttrVal = (data) => {
    return axios.request({
        url: '/api/admin/shop/del-base-attr-value',
        data,
        method: 'post'
    })
}
// 删除平台属性
export const delBaseAttr = (data) => {
    return axios.request({
        url: '/api/admin/shop/del-base-attr',
        data,
        method: 'post'
    })
}
// 商品审批 并设置积分 和 flag 认证
export const goodsApprove = (data) => {
    return axios.request({
        url: '/api/admin/shop/goods-approve',
        data,
        method: 'post'
    })
}
// 编辑积分比例 和 flag
export const editFlagScale = (data) => {
    return axios.request({
        url: '/api/admin/shop/edit-flag-scale',
        data,
        method: 'post'
    })
}
// 查询商品flag认证
export const getGoodsFlag = (data) => {
    return axios.request({
        url: '/api/admin/shop/get-goods-flag',
        data,
        method: 'post'
    })
}
// 查询重量单位
export const findWeightUnit = (data) => {
    return axios.request({
        url: '/api/admin/shopper/find-weight-unit',
        data,
        method: 'post'
    })
}
// 获取二级商品分类
export const findGoodsCategoryByLevel = (data) => {
    return axios.request({
        url: '/api/admin/shop/category-level',
        data,
        method: 'post'
    })
}

//设置商品分类推荐
export const setGoodsCategoryIsHome = (data) => {
    return axios.request({
        url: '/api/admin/shop/is_home',
        data,
        method: 'post'
    })
}