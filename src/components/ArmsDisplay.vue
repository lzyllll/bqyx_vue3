<template>
  <div class="arms-display">
    <div class="arms-image-container">
      <el-popover placement="bottom" :width="600" trigger="click" title="武器属性对比">
        <template #reference>
          <div class="arms-image clickable" :style="getArmsImageStyle(armsItem)">
            <!-- 锁定标识 -->
            <div v-if="armsItem.lockB" class="lock-badge">
              <el-icon>
                <Lock />
              </el-icon>
            </div>

            <!-- 等级显示 -->
            <div v-if="armsItem.itemsLevel > 1" class="level-badge">
              Lv.{{ armsItem.itemsLevel }}
            </div>

            <!-- 新武器标识 -->
            <div v-if="armsItem.newB" class="new-badge">新</div>
          </div>
        </template>

        <!-- 武器属性详情 -->
        <div class="arms-stats">
          
          <div class="stats-layout">
            <!-- 左侧属性区域 -->
            <div class="stats-left">
              <!-- 基础属性 -->
              <div class="stats-section">
                <div class="section-title">基础属性</div>
                <div class="stat-item">
                  <span class="stat-label">射速:</span>
                  <span class="stat-value">{{ formatNumber(attackSpeed) }} 发/秒</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">弹容:</span>
                  <span class="stat-value">{{ armsItem.capacity }} 发</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">装弹速度:</span>
                  <span class="stat-value">{{ formatNumber(armsItem.reloadGap) }} 秒</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">精准度:</span>
                  <span class="stat-value">{{ formatNumber(uiPrecision * 100) }}%</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">射程:</span>
                  <span class="stat-value">{{ formatNumber(uiShootRange) }} 米</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">AI射程:</span>
                  <span class="stat-value">{{ formatNumber(aiShootRange) }} 米</span>
                </div>
                <div v-if="armsItem.ele && armsItem.eleLv > 0" class="stat-item">
                  <span class="stat-label">元素伤害:</span>
                  <el-tag type="warning" size="small">
                    {{ getElementTypeName(armsItem.ele) }} Lv.{{ armsItem.eleLv }} (+{{ formatNumber(armsItem.getElementHurtMul() * 100) }}%)
                  </el-tag>
                </div>
              </div>

              <!-- 加成后属性 -->
              <div class="stats-section">
                <div class="section-title">加成后属性</div>
                
                <div v-if="weaponDamage > 0" class="stat-item damage-item">
                  <span class="stat-label">测试中,伤害:</span>
                  <span class="stat-value damage-value">{{ formatDamage(weaponDamage) }}</span>
                </div>

                <div v-if="enhancedPrecision > 0" class="stat-item enhanced-item">
                  <span class="stat-label">最终精准度:</span>
                  <span class="stat-value precision-value">{{ formatNumber(enhancedPrecision * 100) }}%</span>
                </div>

                <div v-if="finalCapacityUi > 0" class="stat-item enhanced-item">
                  <span class="stat-label">最终弹容:</span>
                  <span class="stat-value capacity-value">{{ finalCapacityUi }} 发</span>
                </div>

                <div v-if="finalAttackSpeed > 0" class="stat-item enhanced-item">
                  <span class="stat-label">最终射速:</span>
                  <span class="stat-value attack-gap-value">{{ finalAttackSpeed }} 发/秒</span>
                </div>

                <div v-if="finalReloadGap > 0" class="stat-item enhanced-item">
                  <span class="stat-label">最终装弹速:</span>
                  <span class="stat-value reload-gap-value">{{ formatNumber(finalReloadGap) }} 秒</span>
                </div>

                <div v-if="finalShootRange > 0" class="stat-item enhanced-item">
                  <span class="stat-label">最终射程:</span>
                  <span class="stat-value shoot-range-value">{{ formatNumber(finalShootRange) }} 米</span>
                </div>
              </div>
            </div>

            <!-- 右侧零件区域 -->
            <div class="parts-right">
              <!-- 稀有零件 -->
              <div class="parts-section">
                <div class="section-title">稀零信息</div>
                <div v-if="rarePartsInfo.length > 0" class="parts-grid">
                  <div v-for="part in rarePartsInfo" :key="part.name" class="part-item">
                    <div class="part-name">{{ part.cnName }}</div>
                    <div class="part-level">Lv.{{ part.itemsLevel }}</div>
                    <div v-if="part.armBonus" class="part-bonus">
                      <div v-for="(value, key) in part.armBonus" :key="String(key)" class="bonus-item">
                        <span class="bonus-key">{{ getBonusKeyName(String(key)) }}:</span>
                        <span class="bonus-value">{{ formatBonusValue(value) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="no-parts">
                  无
                </div>
              </div>

              <!-- 属性零件 -->
              <div class="parts-section">
                <div class="section-title">属性零件</div>
                <div v-if="attributePartsInfo.length > 0" class="parts-grid">
                  <div v-for="part in attributePartsInfo" :key="part.name" class="part-item">
                    <div class="part-name">{{ part.cnName }}</div>
                    <div class="part-level">Lv.{{ part.itemsLevel }}</div>
                    <div v-if="part.bonus" class="part-bonus">
                      <div v-if="part.bonus.mul > 0" class="bonus-item">
                        <span class="bonus-key">倍率:</span>
                        <span class="bonus-value">+{{ formatBonusValue(part.bonus.mul) }}</span>
                      </div>
                      <div v-if="part.bonus.add > 0" class="bonus-item">
                        <span class="bonus-key">加成:</span>
                        <span class="bonus-value">+{{ formatBonusValue(part.bonus.add) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="no-parts">
                  无
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-popover>
    </div>


    <!-- 武器信息 -->
    <div class="arms-info">
      <!-- 品质标签 -->
      <el-tag :type="getColorTagType(armsItem.color) as any" size="small" class="quality-tag">
        {{ translateColorName(armsItem.color) }}
      </el-tag>

      <!-- 武器名称 -->
      <el-tag type="info" size="small" class="name-tag">
        {{ armsItem.cnName }}
      </el-tag>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Lock } from '@element-plus/icons-vue'
import { ArmSaveItem } from '@/types/archive/module/arms'
import type { RoleBonus } from '@/types/archive/Bonus'
import { getArmsBackgroundStyle } from '@/utils/backgroundImages'
import { getColorTagType, translateColorName } from '@/utils/colorUtils'
import { getRarePartInfo } from '@/utils/rareParts'

interface Props {
  armsItem: ArmSaveItem
  roleBonus?: RoleBonus
}

const props = defineProps<Props>()


const getArmsImageStyle = (item: ArmSaveItem) => {
  return getArmsBackgroundStyle(
    {
      name: item.name,
      imgName: item.name
    },
    item.color
  )
}

// 格式化数字，保留最多7位小数，去除末尾的0
const formatNumber = (num: number) => {
  return parseFloat(num.toFixed(7))
}

// 格式化伤害数字，添加万单位
const formatDamage = (num: number) => {
  if (num >= 10000) {
    const wan = Math.floor(num / 10000)
    const remainder = num % 10000
    if (remainder === 0) {
      return `${wan}万`
    } else {
      const remainderStr = remainder.toString().padStart(4, '0')
      return `${wan}.${remainderStr.slice(0, 2)}万`
    }
  }
  return num.toString()
}


// 使用computed计算武器属性
const attackSpeed = computed(() => props.armsItem.getAttackSpeed())
const uiPrecision = computed(() => props.armsItem.getUIPrecision())
const uiShootRange = computed(() => props.armsItem.getUIShootRange())
const aiShootRange = computed(() => props.armsItem.getAIShootRange())

// 计算武器伤害
const weaponDamage = computed(() => {
  if (props.roleBonus) {
    return props.armsItem.getHurt(props.roleBonus)
  }
  return 0
})

// 计算最终容量（含加成）
const finalCapacity = computed(() => {
  if (props.roleBonus) {
    return props.armsItem.getFinalCapacity(props.roleBonus)
  }
  return 0
})

const finalCapacityUi = computed(() => {
  return Math.ceil(finalCapacity.value)
})

const finalAttackSpeed = computed(() => {
  if (props.roleBonus) {
    return 1 / finalAttackGap.value
  }
  return 0
})

const finalAttackGap = computed(() => {
  if (props.roleBonus) {
    return props.armsItem.getFinalAttackGap(props.roleBonus)
  }
  return 0
})

const finalReloadGap = computed(() => {
  if (props.roleBonus) {
    return props.armsItem.getFinalReloadGap(props.roleBonus,finalAttackGap.value)
  }
  return 0
})

// 计算最终射程（含加成）
const finalShootRange = computed(() => {
  if (props.roleBonus) {
    return props.armsItem.getFinalShootRnage(props.armsItem.getShootRange())
  }
  return 0
})

// 计算加成后的精准度
const enhancedPrecision = computed(() => {
  return props.armsItem.getEnhancedPrecision()
})



// 获取稀有零件信息
const rarePartsInfo = computed(() => {
  const partsItems = props.armsItem.partsSave?.partsItems
  if (!partsItems) return []
  const parts = []
  // 稀有零件
  if (partsItems.rareParts && partsItems.rareParts.length > 0) {
    partsItems.rareParts.forEach(rarePart => {
      const partInfo = getRarePartInfo(`${rarePart.name}_${rarePart.itemsLevel}`)
      partInfo.itemsLevel = partInfo.itemsLevel ?? rarePart.itemsLevel
      if (partInfo) parts.push(partInfo)
    })
  }
  
  return parts
})

// 获取属性零件信息
const attributePartsInfo = computed(() => {
  const partsItems = props.armsItem.partsSave?.partsItems
  if (!partsItems) return []
  const parts = []
  
  // 检查各种属性零件
  if (partsItems.dpsPart) {
    parts.push({
      name: partsItems.dpsPart.name,
      cnName: '伤害零件',
      itemsLevel: partsItems.dpsPart.itemsLevel,

    })
  }
  
  if (partsItems.capacityPart) {
    parts.push({
      name: partsItems.capacityPart.name,
      cnName: '弹容零件',
      itemsLevel: partsItems.capacityPart.itemsLevel,
    })
  }
  
  if (partsItems.attackGapPart) {
    parts.push({
      name: partsItems.attackGapPart.name,
      cnName: '攻速零件',
      itemsLevel: partsItems.attackGapPart.itemsLevel,

    })
  }
  
  if (partsItems.reloadPart) {
    parts.push({
      name: partsItems.reloadPart.name,
      cnName: '装弹零件',
      itemsLevel: partsItems.reloadPart.itemsLevel,

    })
  }
  
  if (partsItems.precisionPart) {
    parts.push({
      name: partsItems.precisionPart.name,
      cnName: '精准零件',
      itemsLevel: partsItems.precisionPart.itemsLevel,

    })
  }
  
  if (partsItems.shootRangePart) {
    parts.push({
      name: partsItems.shootRangePart.name,
      cnName: '射程零件',
      itemsLevel: partsItems.shootRangePart.itemsLevel,
    })
  }
  
  if (partsItems.acidicPart) {
    parts.push({
      name: partsItems.acidicPart.name,
      cnName: '腐蚀芯片',
      itemsLevel: partsItems.acidicPart.itemsLevel,

    })
  }
  
  if (partsItems.huntPart) {
    parts.push({
      name: partsItems.huntPart.name,
      cnName: '猎人技能器',
      itemsLevel: partsItems.huntPart.itemsLevel,
    })
  }
  
  return parts
})

// 获取元素类型名称
const getElementTypeName = (elementType: string): string => {
  const elementMap: Record<string, string> = {
    'fire': '火焰',
    'frozen': '冰冻',
    'lightning': '闪电',
    'poison': '毒素',
    'acid': '腐蚀',
    'explosive': '爆炸',
    'incendiary': '燃烧',
    'freeze': '冰冻',
    'shock': '电击',
    'toxic': '毒性',
    'corrosive': '腐蚀'
  }
  return elementMap[elementType] || elementType
}

// 获取加成键名
const getBonusKeyName = (key: string): string => {
  const keyMap: Record<string, string> = {
    'bulletWidth': '子弹宽度',
    'bulletLife': '子弹生命',
    'bulletSpeed': '子弹速度',
    'twoShootPro': '连发概率',
    'eleHurtMul': '元素伤害',
    'penetrationNum': '穿透数量',
    'redHurtMul': '红武伤害',
    'uidpsMul': 'UI伤害',
    'rareHurtMul': '稀有伤害',
    'penetrationGap': '穿透间隔',
    'aiShootRange': 'AI射程',
    'electricEleB': '电磁元素',
    'fireEleB': '火焰元素',
    'frozenEleB': '冷冻元素',
    'poisonEleB': '生化元素',
    'shootAngleCtrlB': '散射角控制',
    'noMagneticB': '消磁',
    'gravity': '重力'
  }
  return keyMap[key] || key
}

// 格式化加成值
const formatBonusValue = (value: any): string => {
  if (typeof value === 'boolean') {
    return value ? '是' : '否'
  }
  if (typeof value === 'number') {
    if (value > 0 && value < 1) {
      return `+${(value * 100).toFixed(1)}%`
    } else if (value > 0) {
      return `+${value}`
    } else {
      return value.toString()
    }
  }
  return value.toString()
}


</script>

<style scoped>
.arms-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.arms-image-container {
  position: relative;
  width: 200px;
  height: 80px;
}

.arms-image {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  position: relative;
  border: 2px solid #e0e0e0;
}

.arms-image.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.arms-image.clickable:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}


.lock-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 10px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.level-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #409eff;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
}

.new-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: #f56c6c;
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
}

