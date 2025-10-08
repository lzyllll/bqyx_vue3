<template>
  <div class="equip-module">
      <el-card class="module-card">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><Tools /></el-icon>
            <div>
              <h2>装备模块</h2>
              <p class="module-desc">装备数据和装备信息</p>
            </div>
          </div>
        </template>
        
        <!-- 装备统计 -->
        <div class="equip-stats">
          <el-row :gutter="20">
            <el-col :span="6" v-for="stat in equipStats" :key="stat.key">
              <el-card class="stat-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon">
                    <el-icon :class="stat.iconClass">
                      <component :is="stat.icon" />
                    </el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-label">{{ stat.label }}</div>
                    <div class="stat-value" :class="stat.valueClass">
                      {{ stat.value }}
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        
        <!-- 装备总加成 -->
        <BonusDisplay 
          :bonus-list="getTotalEquipBonus()"
          :compact="false"
          title="装备总加成"
          subtitle="装备属性总加成"
          empty-text="暂无装备加成"
        />
        
        <!-- 装备展示 -->
        <div class="equip-display-section">
          <el-divider content-position="left">
            <el-icon><List /></el-icon>
            <span>装备展示</span>
          </el-divider>
          
          <!-- 主要装备区域 (head, coat, pants) -->
          <div class="main-equip-area">
            <el-row :gutter="20">
              <el-col :span="12" v-for="equipType in ['head', 'coat', 'pants','belt']" :key="equipType">
                <el-popover 
                  placement="top"
                  :disabled="!equipItems[equipType]"
                  trigger="hover"
                  width="300"
                >
                  <template #reference>
                    <div class="equip-slot" :class="{ 'empty': !equipItems[equipType] }">
                      <div v-if="equipItems[equipType]" class="equip-item">
                        <div class="equip-image" :style="getEquipImageStyle(equipItems[equipType])">
                          <div class="equip-level">{{ equipItems[equipType].itemsLevel }}</div>
                        </div>
                        <div class="equip-info">
                          <div class="equip-name">{{ equipItems[equipType].cnName }}</div>
                          <div class="equip-quality">
                            <el-tag :type="getColorType(equipItems[equipType].color)" size="small">
                              {{ equipItems[equipType].color }}
                            </el-tag>
                          </div>
                        </div>
                      </div>
                      <div v-else class="empty-slot">
                        <el-icon><Plus /></el-icon>
                        <span>{{ getEquipTypeName(equipType) }}</span>
                      </div>
                    </div>
                  </template>
                  
                  <!-- 悬浮卡片内容 -->
                  <div v-if="equipItems[equipType]" class="equip-popover-content">
                    <div class="popover-header">
                      <h4 class="popover-title">{{ equipItems[equipType].cnName }}</h4>
                      <div class="popover-category">
                        <el-tag size="small" type="primary">{{ getEquipTypeName(equipType) }}</el-tag>
                        <el-tag size="small" :type="getColorType(equipItems[equipType].color)">{{ equipItems[equipType].color }}</el-tag>
                      </div>
                    </div>
                    
                    <div class="popover-description">
                      <div class="description-row">
                        <span class="desc-label">等级:</span>
                        <span class="desc-value">{{ equipItems[equipType].itemsLevel }}</span>
                      </div>
                      <div class="description-row">
                        <span class="desc-label">强化等级:</span>
                        <span class="desc-value">{{ equipItems[equipType].strengthenLv || 0 }}</span>
                      </div>
                      <div class="description-row">
                        <span class="desc-label">进化等级:</span>
                        <span class="desc-value">{{ equipItems[equipType].evoLv || 0 }}</span>
                      </div>
                      <div v-if="equipItems[equipType].shopB" class="description-row">
                        <span class="desc-label">来源:</span>
                        <span class="desc-value shop-source">商店购买</span>
                      </div>
                    </div>
                    
                    <div class="popover-time">
                      <div class="time-row">
                        <span class="time-label">获取时间:</span>
                        <span class="time-value">{{ equipItems[equipType].getTime }}</span>
                      </div>
                      <div class="time-row">
                        <span class="time-label">服务器时间:</span>
                        <span class="time-value">{{ equipItems[equipType].severTime }}</span>
                      </div>
                    </div>
                    
                    <div v-if="getEquipBonus(equipItems[equipType]).length > 0" class="popover-bonus">
                      <BonusList 
                        :bonus-list="getEquipBonus(equipItems[equipType])"
                        title="属性加成"
                        :compact="false"
                      />
                    </div>
                  </div>
                </el-popover>
              </el-col>
            </el-row>
          </div>
          
          <!-- 其他装备区域 (fashion, vehicle, weapon, device) -->
          <div class="other-equip-area">
            <el-row :gutter="20">
              <el-col :span="6" v-for="equipType in ['fashion', 'vehicle', 'weapon', 'device']" :key="equipType">
                <el-popover 
                  placement="top"
                  :disabled="!equipItems[equipType]"
                  trigger="hover"
                  width="300"
                >
                  <template #reference>
                    <div class="equip-slot" :class="{ 'empty': !equipItems[equipType] }">
                      <div v-if="equipItems[equipType]" class="equip-item">
                        <div class="equip-image" :style="getEquipImageStyle(equipItems[equipType])">
                          <div class="equip-level">{{ equipItems[equipType].itemsLevel }}</div>
                        </div>
                        <div class="equip-info">
                          <div class="equip-name">{{ equipItems[equipType].cnName }}</div>
                          <div class="equip-quality">
                            <el-tag :type="getColorType(equipItems[equipType].color)" size="small">
                              {{ equipItems[equipType].color }}
                            </el-tag>
                          </div>
                        </div>
                      </div>
                      <div v-else class="empty-slot">
                        <el-icon><Plus /></el-icon>
                        <span>{{ getEquipTypeName(equipType) }}</span>
                      </div>
                    </div>
                  </template>
                  
                  <!-- 悬浮卡片内容 -->
                  <div v-if="equipItems[equipType]" class="equip-popover-content">
                    <div class="popover-header">
                      <h4 class="popover-title">{{ equipItems[equipType].cnName }}</h4>
                      <div class="popover-category">
                        <el-tag size="small" type="primary">{{ getEquipTypeName(equipType) }}</el-tag>
                        <el-tag size="small" :type="getColorType(equipItems[equipType].color)">{{ equipItems[equipType].color }}</el-tag>
                      </div>
                    </div>
                    
                    <div class="popover-description">
                      <div class="description-row">
                        <span class="desc-label">等级:</span>
                        <span class="desc-value">{{ equipItems[equipType].itemsLevel }}</span>
                      </div>
                      <div class="description-row">
                        <span class="desc-label">强化等级:</span>
                        <span class="desc-value">{{ equipItems[equipType].strengthenLv || 0 }}</span>
                      </div>
                      <div class="description-row">
                        <span class="desc-label">进化等级:</span>
                        <span class="desc-value">{{ equipItems[equipType].evoLv || 0 }}</span>
                      </div>
                      <div v-if="equipItems[equipType].shopB" class="description-row">
                        <span class="desc-label">来源:</span>
                        <span class="desc-value shop-source">商店购买</span>
                      </div>
                    </div>
                    
                    <div class="popover-time">
                      <div class="time-row">
                        <span class="time-label">获取时间:</span>
                        <span class="time-value">{{ equipItems[equipType].getTime }}</span>
                      </div>
                      <div class="time-row">
                        <span class="time-label">服务器时间:</span>
                        <span class="time-value">{{ equipItems[equipType].severTime }}</span>
                      </div>
                    </div>
                    
                    <div v-if="getEquipBonus(equipItems[equipType]).length > 0" class="popover-bonus">
                      <BonusList 
                        :bonus-list="getEquipBonus(equipItems[equipType])"
                        title="属性加成"
                        :compact="true"
                      />
                    </div>
                  </div>
                </el-popover>
              </el-col>
            </el-row>
          </div>
          
          <!-- 护盾和饰品区域 (shield, jewelry) -->
          <div class="shield-jewelry-area">
            <el-row :gutter="20">
              <el-col :span="12" v-for="equipType in ['shield', 'jewelry']" :key="equipType">
                <el-popover 
                  placement="top"
                  :disabled="!equipItems[equipType]"
                  trigger="hover"
                  width="300"
                >
                  <template #reference>
                    <div class="equip-slot" :class="{ 'empty': !equipItems[equipType] }">
                      <div v-if="equipItems[equipType]" class="equip-item">
                        <div class="equip-image" :style="getEquipImageStyle(equipItems[equipType])">
                          <div class="equip-level">{{ equipItems[equipType].itemsLevel }}</div>
                        </div>
                        <div class="equip-info">
                          <div class="equip-name">{{ equipItems[equipType].cnName }}</div>
                          <div class="equip-quality">
                            <el-tag :type="getColorType(equipItems[equipType].color)" size="small">
                              {{ equipItems[equipType].color }}
                            </el-tag>
                          </div>
                        </div>
                      </div>
                      <div v-else class="empty-slot">
                        <el-icon><Plus /></el-icon>
                        <span>{{ getEquipTypeName(equipType) }}</span>
                      </div>
                    </div>
                  </template>
                  
                  <!-- 悬浮卡片内容 -->
                  <div v-if="equipItems[equipType]" class="equip-popover-content">
                    <div class="popover-header">
                      <h4 class="popover-title">{{ equipItems[equipType].cnName }}</h4>
                      <div class="popover-category">
                        <el-tag size="small" type="primary">{{ getEquipTypeName(equipType) }}</el-tag>
                        <el-tag size="small" :type="getColorType(equipItems[equipType].color)">{{ equipItems[equipType].color }}</el-tag>
                      </div>
                    </div>
                    
                    <div class="popover-description">
                      <div class="description-row">
                        <span class="desc-label">等级:</span>
                        <span class="desc-value">{{ equipItems[equipType].itemsLevel }}</span>
                      </div>
                      <div class="description-row">
                        <span class="desc-label">强化等级:</span>
                        <span class="desc-value">{{ equipItems[equipType].strengthenLv || 0 }}</span>
                      </div>
                      <div class="description-row">
                        <span class="desc-label">进化等级:</span>
                        <span class="desc-value">{{ equipItems[equipType].evoLv || 0 }}</span>
                      </div>
                      <div v-if="equipItems[equipType].shopB" class="description-row">
                        <span class="desc-label">来源:</span>
                        <span class="desc-value shop-source">商店购买</span>
                      </div>
                    </div>
                    
                    <div class="popover-time">
                      <div class="time-row">
                        <span class="time-label">获取时间:</span>
                        <span class="time-value">{{ equipItems[equipType].getTime }}</span>
                      </div>
                      <div class="time-row">
                        <span class="time-label">服务器时间:</span>
                        <span class="time-value">{{ equipItems[equipType].severTime }}</span>
                      </div>
                    </div>
                    
                    <div v-if="getEquipBonus(equipItems[equipType]).length > 0" class="popover-bonus">
                      <BonusList 
                        :bonus-list="getEquipBonus(equipItems[equipType])"
                        title="属性加成"
                        :compact="true"
                      />
                    </div>
                  </div>
                </el-popover>
              </el-col>
            </el-row>
          </div>
        </div>
        
        <!-- 详细数据 -->
        <JsonViewer 
          :json-data="jsonData"
          title="详细数据"
          collapse-title="查看完整JSON数据"
          :rows="10"
        />
      </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useArchiveStore } from '@/stores/archive'

