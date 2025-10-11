<template>
  <div class="things-bag-module">
    <div class="module-header">
      <h2>物品背包</h2>
      <div class="bag-info">
        <span>总物品数: {{ thingsBag?.arr?.length || 0 }}</span>
        <span>最大抓取数: {{ thingsBag?.gripMaxNum || 0 }}</span>
      </div>
    </div>
    
    <!-- 过滤和搜索 -->
    <div class="filter-section">
      <div class="filter-row">
        <el-select
          v-model="selectedCategory"
          placeholder="选择分类"
          clearable
          style="width: 150px"
          @change="handleCategoryChange"
          filterable
        >
          <el-option
            v-for="category in categories"
            :key="category"
            :label="category"
            :value="category"
          />
        </el-select>
        
        <el-select
          v-model="selectedSubcategory"
          placeholder="选择子分类"
          clearable
          style="width: 150px"
          :disabled="!selectedCategory"
          filterable
        >
          <el-option
            v-for="subcategory in subcategories"
            :key="subcategory"
            :label="subcategory"
            :value="subcategory"
          />
        </el-select>
        
        <el-input
          v-model="searchText"
          placeholder="搜索物品名称"
          clearable
          style="width: 200px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select
          v-model="sortBy"
          placeholder="排序方式"
          style="width: 120px"
        >
          <el-option label="默认" value="" />
          <el-option label="数量↑" value="quantity-asc" />
          <el-option label="数量↓" value="quantity-desc" />
          <el-option label="等级↑" value="level-asc" />
          <el-option label="等级↓" value="level-desc" />
          <el-option label="名称A-Z" value="name-asc" />
          <el-option label="名称Z-A" value="name-desc" />
        </el-select>
        
        <el-button 
          @click="resetFilters"
          type="default"
          size="default"
          :icon="Refresh"
        >
          重置
        </el-button>
        
        <el-button 
          @click="toggleViewMode"
          type="primary"
          size="default"
        >
          {{ viewMode === 'grid' ? '列表视图' : '网格视图' }}
        </el-button>
      </div>
      
      <!-- 统计信息 -->
      <div class="stats-row">
        <span class="stat-item">
          显示 {{ paginatedItems.length }} / {{ filteredItems.length }} 个物品
        </span>
        <span class="stat-item" v-if="selectedCategory">
          分类: {{ selectedCategory }}
        </span>
        <span class="stat-item" v-if="selectedSubcategory">
          子分类: {{ selectedSubcategory }}
        </span>
        <span class="stat-item" v-if="searchText">
          搜索: "{{ searchText }}"
        </span>
      </div>
    </div>
    
    <div :class="viewMode === 'grid' ? 'items-grid' : 'items-list'">
      <div 
        v-for="item in paginatedItems"
        :key="item.id"
        :class="[
          viewMode === 'grid' ? 'item-slot' : 'item-list-item',
          { 'new-item': item.newB, 'locked': item.lockB }
        ]"
      >
        <!-- 物品图片和背景 -->
        <el-popover
          placement="top"
          :width="300"
          trigger="hover"
          :title="getItemDisplayName(item)"
        >
          <template #reference>
            <div 
              class="item-image"
              :style="getItemBackgroundStyle(item)"
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
          </template>
        
          <!-- Popover内容 -->
          <div class="item-details">
            <div class="detail-section">
              <h4>基本信息</h4>
              <div class="detail-row">
                <span class="label">名称:</span>
                <span class="value">{{ getItemDisplayName(item) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">类型:</span>
                <el-tag :type="getItemTypeTagType(item.itemsType) as any" size="small">
                  {{ getItemTypeName(item.itemsType) }}
                </el-tag>
              </div>
              <div class="detail-row" v-if="item.itemsLevel > 1">
                <span class="label">等级:</span>
                <span class="value">Lv.{{ item.itemsLevel }}</span>
              </div>
              <div class="detail-row">
                <span class="label">数量:</span>
                <span class="value">{{ item.nowNum || 1 }}</span>
              </div>
              <div class="detail-row">
                <span class="label">品质:</span>
                 <el-tag :type="getColorTagType(item.color) as any" size="small">
                   {{ translateColorName(item.color) }}
                 </el-tag>
              </div>
            </div>
            
            <div class="detail-section" v-if="getItemDescription(item.itemsType, item.name)">
              <h4>描述</h4>
              <div class="description">{{ getItemDescription(item.itemsType, item.name) }}</div>
            </div>
          </div>
        </el-popover>
        
        <!-- 物品信息 -->
        <div class="item-info">
          <div class="item-name" :title="getItemFullName(item)">
            {{ getItemDisplayName(item) }}
          </div>
          <div class="item-meta">
            <div class="item-level" v-if="item.itemsLevel > 1">
              Lv.{{ item.itemsLevel }}
            </div>
            <el-tag 
              :type="getItemTypeTagType(item.itemsType) as any" 
              size="small"
              class="item-type-tag"
            >
              {{ getItemTypeName(item.itemsType) }}
            </el-tag>
            <!-- 列表视图额外信息 -->
            <div v-if="viewMode === 'list'" class="list-extra-info">
              <span class="quantity-info">数量: {{ item.nowNum || 1 }}</span>
               <el-tag 
                 :type="getColorTagType(item.color) as any" 
                 size="small"
                 class="color-tag"
               >
                 {{ translateColorName(item.color) }}
               </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 分页 -->
    <div v-if="filteredItems.length > 0" class="pagination-section">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[48, 96]"
        :total="filteredItems.length"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <!-- 空状态 -->
    <div v-if="!filteredItems.length && thingsBag?.arr?.length" class="empty-state">
      <el-empty description="没有找到符合条件的物品" />
    </div>
    <div v-else-if="!thingsBag?.arr?.length" class="empty-state">
      <el-empty description="背包为空" />
    </div>
    
    <!-- 详细数据 -->
    <JsonViewer 
      :json-data="jsonData"
      title="详细数据"
      collapse-title="查看完整JSON数据"
      :rows="10"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useArchiveStore } from '@/stores/archive'
import { getItemCnName, getItemDescription, getItemFullInfo } from '@/utils/translate'
import { getThingsBackgroundStyle } from '@/utils/backgroundImages'
import { getColorTagType, translateColorName } from '@/utils/colorUtils'
import { ThingsBag } from '@/types/archive/module/things'
import JsonViewer from '@/components/JsonViewer.vue'
import { Search, Refresh } from '@element-plus/icons-vue'

const archiveStore = useArchiveStore()

// 获取ThingsBag数据
const thingsBag = computed((): ThingsBag | null => {
  return archiveStore.getModuleData('thingsBag') as ThingsBag | null
})

// 获取JSON数据用于JsonViewer
const jsonData = computed(() => {
  return thingsBag.value ? JSON.stringify(thingsBag.value, null, 2) : '{}'
})

// 过滤和搜索
const selectedCategory = ref('')
const selectedSubcategory = ref('')
const searchText = ref('')
const sortBy = ref('quantity-desc')

// 分页
const currentPage = ref(1)
const pageSize = ref(48)

// 分类数据
const categories = ref<string[]>([])
const subcategories = ref<string[]>([])

// 分类缓存 - 避免重复遍历
const categoryMap = new Map<string, Set<string>>() // category -> subcategories

// 视图模式
const viewMode = ref<'grid' | 'list'>('grid')

// 初始化分类数据
const initializeCategories = () => {
  if (!thingsBag.value?.arr) return
  
  // 清空缓存
  categoryMap.clear()
  
  const cats = new Set<string>()
  
  thingsBag.value.arr.forEach(item => {
    const itemInfo = getItemFullInfo(item.itemsType, item.name)
    const category = itemInfo?.originalData?.category || ''
    const subcategory = itemInfo?.originalData?.subcategory || ''
    
    if (category) {
      cats.add(category)
      
      // 构建分类到子分类的映射
      if (!categoryMap.has(category)) {
        categoryMap.set(category, new Set<string>())
      }
      
      if (subcategory) {
        categoryMap.get(category)!.add(subcategory)
      }
    }
  })
  
  categories.value = Array.from(cats).sort()
}

// 更新子分类 - 使用缓存数据
const updateSubcategories = () => {
  if (!selectedCategory.value) {
    subcategories.value = []
    return
  }
  
  // 直接从缓存中获取子分类
  const subcats = categoryMap.get(selectedCategory.value)
  subcategories.value = subcats ? Array.from(subcats).sort() : []
}


// 过滤后的物品
const filteredItems = computed(() => {
  if (!thingsBag.value?.arr) return []
  
  let items = thingsBag.value.arr.filter(item => {
    // 搜索过滤
    if (searchText.value) {
      const itemName = getItemDisplayName(item).toLowerCase()
      if (!itemName.includes(searchText.value.toLowerCase())) {
        return false
      }
    }
    
    // 分类过滤
    if (selectedCategory.value) {
      const itemInfo = getItemFullInfo(item.itemsType, item.name)
      if (itemInfo?.originalData?.category !== selectedCategory.value) {
        return false
      }
    }
    
    // 子分类过滤
    if (selectedSubcategory.value) {
      const itemInfo = getItemFullInfo(item.itemsType, item.name)
      if (itemInfo?.originalData?.subcategory !== selectedSubcategory.value) {
        return false
      }
    }
    
    return true
  })
  
  // 排序
  if (sortBy.value) {
    items = items.sort((a, b) => {
      switch (sortBy.value) {
        case 'quantity-asc':
          return (a.nowNum || 1) - (b.nowNum || 1)
        case 'quantity-desc':
          return (b.nowNum || 1) - (a.nowNum || 1)
        case 'level-asc':
          return (a.itemsLevel || 1) - (b.itemsLevel || 1)
        case 'level-desc':
          return (b.itemsLevel || 1) - (a.itemsLevel || 1)
        case 'name-asc':
          return getItemDisplayName(a).localeCompare(getItemDisplayName(b))
        case 'name-desc':
          return getItemDisplayName(b).localeCompare(getItemDisplayName(a))
        default:
          return 0
      }
    })
  }
  
  return items
})

// 分页后的物品
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

// 处理分类变化
const handleCategoryChange = () => {
  selectedSubcategory.value = ''
  currentPage.value = 1
  updateSubcategories()
}

// 监听数据变化，自动初始化分类
watch(thingsBag, (newBag) => {
  if (newBag?.arr) {
    nextTick(() => {
      initializeCategories()
    })
  }
}, { immediate: true, deep: true })

// 处理分页变化
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  currentPage.value = 1
}

