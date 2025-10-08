<template>
  <div class="base-module">
      <el-card class="module-card">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><User /></el-icon>
            <div>
              <h2>基础信息</h2>
              <p class="module-desc">玩家基础信息和角色数据</p>
            </div>
          </div>
        </template>
        
        <!-- 主要信息展示 -->
        <div class="base-stats">
          <el-row :gutter="20">
            <el-col :span="8" v-for="stat in stats" :key="stat.key">
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
        
        <!-- 技能信息 -->
        <div v-if="data?.skillP" class="skill-section">
          <el-divider content-position="left">
            <el-icon><MagicStick /></el-icon>
            <span>技能信息</span>
          </el-divider>
          <el-card>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="技能点配置">
                <el-tag type="info">{{ data.skillP || '无' }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
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

import { User, Lock, Unlock, Setting, Trophy, Star, MagicStick } from '@element-plus/icons-vue'
import type { Base } from '@/types/archive/module/baseInfo'
import JsonViewer from '@/components/JsonViewer.vue'

const archiveStore = useArchiveStore()

// 获取基础信息模块数据
const data = computed((): Base | null => {
  return archiveStore.getModuleData('base') as Base | null
})

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 统计数据
const stats = computed(() => [
  {
    key: 'playerName',
    label: '玩家名称',
    value: data.value?.playerName || '未知',
    icon: User,
    iconClass: 'text-primary',
    valueClass: 'text-primary'
  },
  {
    key: 'level',
    label: '等级',
    value: data.value?.level || 0,
    icon: Trophy,
    iconClass: 'text-success',
    valueClass: 'text-success'
  },
  {
    key: 'exp',
    label: '经验值',
    value: formatNumber(data.value?.exp || 0),
    icon: Star,
    iconClass: 'text-warning',
    valueClass: 'text-warning'
  },
  {
    key: 'skillResetedNum',
    label: '技能重置次数',
    value: data.value?.skillResetedNum || 0,
    icon: Setting,
    iconClass: 'text-info',
    valueClass: 'text-info'
  },
  {
    key: 'lockB',
    label: '锁定状态',
    value: data.value?.lockB ? '已锁定' : '未锁定',
    icon: data.value?.lockB ? Lock : Unlock,
    iconClass: data.value?.lockB ? 'text-danger' : 'text-success',
    valueClass: data.value?.lockB ? 'text-danger' : 'text-success'
  },
  {
    key: 'playerCtrlB',
    label: '玩家控制',
    value: data.value?.playerCtrlB ? '启用' : '禁用',
    icon: Setting,
    iconClass: data.value?.playerCtrlB ? 'text-success' : 'text-danger',
    valueClass: data.value?.playerCtrlB ? 'text-success' : 'text-danger'
  }
])

// JSON数据
const jsonData = computed(() => {
  return JSON.stringify(data.value, null, 2)
})
</script>

<style scoped>
.base-module {
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

.base-stats {
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

.skill-section,
.data-section {
  margin-top: 24px;
}

.json-viewer {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .base-module {
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
