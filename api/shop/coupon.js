import axios from '@/libs/api.request'

export const findCoupons = (data) => {
    return axios.request({
        url: '/api/admin/shopper/find-coupon',
        data,
        method: 'post'
    })
}
export const addCoupon = (data) => {
    return axios.request({
        url: '/api/admin/shopper/add-coupon',
        data,
        method: 'post'
    })
}

export const editCoupon = (data) => {
    return axios.request({
        url: '/api/admin/shopper/edit-coupon',
        data,
        method: 'post'
    })
}

export const delCoupon = (data) => {
    return axios.request({
        url: '/api/admin/shopper/del-coupon',
        data,
        method: 'post'
    })
}

export const useCoupon = (data) => {
    return axios.request({
        url: '/api/admin/shopper/use-coupon',
        data,
        method: 'post'
    })
}

export const findGoodsCouponArr = (data) => {
    return axios.request({
        url: '/api/admin/shopper/find-goods-coupon',
        data,
        method: 'post'
    })
}