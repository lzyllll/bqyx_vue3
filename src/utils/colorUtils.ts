/**
 * 颜色配置工具
 * 统一管理所有模块的颜色标签类型和名称
 */

// 颜色配置常量
export const COLOR_CONFIG = {
  white: { tagType: 'info', name: '白色' },
  green: { tagType: 'success', name: '绿色' },
  blue: { tagType: 'primary', name: '蓝色' },
  purple: { tagType: 'warning', name: '紫色' },
  orange: { tagType: 'danger', name: '橙色' },
  red: { tagType: 'danger', name: '红色' },
  black: { tagType: 'info', name: '黑色' },
  darkgold: { tagType: 'warning', name: '暗金' },
  purgold: { tagType: 'warning', name: '紫金' },
  yagold: { tagType: 'warning', name: '雅金' }
} as const

/**
 * 获取颜色标签类型
 * @param color 颜色名称
 * @returns Element Plus 标签类型
 */
export function getColorTagType(color: string): string {
  return COLOR_CONFIG[color as keyof typeof COLOR_CONFIG]?.tagType || 'info'
}

/**
 * 获取颜色显示名称
 * @param color 颜色名称
 * @returns 中文颜色名称
 */
export function translateColorName(color: string): string {
  return COLOR_CONFIG[color as keyof typeof COLOR_CONFIG]?.name || color
}

/**
 * 获取颜色类型（兼容旧版本）
 * @param color 颜色名称
 * @returns Element Plus 颜色类型
 */
export function getColorType(color: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' {
  return getColorTagType(color) as 'primary' | 'success' | 'warning' | 'info' | 'danger'
}
