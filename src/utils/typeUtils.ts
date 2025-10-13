/**
 * 装备类型配置工具
 * 统一管理所有装备类型的标签类型和名称
 */

// 装备类型配置常量
export const TYPE_CONFIG = {
  head: { tagType: 'primary', name: '头盔' },
  coat: { tagType: 'success', name: '衣服' },
  pants: { tagType: 'warning', name: '裤子' },
  belt: { tagType: 'info', name: '腰带' },
  fashion: { tagType: 'danger', name: '时装' },
  vehicle: { tagType: 'primary', name: '载具' },
  weapon: { tagType: 'warning', name: '副手' },
  device: { tagType: 'info', name: '设备' },
  jewelry: { tagType: 'success', name: '饰品' },
  shield: { tagType: 'primary', name: '护盾' }
} as const

/**
 * 获取装备类型标签类型
 * @param type 装备类型
 * @returns Element Plus 标签类型
 */
export function getTypeTagType(type: string): string {
  return TYPE_CONFIG[type as keyof typeof TYPE_CONFIG]?.tagType || 'info'
}

/**
 * 获取装备类型显示名称
 * @param type 装备类型
 * @returns 中文类型名称
 */
export function translateTypeName(type: string): string {
  return TYPE_CONFIG[type as keyof typeof TYPE_CONFIG]?.name || type
}

/**
 * 获取装备类型（兼容旧版本）
 * @param type 装备类型
 * @returns Element Plus 类型
 */
export function getTypeType(type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' {
  return getTypeTagType(type) as 'primary' | 'success' | 'warning' | 'info' | 'danger'
}
