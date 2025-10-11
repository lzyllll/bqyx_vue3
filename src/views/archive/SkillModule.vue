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
            <div class="skill-list-container" v-loading="!data">
              <!-- 表头 -->
              <div class="skill-list-header">
                <div class="header-cell skill-cell">技能</div>
                <div class="header-cell position-cell">位置</div>
                <div class="header-cell proficiency-cell">熟练度</div>
                <div class="header-cell study-level-cell">学习等级</div>
                <div class="header-cell status-cell">状态</div>
                <div class="header-cell action-cell">操作</div>
              </div>
              
              <!-- 技能列表 -->
              <div class="skill-list-body">
                <div 
                  v-for="(skill, index) in skillList" 
                  :key="skill.baseLabel"
                  class="skill-list-row"
                  :class="{ 'even-row': index % 2 === 0 }"
                >
                  <!-- 技能信息 -->
                  <div class="skill-cell">
                    <div class="skill-item">
                      <div class="skill-image" :style="getSkillImageStyle(skill)">
                        <div class="skill-level">{{ skill.lv }}</div>
                      </div>
                      <div class="skill-info">
                        <div class="skill-name">{{ skill.baseLabel }}</div>
                        <div class="skill-quality">
                          <span class="quality-tag" :class="getColorType(skill.color)">
                            {{ translateColorName(skill.color) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 位置 -->
                  <div class="position-cell">
                    {{ skill.site }}
                  </div>
                  
                  <!-- 熟练度 -->
                  <div class="proficiency-cell">
                    {{ skill.profi }}
                  </div>
                  
                  <!-- 学习等级 -->
                  <div class="study-level-cell">
                    {{ skill.studyBodyLv }}
                  </div>
                  
                  <!-- 状态 -->
                  <div class="status-cell">
                    <div class="status-tags">
                      <span v-if="skill.lockB" class="status-tag warning">锁定</span>
                      <span v-if="skill.newB" class="status-tag success">新技能</span>
                      <span v-if="skill.effB" class="status-tag info">生效中</span>
                    </div>
                  </div>
                  
                  <!-- 操作 -->
                  <div class="action-cell">
                    <button class="action-btn" @click="viewSkillDetail(skill)">
                      查看详情
                    </button>
                  </div>
                </div>
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
      </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useArchiveStore } from '@/stores/archive'

import { MagicStick, List, Trophy, Star, Setting, Box } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { Skill, SkillItem } from '@/types/archive/module/skill'
import { getColorType, translateColorName } from '@/utils/colorUtils'
import { getThingsBackgroundStyle } from '@/utils/backgroundImages'
import JsonViewer from '@/components/JsonViewer.vue'

const archiveStore = useArchiveStore()

// 移除表格高度计算，让页面自然滚动

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

// 获取技能图片样式
const getSkillImageStyle = (skill: SkillItem) => {
  // 为技能创建适合的对象结构
  const skillObj = {
    name: skill.baseLabel,
    partType: 'skill', // 技能类型
    imgName: skill.baseLabel // 使用技能标识作为图片名
  }
  return getThingsBackgroundStyle(skillObj, skill.color)
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

.skill-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.skill-image {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.skill-level {
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

.skill-info {
  flex: 1;
  min-width: 0;
}

.skill-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
  word-break: break-all;
}

.skill-quality {
  display: flex;
  align-items: center;
}

.status-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/* 自定义技能列表样式 */
.skill-list-container {
  width: 100%;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.skill-list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 1fr;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
  font-weight: 600;
  color: #909399;
}

.header-cell {
  padding: 12px 16px;
  border-right: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.header-cell:last-child {
  border-right: none;
}

/* 技能列表内容区域 - 移除固定高度限制，让内容自然展开 */

.skill-list-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr 1fr;
  border-bottom: 1px solid #ebeef5;
  transition: background-color 0.3s;
}

.skill-list-row:hover {
  background-color: #f5f7fa;
}

.skill-list-row.even-row {
  background-color: #fafafa;
}

.skill-list-row.even-row:hover {
  background-color: #f0f2f5;
}

.skill-list-row:last-child {
  border-bottom: none;
}

.skill-cell,
.position-cell,
.proficiency-cell,
.study-level-cell,
.status-cell,
.action-cell {
  padding: 12px 16px;
  border-right: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  font-size: 14px;
  min-height: 60px;
}

.skill-cell:last-child,
.position-cell:last-child,
.proficiency-cell:last-child,
.study-level-cell:last-child,
.status-cell:last-child,
.action-cell:last-child {
  border-right: none;
}

/* 品质标签样式 */
.quality-tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.quality-tag.primary { background: #ecf5ff; color: #409eff; }
.quality-tag.success { background: #f0f9ff; color: #67c23a; }
.quality-tag.warning { background: #fdf6ec; color: #e6a23c; }
.quality-tag.info { background: #f4f4f5; color: #909399; }
.quality-tag.danger { background: #fef0f0; color: #f56c6c; }

/* 状态标签样式 */
.status-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.status-tag {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
}

.status-tag.warning { background: #fdf6ec; color: #e6a23c; }
.status-tag.success { background: #f0f9ff; color: #67c23a; }
.status-tag.info { background: #ecf5ff; color: #409eff; }

/* 操作按钮样式 */
.action-btn {
  padding: 6px 12px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-btn:hover {
  background: #337ecc;
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