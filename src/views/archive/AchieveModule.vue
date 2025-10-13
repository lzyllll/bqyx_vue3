<template>
  <div class="achieve-module">
    <el-card class="module-card">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Trophy /></el-icon>
          <div>
            <h2>成就模块</h2>
            <p class="module-desc">成就数据和成就信息</p>
          </div>
        </div>
      </template>
      
      <!-- 成就统计 -->
      <div class="achieve-stats">
        <el-row :gutter="20">
          <el-col :span="6" v-for="stat in achieveStats" :key="stat.key">
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
      
      <!-- 成就加成统计 -->
      <div class="achieve-bonus-section">
        <el-divider content-position="left">
          <el-icon><TrendCharts /></el-icon>
          <span>成就加成统计</span>
          <el-button 
            type="text" 
            @click="toggleBonusExpanded"
            class="expand-button"
          >
            <el-icon>
              <component :is="bonusExpanded ? 'ArrowUp' : 'ArrowDown'" />
            </el-icon>
            {{ bonusExpanded ? '收起' : '展开' }}
          </el-button>
        </el-divider>
        <el-collapse-transition>
          <div v-show="bonusExpanded" class="bonus-content-wrapper">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-card class="bonus-card compact" shadow="hover">
              <div class="bonus-header-compact">
                <el-icon class="bonus-icon"><Trophy /></el-icon>
                <div class="bonus-title">已完成成就加成</div>
              </div>
              <div class="bonus-content-compact">
                <div class="bonus-item-compact" v-for="bonus in completedAchievesBonus" :key="bonus.key">
                  <span class="bonus-key">{{ bonus.key }}</span>
                  <span class="bonus-value">{{ bonus.value }}</span>
                </div>
                <div v-if="completedAchievesBonus.length === 0" class="no-bonus-compact">
                  暂无加成
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="18">
            <el-card class="bonus-card" shadow="hover">
              <div class="bonus-header">
                <el-icon class="bonus-icon"><Star /></el-icon>
                <div class="bonus-title">佩戴成就加成</div>
              </div>
              <div class="bonus-content-two-columns">
                <div class="bonus-item-compact" v-for="bonus in equipedAchievesBonus" :key="bonus.key">
                  <span class="bonus-key">{{ bonus.key }}</span>
                  <span class="bonus-value">{{ bonus.value }}</span>
                </div>
                <div v-if="equipedAchievesBonus.length === 0" class="no-bonus-compact">
                  暂无加成
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
          </div>
        </el-collapse-transition>
      </div>
      
      <!-- 成就列表 -->
      <div class="achieve-list-section">
        <el-divider content-position="left">
          <el-icon><List /></el-icon>
          <span>成就列表</span>
        </el-divider>
        
        <!-- 筛选器 -->
        <div class="filter-section">
          <el-row :gutter="20" class="mb-20">
            <el-col :span="6">
              <el-input
                v-model="searchText"
                placeholder="搜索成就名称"
                clearable
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-select v-model="selectedCategory" placeholder="选择分类" clearable>
                <el-option label="全部分类" value="" />
                <el-option 
                  v-for="category in allCategories.categories" 
                  :key="category" 
                  :label="category" 
                  :value="category" 
                />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="selectedSubcategory" placeholder="选择子分类" clearable>
                <el-option label="全部子分类" value="" />
                <el-option 
                  v-for="subcategory in allCategories.subcategories" 
                  :key="subcategory" 
                  :label="subcategory" 
                  :value="subcategory" 
                />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="showCompleted" placeholder="完成状态">
                <el-option label="全部" value="all" />
                <el-option label="已完成" value="completed" />
                <el-option label="进行中" value="pending" />
                <el-option label="佩戴中" value="wearing" />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button @click="resetFilters" type="primary" plain>
                <el-icon><Refresh /></el-icon>
                重置
              </el-button>
            </el-col>
          </el-row>
        </div>
        
        <el-card>
          <div v-if="achieveList.length > 0" class="achieve-grid">
            <el-popover
              v-for="achieve in paginatedAchieveList" 
              :key="achieve.name"
              placement="top"
              :width="350"
              trigger="hover"
              :show-after="300"
              popper-class="achieve-popover"
            >
              <template #reference>
                <div 
                  class="achieve-item"
                  :class="{ 'completed': achieve.state, 'wearing': achieve.wearB }"
                >
                  <div class="achieve-icon">
                    <img 
                      :src="getAchieveSvg(achieve.name)" 
                      :alt="getChineseName(achieve.name)"
                      class="achieve-svg-icon"
                    />
                  </div>
                  <div class="achieve-info">
                    <div class="achieve-name">{{ getChineseName(achieve.name) }}</div>
                    <div class="achieve-desc">{{ achieve.info }}</div>
                    <div class="achieve-progress">
                      <span>进度: {{ achieve.infoValue }}</span>
                    </div>
                    <div class="achieve-category">
                      <el-tag size="small" type="info">{{ getAchieveCategory(achieve.name).category }}</el-tag>
                      <el-tag size="small" type="success">{{ getAchieveCategory(achieve.name).subcategory }}</el-tag>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- 悬浮卡片内容 -->
              <div class="achieve-popover-content">
                <div class="popover-header">
                  <h4 class="popover-title">{{ getChineseName(achieve.name) }}</h4>
                  <div class="popover-category">
                    <el-tag size="small" type="primary">{{ getAchieveCategory(achieve.name).category }}</el-tag>
                    <el-tag size="small" type="success">{{ getAchieveCategory(achieve.name).subcategory }}</el-tag>
                  </div>
                </div>
                
                <div class="popover-description">
                  {{ getAchieveDescription(achieve.name) }}
                </div>
                
                <div v-if="getAchieveBonus(achieve.name).length > 0" class="popover-bonus">
                  <div class="bonus-title">属性加成</div>
                  <div class="bonus-list">
                    <div 
                      v-for="bonus in getAchieveBonus(achieve.name)" 
                      :key="bonus.key"
                      class="bonus-item"
                    >
                      <span class="bonus-key">{{ bonus.key }}</span>
                      <span class="bonus-value">{{ bonus.value }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-popover>
          </div>
          <div v-else class="no-data">
            <p>暂无成就数据</p>
          </div>
          
          <!-- 分页组件 -->
          <div v-if="achieveList.length > pageSize" class="pagination-section">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[20, 50, 100, 200]"
              :total="achieveList.length"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
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
import { computed, ref } from 'vue'
import { useArchiveStore } from '@/stores/archive'
import type { Achieve, AchieveItem } from '@/types/archive/module/achieve'
import { Trophy, List, Star, Check, Clock, Search, Refresh, TrendCharts, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import achieveClassData from '@/assets/data/achieves/achieveClass.json'
import { getFormattedBonusList } from '@/utils/translate'
import { getAchieveSvg } from '@/utils/backgroundImages'
import JsonViewer from '@/components/JsonViewer.vue'

const archiveStore = useArchiveStore()

// 响应式数据
const searchText = ref('')
const selectedCategory = ref('')
const selectedSubcategory = ref('')
const showCompleted = ref('all') // all, completed, pending
const currentPage = ref(1)
const pageSize = ref(50) // 每页显示50个成就
const bonusExpanded = ref(true) // 默认展开状态

// 获取成就模块数据
const data = computed((): Achieve | null => {
  return archiveStore.getModuleData('achieve') as Achieve | null
})

// 获取中文名称
const getChineseName = (achieveName: string) => {
  const achieveInfo = achieveClassData[achieveName as keyof typeof achieveClassData]
  return achieveInfo?.cnName || achieveName
}

// 获取成就描述
const getAchieveDescription = (achieveName: string) => {
  const achieveInfo = achieveClassData[achieveName as keyof typeof achieveClassData]
  return achieveInfo?.description || ''
}

// 获取成就分类
const getAchieveCategory = (achieveName: string) => {
  const achieveInfo = achieveClassData[achieveName as keyof typeof achieveClassData]
  return {
    category: achieveInfo?.category || '未知',
    subcategory: achieveInfo?.subcategory || '未知'
  }
}


// 获取所有分类
const allCategories = computed(() => {
  const categories = new Set<string>()
  const subcategories = new Set<string>()
  
  Object.values(achieveClassData).forEach(achieve => {
    if (achieve.category) categories.add(achieve.category)
    if (achieve.subcategory) subcategories.add(achieve.subcategory)
  })
  
  return {
    categories: Array.from(categories).sort(),
    subcategories: Array.from(subcategories).sort()
  }
})

// 过滤后的成就列表
const filteredAchieveList = computed((): AchieveItem[] => {
  if (!data.value?.obj) return []
  
  let achieves = Object.values(data.value.obj)
  
  // 搜索过滤
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase()
    achieves = achieves.filter(achieve => {
      const chineseName = getChineseName(achieve.name)
      return chineseName.toLowerCase().includes(searchLower)
    })
  }
  
  // 分类过滤
  if (selectedCategory.value) {
    achieves = achieves.filter(achieve => {
      const { category } = getAchieveCategory(achieve.name)
      return category === selectedCategory.value
    })
  }
  
  // 子分类过滤
  if (selectedSubcategory.value) {
    achieves = achieves.filter(achieve => {
      const { subcategory } = getAchieveCategory(achieve.name)
      return subcategory === selectedSubcategory.value
    })
  }
  
  // 完成状态过滤
  if (showCompleted.value === 'completed') {
    achieves = achieves.filter(achieve => achieve.state)
  } else if (showCompleted.value === 'pending') {
    achieves = achieves.filter(achieve => !achieve.state)
  } else if (showCompleted.value === 'wearing') {
    achieves = achieves.filter(achieve => achieve.wearB)
  }
  
  return achieves
})

// 成就列表（使用过滤后的数据）
const achieveList = computed((): AchieveItem[] => {
  return filteredAchieveList.value
})

// 分页后的成就列表
const paginatedAchieveList = computed((): AchieveItem[] => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return achieveList.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(achieveList.value.length / pageSize.value)
})

