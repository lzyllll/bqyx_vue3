<template>
  <div class="equip-house-module">
    <div class="module-header">
      <h2>装备仓库</h2>
    </div>
    
    <!-- 装备统计 -->
    <StatsCards :stats="equipStats" />
    
    <!-- 过滤和搜索 -->
    <div class="filter-section">
      <div class="filter-row">
        <el-select
          v-model="selectedPartType"
          placeholder="选择部位"
          clearable
          style="width: 150px"
          @change="handlePartTypeChange"
          filterable
        >
          <el-option
            v-for="partType in partTypes"
            :key="partType"
            :label="translateTypeName(partType)"
            :value="partType"
          />
        </el-select>
        
        <el-select
          v-model="selectedColor"
          placeholder="选择品质"
          clearable
          style="width: 150px"
          filterable
        >
          <el-option
            v-for="color in colors"
            :key="color"
            :label="translateColorName(color)"
            :value="color"
          />
        </el-select>
        
        <el-input
          v-model="searchText"
          placeholder="搜索装备名称"
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
          <el-option label="等级↑" value="level-asc" />
          <el-option label="等级↓" value="level-desc" />
          <el-option label="强化↑" value="strengthen-asc" />
          <el-option label="强化↓" value="strengthen-desc" />
          <el-option label="进化↑" value="evo-asc" />
          <el-option label="进化↓" value="evo-desc" />
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
          显示 {{ paginatedItems.length }} / {{ filteredItems.length }} 个装备
        </span>
        <span class="stat-item" v-if="selectedPartType">
          部位: {{ translateTypeName(selectedPartType) }}
        </span>
        <span class="stat-item" v-if="selectedColor">
          品质: {{ translateColorName(selectedColor) }}
        </span>
        <span class="stat-item" v-if="searchText">
          搜索: "{{ searchText }}"
        </span>
      </div>
    </div>
    
    <div :class="viewMode === 'grid' ? 'items-grid' : 'items-list'">
      <EquipItemComponent 
        v-for="equip in paginatedItems"
        :key="equip.id"
        :equip="equip"
        :view-mode="viewMode"
      />
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
    <div v-if="!filteredItems.length && equipHouse?.arr?.length" class="empty-state">
      <el-empty description="没有找到符合条件的装备" />
    </div>
    <div v-else-if="!equipHouse?.arr?.length" class="empty-state">
      <el-empty description="装备仓库为空" />
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
import { EquipHouse, EquipItem as EquipItemType } from '@/types/archive/module/equip'
import { getColorTagType, translateColorName } from '@/utils/colorUtils'
import { translateTypeName } from '@/utils/typeUtils'
import JsonViewer from '@/components/JsonViewer.vue'
import StatsCards from '@/components/StatsCards.vue'
import EquipItemComponent from '@/components/EquipItem.vue'
import { Search, Refresh, Box, Star, Setting, Trophy } from '@element-plus/icons-vue'

const archiveStore = useArchiveStore()

// 获取装备仓库数据
const equipHouse = computed((): EquipHouse | null => {
  return archiveStore.getModuleData('equipHouse') as EquipHouse | null
})

// 获取JSON数据用于JsonViewer
const jsonData = computed(() => {
  return equipHouse.value ? JSON.stringify(equipHouse.value, null, 2) : '{}'
})

// 装备统计
const equipStats = computed(() => [
  {
    key: 'totalEquips',
    label: '总装备数',
    value: equipHouse.value?.arr?.length || 0,
    icon: Box,
    iconClass: 'text-info',
    valueClass: 'text-info'
  },
  {
    key: 'maxCapacity',
    label: '最大容量',
    value: equipHouse.value?.gripMaxNum || 0,
    icon: Setting,
    iconClass: 'text-warning',
    valueClass: 'text-warning'
  },
  {
    key: 'lastId',
    label: '最后ID',
    value: equipHouse.value?.lastId || 0,
    icon: Star,
    iconClass: 'text-primary',
    valueClass: 'text-primary'
  },
  {
    key: 'lockedCount',
    label: '锁定装备',
    value: equipHouse.value?.arr?.filter(equip => equip.lockB).length || 0,
    icon: Trophy,
    iconClass: 'text-danger',
    valueClass: 'text-danger'
  }
])

// 过滤和搜索
const selectedPartType = ref('')
const selectedColor = ref('')
const searchText = ref('')
const sortBy = ref('level-desc')

// 分页
const currentPage = ref(1)
const pageSize = ref(48)

// 部位类型数据
const partTypes = ref<string[]>([])
const colors = ref<string[]>([])

// 视图模式
const viewMode = ref<'grid' | 'list'>('grid')

// 初始化部位类型数据
const initializePartTypes = () => {
  if (!equipHouse.value?.arr) return
  
  const parts = new Set<string>()
  const colorSet = new Set<string>()
  
  equipHouse.value.arr.forEach(equip => {
    if (equip.partType) {
      parts.add(equip.partType)
    }
    if (equip.color) {
      colorSet.add(equip.color)
    }
  })
  
  partTypes.value = Array.from(parts).sort()
  colors.value = Array.from(colorSet).sort()
}

// 过滤后的装备
const filteredItems = computed(() => {
  if (!equipHouse.value?.arr) return []
  
  let items = equipHouse.value.arr.filter(equip => {
    // 搜索过滤
    if (searchText.value) {
      const equipName = equip.cnName?.toLowerCase() || ''
      if (!equipName.includes(searchText.value.toLowerCase())) {
        return false
      }
    }
    
    // 部位过滤
    if (selectedPartType.value) {
      if (equip.partType !== selectedPartType.value) {
        return false
      }
    }
    
    // 品质过滤
    if (selectedColor.value) {
      if (equip.color !== selectedColor.value) {
        return false
      }
    }
    
    return true
  })
  
  // 排序
  if (sortBy.value) {
    items = items.sort((a, b) => {
      switch (sortBy.value) {
        case 'level-asc':
          return (a.itemsLevel || 1) - (b.itemsLevel || 1)
        case 'level-desc':
          return (b.itemsLevel || 1) - (a.itemsLevel || 1)
        case 'strengthen-asc':
          return (a.strengthenLv || 0) - (b.strengthenLv || 0)
        case 'strengthen-desc':
          return (b.strengthenLv || 0) - (a.strengthenLv || 0)
        case 'evo-asc':
          return (a.evoLv || 0) - (b.evoLv || 0)
        case 'evo-desc':
          return (b.evoLv || 0) - (a.evoLv || 0)
        case 'name-asc':
          return (a.cnName || '').localeCompare(b.cnName || '')
        case 'name-desc':
          return (b.cnName || '').localeCompare(a.cnName || '')
        default:
          return 0
      }
    })
  }
  
  return items
})

// 分页后的装备
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredItems.value.slice(start, end)
})

// 处理部位类型变化
const handlePartTypeChange = () => {
  currentPage.value = 1
}

// 监听数据变化，自动初始化部位类型分类字段
watch(equipHouse, (newHouse) => {
  if (newHouse?.arr) {
    nextTick(() => {
      initializePartTypes()
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
  selectedPartType.value = ''
  selectedColor.value = ''
  searchText.value = ''
  sortBy.value = 'level-desc'
  currentPage.value = 1
}
</script>

<style scoped>
.equip-house-module {
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

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
}

@media (max-width: 480px) {
  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
    padding: 10px;
  }
}
</style>
