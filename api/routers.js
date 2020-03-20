import axios from '@/libs/api.request'

export const getRouterReq = (access) => {
  return axios.request({
    url: '/api/admin/menu',
    params: {
      // access
    },
    method: 'post'
  })
}
