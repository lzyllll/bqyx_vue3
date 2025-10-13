<template>
  <div class="pay-module">
    <div class="module-header">
      <h2>支付记录</h2>
      <div class="header-stats">
        <el-card class="stat-card">
          <div class="stat-item">
            <span class="stat-label">总记录数:</span>
            <span class="stat-value">{{ totalRecords }}</span>
          </div>
        </el-card>
        <el-card class="stat-card">
          <div class="stat-item">
            <span class="stat-label">总消费:</span>
            <span class="stat-value">{{ totalSpent }}</span>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filter-section">
      <el-card>
        <el-row :gutter="16">
          <el-col :span="6">
            <el-input
              v-model="searchText"
              placeholder="搜索商品名称"
              clearable
              @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="selectedCategory"
              placeholder="选择分类"
              clearable
              @change="handleCategoryChange"
            >
              <el-option
                v-for="category in availableCategories"
                :key="category"
                :label="category"
                :value="category"
              />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="selectedPriceType"
              placeholder="价格类型"
              clearable
              @change="handlePriceTypeChange"
            >
              <el-option label="银币" value="coin" />
              <el-option label="黄金" value="money" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="sortBy"
              placeholder="排序方式"
              @change="handleSortChange"
            >
              <el-option label="按时间排序" value="time" />
              <el-option label="按价格排序" value="price" />
              <el-option label="按名称排序" value="name" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button @click="resetFilters">重置筛选</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 支付记录列表 -->
    <div class="records-section">
      <el-card>
        <div v-if="filteredRecords.length === 0" class="empty-state">
          <el-empty description="暂无支付记录" />
        </div>
        <div v-else class="records-list">
          <div
            v-for="record in paginatedRecords"
            :key="record.id"
            class="record-item"
          >
            <div class="record-image">
              <div class="item-image">
                <!-- 商品图片 -->
                <img 
                  :src="getItemImageSrc(record)" 
                  class="item-svg-image"
                />
                <!-- 新商品标识 -->
                <div v-if="record.newB" class="new-badge">新</div>
              </div>
            </div>
            
            <div class="record-info">
              <div class="record-header">
                <h3 class="item-name">{{ record.cnName || record.name }}</h3>
                <div class="record-meta">
                  <el-tag
                    v-if="record.category"
                    :type="getCategoryTagType(record.category) as any"
                    size="small"
                  >
                    {{ record.category }}
                  </el-tag>
                  <el-tag
                    :type="getPriceTypeTagType(record.priceType) as any"
                    size="small"
                  >
                    {{ getPriceTypeName(record.priceType) }}
                  </el-tag>
                </div>
              </div>
              
              <div class="record-details">
                <div class="detail-row">
                  <span class="label">购买数量:</span>
                  <span class="value quantity-value">{{ record.quantity }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">单价:</span>
                  <span class="value price-value">{{ formatPrice(record.price, record.priceType) }}</span>
                </div>
                <div class="detail-row" v-if="record.buyLimitNum">
                  <span class="label">购买限制:</span>
                  <span class="value">{{ record.buyLimitNum }}次</span>
                </div>
                <div class="detail-row" v-if="record.dayBuyLimitNum">
                  <span class="label">每日限制:</span>
                  <span class="value">{{ record.dayBuyLimitNum }}次</span>
                </div>
                <div class="detail-row" v-if="record.endTime">
                  <span class="label">结束时间:</span>
                  <span class="value">{{ record.endTime }}</span>
                </div>
                <div class="detail-row" v-if="record.discount">
                  <span class="label">折扣:</span>
                  <span class="value discount-value">{{ (record.discount * 100).toFixed(0) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div v-if="filteredRecords.length > pageSize" class="pagination-section">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredRecords.length"
            layout="total, prev, pager, next, jumper"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useArchiveStore } from '@/stores/archive'
import { getThingsImage } from '@/utils/backgroundImages'
import { Search } from '@element-plus/icons-vue'

// 支付数据映射
const PAY_DATA_MAP: Record<string, any> = {}

// 初始化支付数据映射
const initPayDataMap = async () => {
  try {
    // 从 records.json 加载商品数据
    const recordsData = await import('@/assets/data/pay/records.json')
    if (recordsData?.normal?.types) {
      for (const typeName in recordsData.normal.types) {
        const categoryName = recordsData.normal.types[typeName].cnName || typeName
        recordsData.normal.types[typeName].forEach((item: any) => {
          if (item.propId) {
            PAY_DATA_MAP[item.propId] = { ...item, category: categoryName }
          }
        })
      }
    }
  } catch (error) {
    console.error('加载商品数据失败:', error)
  }
}

// 获取商品图片源
const getItemImageSrc = (record: any) => {
  const imageData = {
    name: record.name,
    partType: record.dataType || 'other',
    imgName: record.name
  }
  return getThingsImage(imageData)
}

// 获取分类标签类型
const getCategoryTagType = (category: string) => {
  const categoryMap: Record<string, string> = {
    '热门': 'danger',
    '道具': 'primary',
    '材料': 'success',
    '时装': 'warning',
    '载具': 'info',
    '武器': 'danger',
    '零件': 'success',
    '装备': 'primary',
    '其他': 'info'
  }
  return categoryMap[category] || 'info'
}

// 获取价格类型标签类型
const getPriceTypeTagType = (priceType: string) => {
  return priceType === 'coin' ? 'warning' : 'success'
}

// 获取价格类型名称
const getPriceTypeName = (priceType: string) => {
  return priceType === 'coin' ? '银币' : '黄金'
}

// 格式化价格
const formatPrice = (price: string | number, priceType: string) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  const unit = priceType === 'coin' ? '银币' : '黄金'
  return `${numPrice} ${unit}`
}

const archiveStore = useArchiveStore()

// 响应式数据
const payRecords = ref<any[]>([])
const searchText = ref('')
const selectedCategory = ref('')
const selectedPriceType = ref('')
const sortBy = ref('time')
const currentPage = ref(1)
const pageSize = ref(20)

// 计算属性
const totalRecords = computed(() => payRecords.value.length)

const totalSpent = computed(() => {
  return payRecords.value.reduce((total, record) => {
    const price = typeof record.price === 'string' ? parseFloat(record.price) : record.price
    const quantity = record.quantity || 1
    return total + ((price || 0) * quantity)
  }, 0)
})

const availableCategories = computed(() => {
  const categories = new Set<string>()
  payRecords.value.forEach(record => {
    if (record.category) {
      categories.add(record.category)
    }
  })
  return Array.from(categories).sort()
})

const filteredRecords = computed(() => {
  let filtered = [...payRecords.value]
  
  // 搜索过滤
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    filtered = filtered.filter(record => 
      (record.cnName && record.cnName.toLowerCase().includes(search)) ||
      (record.name && record.name.toLowerCase().includes(search))
    )
  }
  
  // 分类过滤
  if (selectedCategory.value) {
    filtered = filtered.filter(record => record.category === selectedCategory.value)
  }
  
  // 价格类型过滤
  if (selectedPriceType.value) {
    filtered = filtered.filter(record => record.priceType === selectedPriceType.value)
  }
  
  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'price':
        const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price
        const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price
        return priceB - priceA
      case 'name':
        return (a.cnName || a.name).localeCompare(b.cnName || b.name)
      case 'time':
      default:
        return 0 // 保持原有顺序
    }
  })
  
  return filtered
})

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRecords.value.slice(start, end)
})