import { Tools, List, Trophy, Star, Setting, Box, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { Equip, EquipItem, EquipItems } from '@/types/archive/module/equip'
import { getEquipBackgroundStyle } from '@/utils/backgroundImages'
import { getFormattedBonusList } from '@/utils/translate'
import { BonusMerge } from '@/utils/bonusAdd'
import BonusDisplay from '@/components/BonusDisplay.vue'
import BonusList from '@/components/BonusList.vue'
import JsonViewer from '@/components/JsonViewer.vue'

const archiveStore = useArchiveStore()

// 获取装备模块数据
const data = computed((): Equip | null => {
  return archiveStore.getModuleData('equip') as Equip | null
})

// 装备列表
const equipItems = computed((): EquipItems => {
  return data.value?.items
})

// 装备统计
const equipStats = computed(() => [
  {
    key: 'maxCapacity',
    label: '最大容量',
    value: data.value?.gripMaxNum || 0,
    icon: Box,
    iconClass: 'text-info',
    valueClass: 'text-info'
  },

  {
    key: 'lastId',
    label: '最后ID',
    value: data.value?.lastId || 0,
    icon: Star,
    iconClass: 'text-warning',
    valueClass: 'text-warning'
  }
])

// 获取颜色类型
const getColorType = (color: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const colorMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    'white': 'info',
    'green': 'success',
    'blue': 'primary',
    'purple': 'warning',
    'orange': 'danger',
    'red': 'danger'
  }
  return colorMap[color.toLowerCase()] || 'info'
}

