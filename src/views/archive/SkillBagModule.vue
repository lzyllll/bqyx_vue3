<template>
  <div class="skill-bag-module">
    <el-card class="module-card">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Box /></el-icon>
          <div>
            <h2>技能背包</h2>
            <p class="module-desc">技能背包数据和技能信息</p>
          </div>
        </div>
      </template>
      
      <!-- 技能背包统计 -->
      <StatsCards :stats="skillBagStats" />
      
      <!-- 技能背包列表 -->
      <div class="skill-bag-section">
        <el-divider content-position="left">
          <el-icon><List /></el-icon>
          <span>技能背包</span>
        </el-divider>
        
        <!-- 搜索和筛选 -->
        <div class="filter-section">
          <el-row :gutter="20" class="filter-row">
            <el-col :span="8">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索技能名称"
                clearable
                @input="handleFilter"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-select
                v-model="qualityFilter"
                placeholder="选择品质"
                clearable
                @change="handleFilter"
              >
                <el-option label="全部" value="" />
                <el-option 
                  v-for="color in availableColors" 
                  :key="color" 
                  :label="translateColorName(color)" 
                  :value="color" 
                />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select
                v-model="statusFilter"
                placeholder="选择状态"
                clearable
                @change="handleFilter"
              >
                <el-option label="全部" value="" />
                <el-option label="锁定" value="locked" />
                <el-option label="新技能" value="new" />
                <el-option label="生效中" value="active" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button @click="resetFilters">重置</el-button>
            </el-col>
          </el-row>
        </div>
        
        <!-- 技能网格 -->
        <div class="skill-grid" v-loading="!data">
          <div 
            v-for="(skill, index) in paginatedSkills" 
            :key="skill.baseLabel"
            class="skill-card"
          >
            <el-popover
              placement="bottom"
              :width="300"
              trigger="hover"
              :show-arrow="false"
            >
              <template #reference>
                <div class="skill-card-content">
                  <!-- 技能图片 -->
                  <div class="skill-image" :style="getSkillImageStyle(skill)">
                    <div class="skill-level">{{ skill.lv }}</div>
                  </div>
                  
                  <!-- 品质标签 -->
                  <div class="skill-quality" :class="getColorType(skill.color)">
                    {{ translateColorName(skill.color) }}
                  </div>
                  
                  <!-- 技能名称 -->
                  <div class="skill-name">{{ skill.baseLabel }}</div>
                </div>
              </template>
              
              <!-- 悬浮窗内容 -->
              <div class="skill-popover">
                <div class="popover-header">
                  <h4>{{ skill.baseLabel }}</h4>
                  <div class="popover-status">
                    <span v-if="skill.lockB" class="status-tag warning">锁定</span>
                    <span v-if="skill.newB" class="status-tag success">新技能</span>
                    <span v-if="skill.effB" class="status-tag info">生效中</span>
                  </div>
                </div>
                
                <div class="popover-content">
                  <div class="content-section">
                    <h5>基本信息</h5>
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="info-label">等级:</span>
                        <span class="info-value">{{ skill.lv }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">品质:</span>
                        <span class="info-value">{{ translateColorName(skill.color) }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">位置:</span>
                        <span class="info-value">{{ skill.site }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">熟练度:</span>
                        <span class="info-value">{{ skill.profi }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">学习等级:</span>
                        <span class="info-value">{{ skill.studyBodyLv }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="content-section">
                    <h5>其他信息</h5>
                    <div class="info-grid">
                      <div class="info-item">
                        <span class="info-label">每日熟练度:</span>
                        <span class="info-value">{{ skill.dayProfi }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">物品等级:</span>
                        <span class="info-value">{{ skill.itemsLevel }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">物品类型:</span>
                        <span class="info-value">{{ skill.itemsType }}</span>
                      </div>
                      <div class="info-item">
                        <span class="info-label">附加等级:</span>
                        <span class="info-value">{{ skill.addLevel }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-popover>
          </div>
        </div>
        
        <!-- 分页 -->
        <div class="pagination-section" v-if="totalPages > 1">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[12, 24, 36, 48]"
            :total="filteredSkills.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
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
import { computed, ref } from 'vue'
import { useArchiveStore } from '@/stores/archive'

import { Box, List, Search } from '@element-plus/icons-vue'
import type { SkillBag, SkillItem } from '@/types/archive/module/skill'
import { getColorType, translateColorName } from '@/utils/colorUtils'
import { getThingsBackgroundStyle } from '@/utils/backgroundImages'
import StatsCards from '@/components/StatsCards.vue'
import JsonViewer from '@/components/JsonViewer.vue'

const archiveStore = useArchiveStore()

// 获取技能背包数据
const data = computed((): SkillBag | null => {
  return archiveStore.getModuleData('skillBag') as SkillBag | null
})

// 技能列表
const skillList = computed((): SkillItem[] => {
  return data.value?.arr || []
})

// 可用颜色选项
const availableColors = computed(() => {
  if (!data.value?.arr) return []
  
  const colorSet = new Set<string>()
  data.value.arr.forEach(skill => {
    if (skill.color) {
      colorSet.add(skill.color)
    }
  })
  
  return Array.from(colorSet).sort()
})

// 搜索和筛选
const searchKeyword = ref('')
const qualityFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(24)

// 技能背包统计
const skillBagStats = computed(() => [
  {
    key: 'total',
    label: '技能总数',
    value: skillList.value.length,
    icon: Box,
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
    key: 'locked',
    label: '锁定数量',
    value: data.value?.lockLen || 0,
    icon: Box,
    iconClass: 'text-warning',
    valueClass: 'text-warning'
  },
  {
    key: 'lastId',
    label: '最后ID',
    value: data.value?.lastId || 0,
    icon: Box,
    iconClass: 'text-success',
    valueClass: 'text-success'
  }
])

// 获取技能图片样式
const getSkillImageStyle = (skill: SkillItem) => {
  const skillObj = {
    name: skill.baseLabel,
    partType: 'skill',
    imgName: skill.baseLabel
  }
  return getThingsBackgroundStyle(skillObj, skill.color)
}

// 筛选后的技能列表
const filteredSkills = computed(() => {
  let result = skillList.value

  // 搜索筛选
  if (searchKeyword.value) {
    result = result.filter(skill => 
      skill.baseLabel.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  // 品质筛选
  if (qualityFilter.value) {
    result = result.filter(skill => skill.color === qualityFilter.value)
  }

  // 状态筛选
  if (statusFilter.value) {
    result = result.filter(skill => {
      switch (statusFilter.value) {
        case 'locked':
          return skill.lockB
        case 'new':
          return skill.newB
        case 'active':
          return skill.effB
        default:
          return true
      }
    })
  }

  return result
})

// 分页后的技能列表
const paginatedSkills = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredSkills.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredSkills.value.length / pageSize.value)
})

// 处理筛选
const handleFilter = () => {
  currentPage.value = 1
}

// 重置筛选
const resetFilters = () => {
  searchKeyword.value = ''
  qualityFilter.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}

// 处理页面大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

// 处理当前页变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

// JSON数据
const jsonData = computed(() => {
  return JSON.stringify(data.value, null, 2)
})
</script>

<style scoped>
.skill-bag-module {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.module-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

.skill-bag-section {
  margin-top: 24px;
}

.filter-section {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-row {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 5px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 24px;
}

.skill-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.skill-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.2);
  transform: translateY(-2px);
}

.skill-card-content {
  text-align: center;
  width: 100%;
}

.skill-image {
  width: 56px;
  height: 56px;
  border-radius: 4px;
  position: relative;
  margin: 0 auto 8px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.skill-level {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: bold;
  min-width: 16px;
  text-align: center;
}

.skill-quality {
  text-align: center;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
  margin-bottom: 4px;
  display: inline-block;
}

.skill-quality.primary { background: #ecf5ff; color: #409eff; }
.skill-quality.success { background: #f0f9ff; color: #67c23a; }
.skill-quality.warning { background: #fdf6ec; color: #e6a23c; }
.skill-quality.info { background: #f4f4f5; color: #909399; }
.skill-quality.danger { background: #fef0f0; color: #f56c6c; }

.skill-name {
  font-size: 12px;
  color: #333;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100px;
}

/* 悬浮窗样式 */
.skill-popover {
  padding: 16px;
}

.popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.popover-header h4 {
  margin: 0;
  color: #303133;
  font-size: 16px;
}

.popover-status {
  display: flex;
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

.popover-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content-section h5 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.info-label {
  color: #909399;
}

.info-value {
  color: #303133;
  font-weight: 500;
}

.skill-effects {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.effect-item {
  font-size: 12px;
  color: #303133;
  padding: 4px 8px;
  background: #f5f7fa;
  border-radius: 4px;
}

.hero-skill-bonus {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bonus-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.bonus-key {
  color: #909399;
}

.bonus-value {
  color: #303133;
  font-weight: 500;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .skill-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    padding: 15px;
  }
  
  .skill-card {
    padding: 8px;
  }
  
  .skill-image {
    width: 48px;
    height: 48px;
    margin: 0 auto 8px auto;
  }
  
  .skill-name {
    font-size: 11px;
    max-width: 80px;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 12px;
  }
  
  .filter-row .el-col {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .skill-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
    padding: 10px;
  }
  
  .skill-card {
    padding: 6px;
  }
  
  .skill-image {
    width: 40px;
    height: 40px;
    margin: 0 auto 8px auto;
  }
  
  .skill-name {
    font-size: 10px;
    max-width: 60px;
  }
}
</style>
