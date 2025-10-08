import { defineStore } from 'pinia'
import { ref } from 'vue'
import { weaponAPI } from '@/api'
import type { Weapon, PaginatedResponse } from '@/types/index'

export const useWeaponStore = defineStore('weapon', () => {
  // 状态
  const weapons = ref<Weapon[]>([])
  const currentWeapon = ref<Weapon | null>(null)
  const loading = ref<boolean>(false)
  const pagination = ref({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    currentPage: 1
  })

  // 方法
  const fetchWeapons = async (page: number = 1) => {
    loading.value = true
    try {
      const response: PaginatedResponse<Weapon> = await weaponAPI.getCustomWeaponList(page)
      weapons.value = response.results
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
        message: error.response?.data?.detail || '获取武器列表失败' 
      }
    } finally {
      loading.value = false
    }
  }

  const fetchWeapon = async (id: number) => {
    loading.value = true
    try {
      const response = await weaponAPI.getCustomWeapon(id)
      currentWeapon.value = response
      return { success: true, data: response }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.detail || '获取武器详情失败' 
      }
    } finally {
      loading.value = false
    }
  }

  const addWeapon = async (weaponData: {
    extra: any;
    title: string;
    description: string;
  }) => {
    loading.value = true
    try {
      const response = await weaponAPI.addCustomWeapon(weaponData)
      weapons.value.unshift(response)
      return { success: true, data: response }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.detail || '添加武器失败' 
      }
    } finally {
      loading.value = false
    }
  }

  const updateWeapon = async (id: number, weaponData: {
    extra: any;
    title: string;
    description: string;
  }) => {
    loading.value = true
    try {
      const response = await weaponAPI.updateCustomWeapon(id, weaponData)
      // 更新列表中的weapon
      const index = weapons.value.findIndex((weapon: { id: number }) => weapon.id === id)
      if (index !== -1) {
        weapons.value[index] = response
      }
      // 更新当前weapon
      if (currentWeapon.value && currentWeapon.value.id === id) {
        currentWeapon.value = response
      }
      return { success: true, data: response }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.detail || '修改武器失败' 
      }
    } finally {
      loading.value = false
    }
  }

  const deleteWeapon = async (id: number) => {
    loading.value = true
    try {
      await weaponAPI.deleteCustomWeapon(id)
      weapons.value = weapons.value.filter((weapon: { id: number }) => weapon.id !== id)
      return { success: true }
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.detail || '删除武器失败' 
      }
    } finally {
      loading.value = false
    }
  }

  return {
    // 状态
    weapons,
    currentWeapon,
    loading,
    pagination,
    // 方法
    fetchWeapons,
    fetchWeapon,
    addWeapon,
    updateWeapon,
    deleteWeapon
  }
})
