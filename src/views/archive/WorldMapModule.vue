<template>
  <div class="worldmap-module">
    <el-card class="module-card">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><MapLocation /></el-icon>
          <div>
            <h2>世界地图模块</h2>
            <p class="module-desc">世界地图数据和挑战信息</p>
          </div>
        </div>
      </template>
      
        <!-- 地图统计 -->
        <StatsCards :stats="worldMapStats" :span="6" />
      
      <!-- 地图列表 -->
      <div class="map-list-section">
        <el-divider content-position="left">
          <el-icon><List /></el-icon>
          <span>地图列表</span>
        </el-divider>
        
        <!-- 搜索和筛选 -->
        <div class="filter-section">
          <el-row :gutter="20" class="filter-row">
            <el-col :span="8">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索地图名称"
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
                v-model="statusFilter"
                placeholder="筛选状态"
                clearable
                @change="handleFilter"
              >
                <el-option label="全部" value="" />
                <el-option label="已胜利" value="win" />
                <el-option label="未胜利" value="lose" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="categoryFilter"
                placeholder="筛选类别"
                clearable
                @change="handleFilter"
              >
                <el-option label="全部类别" value="" />
                <el-option 
                  v-for="category in availableCategories" 
                  :key="category.value"
                  :label="category.label" 
                  :value="category.value" 
                />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select
                v-model="sortBy"
                placeholder="排序方式"
                @change="handleSort"
              >
                <el-option label="按名称排序" value="name" />
                <el-option label="按地图类别排序" value="category" />
                <el-option label="按挑战等级排序" value="challengeLevel" />
                <el-option label="按胜利数排序" value="winNum" />
                <el-option label="按失败数排序" value="failNum" />
                <el-option label="按无双水晶排序" value="db" />
                <el-option label="按万能球排序" value="dm" />
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
        
        <!-- 地图网格 -->
        <div class="map-grid">
          <el-row :gutter="16">
            <el-col 
              :span="6" 
              v-for="mapItem in paginatedMaps" 
              :key="mapItem.name"
            >
              <el-popover 
                placement="bottom"
                trigger="click"
                width="400"
              >
                <template #reference>
                  <el-card 
                    class="map-card" 
                    :class="{ 
                      'map-won': mapItem.winB, 
                      'map-lost': !mapItem.winB && mapItem.failNum > 0 
                    }"
                    shadow="hover"
                  >
                    <div class="map-content">
                      <div class="map-header">
                        <h3 class="map-name">{{ getMapDisplayName(mapItem.name) }}</h3>
                        <div class="map-status">
                          <el-tag 
                            :type="mapItem.winB ? 'success' : 'danger'" 
                            size="small"
                          >
                            {{ mapItem.winB ? '已胜利' : '未胜利' }}
                          </el-tag>
                        </div>
                      </div>
                      
                      <div class="map-stats">
                        <div class="stats-grid">
                          <div class="stat-item">
                            <span class="stat-label">挑战等级</span>
                            <span class="stat-value">{{ mapItem.challengeLevel }}</span>
                          </div>
                          <div class="stat-item">
                            <span class="stat-label">胜利次数</span>
                            <span class="stat-value text-success">{{ mapItem.winNum }}</span>
                          </div>
                          <div class="stat-item">
                            <span class="stat-label">失败次数</span>
                            <span class="stat-value text-danger">{{ mapItem.failNum }}</span>
                          </div>
                          <div class="stat-item">
                            <span class="stat-label">退出次数</span>
                            <span class="stat-value text-warning">{{ mapItem.quitNum }}</span>
                          </div>
                          <div class="stat-item" v-if="mapItem.db > 0">
                            <span class="stat-label">无双水晶</span>
                            <span class="stat-value text-info">{{ mapItem.db }}</span>
                          </div>
                          <div class="stat-item" v-if="mapItem.dm > 0">
                            <span class="stat-label">万能球</span>
                            <span class="stat-value text-info">{{ mapItem.dm }}</span>
                          </div>
                          <div class="stat-item" v-if="mapItem.demBall > 0">
                            <span class="stat-label">本周无双</span>
                            <span class="stat-value text-info">{{ mapItem.demBall }}</span>
                          </div>
                          <div class="stat-item" v-if="mapItem.demStone > 0">
                            <span class="stat-label">本周万能</span>
                            <span class="stat-value text-info">{{ mapItem.demStone }}</span>
                          </div>
                          <div class="stat-item" v-if="mapItem.demWin > 0">
                            <span class="stat-label">修罗胜利</span>
                            <span class="stat-value text-warning">{{ mapItem.demWin }}</span>
                          </div>
                          <div class="stat-item" v-if="mapItem.diffUnlock > 0">
                            <span class="stat-label">困难解锁</span>
                            <span class="stat-value">{{ mapItem.diffUnlock }}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div v-if="mapItem.levelName" class="map-level">
                        <el-tag type="info" size="small">{{ mapItem.levelName }}</el-tag>
                      </div>
                    </div>
                  </el-card>
                </template>
                
                <!-- 悬浮卡片内容 -->
                <div class="map-popover-content">
                  <div class="popover-header">
                    <h4 class="popover-title">{{ getMapDisplayName(mapItem.name) }}</h4>
                    <div class="popover-status">
                      <el-tag 
                        :type="mapItem.winB ? 'success' : 'danger'" 
                        size="small"
                      >
                        {{ mapItem.winB ? '已胜利' : '未胜利' }}
                      </el-tag>
                    </div>
                  </div>
                  
                  <div v-if="mapItem.countSave" class="popover-counts">
                    <h5>统计信息</h5>
                    <div class="counts-grid">
                      <div class="count-item">
                        <span class="count-label">杀敌数:</span>
                        <span class="count-value">{{ formatNumber(mapItem.countSave.killEnemyNum || 0) }}</span>
                      </div>
                      <div class="count-item">
                        <span class="count-label">爆头数:</span>
                        <span class="count-value">{{ formatNumber(mapItem.countSave.headshotNum || 0) }}</span>
                      </div>
                      <div class="count-item">
                        <span class="count-label">受击数:</span>
                        <span class="count-value">{{ formatNumber(mapItem.countSave.hitNum || 0) }}</span>
                      </div>
                      <div class="count-item">
                        <span class="count-label">重生数:</span>
                        <span class="count-value">{{ formatNumber(mapItem.countSave.rebirthNum || 0) }}</span>
                      </div>
                      <div class="count-item">
                        <span class="count-label">停留时间:</span>
                        <span class="count-value">{{ formatTime(mapItem.countSave.time || 0) }}</span>
                      </div>
                      <div class="count-item">
                        <span class="count-label">获得经验:</span>
                        <span class="count-value">{{ formatNumber(mapItem.countSave.exp || 0) }}</span>
                      </div>
                      <div class="count-item">
                        <span class="count-label">基因掉落:</span>
                        <span class="count-value">{{ formatNumber(mapItem.countSave.geneNum || 0) }}</span>
                      </div>
                      <div class="count-item">
                        <span class="count-label">装备掉落:</span>
                        <span class="count-value">{{ formatNumber(mapItem.countSave.equipNum || 0) }}</span>
                      </div>
                      <div class="count-item">
                        <span class="count-label">武器掉落:</span>
                        <span class="count-value">{{ formatNumber(mapItem.countSave.armsNum || 0) }}</span>
                      </div>
                      <div class="count-item">
                        <span class="count-label">银币掉落:</span>
                        <span class="count-value">{{ formatNumber(mapItem.countSave.coin || 0) }}</span>
                      </div>
                      <div class="count-item">
                        <span class="count-label">橙色掉落:</span>
                        <span class="count-value">{{ formatNumber(mapItem.countSave.orangeNum || 0) }}</span>
                      </div>
                      <div class="count-item">
                        <span class="count-label">射出子弹:</span>
                        <span class="count-value">{{ formatNumber(mapItem.countSave.bulletNum || 0) }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="mapItem.maxEndlessScore > 0" class="popover-endless">
                    <h5>无尽模式</h5>
                    <div class="endless-info">
                      <div class="endless-item">
                        <span class="endless-label">最高等级:</span>
                        <span class="endless-value">{{ mapItem.maxEndlessGrade }}</span>
                      </div>
                      <div class="endless-item">
                        <span class="endless-label">最高分数:</span>
                        <span class="endless-value">{{ formatNumber(mapItem.maxEndlessScore) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-popover>
            </el-col>
          </el-row>
        </div>
        
        <!-- 分页 -->
        <div class="pagination-section">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[12, 18, 24, 36]"
            :total="filteredMaps.length"
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
import { MapLocation, List, Search, Refresh } from '@element-plus/icons-vue'
import type { WorldMap, WorldMapItem } from '@/types/archive/module/worldMap'
import { translateMap, getMapInfo } from '@/utils/translate'
import StatsCards from '@/components/StatsCards.vue'
import JsonViewer from '@/components/JsonViewer.vue'

const archiveStore = useArchiveStore()

// 获取世界地图模块数据
const data = computed((): WorldMap | null => {
  return archiveStore.getModuleData('worldMap') as WorldMap | null
})

// 搜索和筛选
const searchKeyword = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const pageSize = ref(18)

// 地图统计
const worldMapStats = computed(() => [
  {
    key: 'totalMaps',
    label: '总地图数',
    value: data.value ? Object.keys(data.value.obj).length : 0,
    icon: MapLocation,
    iconClass: 'text-primary',
    valueClass: 'text-primary'
  },
  {
    key: 'wonMaps',
    label: '已胜利地图',
    value: data.value ? Object.values(data.value.obj).filter(map => map.winB).length : 0,
    icon: List,
    iconClass: 'text-success',
    valueClass: 'text-success'
  },
  {
    key: 'totalWins',
    label: '总胜利次数',
    value: data.value ? formatNumber(Object.values(data.value.obj).reduce((sum, map) => sum + map.winNum, 0)) : '0',
    icon: List,
    iconClass: 'text-success',
    valueClass: 'text-success'
  },
  {
    key: 'totalFails',
    label: '总失败次数',
    value: data.value ? formatNumber(Object.values(data.value.obj).reduce((sum, map) => sum + map.failNum, 0)) : '0',
    icon: List,
    iconClass: 'text-danger',
    valueClass: 'text-danger'
  },
  {
    key: 'totalDb',
    label: '总无双水晶',
    value: data.value ? formatNumber(Object.values(data.value.obj).reduce((sum, map) => sum + (map.db || 0), 0)) : '0',
    icon: List,
    iconClass: 'text-info',
    valueClass: 'text-info'
  },
  {
    key: 'totalDm',
    label: '总万能球',
    value: data.value ? formatNumber(Object.values(data.value.obj).reduce((sum, map) => sum + (map.dm || 0), 0)) : '0',
    icon: List,
    iconClass: 'text-info',
    valueClass: 'text-info'
  },
  {
    key: 'totalDemBall',
    label: '本周无双水晶',
    value: data.value ? formatNumber(Object.values(data.value.obj).reduce((sum, map) => sum + (map.demBall || 0), 0)) : '0',
    icon: List,
    iconClass: 'text-warning',
    valueClass: 'text-warning'
  },
  {
    key: 'totalDemStone',
    label: '本周万能球',
    value: data.value ? formatNumber(Object.values(data.value.obj).reduce((sum, map) => sum + (map.demStone || 0), 0)) : '0',
    icon: List,
    iconClass: 'text-warning',
    valueClass: 'text-warning'
  },
  {
    key: 'chA',
    label: 'CHA值',
    value: data.value?.chA || 0,
    icon: MapLocation,
    iconClass: 'text-warning',
    valueClass: 'text-warning'
  },
  {
    key: 'superNum',
    label: '超级数量',
    value: data.value?.superNum || 0,
    icon: List,
    iconClass: 'text-info',
    valueClass: 'text-info'
  },
  {
    key: 'totalGeneNum',
    label: '基因掉落',
    value: data.value ? formatNumber(Object.values(data.value.obj).reduce((sum, map) => sum + (map.countSave?.geneNum || 0), 0)) : '0',
    icon: List,
    iconClass: 'text-success',
    valueClass: 'text-success'
  },
  {
    key: 'totalEquipNum',
    label: '装备掉落',
    value: data.value ? formatNumber(Object.values(data.value.obj).reduce((sum, map) => sum + (map.countSave?.equipNum || 0), 0)) : '0',
    icon: List,
    iconClass: 'text-success',
    valueClass: 'text-success'
  },
  {
    key: 'totalArmsNum',
    label: '武器掉落',
    value: data.value ? formatNumber(Object.values(data.value.obj).reduce((sum, map) => sum + (map.countSave?.armsNum || 0), 0)) : '0',
    icon: List,
    iconClass: 'text-success',
    valueClass: 'text-success'
  },
  {
    key: 'totalCoin',
    label: '银币掉落',
    value: data.value ? formatNumber(Object.values(data.value.obj).reduce((sum, map) => sum + (map.countSave?.coin || 0), 0)) : '0',
    icon: List,
    iconClass: 'text-warning',
    valueClass: 'text-warning'
  },
  {
    key: 'totalOrangeNum',
    label: '橙色掉落',
    value: data.value ? formatNumber(Object.values(data.value.obj).reduce((sum, map) => sum + (map.countSave?.orangeNum || 0), 0)) : '0',
    icon: List,
    iconClass: 'text-warning',
    valueClass: 'text-warning'
  },
  {
    key: 'totalExp',
    label: '经验获得',
    value: data.value ? formatNumber(Object.values(data.value.obj).reduce((sum, map) => sum + (map.countSave?.exp || 0), 0)) : '0',
    icon: List,
    iconClass: 'text-info',
    valueClass: 'text-info'
  },
  {
    key: 'totalKillEnemy',
    label: '杀敌总数',
    value: data.value ? formatNumber(Object.values(data.value.obj).reduce((sum, map) => sum + (map.countSave?.killEnemyNum || 0), 0)) : '0',
    icon: List,
    iconClass: 'text-danger',
    valueClass: 'text-danger'
  },
  {
    key: 'totalHeadshot',
    label: '爆头总数',
    value: data.value ? formatNumber(Object.values(data.value.obj).reduce((sum, map) => sum + (map.countSave?.headshotNum || 0), 0)) : '0',
    icon: List,
    iconClass: 'text-danger',
    valueClass: 'text-danger'
  }
])

// 获取地图显示名称
const getMapDisplayName = (mapName: string): string => {
  return translateMap(mapName)
}

// 获取地图类别
const getMapCategory = (mapName: string): string => {
  const mapInfo = getMapInfo(mapName)
  return mapInfo?.category || 'unknown'
}

// 获取可用的地图类别
const availableCategories = computed(() => {
  if (!data.value?.obj) return []
  
  const categories = new Set<string>()
  Object.values(data.value.obj).forEach(map => {
    const category = getMapCategory(map.name)
    if (category !== 'unknown') {
      categories.add(category)
    }
  })
  
  // 类别名称映射
  const categoryLabels: Record<string, string> = {
    'space': '太空',
    'spaceTask': '太空任务',
    'big': '大型地图',
    'other': '其他',
    'task': '任务',
    'infected_area': '感染区'
  }
  
  return Array.from(categories)
    .map(category => ({
      value: category,
      label: categoryLabels[category] || category
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
})

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 格式化时间
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

// 获取所有地图
const allMaps = computed(() => {
  if (!data.value?.obj) return []
  return Object.values(data.value.obj)
})

// 筛选后的地图
const filteredMaps = computed(() => {
  let maps = [...allMaps.value]
  
  // 搜索筛选
  if (searchKeyword.value) {
    maps = maps.filter(map => 
      getMapDisplayName(map.name).toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  // 状态筛选
  if (statusFilter.value) {
    if (statusFilter.value === 'win') {
      maps = maps.filter(map => map.winB)
    } else if (statusFilter.value === 'lose') {
      maps = maps.filter(map => !map.winB)
    }
  }
  
  // 类别筛选
  if (categoryFilter.value) {
    maps = maps.filter(map => getMapCategory(map.name) === categoryFilter.value)
  }
  
  // 排序
  maps.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return getMapDisplayName(a.name).localeCompare(getMapDisplayName(b.name))
      case 'category':
        const categoryA = getMapCategory(a.name)
        const categoryB = getMapCategory(b.name)
        if (categoryA === categoryB) {
          return getMapDisplayName(a.name).localeCompare(getMapDisplayName(b.name))
        }
        return categoryA.localeCompare(categoryB)
      case 'challengeLevel':
        return b.challengeLevel - a.challengeLevel
      case 'winNum':
        return b.winNum - a.winNum
      case 'failNum':
        return b.failNum - a.failNum
      case 'db':
        return (b.db || 0) - (a.db || 0)
      case 'dm':
        return (b.dm || 0) - (a.dm || 0)
      default:
        return 0
    }
  })
  
  return maps
})

// 分页后的地图
const paginatedMaps = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredMaps.value.slice(start, end)
})

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
}

// 筛选处理
const handleFilter = () => {
  currentPage.value = 1
}

// 排序处理
const handleSort = () => {
  currentPage.value = 1
}

// 重置筛选
const resetFilters = () => {
  searchKeyword.value = ''
  statusFilter.value = ''
  categoryFilter.value = ''
  sortBy.value = 'name'
  currentPage.value = 1
}

// 分页处理
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  currentPage.value = 1
}

const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage
}

