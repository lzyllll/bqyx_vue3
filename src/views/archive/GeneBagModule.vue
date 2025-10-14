<template>
  <div class="gene-bag-module">
    <el-card class="module-card">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><MagicStick /></el-icon>
          <div>
            <h2>基因背包</h2>
            <p class="module-desc">基因物品管理和查看</p>
          </div>
        </div>
      </template>
      
      <!-- 背包统计信息 -->
      <StatsCards :stats="geneStats" />
      
      <!-- 基因总加成 -->
      <BonusDisplay 
        :bonus-list="getTotalGeneBonus()"
        title="基因总加成"
        subtitle="基因属性总加成"
        empty-text="暂无基因加成"
        :compact="false"
      />
      
      <!-- 筛选和搜索 -->
      <div class="filter-section">
        <el-row :gutter="20" class="mb-20">
          <el-col :span="6">
            <el-input
              v-model="searchText"
              placeholder="搜索基因名称"
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
              <el-option 
                v-for="color in availableColors" 
                :key="color" 
                :label="translateColorName(color)" 
                :value="color" 
              />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="selectedType" placeholder="选择类型" clearable @change="handleFilter">
              <el-option label="全部" value="" />
              <el-option label="天赋技能" value="talent" />
              <el-option label="后天技能" value="later" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="sortBy" placeholder="排序方式" @change="handleSort">
              <el-option label="默认" value="default" />
              <el-option label="等级降序" value="level-desc" />
              <el-option label="等级升序" value="level-asc" />
              <el-option label="品质排序" value="color" />
              <el-option label="名称排序" value="name" />
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
      
      <!-- 基因网格 -->
      <div class="items-section">
        <el-divider content-position="left">
          <el-icon><Grid /></el-icon>
          <span>基因列表</span>
        </el-divider>
        
        <div class="items-grid">
          <GeneItemComponent 
            v-for="gene in paginatedItems" 
            :key="gene?.id"
            :gene="gene"
          />
        </div>
        
        <!-- 分页 -->
        <div class="pagination-section">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[48, 96, 144]"
            :total="filteredItems.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-if="!filteredItems.length && geneBag?.arr?.length" class="empty-state">
        <el-empty description="没有找到符合条件的基因" />
      </div>
      <div v-else-if="!geneBag?.arr?.length" class="empty-state">
        <el-empty description="基因背包为空" />
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
import { Grid, Search, Refresh, Collection, Star, Setting, Trophy, MagicStick } from '@element-plus/icons-vue'
import { GeneBag, GeneItem } from '@/types/archive/module/gene'
import { translateColorName, getColorTagType } from '@/utils/colorUtils'
import { getFormattedBonusList } from '@/utils/translate'
import StatsCards from '@/components/StatsCards.vue'
import BonusDisplay from '@/components/BonusDisplay.vue'
import GeneItemComponent from '@/components/GeneItem.vue'
import JsonViewer from '@/components/JsonViewer.vue'

const archiveStore = useArchiveStore()

// 获取基因背包数据
const geneBag = computed((): GeneBag | null => {
  return archiveStore.getModuleData('geneBag') as GeneBag | null
})

// 响应式数据
const searchText = ref('')
const selectedColor = ref('')
const selectedType = ref('')
const sortBy = ref('level-desc')
const currentPage = ref(1)
const pageSize = ref(48)

// 基因统计信息
const geneStats = computed(() => [
  {
    key: 'totalGenes',
    label: '总基因数',
    value: geneBag.value?.arr?.length || 0,
    icon: MagicStick,
    iconClass: 'text-primary',
    valueClass: 'text-primary'
  },
  {
    key: 'maxCapacity',
    label: '最大容量',
    value: geneBag.value?.gripMaxNum || 0,
    icon: Setting,
    iconClass: 'text-warning',
    valueClass: 'text-warning'
  },
  {
    key: 'lockedCount',
    label: '锁定基因',
    value: geneBag.value?.arr?.filter(gene => gene.lockB).length || 0,
    icon: Trophy,
    iconClass: 'text-danger',
    valueClass: 'text-danger'
  },
  {
    key: 'newGenes',
    label: '新基因',
    value: geneBag.value?.arr?.filter(gene => gene.newB).length || 0,
    icon: Star,
    iconClass: 'text-success',
    valueClass: 'text-success'
  }
])

// 可用颜色列表
const availableColors = computed(() => {
  if (!geneBag.value?.arr) return []
  const colors = new Set<string>()
  geneBag.value.arr.forEach(gene => {
    if (gene.color) {
      colors.add(gene.color)
    }
  })
  return Array.from(colors).sort()
})

// 获取基因总属性加成
const getTotalGeneBonus = () => {
  if (!geneBag.value?.arr) return []
  
  const totalBonus: Record<string, number> = {}
  
  geneBag.value.arr.forEach(gene => {
    if (gene.obj) {
      Object.entries(gene.obj).forEach(([key, value]) => {
        if (typeof value === 'number') {
          totalBonus[key] = (totalBonus[key] || 0) + value
        }
      })
    }
  })
  
  return getFormattedBonusList(totalBonus)
}

// 过滤后的基因
const filteredItems = computed(() => {
  if (!geneBag.value?.arr) return []
  
  let items = [...geneBag.value.arr]
  
  // 搜索过滤
  if (searchText.value) {
    items = items.filter(gene => 
      gene.cnName?.toLowerCase().includes(searchText.value.toLowerCase()) ||
      gene.name?.toLowerCase().includes(searchText.value.toLowerCase())
    )
  }
  
  // 品质过滤
  if (selectedColor.value) {
    items = items.filter(gene => gene.color === selectedColor.value)
  }
  
  // 类型过滤
  if (selectedType.value) {
    if (selectedType.value === 'talent') {
      items = items.filter(gene => gene.talentSkillArr && gene.talentSkillArr.length > 0)
    } else if (selectedType.value === 'later') {
      items = items.filter(gene => gene.laterSkillArr && gene.laterSkillArr.length > 0)
    }
  }
  
  // 排序
  items = sortItems(items, sortBy.value)
  
  return items
})

// 分页后的基因
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

// JSON数据
const jsonData = computed(() => {
  if (!geneBag.value) return '{}'
  
  // 安全地序列化数据，处理 NaN 和 undefined 值
  const safeStringify = (obj: any): string => {
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'number' && isNaN(value)) {
        return null
      }
      if (value === undefined) {
        return null
      }
      return value
    }, 2)
  }
  
  return safeStringify(geneBag.value)
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
const sortItems = (items: GeneItem[], sortType: string) => {
  const sortedItems = [...items]
  
  switch (sortType) {
    case 'level-desc':
      return sortedItems.sort((a, b) => b.itemsLevel - a.itemsLevel)
    case 'level-asc':
      return sortedItems.sort((a, b) => a.itemsLevel - b.itemsLevel)
    case 'color':
      const colorOrder = ['yagold', 'purgold', 'darkgold', 'red', 'purple', 'blue', 'green', 'white']
      return sortedItems.sort((a, b) => {
        const aIndex = colorOrder.indexOf(a.color)
        const bIndex = colorOrder.indexOf(b.color)
        return aIndex - bIndex
      })
    case 'name':
      return sortedItems.sort((a, b) => a.cnName.localeCompare(b.cnName))
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

// 监听数据变化，重置分页
watch(() => geneBag.value, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.gene-bag-module {
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

.filter-section {
  margin-bottom: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}

.items-section {
  margin-top: 24px;
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

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 24px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 6px;
    padding: 8px;
  }
}
</style>