// 已完成成就加成
const completedAchievesBonus = computed(() => {
  if (!data.value) return []
  const bonus = data.value.getCompletedAchievesBonus()
  return getFormattedBonusList(bonus)
})

// 佩戴成就加成
const equipedAchievesBonus = computed(() => {
  if (!data.value) return []
  const bonus = data.value.getEquipedAchievesRoleBonus()
  return getFormattedBonusList(bonus)
})

// 成就统计
const achieveStats = computed(() => [
  {
    key: 'total',
    label: '成就总数',
    value: achieveList.value.length,
    icon: Trophy,
    iconClass: 'text-primary',
    valueClass: 'text-primary'
  },
  {
    key: 'completed',
    label: '已完成',
    value: achieveList.value.filter(achieve => achieve.state).length,
    icon: Check,
    iconClass: 'text-success',
    valueClass: 'text-success'
  },
  {
    key: 'wearing',
    label: '佩戴中',
    value: achieveList.value.filter(achieve => achieve.wearB).length,
    icon: Star,
    iconClass: 'text-warning',
    valueClass: 'text-warning'
  },
  {
    key: 'pending',
    label: '进行中',
    value: achieveList.value.filter(achieve => !achieve.state).length,
    icon: Clock,
    iconClass: 'text-info',
    valueClass: 'text-info'
  }
])

