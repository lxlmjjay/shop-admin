import axios from '@/libs/api.request'
// 获取分类
export const findVideoCategory = (data) => {
    return axios.request({
        url: '/api/admin/video/find-category',
        data,
        method: 'post'
    })
}