import { defineStore } from 'pinia'
import { ref } from 'vue'
// import type { ArchiveData } from '@/types/archive'
import { ArchiveData } from '@/types/archive/root'
import { plainToInstance } from 'class-transformer';

import type { RoleBonus } from '@/types/archive/Bonus';
import { BonusMerge } from '@/utils/bonusAdd';



export const useArchiveStore = defineStore('archive', () => {
  // 状态
  const archiveData = ref<ArchiveData | null>(null)
  const rawData = ref<any>(null)
  const currentModule = ref<string>('')
  // 动作
  const setArchiveData = (data: object) => {
    //转换的类
    archiveData.value = plainToInstance(ArchiveData,data)
    //武器属性更新，因为有的合成武器属性是固定的，
    // 传来的存档数据，省略了这些属性,需要根据bullet的json数据获取
    // 算了，改为点击图片计算属性了
    // dealArmsInfo(archiveData.value.arms.items as any)
    // dealArmsInfo(archiveData.value.armsHouse.items as any)
    // dealArmsInfo(archiveData.value.armsBag.items as any)
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
  const getAllRoleBonus = ():RoleBonus => {
    var totalBonus: RoleBonus = {}
    //成就加成
    totalBonus = BonusMerge(totalBonus, archiveData.value?.achieve.getRoleBonus()||{} as RoleBonus)
    //装备加成
    totalBonus = BonusMerge(totalBonus, archiveData.value?.equip.getRoleBonus()||{} as RoleBonus)
    //宠物 todo 暂时没有完成生命加成
    totalBonus = BonusMerge(totalBonus, archiveData.value?.pet?.getFightPet()?.getRoleBonus() || {} as RoleBonus)
    //虚天塔
    totalBonus = BonusMerge(totalBonus, archiveData.value?.tower.getRoleBonus()||{} as RoleBonus)
    //巅峰加成
    totalBonus = BonusMerge(totalBonus, archiveData.value?.peak.getRoleBonus()||{} as RoleBonus)
    //vip加成
    totalBonus = BonusMerge(totalBonus, archiveData.value?.vip.getRoleBonus()||{} as RoleBonus)
    //总统加成
    totalBonus = BonusMerge(totalBonus, archiveData.value?.post.getRoleBonus()||{} as RoleBonus)
    //军队加成
    totalBonus = BonusMerge(totalBonus, archiveData.value?.union.getRoleBonus()||{} as RoleBonus)
    //魂卡
    totalBonus = BonusMerge(totalBonus, archiveData.value?.bossCard.getRoleBonus() || {} as RoleBonus)
    //头衔
    totalBonus = BonusMerge(totalBonus, archiveData.value?.head.getRoleBonus()||{} as RoleBonus)
    return totalBonus

  }

  return {
    // 状态
    archiveData,
    rawData,
    currentModule,

    // 动作
    setArchiveData,
    getAllRoleBonus,
    getModuleData,
    clearData
  }
})