// 获取装备图像样式
const getEquipImageStyle = (equip: EquipItem) => {
  return getEquipBackgroundStyle(equip, equip.color)
}

// 获取装备类型名称
const getEquipTypeName = (type: string): string => {
  const typeMap: Record<string, string> = {
    'head': '头盔',
    'coat': '衣服',
    'pants': '裤子',
    'belt': '腰带',
    'fashion': '时装',
    'vehicle': '载具',
    'weapon': '武器',
    'device': '设备',
    'jewelry':"饰品",
    'shield':"护盾"
  }
  return typeMap[type] || type
}

// 获取装备属性加成
const getEquipBonus = (equip: EquipItem | undefined) => {
  if (!equip) return []
  
  const bonus = equip.getRoleBonus()
  return getFormattedBonusList(bonus)
}

// 获取装备总属性加成
const getTotalEquipBonus = () => {
  if (!data.value?.items) return []
  
  let totalBonus = {}
  
  // 遍历所有装备，合并属性加成
  Object.values(data.value.items).forEach(equip => {
    if (equip) {
      totalBonus = BonusMerge(totalBonus, equip.getRoleBonus())
    }
  })
  
  return getFormattedBonusList(totalBonus)
}

// 查看装备详情
const viewEquipDetail = (equip: EquipItem) => {
  ElMessage.info(`查看装备详情: ${equip.name}`)
  // 这里可以打开详情弹窗或跳转到详情页面
}