const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage
}

// 切换视图模式
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

// 重置所有过滤条件
const resetFilters = () => {
  selectedCategory.value = ''
  selectedSubcategory.value = ''
  searchText.value = ''
  sortBy.value = 'quantity-desc'
  currentPage.value = 1
  subcategories.value = []
}

// 常量定义
const ITEM_TYPE_CONFIG = {
  skillChip: { tagType: 'success', name: '技能碎片' },
  normalChip: { tagType: 'info', name: '普通碎片' },
  materials: { tagType: 'warning', name: '材料' },
  props: { tagType: 'danger', name: '道具' },
  rareChip: { tagType: 'primary', name: '稀有碎片' },
  blackChip: { tagType: 'dark', name: '黑色碎片' }
} as const

/**
 * 获取物品背景样式
 */
function getItemBackgroundStyle(item: any) {
  return getThingsBackgroundStyle(
    { name: item.name, partType: item.itemsType || 'materials',imgName:item.imgName }, 
    item.color || 'white'
  )
}

/**
 * 获取物品显示名称（使用翻译功能）
 */
function getItemDisplayName(item: any): string {
  if (!item.itemsType || !item.name) return item.cnName || '未知物品'
  
  const translatedName = getItemCnName(item.itemsType, item.name)
  return translatedName !== item.name ? translatedName : (item.cnName || item.name)
}

