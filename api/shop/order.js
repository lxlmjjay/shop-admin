import axios from '@/libs/api.request'

export const findOrders = (data) => {
    return axios.request({
        url: '/api/admin/shopper/find-orders',
        data,
        method: 'post'
    })
}