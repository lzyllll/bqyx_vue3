import translateData from '@/assets/data/bonus/translate.json'
import mapData from '@/assets/data/map.json'
import headClassData from '@/assets/data/headTitle/headClass.json'
//物品相关的json
import blackChipData from '@/assets/data/blackChip/blackChip.json'
import rareChipData from '@/assets/data/rareChip/rareChip.json'
import skillChipData from '@/assets/data/skillChip/skillChip.json'
import materialsData from '@/assets/data/materials/materials.json'
import normalChipData from '@/assets/data/normalChip/normalChip.json'
import propsData from '@/assets/data/props/props.json'

// 物品类型数据映射json详细的信息
const itemTypeDataMap = {
  skillChip: skillChipData,
  normalChip: normalChipData,
  materials: materialsData,
  props: propsData,
  rareChip: rareChipData,
  blackChip: blackChipData
}

// 模块级缓存变量
let flatMapData: Record<string, string> | null = null

/**
 * 扁平化地图数据
 * @param data 嵌套的地图数据
 * @returns 扁平化的地图数据
 */
function flattenMapData(data: any): Record<string, string> {
  const result: Record<string, string> = {}
  
  for (const [category, maps] of Object.entries(data)) {
    if (typeof maps === 'object' && maps !== null) {
      for (const [key, value] of Object.entries(maps)) {
        result[key] = value as string
      }
    }
  }
  
  return result
}

/**
 * 翻译单个加成属性
 * @param key 英文属性名
 * @returns 中文属性名
 */
export function translateSingleBonus(key: string): string {
  return translateData[key as keyof typeof translateData]?.label || key
}

/**
 * 翻译地图名称
 * @param key 地图键名
 * @returns 中文地图名称
 */
export function translateMap(key: string): string {
  // 如果还没有扁平化数据，则进行扁平化
  if (!flatMapData) {
    flatMapData = flattenMapData(mapData)
  }
  return flatMapData[key] || key
}

/**
 * 翻译头衔名称
 * @param key 头衔键名
 * @returns 中文头衔名称
 */
export function translateHeadTitle(key: string): string {
  return headClassData[key as keyof typeof headClassData]?.cnName || key
}

/**
 * 获取头衔信息
 * @param key 头衔键名
 * @returns 头衔信息对象
 */
export function getHeadTitleInfo(key: string): { cnName: string; description: string; type: string; score: number; roleBonus: Record<string, any> } | null {
  const headInfo = headClassData[key as keyof typeof headClassData]
  if (!headInfo) return null
  
  return {
    cnName: headInfo.cnName,
    description: headInfo.description,
    type: headInfo.type,
    score: headInfo.score,
    roleBonus: headInfo.roleBonus || {}
  }
}




/**
 * 批量翻译属性对象
 * @param bonus 属性加成对象
 * @returns 翻译后的属性加成对象
 */
export function translateBonus(bonus: Record<string, any>): Record<string, any> {
  const translatedBonus: Record<string, any> = {}
  for (const [key, value] of Object.entries(bonus)) {
    const translatedKey = translateSingleBonus(key)
    translatedBonus[translatedKey] = value
  }
  return translatedBonus
}

/**
 * 根据格式类型格式化属性加成数值
 * @param key 属性键名
 * @param value 属性值
 * @returns 格式化后的字符串
 */
export function formatBonusValue(key: string, value: any): string {
  if (typeof value !== 'number') {
    return value.toString()
  }

  const format = translateData[key as keyof typeof translateData]?.format
  
  if (format === 'percent') {
      return `${parseFloat((value * 100).toFixed(3))}%`
  } else if (format === 'plus') {
    // 数值格式：保留3位小数但去除末尾的0
    return parseFloat(value.toFixed(3)).toString()
  } else {
    // 默认格式：如果数值小于1，转换为百分比
    if (value < 1 && value > 0) {
      return `${parseFloat((value * 100).toFixed(3))}%`
    }
    // 如果数值大于等于1，保留3位小数但去除末尾的0
    return parseFloat(value.toFixed(3)).toString()
  }
}

/**
 * 获取翻译后的属性加成列表
 * @param bonus 属性加成对象
 * @returns 格式化后的属性加成列表
 */
export function getFormattedBonusList(bonus: Record<string, any>): Array<{key: string, value: string}> {
  return Object.entries(bonus).map(([key, value]) => ({
    key: translateSingleBonus(key),
    value: formatBonusValue(key, value)
  }))
}



/**
 * 根据itemtype获取物品详细信息
 * @param itemType 物品类型
 * @param itemName 物品名
 * @returns 物品详细信息对象或null
 */
export function getItemInfo(itemType: string, itemName: string): any {
  const dataSource = itemTypeDataMap[itemType as keyof typeof itemTypeDataMap]
  if (!dataSource) {
    console.warn(`未知的物品类型: ${itemType}`)
    return null
  }
  
  const itemInfo = dataSource[itemName as keyof typeof dataSource]
  if (!itemInfo) {
    console.warn(`未找到物品: ${itemName} 在类型 ${itemType} 中`)
    return null
  }
  
  return itemInfo
}

/**
 * 根据itemtype获取物品中文名称
 * @param itemType 物品类型
 * @param itemName 物品名
 * @returns 中文名称或原始ID
 */
export function getItemCnName(itemType: string, itemName: string): string {
  const itemInfo = getItemInfo(itemType, itemName)
  return itemInfo?.cnName || itemName
}

/**
 * 根据itemtype获取物品描述
 * @param itemType 物品类型
 * @param itemId 物品ID
 * @returns 物品描述或空字符串
 */
export function getItemDescription(itemType: string, itemId: string): string {
  const itemInfo = getItemInfo(itemType, itemId)
  return itemInfo?.description || ''
}

/**
 * 根据itemtype获取物品分类
 * @param itemType 物品类型
 * @param itemId 物品ID
 * @returns 物品分类或空字符串
 */
export function getItemCategory(itemType: string, itemId: string): string {
  const itemInfo = getItemInfo(itemType, itemId)
  return itemInfo?.category || ''
}

/**
 * 根据itemtype获取物品完整信息（包含翻译）
 * @param itemType 物品类型
 * @param itemId 物品ID
 * @returns 包含翻译的完整物品信息
 */
export function getItemFullInfo(itemType: string, itemId: string): {
  id: string
  cnName: string
  description: string
  category: string
  originalData: any
} | null {
  const itemInfo = getItemInfo(itemType, itemId)
  if (!itemInfo) return null
  
  return {
    id: itemId,
    cnName: itemInfo.cnName || itemId,
    description: itemInfo.description || '',
    category: itemInfo.category || '',
    originalData: itemInfo
  }
}

/**
 * 批量获取多个物品的信息
 * @param items 物品列表，格式为 [{itemType, itemId}, ...]
 * @returns 物品信息列表
 */
export function getBatchItemInfo(items: Array<{itemType: string, itemId: string}>): Array<{
  itemType: string
  itemId: string
  cnName: string
  description: string
  category: string
  success: boolean
}> {
  return items.map(({itemType, itemId}) => {
    const itemInfo = getItemInfo(itemType, itemId)
    return {
      itemType,
      itemId,
      cnName: itemInfo?.cnName || itemId,
      description: itemInfo?.description || '',
      category: itemInfo?.category || '',
      success: !!itemInfo
    }
  })
}