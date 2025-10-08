<template>
  <div class="skill-module">
      <el-card class="module-card">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><MagicStick /></el-icon>
            <div>
              <h2>技能模块</h2>
              <p class="module-desc">技能数据和技能信息</p>
            </div>
          </div>
        </template>
        
        <!-- 技能统计 -->
        <div class="skill-stats">
          <el-row :gutter="20">
            <el-col :span="6" v-for="stat in skillStats" :key="stat.key">
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
        
        <!-- 技能列表 -->
        <div class="skill-list-section">
          <el-divider content-position="left">
            <el-icon><List /></el-icon>
            <span>技能列表</span>
          </el-divider>
          <el-card>
            <el-table 
              :data="skillList" 
              stripe 
              style="width: 100%"
              max-height="400"
              v-loading="!data"
            >
              <el-table-column prop="baseLabel" label="技能标识" width="150" />
              <!-- <el-table-column prop="cnName" label="中文名称" width="150" /> -->
              <el-table-column prop="lv" label="等级" width="80" />
              <el-table-column prop="color" label="品质" width="100">
                <template #default="scope">
                  <el-tag :type="getColorType(scope.row.color)">
                    {{ scope.row.color }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="site" label="位置" width="80" />
              <el-table-column prop="profi" label="熟练度" width="100" />
              <el-table-column prop="studyBodyLv" label="学习等级" width="100" />
              <el-table-column label="状态" width="120">
                <template #default="scope">
                  <el-tag v-if="scope.row.lockB" type="warning">锁定</el-tag>
                  <el-tag v-if="scope.row.newB" type="success">新技能</el-tag>
                  <el-tag v-if="scope.row.effB" type="info">生效中</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button size="small" @click="viewSkillDetail(scope.row)">
                    查看详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
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

import { MagicStick, List, Trophy, Star, Setting, Box } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { Skill, SkillItem } from '@/types/archive/module/skill'
import JsonViewer from '@/components/JsonViewer.vue'

const archiveStore = useArchiveStore()

// 获取技能模块数据
const data = computed((): Skill | null => {
  return archiveStore.getModuleData('skill') as Skill | null
})

// 技能列表
const skillList = computed((): SkillItem[] => {
  return data.value?.arr || []
})

// 技能统计
const skillStats = computed(() => [
  {
    key: 'total',
    label: '技能总数',
    value: skillList.value.length,
    icon: MagicStick,
    iconClass: 'text-primary',
    valueClass: 'text-primary'
  },
  {
    key: 'maxCapacity',
    label: '最大容量',
    value: data.value?.gripMaxNum || 0,
    icon: Box,
    iconClass: 'text-info',
    valueClass: 'text-info'
  },
  {
    key: 'avgLevel',
    label: '平均等级',
    value: skillList.value.length > 0 
      ? Math.round(skillList.value.reduce((sum, skill) => sum + skill.lv, 0) / skillList.value.length)
      : 0,
    icon: Star,
    iconClass: 'text-warning',
    valueClass: 'text-warning'
  },
  {
    key: 'lastId',
    label: '最后ID',
    value: data.value?.lastId || 0,
    icon: Setting,
    iconClass: 'text-success',
    valueClass: 'text-success'
  }
])

// 获取品质颜色
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

// 查看技能详情
const viewSkillDetail = (skill: SkillItem) => {
  ElMessage.info(`查看技能详情: ${skill.baseLabel}`)
  // 这里可以打开详情弹窗或跳转到详情页面
}

// JSON数据
const jsonData = computed(() => {
  return JSON.stringify(data.value, null, 2)
})
</script>

<style scoped>
.skill-module {
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

.skill-stats {
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

.skill-list-section,
.data-section {
  margin-top: 24px;
}

.json-viewer {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .skill-module {
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