<template>
  <div class="drop-module">
    <div class="module-header">
      <h2>掉落统计</h2>
      <div class="header-stats">
        <el-card class="stat-card">
          <div class="stat-item">
            <span class="stat-label">总黑芯片:</span>
            <span class="stat-value">{{ dropData?.allBlackChipNum || 0 }}</span>
          </div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-item">
            <span class="stat-label">总武器黑芯片:</span>
            <span class="stat-value">{{ dropData?.allArmsBlackChipNum || 0 }}</span>
          </div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-item">
            <span class="stat-label">总宝箱:</span>
            <span class="stat-value">{{ totalChests }}</span>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 主要掉落统计 -->
    <div class="main-stats-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><Trophy /></el-icon>
            <span>主要掉落统计</span>
          </div>
        </template>
        
        <div class="stats-grid">
          <div class="stat-item-large">
            <div class="stat-icon black-chip">
              <el-icon><Box /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-label">黑芯片</div>
              <div class="stat-value">{{ dropData?.allBlackChipNum || 0 }}</div>
              <div class="stat-total">今日: {{ dropData?.blackChipNum || 0 }}</div>
            </div>
          </div>
          
          <div class="stat-item-large">
            <div class="stat-icon arms-chip">
              <el-icon><Tools /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-label">武器黑芯片</div>
              <div class="stat-value">{{ dropData?.allArmsBlackChipNum || 0 }}</div>
              <div class="stat-total">今日: {{ dropData?.armsBlackChipNum || 0 }}</div>
            </div>
          </div>
          
          <div class="stat-item-large">
            <div class="stat-icon blood-stone">
              <el-icon><Star /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-label">血石</div>
              <div class="stat-value">{{ dropData?.bloodStoneNum || 0 }}</div>
            </div>
          </div>
          
          <div class="stat-item-large">
            <div class="stat-icon equip-gem">
              <el-icon><Star /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-label">装备宝石</div>
              <div class="stat-value">{{ dropData?.equipGem || 0 }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 宝箱统计 -->
    <div class="chest-stats-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><Box /></el-icon>
            <span>宝箱统计</span>
          </div>
        </template>
        
        <div class="chest-grid">
          <div class="chest-item">
            <div class="chest-icon normal">
              <el-icon><Box /></el-icon>
            </div>
            <div class="chest-info">
              <div class="chest-name">普通宝箱</div>
              <div class="chest-count">{{ dropData?.normalChestNum || 0 }}</div>
            </div>
          </div>
          
          <div class="chest-item">
            <div class="chest-icon magic">
              <el-icon><Star /></el-icon>
            </div>
            <div class="chest-info">
              <div class="chest-name">魔法宝箱</div>
              <div class="chest-count">{{ dropData?.magicChestNum || 0 }}</div>
            </div>
          </div>
          
          <div class="chest-item">
            <div class="chest-icon dragon">
              <el-icon><Trophy /></el-icon>
            </div>
            <div class="chest-info">
              <div class="chest-name">龙族宝箱</div>
              <div class="chest-count">{{ dropData?.dragonChestNum || 0 }}</div>
            </div>
          </div>
          
          <div class="chest-item">
            <div class="chest-icon tiger">
              <el-icon><Star /></el-icon>
            </div>
            <div class="chest-info">
              <div class="chest-name">老虎宝箱</div>
              <div class="chest-count">{{ dropData?.tigerChest || 0 }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 装备和武器统计 -->
    <div class="equipment-stats-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><Tools /></el-icon>
            <span>装备和武器统计</span>
          </div>
        </template>
        
        <div class="equipment-grid">
          <div class="equipment-item">
            <div class="equipment-label">90级武器黑装</div>
            <div class="equipment-count">{{ dropData?.allNintyArmsBlackNum || 0 }}</div>
            <div class="equipment-total">今日: {{ dropData?.nintyArmsBlackNum || 0 }}</div>
          </div>
          
          <div class="equipment-item">
            <div class="equipment-label">90级装备黑装</div>
            <div class="equipment-count">{{ dropData?.allNintyEquipBlackNum || 0 }}</div>
            <div class="equipment-total">今日: {{ dropData?.nintyEquipBlackNum || 0 }}</div>
          </div>
          
          <div class="equipment-item">
            <div class="equipment-label">精炼黑装</div>
            <div class="equipment-count">{{ dropData?.refiningBlackNum || 0 }}</div>
          </div>
          
          <div class="equipment-item">
            <div class="equipment-label">武器数量</div>
            <div class="equipment-count">{{ dropData?.weaponNum || 0 }}</div>
          </div>
          
          <div class="equipment-item">
            <div class="equipment-label">装置数量</div>
            <div class="equipment-count">{{ dropData?.deviceNum || 0 }}</div>
          </div>
          
          <div class="equipment-item">
            <div class="equipment-label">零件数量</div>
            <div class="equipment-count">{{ dropData?.partsNum || 0 }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 特殊物品统计 -->
    <div class="special-items-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><Star /></el-icon>
            <span>特殊物品统计</span>
          </div>
        </template>
        
        <div class="special-grid">
          <div class="special-item">
            <div class="special-label">疯狂之心</div>
            <div class="special-count">{{ dropData?.madheart || 0 }}</div>
          </div>
          
          <div class="special-item">
            <div class="special-label">疯狂之心A</div>
            <div class="special-count">{{ dropData?.mhA || 0 }}</div>
          </div>
          
          <div class="special-item">
            <div class="special-label">铁拳书</div>
            <div class="special-count">{{ dropData?.ironChiefBook || 0 }}</div>
          </div>
          
          <div class="special-item">
            <div class="special-label">钥匙数量</div>
            <div class="special-count">{{ dropData?.keyNum || 0 }}</div>
          </div>
          
          <div class="special-item">
            <div class="special-label">圣诞枪</div>
            <div class="special-count">{{ dropData?.chrisGun || 0 }}</div>
          </div>
          
          <div class="special-item">
            <div class="special-label">时间C更多</div>
            <div class="special-count">{{ dropData?.timeCMore || 0 }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 节日活动统计 -->
    <div class="festival-stats-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><Calendar /></el-icon>
            <span>节日活动统计</span>
          </div>
        </template>
        
        <div class="festival-grid">
          <div class="festival-item">
            <div class="festival-label">21年植树节</div>
            <div class="festival-count">{{ dropData?.arbor21All || 0 }}</div>
            <div class="festival-total">今日: {{ dropData?.arbor21 || 0 }}</div>
          </div>
          
          <div class="festival-item">
            <div class="festival-label">20年万圣节</div>
            <div class="festival-count">{{ dropData?.pumpkin20All || 0 }}</div>
            <div class="festival-total">今日: {{ dropData?.pumpkin20 || 0 }}</div>
          </div>
          
          <div class="festival-item">
            <div class="festival-label">23年冬至</div>
            <div class="festival-count">{{ dropData?.dongzhi23 || 0 }}</div>
          </div>
          
          <div class="festival-item">
            <div class="festival-label">红包</div>
            <div class="festival-count">{{ dropData?.redBagAll || 0 }}</div>
            <div class="festival-total">今日: {{ dropData?.redBag || 0 }}</div>
          </div>
          
          <div class="festival-item">
            <div class="festival-label">2021年五一芯片</div>
            <div class="festival-count">{{ dropData?.wuyiChip2021 || 0 }}</div>
          </div>
          
          <div class="festival-item">
            <div class="festival-label">梯队1</div>
            <div class="festival-count">{{ dropData?.echelon1 || 0 }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 详细数据 -->
    <JsonViewer 
      :json-data="jsonData"
      title="详细数据"
      collapse-title="查看完整JSON数据"
      :rows="10"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useArchiveStore } from '@/stores/archive'
import { Drop } from '@/types/archive/module/drop'
import { Trophy, Box, Tools, Star, Calendar } from '@element-plus/icons-vue'
import JsonViewer from '@/components/JsonViewer.vue'

const archiveStore = useArchiveStore()

// 获取掉落数据
const dropData = computed((): Drop | null => {
  return archiveStore.getModuleData('drop') as Drop | null
})

// 获取JSON数据用于JsonViewer
const jsonData = computed(() => {
  return dropData.value ? JSON.stringify(dropData.value, null, 2) : '{}'
})

// 计算总宝箱数量
const totalChests = computed(() => {
  if (!dropData.value) return 0
  return (dropData.value.normalChestNum || 0) + 
         (dropData.value.magicChestNum || 0) + 
         (dropData.value.dragonChestNum || 0) + 
         (dropData.value.tigerChest || 0)
})
</script>

<style scoped>
.drop-module {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.module-header {
  margin-bottom: 20px;
}

.module-header h2 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 24px;
}

.header-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 200px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #333;
}

.header-icon {
  color: #409eff;
}

/* 主要掉落统计 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-item-large {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.stat-item-large:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
  color: white;
}

.stat-icon.black-chip {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.arms-chip {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.blood-stone {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.stat-icon.equip-gem {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.stat-content {
  flex: 1;
}

.stat-content .stat-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stat-content .stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-total {
  font-size: 12px;
  color: #999;
}

/* 宝箱统计 */
.chest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.chest-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.chest-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 18px;
  color: white;
}

.chest-icon.normal {
  background: #909399;
}

.chest-icon.magic {
  background: #409eff;
}

.chest-icon.dragon {
  background: #f56c6c;
}

.chest-icon.tiger {
  background: #e6a23c;
}

.chest-info {
  flex: 1;
}

.chest-name {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.chest-count {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 装备统计 */
.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.equipment-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  text-align: center;
}

.equipment-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.equipment-count {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 4px;
}

.equipment-total {
  font-size: 12px;
  color: #999;
}

/* 特殊物品统计 */
.special-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.special-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  text-align: center;
}

.special-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.special-count {
  font-size: 18px;
  font-weight: bold;
  color: #67c23a;
}

/* 节日活动统计 */
.festival-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.festival-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  text-align: center;
}

.festival-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.festival-count {
  font-size: 18px;
  font-weight: bold;
  color: #e6a23c;
  margin-bottom: 4px;
}

.festival-total {
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-stats {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .chest-grid,
  .equipment-grid,
  .special-grid,
  .festival-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>
