<template>
  <div class="arms-display">
    <div class="arms-image-container">
      <el-popover
        placement="top"
        :width="300"
        trigger="click"
        title="武器原生属性(无任何加成)"
      >
        <template #reference>
          <div 
            class="arms-image clickable"
            :style="getArmsImageStyle(armsItem)"
        
          >
            <!-- 锁定标识 -->
            <div v-if="armsItem.lockB" class="lock-badge">
              <el-icon><Lock /></el-icon>
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
          
          <!-- 分隔线 -->
          <div v-if="weaponDamage > 0" class="stat-divider"></div>
          
          <div v-if="weaponDamage > 0" class="stat-item damage-item">
            <span class="stat-label">测试中,伤害(含加成):</span>
            <span class="stat-value damage-value">{{ formatDamage(weaponDamage) }}</span>
          </div>
        </div>
      </el-popover>
    </div>
    
    <!-- 武器信息 -->
    <div class="arms-info">
      <!-- 品质标签 -->
      <el-tag 
        :type="getColorTagType(armsItem.color) as any" 
        size="small"
        class="quality-tag"
      >
        {{ translateColorName(armsItem.color) }}
      </el-tag>
      
      <!-- 武器名称 -->
      <el-tag 
        type="info" 
        size="small"
        class="name-tag"
      >
        {{ armsItem.cnName }}
      </el-tag>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Lock } from '@element-plus/icons-vue'
import { ArmsItem } from '@/types/archive/module/arms'
import type { RoleBonus } from '@/types/archive/Bonus'
import { getArmsBackgroundStyle } from '@/utils/backgroundImages'
import { getColorTagType, translateColorName } from '@/utils/colorUtils'

interface Props {
  armsItem: ArmsItem
  roleBonus?: RoleBonus
}

const props = defineProps<Props>()

// 获取武器图片样式
//刷新，址更新
//有标记，如果刷新后，就不会重新调用了
const getArmsImageStyle = (item: ArmsItem) => {
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
  font-weight: 500;
  color: #606266;
  font-size: 13px;
}

.stat-value {
  font-weight: 600;
  color: #303133;
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
  padding: 8px;
  margin-top: 4px;
}

.damage-value {
  color: #f56c6c !important;
  font-weight: 700;
}
</style>
