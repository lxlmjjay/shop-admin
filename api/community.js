import axios from '@/libs/api.request'
export const findGroups = (data) => {
    return axios.request({
        url: '/api/admin/community/find',
        data,
        method: 'post'
    })
}
export const editGroup = (data) => {
    return axios.request({
        url: '/api/admin/community/edit',
        data,
        method: 'post'
    })
}
export const createGroup = (data) => {
    return axios.request({
        url: '/api/admin/community/add',
        data,
        method: 'post'
    })
}
//解散群
export const delGroup = (data) => {
    return axios.request({
        url: '/api/admin/community/del',
        data,
        method: 'post'
    })
}
//get by id
export const getGroup = (id) => {
    const data = {
        id: id
    }
    return axios.request({
        url: '/api/admin/community/get',
        data,
        method: 'post'
    })
}

//查找群分类
export const findFlags = (data) => {
    return axios.request({
        url: '/api/admin/community/findc',
        data,
        method: 'post'
    })
}

//审批
export const approve = (data) => {
    return axios.request({
        url: '/api/admin/community/approve',
        data,
        method: 'post'
    })
}
