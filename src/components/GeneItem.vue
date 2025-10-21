<template>
  <el-popover
    placement="bottom"
    :width="350"
    trigger="click"
    :title="gene.cnName"
  >
    <template #reference>
      <div 
        :class="[
          'gene-item',
          { 'new-item': gene.newB, 'locked': gene.lockB }
        ]"
      >
        <!-- 基因图片和背景 -->
        <div 
          class="item-image"
          :style="{ backgroundImage: `url(${getGridBackgroundImage(gene.color)})` }"
        >
          <!-- 基因图片 -->
          <img 
            :src="getGeneSvg(gene.name)" 
            class="gene-svg-image"
          />
          
          <!-- 基因等级显示 -->
          <div v-if="gene.itemsLevel > 1" class="item-level-top">
            Lv.{{ gene.itemsLevel }}
          </div>
          
          <!-- 新基因标识 -->
          <div v-if="gene.newB" class="new-badge">新</div>
          
          <!-- 锁定标识 -->
          <div v-if="gene.lockB" class="lock-badge">🔒</div>
        </div>
        
        <!-- 基因信息 -->
        <div class="item-info">
          <div class="item-name" :title="gene.cnName">
            {{ gene.cnName }}
          </div>
          <div class="item-meta">
            <div class="tag-group">
              <el-tag 
                :type="getColorTagType(gene.color) as any" 
                size="small"
                class="item-quality-tag"
              >
                {{ getColorName(gene.color) }}
              </el-tag>
              <!-- 等级显示 -->
              <div v-if="gene.itemsLevel > 1" class="item-level">
                Lv.{{ gene.itemsLevel }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- Popover内容 -->
    <div class="gene-details">
      <div class="detail-section">
        <h4>基本信息</h4>
        <div class="detail-grid">
          <div class="detail-row">
            <span class="label">名称:</span>
            <span class="value">{{ gene.cnName }}</span>
          </div>
          <div class="detail-row">
            <div class="tag-row">
              <el-tag :type="getColorTagType(gene.color) as any" size="small">
                {{ getColorName(gene.color) }}
              </el-tag>
            </div>
          </div>
          <div class="detail-row" v-if="gene.itemsLevel > 1">
            <span class="label">等级:</span>
            <span class="value">Lv.{{ gene.itemsLevel }}</span>
          </div>
          <div class="detail-row">
            <span class="label">位置:</span>
            <span class="value">{{ gene.site }}</span>
          </div>
        </div>
      </div>

      <!-- 属性加成 -->
      <div v-if="hasAttributes" class="detail-section">
        <h4>属性加成</h4>
        <div class="attributes-grid-two-column">
          <div v-for="attr in validAttributes" :key="attr.key" class="attribute-row">
            <span class="attr-label">{{ getAttributeName(attr.key) }}:</span>
            <span class="attr-value" :class="{ 'positive': attr.value > 0, 'negative': attr.value < 0 }">
              {{ formatAttributeValue(attr.value, attr.key) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 天赋技能 -->
      <div v-if="gene.talentSkillArr && gene.talentSkillArr.length > 0" class="detail-section">
        <h4>天赋技能</h4>
        <div class="skill-list">
          <div v-for="skill in gene.talentSkillArr" :key="skill" class="skill-item talent-skill">
            {{ skill }}
          </div>
        </div>
      </div>

      <!-- 后天技能 -->
      <div v-if="gene.laterSkillArr && gene.laterSkillArr.length > 0" class="detail-section">
        <h4>后天技能</h4>
        <div class="skill-list">
          <div v-for="skill in gene.laterSkillArr" :key="skill" class="skill-item later-skill">
            {{ skill }}
          </div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { GeneItem } from '@/types/archive/module/gene'
import { getGeneSvg, getGridBackgroundImage } from '@/utils/backgroundImages'
import { translateColorName, getColorTagType } from '@/utils/colorUtils'

interface Props {
  gene: GeneItem
}

const props = defineProps<Props>()

// 计算是否有属性加成
const hasAttributes = computed(() => {
  if (!props.gene.obj) return false
  return Object.values(props.gene.obj).some(value => 
    value !== 0 && value !== null && value !== undefined
  )
})

// 获取有效的属性加成
const validAttributes = computed(() => {
  if (!props.gene.obj) return []
  return Object.entries(props.gene.obj)
    .filter(([key, value]) => value !== 0 && value !== null && value !== undefined)
    .map(([key, value]) => ({ key, value }))
})

// 获取颜色中文名称
const getColorName = (color: string) => {
  return translateColorName(color)
}

// 属性配置映射
const attributeConfig: Record<string, { label: string; format: string }> = {
  'dpsMul': { label: '战斗力加成', format: 'percent' },
  'hurtMul': { label: '伤害加成', format: 'percent' },
  'lifeMul': { label: '生命加成', format: 'percent' },
  'headMul': { label: '头部防御加成', format: 'percent' },
  'lifeRate': { label: '生命回复数值', format: 'plus' },
  'critPro3': { label: '三倍爆击加成', format: 'percent' },
  'cdMul': { label: '技能冷却', format: 'percent' },
  'dodge': { label: '闪避率加成', format: 'percent' },
  'fightDedut': { label: '近战减免加成', format: 'percent' },
  'moveMul': { label: '速度加成', format: 'percent' }
}

// 获取属性名称
const getAttributeName = (key: string) => {
  return attributeConfig[key]?.label || key
}

// 格式化属性值
const formatAttributeValue = (value: number, key: string) => {
  const config = attributeConfig[key]
  if (!config) return value.toString()
  
  switch (config.format) {
    case 'percent':
      if (value >= 1) {
        return `+${(value * 100).toFixed(1)}%`
      } else if (value > 0) {
        return `+${(value * 100).toFixed(1)}%`
      } else {
        return `${(value * 100).toFixed(1)}%`
      }
    case 'plus':
      return value > 0 ? `+${value}` : value.toString()
    default:
      return value.toString()
  }
}
</script>

<style scoped>
.gene-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
  cursor: pointer;
  position: relative;
}

.gene-item:hover {
  border-color: #409eff;
}

.gene-item.new-item {
  border-color: #67c23a;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
}

.gene-item.locked {
  border-color: #f56c6c;
}

.item-image {
  width: 56px;
  height: 56px;
  position: relative;
  margin-bottom: 8px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: 56px 56px;
  background-repeat: no-repeat;
  background-position: center;
}

.gene-svg-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  position: relative;
  z-index: 1;
  background: transparent;
  border: none;
  outline: none;
}

.gene-svg-image:not([src]),
.gene-svg-image[src=""],
.gene-svg-image[src*="undefined"],
.gene-svg-image[src*="null"] {
  opacity: 0;
  visibility: hidden;
}

/* 处理图片加载失败的情况 */
.gene-svg-image[src]:not([src=""]) {
  background: transparent;
}

.item-level-top {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: bold;
  min-width: 16px;
  text-align: center;
  z-index: 10;
}

.new-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #67c23a;
  color: white;
  font-size: 8px;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: bold;
}