/**
 * 获取物品完整名称（用于tooltip）
 */
function getItemFullName(item: any): string {
  if (!item.itemsType || !item.name) return item.cnName || '未知物品'
  
  const translatedName = getItemCnName(item.itemsType, item.name)
  const description = getItemDescription(item.itemsType, item.name)
  
  let fullName = translatedName !== item.name ? translatedName : (item.cnName || item.name)
  
  if (description) {
    fullName += `\n${description}`
  }
  
  return fullName
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
 * 获取物品类型标签类型
 */
function getItemTypeTagType(itemsType: string): string {
  return ITEM_TYPE_CONFIG[itemsType as keyof typeof ITEM_TYPE_CONFIG]?.tagType || 'info'
}

/**
 * 获取物品类型名称
 */
function getItemTypeName(itemsType: string): string {
  return ITEM_TYPE_CONFIG[itemsType as keyof typeof ITEM_TYPE_CONFIG]?.name || itemsType
}
</script>

<style scoped>
.things-bag-module {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.module-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.bag-info {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 14px;
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

.stats-row {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 10px;
}

.stat-item {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 5px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.item-list-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fafafa;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.item-list-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
  transform: translateY(-1px);
}

.item-list-item .item-image {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  margin-bottom: 0;
}

.item-list-item .item-info {
  flex: 1;
  text-align: left;
}

.item-list-item .item-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  max-width: none;
}

.item-list-item .item-meta {
  justify-content: flex-start;
  gap: 8px;
}

.list-extra-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.quantity-info {
  font-size: 12px;
  color: #666;
}

.color-tag {
  font-size: 10px;
  height: 16px;
  line-height: 14px;
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

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Popover内容样式 */
.item-details {
  max-width: 280px;
}

.detail-section {
  margin-bottom: 15px;
}

.detail-section h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}

.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  gap: 8px;
}

.detail-row .label {
  font-weight: 500;
  color: #666;
  min-width: 50px;
  font-size: 12px;
}

.detail-row .value {
  color: #333;
  font-size: 12px;
}

.description {
  color: #666;
  font-size: 12px;
  line-height: 1.4;
  max-height: 100px;
  overflow-y: auto;
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
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    padding: 15px;
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
    gap: 8px;
    padding: 10px;
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