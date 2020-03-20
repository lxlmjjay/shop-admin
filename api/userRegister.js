import axios from '@/libs/api.request'
//获取token
export const get_time_token = (data) => {
    return axios.request({
        url: 'http://47.92.130.202:5100/get_time_token',
        data,
        method: 'post'
    })
}

//注册用户列表
export const get_member = (data) => {
    return axios.request({
        url: 'http://47.92.130.202:5100/get_member',
        data,
        method: 'post'
    })
}
//待审核用户列表
export const get_member_confirm = (data) => {
    return axios.request({
        url: 'http://47.92.130.202:5100/confirm_list',
        data,
        method: 'post'
    })
}

export const get_image = (data) => {
    return axios.request({
        url: 'http://47.92.130.202:5100/get_image',
        data,
        responseType: 'blob',
        method: 'post'
    })
}
//审核
export const confirm = (data) => {
    return axios.request({
        url: 'http://47.92.130.202:5100/confirm',
        data,
        method: 'post'
    })
}

//设置积分
export const set_give_jifen = (data) => {
    return axios.request({
        url: 'http://47.92.130.202:5100/set_give_jifen',
        data,
        method: 'post'
    })
}

//获取积分
export const get_give_jifen = () => {
    return axios.request({
        url: 'http://47.92.130.202:5100/get_give_jifen',
        method: 'get'
    })
}

