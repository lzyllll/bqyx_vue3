<template>
  <div class="parts-bag-module">
    <el-card class="module-card">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Box /></el-icon>
          <div>
            <h2>零件背包</h2>
            <p class="module-desc">零件物品管理和查看</p>
          </div>
        </div>
      </template>
      
      <!-- 背包统计信息 -->
      <div class="bag-stats">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card class="stat-card" shadow="hover">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon class="text-primary"><Box /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-label">总物品数</div>
                  <div class="stat-value text-primary">{{ totalItems }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="stat-card" shadow="hover">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon class="text-success"><Grid /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-label">背包容量</div>
                  <div class="stat-value text-success">{{ gripMaxNum }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="stat-card" shadow="hover">
              <div class="stat-content">
                <div class="stat-icon">
                  <el-icon class="text-warning"><Collection /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-label">已使用</div>
                  <div class="stat-value text-warning">{{ usedSlots }}</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 物品网格 -->
      <div class="items-section">
        <el-divider content-position="left">
          <el-icon><Grid /></el-icon>
          <span>物品列表</span>
        </el-divider>
        
        <!-- 筛选和搜索 -->
        <div class="filter-section">
          <el-row :gutter="20" class="mb-20">
            <el-col :span="6">
              <el-input
                v-model="searchText"
                placeholder="搜索物品名称"
                clearable
                @input="handleSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-select v-model="selectedColor" placeholder="选择品质" clearable @change="handleFilter">
                <el-option label="全部" value="" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select v-model="selectedType" placeholder="选择类型" clearable @change="handleFilter">
                <el-option label="全部" value="" />
                <el-option label="普通零零件" value="loaderParts" />
                <el-option label="非普通零零件" value="UniqueParts" />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="sortBy" placeholder="排序方式" @change="handleSort">
                <el-option label="默认" value="default" />
                <el-option label="等级降序" value="level-desc" />
                <el-option label="等级升序" value="level-asc" />
                <el-option label="数量降序" value="quantity-desc" />
                <el-option label="数量升序" value="quantity-asc" />
                <el-option label="品质排序" value="color" />
                <el-option label="类型排序" value="type" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button @click="resetFilters" type="primary" plain>
                <el-icon><Refresh /></el-icon>
                重置
              </el-button>
            </el-col>
          </el-row>
        </div>
        
        <!-- 物品网格 -->
        <div class="items-grid">
          <div 
            v-for="item in paginatedItems" 
            :key="item.id"
            class="item-slot"
            :class="{ 'new-item': item.newB, 'locked': item.lockB }"
          >
            <!-- 物品图片和背景 -->
            <div 
              class="item-image"
              :style="getPartsBackgroundStyle(item, item.color)"
            >
              <!-- 物品数量显示 -->
              <div v-if="item.nowNum && item.nowNum > 1" class="item-count">
                {{ formatNumber(item.nowNum) }}
              </div>
              
              <!-- 新物品标识 -->
              <div v-if="item.newB" class="new-badge">新</div>
              
              <!-- 锁定标识 -->
              <div v-if="item.lockB" class="lock-badge">🔒</div>
            </div>
            
            <!-- 物品信息 -->
            <div class="item-info">
              <div class="item-name" :title="item.cnName">
                {{ item.cnName }}
              </div>
              <div class="item-meta">
                <div class="item-level" v-if="item.itemsLevel > 1">
                  Lv.{{ item.itemsLevel }}
                </div>
                <el-tag 
                  :type="getColorTagType(item.color) as any" 
                  size="small"
                  class="item-type-tag"
                >
                  {{ getColorName(item.color) }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div class="pagination-section">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[49]"
            :total="filteredItems.length"
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
import { computed, ref, watch } from 'vue'
import { useArchiveStore } from '@/stores/archive'
import { Box, Grid, Collection, Search, Refresh, Star } from '@element-plus/icons-vue'
import { getPartsBackgroundStyle } from '@/utils/backgroundImages'

import { PartsBag, PartsItem } from '@/types/archive/module/parts'
import JsonViewer from '@/components/JsonViewer.vue'

const archiveStore = useArchiveStore()

// 获取零件背包数据
const data = computed((): PartsBag | null => {
  return archiveStore.getModuleData('partsBag') as PartsBag | null
})

// 响应式数据
const searchText = ref('')
const selectedColor = ref('')
const selectedType = ref('')
const sortBy = ref('level-desc')
const currentPage = ref(1)
const pageSize = ref(49) // 7行7列 = 49

// 计算属性
const totalItems = computed(() => data.value?.arr?.length || 0)
const gripMaxNum = computed(() => data.value?.gripMaxNum || 0)
const usedSlots = computed(() => {
  if (!data.value?.arr) return 0
  return data.value.arr.filter(item => item.nowNum > 0).length
})

// 过滤后的物品
const filteredItems = computed(() => {
  if (!data.value?.arr) return []
  
  let items = [...data.value.arr]
  
  // 搜索过滤
  if (searchText.value) {
    items = items.filter(item => 
      item.cnName.toLowerCase().includes(searchText.value.toLowerCase())
    )
  }
  
  // 品质过滤
  if (selectedColor.value) {
    items = items.filter(item => item.color === selectedColor.value)
  }
  
  // 类型过滤,普通零件和独特的零件
  if (selectedType.value) {
    if(selectedType.value === "loaderParts"){
      items = items.filter(item => item.name === "loaderParts")
    }
    else{
      items = items.filter(item => item.name !== "loaderParts")
    }
    
  }
  
  // 排序
  items = sortItems(items, sortBy.value)
  
  return items
})

// 分页后的物品
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

// JSON数据
const jsonData = computed(() => {
  return JSON.stringify(data.value, null, 2)
})

// 方法
const handleSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  searchText.value = ''
  selectedColor.value = ''
  selectedType.value = ''
  sortBy.value = 'level-desc'
  currentPage.value = 1
}

const handleSort = () => {
  currentPage.value = 1
}

// 排序函数
const sortItems = (items: PartsItem[], sortType: string) => {
  const sortedItems = [...items]
  
  switch (sortType) {
    case 'level-desc':
      return sortedItems.sort((a, b) => b.itemsLevel - a.itemsLevel)
    case 'level-asc':
      return sortedItems.sort((a, b) => a.itemsLevel - b.itemsLevel)
    case 'quantity-desc':
      return sortedItems.sort((a, b) => b.nowNum - a.nowNum)
    case 'quantity-asc':
      return sortedItems.sort((a, b) => a.nowNum - b.nowNum)
    case 'color':
      const colorOrder = ['darkgold','black', 'red', 'purple', 'blue', 'green', 'white']
      return sortedItems.sort((a, b) => {
        const aIndex = colorOrder.indexOf(a.color)
        const bIndex = colorOrder.indexOf(b.color)
        return aIndex - bIndex
      })
    case 'type':
      return sortedItems.sort((a, b) => {
        if (a.itemsType !== b.itemsType) {
          return a.itemsType.localeCompare(b.itemsType)
        }
        return b.itemsLevel - a.itemsLevel
      })
    default:
      return sortedItems
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

/**
 * 格式化数字显示
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * 获取颜色标签类型
 */
function getColorTagType(color: string): string {
  // 确保color不为空或undefined
  if (!color) return 'info'
  
  const colorMap: Record<string, string> = {
    'white': 'info',
    'green': 'success',
    'blue': 'primary',
    'purple': 'warning',
    'orange': 'danger',
    'red': 'danger',
    'black': 'info', // 改为info，因为el-tag不支持dark
    'darkgold': 'warning',
    'purgold': 'warning',
    'yagold': 'warning'
  }
  return colorMap[color] || 'info'
}

/**
 * 获取颜色名称
 */
function getColorName(color: string): string {
  // 确保color不为空或undefined
  if (!color) return '未知'
  
  const colorMap: Record<string, string> = {
    'white': '白色',
    'green': '绿色',
    'blue': '蓝色',
    'purple': '紫色',
    'orange': '橙色',
    'red': '红色',
    'black': '黑色',
    'darkgold': '暗金',
    'purgold': '紫金',
    'yagold': '雅金'
  }
  return colorMap[color] || color
}


// 监听数据变化，重置分页
watch(() => data.value, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.parts-bag-module {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
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

.bag-stats {
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

.items-section {
  margin-top: 24px;
}

.filter-section {
  margin-bottom: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 24px;
}

.item-slot {
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

.item-slot:hover {
  border-color: #409eff;
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.2);
  transform: translateY(-2px);
}

.item-slot.new-item {
  border-color: #67c23a;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
}

.item-slot.locked {
  opacity: 0.6;
  border-color: #f56c6c;
}

.item-image {
  width: 56px;
  height: 56px;
  position: relative;
  margin-bottom: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.item-count {
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

.new-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #67c23a;
  color: white;
  font-size: 8px;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: bold;
}

.lock-badge {
  position: absolute;
  top: -2px;
  left: -2px;
  font-size: 12px;
}

.item-info {
  text-align: center;
  width: 100%;
}

.item-name {
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

.item-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
}

.item-level {
  font-size: 10px;
  color: #666;
  background: #f0f0f0;
  padding: 1px 4px;
  border-radius: 3px;
  display: inline-block;
}

.item-type-tag {
  font-size: 9px;
  height: 18px;
  line-height: 16px;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
    padding: 10px;
  }
  
  .item-slot {
    padding: 8px;
  }
  
  .item-image {
    width: 48px;
    height: 48px;
  }
  
  .item-name {
    font-size: 11px;
    max-width: 80px;
  }
}

@media (max-width: 480px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 6px;
    padding: 8px;
  }
  
  .item-slot {
    padding: 6px;
  }
  
  .item-image {
    width: 40px;
    height: 40px;
  }
  
  .item-name {
    font-size: 10px;
    max-width: 60px;
  }
}
</style>