// 获取成就属性加成
const getAchieveBonus = (achieveName: string) => {
  const achieveInfo = achieveClassData[achieveName as keyof typeof achieveClassData]
  if (!achieveInfo?.roleBonus || Object.keys(achieveInfo.roleBonus).length === 0) {
    return []
  }
  
  return getFormattedBonusList(achieveInfo.roleBonus)
}

// 重置筛选器
const resetFilters = () => {
  searchText.value = ''
  selectedCategory.value = ''
  selectedSubcategory.value = ''
  showCompleted.value = 'all'
  currentPage.value = 1
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 切换加成统计展开/收缩
const toggleBonusExpanded = () => {
  bonusExpanded.value = !bonusExpanded.value
}

// JSON数据
const jsonData = computed(() => {
  return JSON.stringify(data.value, null, 2)
})
</script>

<style scoped>
.achieve-module {
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

.achieve-stats {
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

.text-info {
  color: #909399 !important;
}

.achieve-list-section,
.data-section {
  margin-top: 24px;
}

.filter-section {
  margin-bottom: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}

.achieve-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 8px;
}

.achieve-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.achieve-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.achieve-item.completed {
  border-color: #67c23a;
  background: #f0f9ff;
}

.achieve-item.wearing {
  border-color: #e6a23c;
  background: #fdf6ec;
}

.achieve-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f5f7fa;
}

.achieve-svg-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.achieve-info {
  flex: 1;
}

.achieve-name {
  font-weight: 600;
  margin-bottom: 2px;
  color: #303133;
  font-size: 13px;
}

.achieve-desc {
  font-size: 11px;
  color: #606266;
  margin-bottom: 4px;
  line-height: 1.3;
}

.achieve-progress {
  font-size: 10px;
  color: #909399;
}

.achieve-category {
  display: flex;
  gap: 2px;
  margin-top: 4px;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding: 16px 0;
}

.achieve-bonus-section {
  margin: 24px 0;
}

.expand-button {
  margin-left: 12px;
  color: #409eff;
  font-size: 14px;
}

.expand-button:hover {
  color: #66b1ff;
}

.bonus-content-wrapper {
  margin-top: 16px;
}

.bonus-card {
  height: 100%;
}

.bonus-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.bonus-icon {
  font-size: 20px;
  color: #409eff;
}

.bonus-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.bonus-content {
  min-height: 60px;
}

.bonus-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.bonus-item:last-child {
  border-bottom: none;
}

.bonus-key {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.bonus-value {
  font-size: 14px;
  color: #67c23a;
  font-weight: 600;
}

.no-bonus {
  text-align: center;
  color: #909399;
  font-size: 14px;
  padding: 20px 0;
}

.bonus-card.compact {
  padding: 12px;
}

.bonus-header-compact {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.bonus-content-compact {
  min-height: 40px;
}

.bonus-item-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 12px;
}

.bonus-item-compact:last-child {
  border-bottom: none;
}

.bonus-item-compact .bonus-key {
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

.bonus-item-compact .bonus-value {
  font-size: 12px;
  color: #67c23a;
  font-weight: 600;
}

.no-bonus-compact {
  text-align: center;
  color: #909399;
  font-size: 12px;
  padding: 10px 0;
}

.bonus-content-two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  min-height: 40px;
}

.json-viewer {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
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
  .achieve-module {
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
  
  .achieve-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
.achieve-popover .el-popover {
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.achieve-popover-content {
  padding: 16px;
  background: white;
  border-radius: 8px;
}

.popover-header {
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.popover-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.popover-category {
  display: flex;
  gap: 6px;
}

.popover-description {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 12px;
}

.popover-bonus {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 12px;
}

.bonus-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.bonus-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bonus-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.bonus-key {
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

.bonus-value {
  font-size: 12px;
  color: #67c23a;
  font-weight: 600;
}
</style>