// 方法
const handleSearch = () => {
  currentPage.value = 1
}

const handleCategoryChange = () => {
  currentPage.value = 1
}

const handlePriceTypeChange = () => {
  currentPage.value = 1
}

const handleSortChange = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  searchText.value = ''
  selectedCategory.value = ''
  selectedPriceType.value = ''
  sortBy.value = 'time'
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

// 生命周期
onMounted(async () => {
  try {
    // 先初始化商品数据映射
    await initPayDataMap()
    
    // 获取支付记录数据
    const payData = await archiveStore.getModuleData('pay')
    if (payData && payData.obj) {
      // 处理支付记录数据 - obj 是 Record<string, number> 格式
      const records: any[] = []
      
      // 遍历购买的物品记录
      for (const [itemId, quantity] of Object.entries(payData.obj)) {
        // 从映射中获取商品信息
        const itemInfo = PAY_DATA_MAP[itemId]
        if (itemInfo) {
          records.push({
            id: itemId,
            quantity: quantity,
            ...itemInfo
          })
        } else {
          // 如果没有找到商品信息，创建一个基本记录
          records.push({
            id: itemId,
            quantity: quantity,
            cnName: `商品 ${itemId}`,
            name: itemId,
            price: '0',
            priceType: 'coin'
          })
        }
      }
      
      payRecords.value = records
    }
  } catch (error) {
    console.error('加载支付记录失败:', error)
  }
})
</script>

<style scoped>
.pay-module {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 20px;
}

.module-header {
  margin-bottom: 20px;
}

.module-header h2 {
  margin: 0 0 16px 0;
  color: #333;
}

.header-stats {
  display: flex;
  gap: 16px;
}

.stat-card {
  flex: 1;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.filter-section {
  margin-bottom: 20px;
}

.records-section {
  margin-bottom: 20px;
}

.records-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.record-item {
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s;
}

.record-item:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.record-image {
  margin-right: 16px;
  flex-shrink: 0;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  position: relative;
  border: 2px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
}

.item-svg-image {
  width: 64px;
  height: 64px;
  object-fit: contain;
  background: transparent;
  border: none;
  outline: none;
}

.new-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f56c6c;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
}

.record-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.item-name {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.record-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.record-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.value {
  font-size: 14px;
  color: #333;
}

.price-value {
  font-weight: bold;
  color: #409eff;
}

.quantity-value {
  font-weight: bold;
  color: #67c23a;
}

.discount-value {
  color: #f56c6c;
  font-weight: bold;
}

.pagination-section {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .records-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .pay-module {
    padding: 10px;
  }
  
  .header-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .records-list {
    grid-template-columns: 1fr;
  }
  
  .record-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .record-image {
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .record-header {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  
  .record-details {
    grid-template-columns: 1fr;
  }
}
</style>
