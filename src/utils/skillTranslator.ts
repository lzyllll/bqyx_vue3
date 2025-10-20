/**
 * Boss技能翻译工具
 */

import editBossSkillData from '@/assets/data/EditBossSkill.json'

/**
 * 技能翻译映射表
 */
const skillTranslationMap: Record<string, string> = editBossSkillData

/**
 * 将技能ID翻译成中文名称
 * @param skillId 技能ID，格式如 "13_8", "32_3"
 * @returns 技能的中文名称，如果找不到则返回原ID
 */
export function translateSkill(skillId: string): string {
  return skillTranslationMap[skillId] || skillId
}

/**
 * 批量翻译技能ID数组
 * @param skillIds 技能ID数组
 * @returns 翻译后的技能名称数组
 */
export function translateSkills(skillIds: string[]): string[] {
  return skillIds.map(skillId => translateSkill(skillId))
}

/**
 * 获取技能翻译对象，包含原ID和翻译名称
 * @param skillId 技能ID
 * @returns 包含id和name的对象
 */
export function getSkillTranslation(skillId: string): { id: string; name: string } {
  return {
    id: skillId,
    name: translateSkill(skillId)
  }
}

/**
 * 批量获取技能翻译对象数组
 * @param skillIds 技能ID数组
 * @returns 包含id和name的对象数组
 */
export function getSkillTranslations(skillIds: string[]): Array<{ id: string; name: string }> {
  return skillIds.map(skillId => getSkillTranslation(skillId))
}