// JSON数据
const jsonData = computed(() => {
  return JSON.stringify(data.value, null, 2)
})
</script>

<style scoped>
.equip-module {
  padding: 20px;
  overflow-y: auto;
}

.module-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 24px;
  color: #409eff;
}

.card-header h2 {
  margin: 0;
  color: #303133;
  font-size: 20px;
}

.module-desc {
  margin: 4px 0 0 0;
  color: #909399;
  font-size: 14px;
}

.equip-stats {
  margin-bottom: 24px;
}

.stat-card {
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f5f7fa;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.text-primary {
  color: #409eff !important;
}

.text-success {
  color: #67c23a !important;
}

.text-warning {
  color: #e6a23c !important;
}

.text-danger {
  color: #f56c6c !important;
}

.text-info {
  color: #909399 !important;
}

.equip-display-section {
  margin-top: 24px;
}

.main-equip-area {
  margin-bottom: 24px;
}

.other-equip-area {
  margin-bottom: 24px;
}

.shield-jewelry-area {
  margin-bottom: 24px;
}

.equip-slot {
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s ease;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.equip-slot:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.equip-slot.empty {
  background-color: #fafafa;
}

.equip-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.equip-image {
  width: 56px;
  height: 56px;
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.equip-level {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #409eff;
  color: white;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 8px;
  font-weight: bold;
  min-width: 16px;
  text-align: center;
}

.equip-info {
  text-align: center;
}

.equip-name {
  font-size: 12px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
  word-break: break-all;
}

.equip-quality {
  display: flex;
  justify-content: center;
}

.empty-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #909399;
  font-size: 12px;
}

.empty-slot .el-icon {
  font-size: 24px;
}

/* 悬浮卡片样式 */
.equip-popover-content {
  padding: 0;
}

.popover-header {
  margin-bottom: 12px;
}

.popover-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.popover-category {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.popover-description {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
  line-height: 1.4;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.description-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.desc-label {
  color: #909399;
  font-weight: 500;
}

.desc-value {
  color: #303133;
  font-weight: 600;
}

.shop-source {
  color: #e6a23c;
  font-weight: 600;
}

.popover-time {
  border-top: 1px solid #ebeef5;
  padding-top: 12px;
  margin-top: 12px;
}

.time-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  margin-bottom: 4px;
}

.time-label {
  color: #909399;
  font-weight: 500;
}

.time-value {
  color: #606266;
  font-weight: 500;
}

.popover-bonus {
  border-top: 1px solid #ebeef5;
  padding-top: 12px;
}

.bonus-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}


@media (max-width: 768px) {
  .equip-module {
    padding: 16px;
  }
  
  .stat-content {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 24px;
  }
  
  .stat-value {
    font-size: 16px;
  }
}
</style>