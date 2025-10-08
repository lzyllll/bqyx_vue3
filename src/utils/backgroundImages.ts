/**
 * 根据颜色获取背景图片的工具模块
 */

// 支持的颜色列表
export const SUPPORTED_COLORS = [
  'white',
  'green', 
  'blue',
  'purple',
  'orange',
  'red',
  'black',
  'darkgold',
  'purgold',
  'yagold'
] as const

export type SupportedColor = typeof SUPPORTED_COLORS[number]

/**
 * 获取arm枪类背景图片
 * @param color 颜色名称
 * @returns 背景图片URL
 */
export function getArmBackgroundImage(color: string): string {
  const normalizedColor = color.toLowerCase()
  
  if (!SUPPORTED_COLORS.includes(normalizedColor as SupportedColor)) {
    console.warn(`不支持的颜色: ${color}, 使用默认颜色 black`)
    return new URL('../assets/images/icons/back/arm_black.png', import.meta.url).href
  }
  
  return new URL(`../assets/images/icons/back/arm_${normalizedColor}.png`, import.meta.url).href
}

/**
 * 获取格子类背景图片
 * @param color 颜色名称
 * @returns 背景图片URL
 */
export function getGridBackgroundImage(color: string): string {
  const normalizedColor = color.toLowerCase()
  
  if (!SUPPORTED_COLORS.includes(normalizedColor as SupportedColor)) {
    console.warn(`不支持的颜色: ${color}, 使用默认颜色 black`)
    return new URL('../assets/images/icons/back/grid_black.png', import.meta.url).href
  }
  
  return new URL(`../assets/images/icons/back/grid_${normalizedColor}.png`, import.meta.url).href
}

/**
 * 获取背景图片样式对象
 * @param color 颜色名称
 * @param type 背景类型 'arm' | 'grid'
 * @returns CSS样式对象
 */
export function getBackgroundImageStyle(color: string, type: 'arm' | 'grid' = 'grid') {
  const imageUrl = type === 'arm' 
    ? getArmBackgroundImage(color)
    : getGridBackgroundImage(color)
    
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: type === 'arm' ? '173px 69px' : '56px 56px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  }
}

/**
 * 获取零件图像
 * @param item 零件对象
 * @returns 零件图像URL
 */
export function getpartsImage(item: { name: string; itemsLevel: number }): string {
  // 如果是loaderParts类型
  if (item.name === 'loaderParts') {
    // 如果等级小于69，都使用loaderParts_69.png
    if (item.itemsLevel < 69) {
      return new URL('@/assets/images/parts/loaderParts_69.png', import.meta.url).href
    }
    // 否则使用对应等级的图像
    return new URL(`../assets/images/parts/loaderParts_${item.itemsLevel}.png`, import.meta.url).href
  }
  
  // 如果不是loaderParts，使用对应名称的图像
  return new URL(`../assets/images/parts/${item.name}_${item.itemsLevel}.png`, import.meta.url).href
}

/**
 * 获取装备图像
 * @param item 装备对象
 * @returns 装备图像URL
 */
// 装备图片路径映射字典
const equipImageMap: Record<string, string> = {
  // 基础装备类型 - 使用 images/equip 目录
  'head': 'equip',
  'coat': 'equip', 
  'pants': 'equip',
  'belt': 'equip',
  // 其他装备类型 - 使用对应的 images 目录
  'fashion': 'fashion',
  'vehicle': 'vehicle',
  'weapon': 'weapon',
  'device': 'device',
  //饰品
  'jewelry': 'jewelry',
  //护盾
  'shield': 'shield',
  //其他
  'parts': 'parts'
}

export function getEquipImage(item: { name: string; partType: string }): string {
  const imageDir = equipImageMap[item.partType] || 'equip'
  // 对于基础装备类型，使用 name_partType 格式
  //images/equip/xxxx_head.png
  if (['head', 'coat', 'pants', 'belt'].includes(item.partType)) {
    return new URL(`../assets/images/${imageDir}/${item.name}_${item.partType}.png`, import.meta.url).href
  }
  //images/device/xxxx.png
  // 对于其他类型，直接使用名称
  return new URL(`../assets/images/${imageDir}/${item.name}.png`, import.meta.url).href
}

/**
 * 获取装备背景样式（装备图片在上，格子背景在下）
 * @param item 装备对象
 * @param color 背景颜色
 * @returns CSS样式对象
 */
export function getEquipBackgroundStyle(item: { name: string; partType: string }, color: string) {
  const equipImageUrl = getEquipImage(item)
  const gridImageUrl = getGridBackgroundImage(color)
  return {
    backgroundImage: `url(${equipImageUrl}), url(${gridImageUrl})`,
    backgroundSize: '48px 48px, 56px 56px',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: 'center, center'
  }
}


