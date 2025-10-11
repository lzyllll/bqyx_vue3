<template>
  <div class="arms-module">
      <el-card class="module-card">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><Tools /></el-icon>
            <div>
              <h2>武器模块</h2>
              <p class="module-desc">武器数据和装备信息</p>
            </div>
          </div>
        </template>
        
        <!-- 武器统计 -->
        <div class="arms-stats">
          <el-row :gutter="20">
            <el-col :span="6" v-for="stat in armsStats" :key="stat.key">
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
        
        <!-- 武器展示 -->
        <div class="arms-display-section">
          <el-divider content-position="left">
            <el-icon><Tools /></el-icon>
            <span>武器展示</span>
          </el-divider>
          
          <div class="arms-grid">
            <el-row :gutter="16">
              <el-col 
                :span="8" 
                v-for="(armsItem, index) in data?.items" 
                :key="armsItem.id"
              >
                <div class="arms-item-wrapper">
                  <ArmsDisplay :arms-item="armsItem" />
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
import { Tools, List, Trophy, Star, Setting, Box } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { Arms, ArmsItem } from '@/types/archive/module/arms'
import JsonViewer from '@/components/JsonViewer.vue'
import ArmsDisplay from '@/components/ArmsDisplay.vue'

const archiveStore = useArchiveStore()

// 获取武器模块数据
const data = computed((): Arms | null => {
  return archiveStore.getModuleData('arms') as Arms | null
})



// 武器统计
const armsStats = computed(() => [
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


// 查看武器详情
const viewArmsDetail = (arms: ArmsItem) => {
  ElMessage.info(`查看武器详情: ${arms.name}`)
  // 这里可以打开详情弹窗或跳转到详情页面
}

// JSON数据
const jsonData = computed(() => {
  return JSON.stringify(data.value, null, 2)
})
</script>

<style scoped>
.arms-module {
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

.arms-stats {
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

.arms-display-section {
  margin-top: 24px;
}

.arms-grid {
  margin-top: 16px;
}

.arms-item-wrapper {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.json-viewer {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .arms-module {
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
  
  .arms-grid .el-col {
    margin-bottom: 16px;
  }
}
</style>