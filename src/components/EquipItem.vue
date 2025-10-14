<template>
  <div 
    :class="[
      'equip-item',
      { 'new-item': equip.newB, 'locked': equip.lockB }
    ]"
  >
    <!-- 装备图片和背景 -->
    <el-popover
      placement="bottom"
      :width="350"
      trigger="hover"
      :title="equip.cnName"
    >
      <template #reference>
        <div 
          class="item-image"
          :style="{ backgroundImage: `url(${getGridBackgroundImage(equip.color)})` }"
        >
          <!-- 装备图片 -->
          <img 
            :src="getEquipSvg(equip)" 
            class="equip-svg-image"
          />
          
          <!-- 装备等级显示 -->
          <div v-if="equip.itemsLevel > 1" class="item-level-top">
            Lv.{{ equip.itemsLevel }}
          </div>
          
          <!-- 新装备标识 -->
          <div v-if="equip.newB" class="new-badge">新</div>
          
          <!-- 锁定标识 -->
          <div v-if="equip.lockB" class="lock-badge">🔒</div>
        </div>
        
      </template>
    
      <!-- Popover内容 -->
      <div class="equip-details">
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-grid">
            <div class="detail-row">
              <span class="label">名称:</span>
              <span class="value">{{ equip.cnName }}</span>
            </div>
            <div class="detail-row">
              <div class="tag-row">
                <el-tag :type="getTypeTagType(equip.partType) as any" size="small">
                  {{ translateTypeName(equip.partType) }}
                </el-tag>
                <el-tag :type="getColorTagType(equip.color) as any" size="small">
                  {{ translateColorName(equip.color) }}
                </el-tag>
              </div>
            </div>
            <div class="detail-row" v-if="equip.itemsLevel > 1">
              <span class="label">等级:</span>
              <span class="value">Lv.{{ equip.itemsLevel }}</span>
            </div>
            <div class="detail-row" v-if="equip.strengthenLv > 0">
              <span class="label">强化等级:</span>
              <span class="value">+{{ equip.strengthenLv }}</span>
            </div>
            <div class="detail-row" v-if="equip.evoLv > 0">
              <span class="label">进化等级:</span>
              <span class="value">进化{{ equip.evoLv }}</span>
            </div>
            <div class="detail-row" v-if="equip.shopB">
              <span class="label">来源:</span>
              <span class="value shop-source">商店购买</span>
            </div>
          </div>
        </div>
        
        <div class="detail-section" v-if="getEquipBonus(equip).length > 0">
          <h4>属性加成</h4>
          <BonusList 
            :bonus-list="getEquipBonus(equip)"
            title=""
            :compact="true"
          />
        </div>
        
        <!-- 英雄技能加成 -->
        <div class="detail-section" v-if="getHeroSkillBonus(equip).length > 0">
          <h4>英雄技能加成</h4>
          <BonusList 
            :bonus-list="getHeroSkillBonus(equip)"
            title=""
            :compact="true"
          />
        </div>
        
        <div class="detail-section">
          <h4>时间信息</h4>
          <div class="detail-row">
            <span class="label">获取时间:</span>
            <span class="value">{{ equip.getTime }}</span>
          </div>
          <div class="detail-row">
            <span class="label">服务器时间:</span>
            <span class="value">{{ equip.severTime }}</span>
          </div>
        </div>
      </div>
    </el-popover>
    
    <!-- 装备信息 -->
    <div class="item-info">
      <div class="item-name" :title="equip.cnName">
        {{ equip.cnName }}
      </div>
      <div class="item-meta">
        <div class="tag-group">
          <el-tag 
            :type="getTypeTagType(equip.partType) as any" 
            size="small"
            class="item-type-tag"
          >
            {{ translateTypeName(equip.partType) }}
          </el-tag>
          <el-tag 
            :type="getColorTagType(equip.color) as any" 
            size="small"
            class="item-quality-tag"
          >
            {{ translateColorName(equip.color) }}
          </el-tag>
        </div>
        <!-- 列表视图额外信息 -->
        <div v-if="viewMode === 'list'" class="list-extra-info">
          <span v-if="equip.strengthenLv > 0" class="strengthen-info">+{{ equip.strengthenLv }}</span>
          <span v-if="equip.evoLv > 0" class="evo-info">进化{{ equip.evoLv }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getEquipSvg, getGridBackgroundImage } from '@/utils/backgroundImages'
import { getColorTagType, translateColorName } from '@/utils/colorUtils'
import { getTypeTagType, translateTypeName } from '@/utils/typeUtils'
import { getFormattedBonusList } from '@/utils/translate'
import { EquipItem } from '@/types/archive/module/equip'
import BonusList from '@/components/BonusList.vue'

// 定义props
interface Props {
  equip: EquipItem
  viewMode?: 'grid' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'grid'
})


/**
 * 获取装备属性加成
 */
function getEquipBonus(equip: EquipItem) {
  if (!equip) return []
  
  const bonus = equip.getRoleBonus()
  return getFormattedBonusList(bonus)
}

/**
 * 获取英雄技能加成
 */
function getHeroSkillBonus(equip: EquipItem) {
  if (!equip || !equip.heroSkillAddObj) return []
  
  // 将数值转换为百分比格式
  const formattedBonus: Record<string, string> = {}
  Object.entries(equip.heroSkillAddObj).forEach(([key, value]) => {
    if (value !== 0 && value !== null && value !== undefined) {
      // 将数值转换为百分比显示，保留全部小数
      const percentage = value * 100
      formattedBonus[key] = value > 0 ? `+${percentage}%` : `${percentage}%`
    }
  })
  
  return getFormattedBonusList(formattedBonus)
}


 
</script>

<style scoped>
.equip-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.equip-item:hover {
  border-color: #409eff;
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.2);
  transform: translateY(-2px);
}

.equip-item.new-item {
  border-color: #67c23a;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
}

.equip-item.locked {
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

.equip-svg-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  position: relative;
  z-index: 1;
  background: transparent;
  border: none;
  outline: none;
}

.equip-svg-image:not([src]),
.equip-svg-image[src=""],
.equip-svg-image[src*="undefined"],
.equip-svg-image[src*="null"] {
  opacity: 0;
  visibility: hidden;
}

/* 处理图片加载失败的情况 */
.equip-svg-image[src]:not([src=""]) {
  background: transparent;
}

.item-level {
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

.item-type-tag {
  font-size: 9px;
  height: 18px;
  line-height: 16px;
}

.item-quality-tag {
  font-size: 9px;
  height: 18px;
  line-height: 16px;
}

.list-extra-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.strengthen-info, .evo-info {
  font-size: 12px;
  color: #666;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
}

/* Popover内容样式 */
.equip-details {
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

.shop-source {
  color: #e6a23c;
  font-weight: 600;
}

/* 列表视图样式 */
.equip-item[data-view-mode="list"] {
  flex-direction: row;
  text-align: left;
  padding: 12px;
}

.equip-item[data-view-mode="list"] .item-image {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  margin-bottom: 0;
}

.equip-item[data-view-mode="list"] .item-info {
  flex: 1;
  text-align: left;
}

.equip-item[data-view-mode="list"] .item-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  max-width: none;
}

.equip-item[data-view-mode="list"] .item-meta {
  justify-content: flex-start;
  gap: 8px;
}
</style>
