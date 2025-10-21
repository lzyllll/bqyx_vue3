import rarePartData from '@/assets/data/parts/rarePart.json'

/**
 * 稀有零件信息接口
 */
export interface RarePartInfo {
  name: string
  cnName: string
  objType: string
  maxLevel: number
  itemsLevel?: number
  iconUrl?: string
  baseLabel?: string
  skillArr?: string
  armBonus?: Record<string, any>
  description?: string
}

/**
 * 根据零件名称获取详细信息
 * @param partName 零件名称
 * @returns 零件详细信息，如果未找到返回 null
 */
export function getRarePartInfo(partName: string): any | null {
  return rarePartData[partName as keyof typeof rarePartData] || null
}



/**
 * 根据零件类型获取所有零件
 * @param objType 零件类型 (loader, skill, special, rare)
 * @returns 该类型的所有零件信息
 */
export function getRarePartsByType(objType: string): any[] {
  return Object.entries(rarePartData)
    .filter(([key, partInfo]) => partInfo.objType === objType)
    .map(([key, partInfo]) => partInfo)
}

/**
 * 根据基础标签获取所有相关零件
 * @param baseLabel 基础标签
 * @returns 该基础标签的所有零件信息
 */
export function getRarePartsByBaseLabel(baseLabel: string): any[] {
  return Object.entries(rarePartData)
    .filter(([key, partInfo]) => (partInfo as any).baseLabel === baseLabel)
    .map(([key, partInfo]) => partInfo)
    .sort((a, b) => ((a as any).itemsLevel || 0) - ((b as any).itemsLevel || 0))
}

/**
 * 获取所有稀有零件信息
 * @returns 所有零件信息
 */
export function getAllRareParts(): any[] {
  return Object.values(rarePartData)
}

/**
 * 搜索零件（根据中文名称或英文名称）
 * @param keyword 搜索关键词
 * @returns 匹配的零件信息
 */
export function searchRareParts(keyword: string): any[] {
  const lowerKeyword = keyword.toLowerCase()
  
  return Object.entries(rarePartData)
    .filter(([key, partInfo]) => {
      const name = partInfo.name || key
      const cnName = partInfo.cnName || ''
      return name.toLowerCase().includes(lowerKeyword) || 
             cnName.toLowerCase().includes(lowerKeyword)
    })
    .map(([key, partInfo]) => partInfo)
}
