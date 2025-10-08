import { defineStore } from 'pinia'
import { ref } from 'vue'
// import type { ArchiveData } from '@/types/archive'
import { ArchiveData } from '@/types/archive/root'
import { plainToInstance } from 'class-transformer';
import { da } from 'element-plus/es/locales.mjs';
export const useArchiveStore = defineStore('archive', () => {
  // 状态
  const archiveData = ref<ArchiveData | null>(null)
  const rawData = ref<any>(null)
  const currentModule = ref<string>('')
  // 动作
  const setArchiveData = (data: object) => {
    //转换的类
    archiveData.value = plainToInstance(ArchiveData,data)
    //原生obj
    rawData.value = data
  }
  //获取指定模块数据
  const getModuleData = (moduleKey: string): any => {
    if (!archiveData.value) return null
    return (archiveData.value as any)[moduleKey]
  }
  const clearData = () => {
    archiveData.value = null
    rawData.value = null

  }

  return {
    // 状态
    archiveData,
    rawData,
    currentModule,

    // 动作
    setArchiveData,

    getModuleData,
    clearData
  }
})
