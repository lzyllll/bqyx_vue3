import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bossAPI } from '@/api'
import type { Boss, PaginatedResponse } from '@/types'

export const useBossStore = defineStore('boss', () => {
  // 状态
  const bosses = ref<Boss[]>([])
  const currentBoss = ref<Boss | null>(null)
  const loading = ref<boolean>(false)
  const pagination = ref({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    currentPage: 1
  })

  // 方法
  const fetchBosses = async (page: number = 1) => {
    loading.value = true
    try {
      const response: PaginatedResponse<Boss> = await bossAPI.getBossList(page)
      bosses.value = response.results
      pagination.value = {
        count: response.count,
        next: response.next,
        previous: response.previous,
        currentPage: page
      }
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.detail || '获取Boss列表失败' 
      }
    } finally {
      loading.value = false
    }
  }

  const fetchBoss = async (id: number) => {
    loading.value = true
    try {
      const response = await bossAPI.getBoss(id)
      currentBoss.value = response
      return { success: true, data: response }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.detail || '获取Boss详情失败' 
      }
    } finally {
      loading.value = false
    }
  }

  const addBoss = async (bossData: {
    extra: any;
    title: string;
    description: string;
  }) => {
    loading.value = true
    try {
      const response = await bossAPI.addBoss(bossData)
      bosses.value.unshift(response)
      return { success: true, data: response }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.detail || '添加Boss失败' 
      }
    } finally {
      loading.value = false
    }
  }

  const updateBoss = async (id: number, bossData: {
    extra: any;
    title: string;
    description: string;
  }) => {
    loading.value = true
    try {
      const response = await bossAPI.updateBoss(id, bossData)
      // 更新列表中的boss
      const index = bosses.value.findIndex(boss => boss.id === id)
      if (index !== -1) {
        bosses.value[index] = response
      }
      // 更新当前boss
      if (currentBoss.value && currentBoss.value.id === id) {
        currentBoss.value = response
      }
      return { success: true, data: response }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.detail || '修改Boss失败' 
      }
    } finally {
      loading.value = false
    }
  }

  const deleteBoss = async (id: number) => {
    loading.value = true
    try {
      await bossAPI.deleteBoss(id)
      bosses.value = bosses.value.filter(boss => boss.id !== id)
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.detail || '删除Boss失败' 
      }
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    bosses,
    currentBoss,
    loading,
    pagination,
    // 方法
    fetchBosses,
    fetchBoss,
    addBoss,
    updateBoss,
    deleteBoss
  }
})