// JSON数据
const jsonData = computed(() => {
  return JSON.stringify(data.value, null, 2)
})
</script>

<style scoped>
.worldmap-module {
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

.map-list-section {
  margin-top: 24px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-row {
  align-items: center;
}

.map-grid {
  margin-bottom: 24px;
}

.map-card {
  margin-bottom: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 200px;
}

.map-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.map-card.map-won {
  border-left: 3px solid #67c23a;
}

.map-card.map-lost {
  border-left: 3px solid #f56c6c;
}

.map-content {
  padding: 0;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.map-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  flex: 1;
  margin-right: 6px;
  line-height: 1.3;
}

.map-status {
  flex-shrink: 0;
}

.map-stats {
  margin-bottom: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 11px;
}

.stat-item .stat-label {
  color: #909399;
  font-weight: 500;
  font-size: 10px;
  margin-bottom: 2px;
}

.stat-item .stat-value {
  color: #303133;
  font-weight: 600;
  font-size: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
  font-size: 12px;
}

.stat-label {
  color: #909399;
  font-weight: 500;
}

.stat-value {
  color: #303133;
  font-weight: 600;
}

.map-level {
  text-align: center;
}

.map-counts {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.map-counts h5 {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #303133;
  font-weight: 600;
}

.counts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.count-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding: 4px 6px;
  background: #f8f9fa;
  border-radius: 3px;
}

.count-label {
  color: #909399;
  font-weight: 500;
}

.count-value {
  color: #303133;
  font-weight: 600;
}

.map-endless {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.map-endless h5 {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #303133;
  font-weight: 600;
}

.endless-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.endless-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding: 4px 6px;
  background: #f8f9fa;
  border-radius: 3px;
}

.endless-label {
  color: #909399;
  font-weight: 500;
}

.endless-value {
  color: #303133;
  font-weight: 600;
}

/* 悬浮卡片样式 */
.map-popover-content {
  padding: 0;
}

.popover-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.popover-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  flex: 1;
  margin-right: 8px;
}

.popover-status {
  flex-shrink: 0;
}

.popover-counts {
  border-top: 1px solid #ebeef5;
  padding-top: 16px;
  margin-bottom: 16px;
}

.popover-counts h5 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

.popover-endless {
  border-top: 1px solid #ebeef5;
  padding-top: 16px;
}

.popover-endless h5 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

/* 颜色工具类 */
.text-primary { color: #409eff !important; }
.text-success { color: #67c23a !important; }
.text-warning { color: #e6a23c !important; }
.text-danger { color: #f56c6c !important; }
.text-info { color: #909399 !important; }

@media (max-width: 768px) {
  .worldmap-module {
    padding: 16px;
  }
  
  .filter-row .el-col {
    margin-bottom: 12px;
  }
  
  .map-grid .el-col {
    margin-bottom: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .counts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
