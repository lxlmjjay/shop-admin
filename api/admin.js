import axios from '@/libs/api.request'
//删除角色
export const delRole = (data) => {
    return axios.request({
        url: '/api/admin/user/role-del',
        data,
        method: 'post'
    })
}
//添加角色
export const addRole = (data) => {
    return axios.request({
        url: '/api/admin/user/role-add',
        data,
        method: 'post'
    })
}
//修改角色权限
export const editAccess = (data) => {
    return axios.request({
        url: '/api/admin/user/role-access',
        data,
        method: 'post'
    })
}
//获取所有权限
export const findAccess = (data) => {
    return axios.request({
        url: '/api/admin/user/access-find',
        data,
        method: 'post'
    })
}
//查找所有角色
export const findRoles = (data) => {
    return axios.request({
        url: '/api/admin/user/role-find',
        data,
        method: 'post'
    })
}
//查找所有管理员
export const findAdmin = (data) => {
    return axios.request({
        url: '/api/admin/user/find',
        data,
        method: 'post'
    })
}
//编辑用户角色 {"id":1,"roleIds":[1,2,3]}  id:用户id roleIds参数为数组类型
export const editAdmin = (data) => {
    return axios.request({
        url: '/api/admin/user/edit',
        data,
        method: 'post'
    })
}
//添加用户 {"username":"12132332323","password":"dasdasd","roleIds":[1,2]}  id:用户id roleIds参数为数组类型
export const addAdmin = (data) => {
    return axios.request({
        url: '/api/admin/user/add',
        data,
        method: 'post'
    })
}
//启用禁用 用户 {"username":"12132332323","password":"dasdasd","roleIds":[1,2]}  id:用户id roleIds参数为数组类型
export const activateAdmin = (data) => {
    return axios.request({
        url: '/api/admin/user/activate',
        data,
        method: 'post'
    })
}
