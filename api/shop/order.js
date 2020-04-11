import axios from '@/libs/api.request'

export const findOrders = (data) => {
    return axios.request({
        url: '/api/admin/shopper/find-orders',
        data,
        method: 'post'
    })
}

export const findReturnOrders = (data) => {
    return axios.request({
        url: '/api/admin/shopper/find-return-orders',
        data,
        method: 'post'
    })
}

export const returnApprove = (data) => {
    return axios.request({
        url: '/api/admin/shopper/return-approve',
        data,
        method: 'post'
    })
}

//根据快递单号获取快递公司
export const findPosts = (data) => {
    return axios.request({
        url: '/api/admin/shopper/find-posts',
        data,
        method: 'post'
    })
}

//修改订单为卖家已发货
export const shipped = (data) => {
    return axios.request({
        url: '/api/admin/shopper/shipped',
        data,
        method: 'post'
    })
}

//修改订单为卖家已发货
export const payableAmount = (data) => {
    return axios.request({
        url: '/api/admin/shopper/payable-amount-admin',
        data,
        method: 'post'
    })
}


