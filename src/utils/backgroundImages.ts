/**
 * 根据颜色获取背景图片的工具模块
 */

import { ThingsType } from "@/types/archive/shared/thingsType"

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
export function getArmBackgroundImage(color?: string): string {
  if (!color) {
    console.warn(`颜色参数为空, 使用默认颜色 black`)
    return new URL('../assets/images/icons/back/arm_black.png', import.meta.url).href
  }

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
export function getGridBackgroundImage(color?: string): string {
  if (!color) {
    return new URL('../assets/images/icons/back/grid_black.png', import.meta.url).href
  }

  const normalizedColor = color.toLowerCase()

  if (!SUPPORTED_COLORS.includes(normalizedColor as SupportedColor)) {
    return new URL('../assets/images/icons/back/grid_black.png', import.meta.url).href
  }

  return new URL(`../assets/images/icons/back/grid_${normalizedColor}.png`, import.meta.url).href
}

/**
 * 获取背景图片样式对象
 * @param color 颜色名称
 * @param type 背景类型 'arm' | 'grid'
 * @param size 自定义大小，格式如 '100px 100px' 或 'contain'
 * @returns CSS样式对象
 */
export function getBackgroundImageStyle(color?: string, type: 'arm' | 'grid' = 'grid', size?: string) {
  const imageUrl = type === 'arm'
    ? getArmBackgroundImage(color)
    : getGridBackgroundImage(color)

  const defaultSize = type === 'arm' ? '173px 69px' : '56px 56px'
  const backgroundSize = size || defaultSize

  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize,
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

export function getThingsImage(item: { name: string; partType: string, imgName: string }): string {
  const imageDir = equipImageMap[item.partType] || item.partType
  // 对于基础装备类型，使用 name_partType 格式
  if (item.imgName) {
    var href = new URL(`../assets/images/${imageDir}/${item.imgName}.png`, import.meta.url).href
    if (!href.includes('undefined')) {
      return href
    }
  }

  //使用name拼接的 new URL(`../assets/images/${imageDir}/${item.name}.png`, import.meta.url).href
  return new URL(`../assets/images/${imageDir}/${item.name}.png`, import.meta.url).href

}

export function getEquipSvg(item: { name: string; partType: string, imgName: string }): string {
  const imageDir = equipImageMap[item.partType] || item.partType
  //svg的问题
  // if(item.name === 'sickleScythe'){
  //  return new URL(`../assets/images/${imageDir}/sickleScythe_1.svg`, import.meta.url).href
  // }
  if (item.imgName) {
    var href = new URL(`../assets/images/${imageDir}/${item.imgName}.svg`, import.meta.url).href
    if (!href.includes('undefined')) {
      return href
    }
  }
  //退化为使用name
  var href = new URL(`../assets/images/${imageDir}/${item.name}.svg`, import.meta.url).href
  if (!href.includes('undefined')) {
    return href
  }
  //如果还不行，那就变为xxxx_1.svg
  return new URL(`../assets/images/${imageDir}/${item.name.split('_')[0]}_1.svg`, import.meta.url).href
  
}

/**
 * 获取装备格子图片的背景及图片的样式（装备图片在上，格子背景在下）
 * @param item 装备对象
 * @param color 背景颜色
 * @returns CSS样式对象
 */
export function getThingsBackgroundStyle(item: { name: string; partType: string, imgName: string }, color?: string) {
  const equipImageUrl = getThingsImage(item)
  const gridImageUrl = getGridBackgroundImage(color)
  return {
    backgroundImage: `url(${equipImageUrl}), url(${gridImageUrl})`,
    backgroundSize: '48px 48px, 56px 56px',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: 'center, center'
  }
}

/**
 * 获取零件背景样式（零件图片在上，格子背景在下）
 * @param item 零件对象
 * @param color 背景颜色
 * @returns CSS样式对象
 */
export function getPartsBackgroundStyle(item: { name: string; itemsLevel: number }, color?: string) {
  const partsImageUrl = getpartsImage(item)
  const gridImageUrl = getGridBackgroundImage(color)
  return {
    backgroundImage: `url(${partsImageUrl}), url(${gridImageUrl})`,
    backgroundSize: '40px 40px, 56px 56px',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: 'center, center'
  }
}

/**
 * 获取武器图像
 * @param item 武器对象
 * @returns 武器图像URL
 */
export function getArmsImage(item: { name: string; imgName?: string }): string {
  // 如果有imgName，直接使用

  // 使用name
  return new URL(`../assets/images/arms/${item.name}.png`, import.meta.url).href
}

/**
 * 获取武器背景样式（武器图片在上，格子背景在下）
 * @param item 武器对象
 * @param color 背景颜色
 * @returns CSS样式对象
 */
export function getArmsBackgroundStyle(item: { name: string; imgName?: string }, color?: string) {
  const armsImageUrl = getArmsImage(item)
  const gridImageUrl = getArmBackgroundImage(color)

  return {
    backgroundImage: `url(${armsImageUrl}), url(${gridImageUrl})`,
    backgroundSize: 'contain, 200px 80px',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: 'center, center'
  }
}


/**
 * 获取成就 SVG 图片
 * @param achieveName 成就名称
 * @returns 成就 SVG 图片 URL
 */
export function getAchieveSvg(achieveName: string): string {
  return new URL(`../assets/images/achieve/${achieveName}.svg`, import.meta.url).href
}

/**
 * 获取头衔 SVG 图片
 * @param headName 头衔名称
 * @returns 头衔 SVG 图片 URL
 */
export function getHeadTitleSvg(headName: string): string {
  return new URL(`../assets/images/headTitle/${headName}.svg`, import.meta.url).href
}


/**
 * 获取技能 SVG 图片
 * @param skillName 技能名称
 * @returns 技能 SVG 图片 URL
 */
export function getSkillSvg(skillName: string): string {
  return new URL(`../assets/images/skill/${skillName}.svg`, import.meta.url).href
}

/**
 * 获取基因 SVG 图片
 * @param geneName 基因名称
 * @returns 基因 SVG 图片 URL
 */
export function getGeneSvg(geneName: string): string {
  return new URL(`../assets/images/gene/${geneName}.svg`, import.meta.url).href
}

/**
 * 获取基因背景样式（基因图片在上，格子背景在下）
 * @param item 基因对象
 * @param color 背景颜色
 * @returns CSS样式对象
 */
export function getGeneBackgroundStyle(item: { name: string }, color?: string) {
  const geneImageUrl = getGeneSvg(item.name)
  const gridImageUrl = getGridBackgroundImage(color)
  
  return {
    backgroundImage: `url(${geneImageUrl}), url(${gridImageUrl})`,
    backgroundSize: '48px 48px, 56px 56px',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: 'center, center'
  }
}




