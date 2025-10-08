import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { 
  User, 
  AuthResponse, 
  Weapon, 
  Boss, 
  PaginatedResponse, 
  WeaponObject, 
  BossObject,
  ApiError 
} from '@/types'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://127.0.0.1:80/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API接口函数
export const authAPI = {
  // 用户注册
  register: async (username: string, email: string, password: string, passwordConfirm: string): Promise<User> => {
    return api.post('/user/', {
      username,
      email,
      password,
      password_confirm: passwordConfirm
    })
  },

  // 获取Token
  getToken: async (username: string, password: string): Promise<AuthResponse> => {
    return api.post('/token/', {
      username,
      password
    })
  },

  // 生成请求头
  getTokenHeaders: (token: string) => {
    return {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    }
  }
}

export const weaponAPI = {
  // 获取自定义武器列表
  getCustomWeaponList: async (page: number = 1): Promise<PaginatedResponse<Weapon>> => {
    return api.get('/CustomWeapon/', {
      params: { page }
    })
  },

  // 获取单个自定义武器
  getCustomWeapon: async (id: number): Promise<Weapon> => {
    return api.get(`/CustomWeapon/${id}/`)
  },

  // 添加自定义武器
  addCustomWeapon: async (weaponData: {
    extra: WeaponObject;
    title: string;
    description: string;
  }): Promise<Weapon> => {
    return api.post('/CustomWeapon/', weaponData)
  },

  // 修改自定义武器
  updateCustomWeapon: async (id: number, weaponData: {
    extra: WeaponObject;
    title: string;
    description: string;
  }): Promise<Weapon> => {
    return api.put(`/CustomWeapon/${id}/`, weaponData)
  },

  // 删除自定义武器
  deleteCustomWeapon: async (id: number): Promise<void> => {
    return api.delete(`/CustomWeapon/${id}/`)
  }
}

export const bossAPI = {
  // 获取Boss列表
  getBossList: async (page: number = 1): Promise<PaginatedResponse<Boss>> => {
    return api.get('/CustomBoss/', {
      params: { page }
    })
  },

  // 获取单个Boss
  getBoss: async (id: number): Promise<Boss> => {
    return api.get(`/CustomBoss/${id}/`)
  },

  // 添加Boss
  addBoss: async (bossData: {
    extra: BossObject;
    title: string;
    description: string;
  }): Promise<Boss> => {
    return api.post('/CustomBoss/', bossData)
  },

  // 修改Boss
  updateBoss: async (id: number, bossData: {
    extra: BossObject;
    title: string;
    description: string;
  }): Promise<Boss> => {
    return api.put(`/CustomBoss/${id}/`, bossData)
  },

  // 删除Boss
  deleteBoss: async (id: number): Promise<void> => {
    return api.delete(`/CustomBoss/${id}/`)
  }
}

export default api