.arms-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.quality-tag {
  font-size: 10px;
  height: 18px;
  line-height: 16px;
}

.name-tag {
  font-size: 10px;
  height: 18px;
  line-height: 16px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .arms-image-container {
    width: 160px;
    height: 64px;
  }

  .lock-badge,
  .level-badge,
  .new-badge {
    font-size: 9px;
    padding: 1px 3px;
  }

  .quality-tag,
  .name-tag {
    font-size: 9px;
    height: 16px;
    line-height: 14px;
  }
}

/* 武器属性弹窗样式 */
.arms-stats {
  padding: 8px 0;
}


.stats-layout {
  display: flex;
  gap: 20px;
}

.stats-left {
  flex: 1;
  min-width: 0;
}

.stats-section {
  margin-bottom: 16px;
}

.stats-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.stats-column:first-child .section-title {
  background: linear-gradient(135deg, #409eff, #67c23a);
}

.stats-column:last-child .section-title {
  background: linear-gradient(135deg, #e6a23c, #f56c6c);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-weight: 600;
  color: #ff6b35;
  font-size: 13px;
}

.stat-value {
  font-weight: 700;
  color: #2c3e50;
  font-size: 13px;
}

/* 分隔线样式 */
.stat-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 8px 0;
}

/* 伤害项样式 */
.damage-item {
  background: #f8f9fa;
  border-radius: 4px;
  padding: 4px 8px;
  margin: 2px 0;
}

.damage-value {
  color: #f56c6c !important;
  font-weight: 700;
}

/* 增强项样式 */
.enhanced-item {
  background: #f8f9fa;
  border-radius: 4px;
  padding: 4px 8px;
  margin: 2px 0;
}

.capacity-value {
  color: #409eff !important;
  font-weight: 700;
}

.attack-gap-value {
  color: #67c23a !important;
  font-weight: 700;
}

.reload-gap-value {
  color: #e6a23c !important;
  font-weight: 700;
}

.shoot-range-value {
  color: #9c27b0 !important;
  font-weight: 700;
}

.precision-value {
  color: #ff9800 !important;
  font-weight: 700;
}

/* 零件展示样式 */
.parts-right {
  flex: 0 0 300px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.parts-section {
  flex: 1;
}

.parts-section .section-title {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  font-size: 12px;
  margin-bottom: 8px;
  padding: 6px 10px;
  box-shadow: 0 2px 6px rgba(255, 107, 107, 0.3);
}

.parts-section:nth-child(2) .section-title {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  box-shadow: 0 2px 6px rgba(78, 205, 196, 0.3);
}

.parts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.part-item {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 6px;
  font-size: 11px;
}

.part-name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 1px;
  font-size: 11px;
  line-height: 1.2;
}

.part-level {
  color: #409eff;
  font-size: 9px;
  margin-bottom: 3px;
}

.part-bonus {
  margin-top: 3px;
}

.bonus-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1px;
  font-size: 10px;
}

.bonus-key {
  color: #606266;
  font-weight: 500;
}

.bonus-value {
  color: #67c23a;
  font-weight: 600;
}

.no-parts {
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 20px;
  font-style: italic;
}

</style>
