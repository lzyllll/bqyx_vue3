<template>
  <div class="generic-module">
    <div class="module-header">
      <h2>{{ moduleName }}</h2>
      <p class="module-desc">{{ moduleDescription }}</p>
    </div>
    
    <!-- 巅峰展示区域 -->
    <div v-if="data" class="peak-display">
      <!-- 巅峰基础信息 -->
      <div class="peak-info-section">
        <h3>巅峰信息</h3>
        <div class="peak-info-card">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">等级：</span>
              <span class="info-value">{{ data.lv }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">经验：</span>
              <span class="info-value">{{ data.exp }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">每日经验：</span>
              <span class="info-value">{{ data.dayExp }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">DP日：</span>
              <span class="info-value">{{ data.dpDay }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">全体加成：</span>
              <span class="info-value">{{ data.dpN }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">当前方案：</span>
              <span class="info-value">方案 {{ data.now || '1' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前方案属性加成 -->
      <div class="current-scheme-section">
        <h3>当前方案属性加成</h3>
        <div class="scheme-card" v-if="getCurrentSchemeBonus().length > 0">
          <div class="bonus-list-three-columns">
            <div 
              v-for="bonus in getCurrentSchemeBonus()" 
              :key="bonus.key"
              class="bonus-item"
            >
              <span class="bonus-key">{{ bonus.key }}</span>
              <span class="bonus-value">{{ bonus.value }}</span>
            </div>
          </div>
        </div>
        <div v-else class="no-bonus">
          当前方案暂无属性加成
        </div>
      </div>

      <!-- 全体战力加成 -->
      <div class="dps-whole-section">
        <h3>全体战力加成</h3>
        <div class="dps-whole-card">
          <div class="dps-whole-info">
            <span class="dps-label">全体战力加成：</span>
            <span class="dps-value">{{ getDpsWholeBonus() }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="data-preview">
      <h3>{{ moduleName }}数据</h3>
      <div v-if="data" class="data-content">
        <el-collapse>
          <el-collapse-item title="查看完整数据" name="full">
            <pre class="json-data">{{ JSON.stringify(data, null, 2) }}</pre>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-else class="no-data">
        <p>该模块暂无数据</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useArchiveStore } from '@/stores/archive'
import type { Peak } from '@/types/archive/module/peak'
import { getFormattedBonusList } from '@/utils/translate'

const archiveStore = useArchiveStore()
const moduleKey = "peak"

// 获取模块信息
const moduleInfo = computed(() => {
  return archiveStore.getModuleData(moduleKey)
})

const moduleName = computed(() => {
  return moduleInfo.value?.name || moduleKey
})

const moduleDescription = computed(() => {
  return moduleInfo.value?.description || '存档模块数据'
})

// 获取模块数据
const data = computed(() => {
  return archiveStore.getModuleData(moduleKey) as Peak | null
})

// 获取当前方案的属性加成
const getCurrentSchemeBonus = () => {
  if (!data.value) return []
  const currentPoint = data.value.getCurrentPoint()
  if (!currentPoint) return []
  
  const bonusValues = currentPoint.getAllRoleBonusValues()
  return getFormattedBonusList(bonusValues)
}

// 获取全体战力加成
const getDpsWholeBonus = () => {
  if (!data.value) return '0%'
  const dpsWhole = data.value.getDpsWhole()
  const value = dpsWhole.dpsWhole || 0
  return `${(value * 100).toFixed(2)}%`
}
</script>

<style scoped>
.generic-module {
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  margin: 20px;
  overflow-y: auto;
}

.module-header {
  margin-bottom: 20px;
}

.module-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 20px;
}

.module-desc {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

/* 巅峰展示样式 */
.peak-display {
  margin-bottom: 30px;
}

.peak-info-section,
.current-scheme-section,
.dps-whole-section {
  margin-bottom: 30px;
}

.peak-info-section h3,
.current-scheme-section h3,
.dps-whole-section h3 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.peak-info-card {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #606266;
  font-size: 14px;
  font-weight: 500;
}

.info-value {
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.scheme-card {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
}

.bonus-list-three-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.bonus-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.bonus-key {
  color: #606266;
  font-size: 14px;
  font-weight: 500;
}

.bonus-value {
  color: #409eff;
  font-weight: 600;
  font-size: 14px;
}

.dps-whole-card {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
}

.dps-whole-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dps-label {
  color: #606266;
  font-size: 16px;
  font-weight: 500;
}

.dps-value {
  color: #67c23a;
  font-size: 18px;
  font-weight: 600;
}

.no-bonus {
  text-align: center;
  color: #909399;
  font-size: 14px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 1px dashed #dcdfe6;
}

.data-preview h3 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.data-content {
  margin-top: 16px;
}

.json-data {
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #909399;
}

.no-data p {
  margin: 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .bonus-list-three-columns {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
