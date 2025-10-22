<template>
  <div class="arms-house-module">
    <el-card class="module-card">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><House /></el-icon>
          <div>
            <h2>武器仓库</h2>
            <p class="module-desc">武器仓库数据和装备信息</p>
          </div>
        </div>
      </template>
      
      <!-- 武器仓库统计 -->
      <StatsCards :stats="armsHouseStats" />
      
      <!-- 武器展示 -->
      <div class="arms-display-section">
        <el-divider content-position="left">
          <el-icon><House /></el-icon>
          <span>武器展示</span>
        </el-divider>
        
        <div class="arms-grid">
          <div class="arms-flex-container">
            <ArmsDisplay 
              v-for="armsItem in data?.items" 
              :key="armsItem.id"
              :arms-item="armsItem"
              class="arms-flex-item"
            />
          </div>
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
import { House, Star, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { ArmsHouse, ArmSaveItem } from '@/types/archive/module/arms'
import JsonViewer from '@/components/JsonViewer.vue'
import ArmsDisplay from '@/components/ArmsDisplay.vue'
import StatsCards from '@/components/StatsCards.vue'

const archiveStore = useArchiveStore()

// 获取武器仓库模块数据
const data = computed((): ArmsHouse | null => {
  return archiveStore.getModuleData('armsHouse') as ArmsHouse | null
})

// 武器仓库统计
const armsHouseStats = computed(() => {
  const armsItems = data.value?.items || []
  const lockedCount = armsItems.filter(item => item.lockB).length
  const newCount = armsItems.filter(item => item.newB).length
  const maxEvoLv = Math.max(...armsItems.map(item => item.evoLv || 0), 0)
  
  return [
    {
      key: 'totalArms',
      label: '武器总数',
      value: armsItems.length,
      icon: House,
      iconClass: 'text-primary',
      valueClass: 'text-primary'
    },
    {
      key: 'maxCapacity',
      label: '最大容量',
      value: data.value?.gripMaxNum || 0,
      icon: House,
      iconClass: 'text-info',
      valueClass: 'text-info'
    },
    {
      key: 'lockedArms',
      label: '锁定武器',
      value: lockedCount,
      icon: Lock,
      iconClass: 'text-warning',
      valueClass: 'text-warning'
    },
    {
      key: 'newArms',
      label: '新武器',
      value: newCount,
      icon: Star,
      iconClass: 'text-success',
      valueClass: 'text-success'
    },
    {
      key: 'maxEvoLv',
      label: '最高进化',
      value: maxEvoLv,
      icon: Star,
      iconClass: 'text-danger',
      valueClass: 'text-danger'
    },
    {
      key: 'lastId',
      label: '最后ID',
      value: data.value?.lastId || 0,
      icon: Star,
      iconClass: 'text-info',
      valueClass: 'text-info'
    }
  ]
})

// 查看武器详情
const viewArmsDetail = (arms: ArmSaveItem) => {
  ElMessage.info(`查看武器详情: ${arms.name}`)
  // 这里可以打开详情弹窗或跳转到详情页面
}

// JSON数据
const jsonData = computed(() => {
  return JSON.stringify(data.value, null, 2)
})
</script>

<style scoped>
.arms-house-module {
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

.arms-display-section {
  margin-top: 24px;
}

.arms-grid {
  margin-top: 16px;
}

/* 五列flex布局 */
.arms-flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
}

.arms-flex-item {
  flex: 0 0 calc(20% - 13px); /* 五列布局，减去gap的影响 */
  min-width: 180px; /* 最小宽度，确保在收缩时不会太小 */
}

/* 响应式布局 */
@media (max-width: 1400px) {
  .arms-flex-item {
    flex: 0 0 calc(25% - 12px); /* 四列布局 */
  }
}

@media (max-width: 1100px) {
  .arms-flex-item {
    flex: 0 0 calc(33.333% - 11px); /* 三列布局 */
  }
}

@media (max-width: 800px) {
  .arms-flex-item {
    flex: 0 0 calc(50% - 8px); /* 两列布局 */
  }
}

@media (max-width: 500px) {
  .arms-flex-item {
    flex: 0 0 100%; /* 单列布局 */
  }
}

@media (max-width: 768px) {
  .arms-house-module {
    padding: 16px;
  }
}
</style>
