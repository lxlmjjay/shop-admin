import Vue from 'vue';
import iView from 'iview'
import axios from '@/libs/api.request'
import { getToken } from '@/libs/util'
import axiosSource from 'axios'

// 资讯详情
export const infomationGet = (data) => {
  return axios.request({
    url: '/api/admin/information/get',
    data,
    method: 'post'
  })
}

// 资讯排序编辑
export const infomationEditSort = (data) => {
  return axios.request({
    url: '/api/admin/information/edit-sort',
    data,
    method: 'post'
  })
}

// 资讯编辑
export const infomationEdit = (data) => {
  return axios.request({
    url: '/api/admin/information/edit',
    data,
    method: 'post'
  })
}

// 资讯列表
export const infomationList = (data) => {
  return axios.request({
    url: '/api/admin/information/find',
    data,
    method: 'post'
  })
}

// 资讯推荐到首页
export const infomationIsHome = (data) => {
  return axios.request({
    url: '/api/admin/information/is-home',
    data,
    method: 'post'
  })
}

// 资讯保存
export const infomationAdd = (data) => {
  return axios.request({
    url: '/api/admin/information/add',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
      'token': getToken()
    },
    method: 'post'
  })
}
// 资讯删除
export const infomationDel = (data) => {
  return axios.request({
    url: '/api/admin/information/del',
    data,
    method: 'post'
  })
}
// 资讯审批
export const infomationApprove = (data) => {
  return axios.request({
    url: '/api/admin/information/approve',
    data,
    method: 'post'
  })
}
// 资讯取消审批
export const infomationCancelApprove = (data) => {
  return axios.request({
    url: '/api/admin/information/cancelApprove',
    data,
    method: 'post'
  })
}

// 资讯分类添加
export const infomationCategoryAdd = (data) => {
  return axios.request({
    url: '/api/admin/information/addc',
    data,
    method: 'post'
  })
}
// 资讯分类列表
export const infomationCategoryList = () => {
  return axios.request({
    url: '/api/admin/information/findc',
    method: 'post'
  })
}

// 资讯分类删除
export const infomationCategoryDel = (data) => {
  return axios.request({
    url: '/api/admin/information/delc',
    data,
    method: 'post'
  })
}

// 资讯分类update
export const infomationCategoryUpdate = (data) => {
  return axios.request({
    url: '/api/admin/information/editc',
    data,
    method: 'post'
  })
}

// 统一请求方法  无返回值
export const apiOp = (funcName, data) => {
  var comand = eval(funcName + "('" + data + "')");
  comand.then(res => {
    if (res.status == 200) {
      var vo = res.data
      if (vo.status == "fail") {
        iView.Message.success(vo.msg);
        return false;
      } else if (vo.status == "success") {
        iView.Message.success(vo.msg);
        return true
      } else {
        iView.Message.success("操作失败");
        return false
      }
    } else {
      iView.Message.success("请求超时");
    }
  });
}
