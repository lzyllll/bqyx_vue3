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
        <StatsCards :stats="equipStats" />
        
        <!-- 装备总加成 -->
        <BonusDisplay 
          :bonus-list="getTotalEquipBonus()"
          :compact="false"
          title="装备总加成"
          subtitle="装备属性总加成"
          empty-text="暂无装备加成"
        />
                <!-- 装备套装总加成 -->
        <BonusDisplay 
          :bonus-list="getSuitProBonus()"
          :compact="false"
          title="装备套装加成"
          :subtitle="suitSubtitle"
          empty-text="暂无任何套装，现在只支持狂人和战神"
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
                <div class="equip-slot" :class="{ 'empty': !equipItems[equipType] }">
                  <EquipItem 
                    v-if="equipItems[equipType]" 
                    :equip="equipItems[equipType]"
                    view-mode="grid"
                    class="equip-item-component"
                  />
                  <div v-else class="empty-slot">
                    <el-icon><Plus /></el-icon>
                    <span>{{ getEquipTypeName(equipType) }}</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          
          <!-- 其他装备区域 (fashion, vehicle, weapon, device) -->
          <div class="other-equip-area">
            <el-row :gutter="20">
              <el-col :span="6" v-for="equipType in ['fashion', 'vehicle', 'weapon', 'device']" :key="equipType">
                <div class="equip-slot" :class="{ 'empty': !equipItems[equipType] }">
                  <EquipItem 
                    v-if="equipItems[equipType]" 
                    :equip="equipItems[equipType]"
                    view-mode="grid"
                    class="equip-item-component"
                  />
                  <div v-else class="empty-slot">
                    <el-icon><Plus /></el-icon>
                    <span>{{ getEquipTypeName(equipType) }}</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          
          <!-- 护盾和饰品区域 (shield, jewelry) -->
          <div class="shield-jewelry-area">
            <el-row :gutter="20">
              <el-col :span="12" v-for="equipType in ['shield', 'jewelry']" :key="equipType">
                <div class="equip-slot" :class="{ 'empty': !equipItems[equipType] }">
                  <EquipItem 
                    v-if="equipItems[equipType]" 
                    :equip="equipItems[equipType]"
                    view-mode="grid"
                    class="equip-item-component"
                  />
                  <div v-else class="empty-slot">
                    <el-icon><Plus /></el-icon>
                    <span>{{ getEquipTypeName(equipType) }}</span>
                  </div>
                </div>
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
import  { Equip, EquipItems } from '@/types/archive/module/equip'
import { getFormattedBonusList } from '@/utils/translate'
import { BonusMerge } from '@/utils/bonusAdd'
import BonusDisplay from '@/components/BonusDisplay.vue'
import JsonViewer from '@/components/JsonViewer.vue'
import StatsCards from '@/components/StatsCards.vue'
import EquipItem from '@/components/EquipItem.vue'

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



// 获取装备类型名称
const getEquipTypeName = (type: string): string => {
  const typeMap: Record<string, string> = {
    'head': '头盔',
    'coat': '衣服',
    'pants': '裤子',
    'belt': '腰带',
    'fashion': '时装',
    'vehicle': '载具',
    'weapon': '副手',
    'device': '设备',
    'jewelry':"饰品",
    'shield':"护盾"
  }
  return typeMap[type] || type
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

const getSuitProBonus = ()=>{
  return getFormattedBonusList(data.value?.items?.getSuitBonus())
}

// 动态套装副标题
const suitSubtitle = computed(() => {
  const suitName = data.value?.items?.getSuitName()
  return suitName ? `${EquipItems.getSuitCnName(suitName)} 套装加成` : '装备套装总加成'
})



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