import axios from '@/libs/api.request'
//测试申请成为商家 
export const testAddSupplier = (data) => {
    return axios.request({
        url: '/api/v1/shop/supplier/add',
        data,
        method: 'post'
    })
}
//编辑店铺
export const editStore = (data) => {
    return axios.request({
        url: '/api/admin/shopper/edit-store',
        data,
        method: 'post'
    })
}
//我的店铺
export const myStore = (data) => {
    return axios.request({
        url: '/api/admin/shopper/my-store',
        data,
        method: 'post'
    })
}
