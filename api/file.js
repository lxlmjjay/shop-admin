import axios from '@/libs/api.request'

export const uploadOne = (data) => {
    return axios.request({
        url: '/api/admin/uploadOne',
        data,
        method: 'post'
    })
}
export const uploadOneToThumb = (data) => {
    return axios.request({
        url: '/api/admin/uploadOneToThumb',
        data,
        method: 'post'
    })
}
export const upload214_162 = (data) => {
    return axios.request({
        url: '/api/admin/upload214_162',
        data,
        method: 'post'
    })
}

// ali video
export const getUploadAuthAndAddress = (data) => {
    return axios.request({
        url: '/api/admin/video/getUploadAddressAuth',
        data,
        method: 'post'
    })
}

// ali video
export const refreshUploadAuthAndAddress = (data) => {
    return axios.request({
        url: '/api/admin/video/refreshUploadAddressAuth',
        data,
        method: 'post'
    })
}