.lock-badge {
  position: absolute;
  top: -2px;
  left: -2px;
  font-size: 12px;
}

.item-info {
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-name {
  font-size: 12px;
  color: #333;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100px;
  text-align: center;
  width: 100%;
}

.item-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.tag-group {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
}

.item-quality-tag {
  font-size: 9px;
  height: 18px;
  line-height: 16px;
}

.item-level {
  font-size: 10px;
  color: #666;
  background: #f0f0f0;
  padding: 1px 4px;
  border-radius: 3px;
  display: inline-block;
}

.gene-details {
  max-width: 320px;
}

.detail-section {
  margin-bottom: 15px;
}

.detail-section h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}

.detail-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-row {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: calc(50% - 4px);
  margin-bottom: 6px;
  gap: 8px;
}

.detail-row .label {
  font-weight: 500;
  color: #666;
  min-width: 50px;
  font-size: 12px;
}

.detail-row .value {
  color: #333;
  font-size: 12px;
}

.tag-row {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  justify-content: flex-start;
}

.attributes-grid {
  display: grid;
  gap: 4px;
}

.attribute-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0;
}

.attr-label {
  color: #7f8c8d;
  font-size: 12px;
  font-weight: 500;
}

.attr-value {
  font-size: 12px;
  font-weight: 600;
}

.attr-value.positive {
  color: #27ae60;
}

.attr-value.negative {
  color: #e74c3c;
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.skill-item {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
}

.talent-skill {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.later-skill {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
}

.detail-section {
  margin-bottom: 16px;
}

.detail-section h4 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 4px;
}

.detail-grid {
  display: grid;
  gap: 4px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0;
}

.label {
  color: #7f8c8d;
  font-size: 12px;
  font-weight: 500;
}

.value {
  color: #2c3e50;
  font-size: 12px;
  font-weight: 600;
}

.color-white { color: #bdc3c7; }
.color-green { color: #27ae60; }
.color-blue { color: #3498db; }
.color-purple { color: #9b59b6; }
.color-orange { color: #f39c12; }
.color-red { color: #e74c3c; }
.color-black { color: #2c3e50; }
.color-darkgold { color: #8b4513; }
.color-purgold { color: #6a1b9a; }
.color-yagold { color: #f1c40f; }

.attributes-grid {
  display: grid;
  gap: 4px;
}

.attribute-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0;
}

.attr-label {
  color: #7f8c8d;
  font-size: 12px;
  font-weight: 500;
}

.attr-value {
  font-size: 12px;
  font-weight: 600;
}

.attr-value.positive {
  color: #27ae60;
}

.attr-value.negative {
  color: #e74c3c;
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.skill-item {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
}

.talent-skill {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.later-skill {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
}

/* 两列属性布局 */
.attributes-grid-two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.attributes-grid-two-column .attribute-row {
  font-size: 11px;
}

.attributes-grid-two-column .attr-label {
  font-size: 11px;
}

.attributes-grid-two-column .attr-value {
  font-size: 11px;
}
</style>
