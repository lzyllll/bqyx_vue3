import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/api'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(localStorage.getItem('token') || null)
  const user = ref<User | null>(null)
  const isAuthenticated = ref<boolean>(!!localStorage.getItem('token'))

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)

  // 方法
  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.getToken(username, password)
      token.value = response.token
      isAuthenticated.value = true
      localStorage.setItem('token', response.token)
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.detail || '登录失败' 
      }
    }
  }

  const register = async (username: string, email: string, password: string, passwordConfirm: string) => {
    try {
      const response = await authAPI.register(username, email, password, passwordConfirm)
      user.value = response
      return { success: true, data: response }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.detail || '注册失败' 
      }
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return {
    // 状态
    token,
    user,
    isAuthenticated,
    // 计算属性
    isLoggedIn,
    // 方法
    login,
    register,
    logout
  }
})
