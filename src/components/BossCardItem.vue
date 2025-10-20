<template>
  <div class="boss-card-item">
    <!-- Boss 头部信息 -->
    <div class="boss-header">
      <el-popover
        placement="right"
        :width="300"
        trigger="click"
        :show-after="100"
      >
        <template #reference>
          <div class="boss-icon clickable">
            <img :src="bossIconUrl" :alt="bossData.n" class="boss-image" />
          </div>
        </template>
        
        <!-- 悬浮窗内容 -->
        <div class="popover-content">
          <div class="popover-header">
            <h4 class="popover-title">{{ bossData.n }}</h4>
            <div class="popover-basic-info">
              <span class="info-item">{{ bossData.s }}★</span>
              <span class="info-item">进化 {{ bossData.ev }}</span>
              <span class="info-item">生命 {{ formatNumber(bossData.li) }}</span>
              <span class="info-item">伤害 {{ formatNumber(bossData.dp) }}</span>
            </div>
          </div>
          
          <!-- 属性加成 -->
          <div v-if="bonusList.length > 0" class="popover-bonus">
            <h5>属性加成</h5>
            <div class="bonus-grid">
              <div 
                v-for="bonus in bonusList" 
                :key="bonus.key"
                class="bonus-item"
              >
                <span class="bonus-key">{{ bonus.key }}</span>
                <span class="bonus-value">{{ bonus.value }}</span>
              </div>
            </div>
          </div>
          
          <!-- 技能列表 -->
          <div v-if="skillsList.length > 0" class="popover-skills">
            <h5>技能列表 ({{ skillsList.length }})</h5>
            <div class="skills-grid">
              <el-tag 
                v-for="skill in skillsList" 
                :key="skill.id"
                :type="getSkillTagType(skill.id)"
                size="small"
                class="skill-tag-popup"
              >
                {{ skill.name }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-popover>
      <div class="boss-info">
        <div class="boss-name">{{ bossData.n }}</div>
        <div class="boss-stats">
          <div class="stat-row">
            <span class="stat-compact">{{ bossData.s }}★</span>
            <span class="stat-compact">ev.{{ bossData.ev }}</span>
            <el-tag type="success" size="small" class="stat-tag">生命:{{ formatNumber(bossData.li) }}</el-tag>
            <el-tag type="danger" size="small" class="stat-tag">伤害:{{ formatNumber(bossData.dp) }}</el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 技能列表 -->
    <div v-if="bossData.sr && bossData.sr.length > 0" class="skills-section">
      <div class="skills-tags">
        <el-tag 
          v-for="skill in skillsList" 
          :key="skill.id"
          :type="getSkillTagType(skill.id)"
          size="small"
          :title="`${skill.id}: ${skill.name}`"
          class="skill-tag"
        >
          {{ skill.name }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BossCardItem } from '@/types/archive/module/bossCard'
import BonusList from './BonusList.vue'
import { getBossSvg } from '@/utils/backgroundImages'
import { getSkillTranslations } from '@/utils/skillTranslator'

interface Props {
  bossData: BossCardItem
}

const props = defineProps<Props>()

// Boss 图标 URL
const bossIconUrl = computed(() => {
  return getBossSvg(props.bossData.n)
})

// 属性加成列表
const bonusList = computed(() => {
  if (!props.bossData.o) return []
  
  return Object.entries(props.bossData.o).map(([key, value]) => ({
    key: translateBonusKey(key),
    value: formatBonusValue(value)
  }))
})

// 技能列表 - 按类型和名称排序
const skillsList = computed(() => {
  if (!props.bossData.sr) return []
  const skills = getSkillTranslations(props.bossData.sr)
  
  // 按技能类型前缀和名称排序
  return skills.sort((a, b) => {
    const prefixA = a.id.split('_')[0]
    const prefixB = b.id.split('_')[0]
    
    // 首先按类型前缀排序
    if (prefixA !== prefixB) {
      return prefixA.localeCompare(prefixB)
    }
    
    // 同类型内按名称排序
    return a.name.localeCompare(b.name, 'zh-CN')
  })
})

/**
 * 翻译属性加成键名
 */
function translateBonusKey(key: string): string {
  const translations: Record<string, string> = {
    'specialPartsDropPro': '特殊零件掉落概率',
    'dpsAllBlack': '全黑武器伤害',
    'hpBonus': '生命加成',
    'damageBonus': '伤害加成',
    'speedBonus': '速度加成',
    'defenseBonus': '防御加成'
  }
  return translations[key] || key
}

/**
 * 格式化属性加成数值
 */
function formatBonusValue(value: number): string {
  // 如果是小数且小于1，显示为百分比
  if (value < 1 && value > 0) {
    return `+${(value * 100).toFixed(1)}%`
  }
  // 如果是整数或大于1的数，直接显示
  return `+${value}`
}

/**
 * 格式化数字显示
 */
function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

/**
 * 根据技能ID获取标签类型
 */
function getSkillTagType(skillId: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' {
  const prefix = skillId.split('_')[0]
  const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    '11': 'primary',    // 召唤类
    '12': 'success',    // 增益类
    '13': 'warning',    // 攻击类
    '14': 'danger',     // 特殊攻击
    '15': 'info',       // 其他攻击
    '21': 'danger',     // 负面状态
    '22': 'warning',    // 控制类
    '23': 'danger',     // 削弱类
    '31': 'success',    // 防御类
    '32': 'primary',    // 恢复类
    '33': 'warning',    // 敏感类
    '34': 'success',    // 抵抗类
    '35': 'primary',    // 免疫类
    '41': 'info',       // 移动类
    '42': 'primary',    // 隐身类
    '43': 'warning',    // 环境类
    '44': 'danger'      // 自我限制类
  }
  return typeMap[prefix] || 'info'
}
</script>

<style scoped>
.boss-card-item {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 10px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.boss-card-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.2);
}

.boss-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.boss-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  flex-shrink: 0;
}

.boss-icon.clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.boss-icon.clickable:hover {
  border-color: #409eff;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.3);
  transform: scale(1.05);
}

.boss-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.boss-info {
  flex: 1;
}

.boss-name {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.boss-stats {
  margin-top: 2px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.stat-compact {
  font-size: 11px;
  color: #606266;
  font-weight: 500;
}

.stat-compact:first-child {
  color: #f56c6c;
  font-weight: 600;
}

.stat-tag {
  font-size: 10px !important;
}

.skills-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-content: flex-start;
}

.skill-tag {
  cursor: help;
  transition: all 0.3s ease;
  font-size: 10px !important;
  padding: 2px 6px !important;
  height: auto !important;
  line-height: 1.2 !important;
}

.skill-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 悬浮窗样式 */
.popover-content {
  padding: 0;
}

.popover-header {
  margin-bottom: 16px;
}

.popover-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.popover-basic-info {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.info-item {
  font-size: 12px;
  color: #606266;
  background-color: #f5f7fa;
  padding: 2px 6px;
  border-radius: 3px;
}

.info-item:first-child {
  color: #f56c6c;
  font-weight: 600;
}

.popover-bonus {
  margin-bottom: 16px;
}

.popover-bonus h5,
.popover-skills h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.bonus-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.bonus-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
}

.bonus-key {
  color: #606266;
}

.bonus-value {
  color: #67c23a;
  font-weight: 500;
}

.popover-skills {
  margin-bottom: 0;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.skill-tag-popup {
  font-size: 11px !important;
  margin: 0 !important;
}
</style>
