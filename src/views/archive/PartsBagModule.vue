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
            class="item-card"
            :class="{
              'item-new': item.newB,
              'item-auto-use': item.autoUseB,
              [`item-${item.color}`]: true
            }"
            :style="getItemBackgroundStyle(item)"
          >
            <!-- 新物品标记 -->
            <div v-if="item.newB" class="new-item-badge">
              <el-icon class="new-icon"><Star /></el-icon>
            </div>
            
            <div class="item-content">
              <!-- 物品图像 -->
              <div class="item-image">
                <img 
                  :src="getItemImage(item)" 
                  :alt="item.cnName"
                  class="item-img"
                />
                <div class="item-level-overlay">{{ item.itemsLevel }}</div>
              </div>
              <div class="item-name">{{ item.cnName }}</div>
              <div class="item-quantity">
                <el-icon><Box /></el-icon>
                <span>{{ item.nowNum }}</span>
              </div>
            </div>
            
            <div class="item-footer">
              <div class="item-flags">
                <el-tag v-if="item.newB" type="warning" size="small">新</el-tag>
                <el-tag v-if="item.autoUseB" type="info" size="small">自动</el-tag>
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



// 获取物品背景样式
const getItemBackgroundStyle = (item: PartsItem) => {
  const colorMap: Record<string, string> = {
    'darkgold': 'rgba(184, 134, 11, 0.3)', // 暗金色，透明度0.15
    'black': 'rgba(0, 0, 0, 0.15)', // 黑色，透明度0.15
    'red': 'rgba(245, 108, 108, 0.15)', // 红色，透明度0.15
    'purple': 'rgba(142, 68, 173, 0.15)', // 紫色，透明度0.15
    'blue': 'rgba(64, 158, 255, 0.15)', // 蓝色，透明度0.15
    'green': 'rgba(103, 194, 58, 0.15)', // 绿色，透明度0.15
    'white': 'rgba(144, 147, 153, 0.15)', // 白色，透明度0.15
    'orange': 'rgba(255, 140, 0, 0.15)' // 橙色，使用更鲜明的橙色
  }
  
  const backgroundColor = colorMap[item.color] || 'rgba(144, 147, 153, 0.15)'
  return {
    backgroundColor: backgroundColor,
    backgroundImage: `linear-gradient(135deg, ${backgroundColor} 0%, transparent 100%)`
  }
}

// 获取物品图像
const getItemImage = (item: PartsItem) => {
  // 如果是loaderParts类型
  if (item.name === 'loaderParts') {
    // 如果等级小于69，都使用loaderParts_69.png
    if (item.itemsLevel < 69) {
      return new URL('@/assets/images/parts/loaderParts_69.png', import.meta.url).href
    }
    // 否则使用对应等级的图像
    //不知道为什么，拼接  @/assets不起作用
    return new URL(`../../assets/images/parts/loaderParts_${item.itemsLevel}.png`, import.meta.url).href
  }
  
  // 如果不是loaderParts，使用对应名称的图像（暂时返回默认图像）
  return new URL(`../../assets/images/parts/${item.name}_${item.itemsLevel}.png`, import.meta.url).href
}


// 监听数据变化，重置分页
watch(() => data.value, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.parts-bag-module {
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
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 24px;
}

.item-card {
  background: #fff;
  border: 2px solid #e4e7ed;
  border-radius: 6px;
  padding: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  min-height: 100px;
  display: flex;
  flex-direction: column;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-card.item-new {
  border-color: #e6a23c;
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
  box-shadow: 0 0 8px rgba(230, 162, 60, 0.3);
}

.item-card.item-auto-use {
  border-color: #e6a23c;
}

.item-card.item-white {
  border-left: 4px solid #909399;
}

.item-card.item-green {
  border-left: 4px solid #67c23a;
}

.item-card.item-blue {
  border-left: 4px solid #409eff;
}

.item-card.item-purple {
  border-left: 4px solid #8e44ad;
}

.item-card.item-orange {
  border-left: 4px solid #e6a23c;
}

.item-card.item-red {
  border-left: 4px solid #f56c6c;
}

.item-card.item-darkgold {
  border-left: 4px solid #b8860b;
}

.item-card.item-black {
  border-left: 4px solid #000;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.item-level {
  background: #409eff;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.item-type-tag {
  font-size: 10px;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.item-image {
  width: 40px;
  height: 40px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.item-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.item-img:hover {
  transform: scale(1.1);
}

.item-level-overlay {
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
  z-index: 10;
}

.item-name {
  font-size: 12px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
  text-align: center;
  line-height: 1.2;
}

.item-quantity {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 11px;
  color: #606266;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}


.item-flags {
  display: flex;
  gap: 4px;
}

.new-item-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e6a23c;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(230, 162, 60, 0.4);
  animation: pulse 2s infinite;
  z-index: 10;
}

.new-icon {
  font-size: 14px;
  animation: rotate 2s linear infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(230, 162, 60, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(230, 162, 60, 0.6);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(230, 162, 60, 0.4);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.data-section {
  margin-top: 24px;
}

.json-viewer {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 1200px) {
  .items-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (max-width: 768px) {
  .parts-bag-module {
    padding: 16px;
  }
  
  .items-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .item-card {
    min-height: 100px;
    padding: 8px;
  }
  
  .item-name {
    font-size: 12px;
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

@media (max-width: 480px) {
  .items-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
