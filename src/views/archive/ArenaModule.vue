<template>
  <div class="arena-module">
      <div class="module-header">
        <h2>竞技场</h2>
        <p class="module-desc">竞技场相关数据和战斗信息</p>
      </div>
    

      <div class="data-preview">
        <h3>竞技场数据</h3>
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

const archiveStore = useArchiveStore()

// 获取基础信息模块数据
const data = computed((): any | null => {
  return archiveStore.getModuleData('arena') as any | null
})

// 获取数据类型
const getDataType = (): string => {
  if (Array.isArray(data.value)) return '数组'
  if (typeof data.value === 'object' && data.value !== null) return '对象'
  return typeof data.value
}

// 获取数据项数
const getDataCount = (): number => {
  if (Array.isArray(data.value)) return data.value.length
  if (typeof data.value === 'object' && data.value !== null) return Object.keys(data.value).length
  return 1
}
</script>

<style scoped>
.arena-module {
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

.module-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.summary-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
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
  .module-summary {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
  }
}
</style>


