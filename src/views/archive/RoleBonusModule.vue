<template>
  <div class="role-bonus-module">
    <el-card class="module-card">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon"><Trophy /></el-icon>
          <div>
            <h2>角色属性加成</h2>
            <p class="module-desc">所有模块的属性加成统计</p>
          </div>
        </div>
      </template>
      
      <!-- 总加成概览 -->
      <div class="bonus-overview">
        <el-row :gutter="20">
          <el-col :span="6" v-for="stat in overviewStats" :key="stat.key">
            <el-card class="overview-card" shadow="hover">
              <div class="overview-content">
                <div class="overview-icon">
                  <el-icon :class="stat.iconClass">
                    <component :is="stat.icon" />
                  </el-icon>
                </div>
                <div class="overview-info">
                  <div class="overview-label">{{ stat.label }}</div>
                  <div class="overview-value" :class="stat.valueClass">
                    {{ stat.value }}
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 详细加成列表 -->
      <div class="bonus-detail-section">
        <el-divider content-position="left">
          <el-icon><List /></el-icon>
          <span>详细加成列表</span>
        </el-divider>
        
        <!-- 搜索和筛选 -->
        <div class="filter-section">
          <el-row :gutter="20" class="filter-row">
            <el-col :span="8">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索属性名称"
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
                v-model="categoryFilter"
                placeholder="筛选分类"
                clearable
                @change="handleFilter"
              >
                <el-option label="全部分类" value="" />
                <el-option label="伤害" value="伤害" />
                <el-option label="生命" value="生命" />
                <el-option label="碎片" value="碎片" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="moduleFilter"
                placeholder="筛选模块"
                clearable
                @change="handleFilter"
              >
                <el-option label="全部模块" value="" />
                <el-option 
                  v-for="module in availableModules" 
                  :key="module.value"
                  :label="module.label" 
                  :value="module.value" 
                />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select
                v-model="sortBy"
                placeholder="排序方式"
                @change="handleSort"
              >
                <el-option label="按属性名称排序" value="name" />
                <el-option label="按总加成排序" value="total" />
                <el-option label="按模块数量排序" value="modules" />
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

        <!-- 加成表格 -->
        <el-table 
          :data="paginatedBonusList" 
          stripe
          style="width: 100%"
          :loading="false"
        >
          <el-table-column prop="name" label="属性名称" width="150" fixed="left">
            <template #default="{ row }">
              <el-tag :type="getBonusTagType(row.totalValue)" size="small">
                {{ translateSingleBonus(row.name) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="category" label="分类" width="100" align="center">
            <template #default="{ row }">
              <el-tag 
                :type="getCategoryTagType(row.category)" 
                size="small"
              >
                {{ row.category }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="totalValue" label="总加成" width="120" align="center">
            <template #default="{ row }">
              <span class="total-value" :class="getValueClass(row.totalValue)">
                {{ formatBonusValue(row.name, row.totalValue) }}
              </span>
            </template>
          </el-table-column>
          
          <el-table-column prop="modules" label="来源模块" min-width="200">
            <template #default="{ row }">
              <div class="module-list">
                <el-tag 
                  v-for="module in row.modules" 
                  :key="module.name"
                  :type="getModuleTagType(module.name)"
                  size="small"
                  class="module-tag"
                >
                  {{ module.label }}+{{ formatBonusValue(row.name, module.value) }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="moduleCount" label="模块数量" width="100" align="center">
            <template #default="{ row }">
              <el-tag type="info" size="small">
                {{ row.moduleCount }} 个
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-section">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredBonusList.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useArchiveStore } from '@/stores/archive'
import { Trophy, List, Search, Refresh } from '@element-plus/icons-vue'
import type { RoleBonus } from '@/types/archive/Bonus'
import { getFormattedBonusList, translateSingleBonus, formatBonusValue } from '@/utils/translate'

const archiveStore = useArchiveStore()

// 搜索和筛选
const searchKeyword = ref('')
const categoryFilter = ref('')
const moduleFilter = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const pageSize = ref(20)

// 获取所有角色加成数据
const allRoleBonus = computed(() => {
  return archiveStore.getAllRoleBonus()
})

// 获取各模块加成数据
const moduleBonusData = computed(() => {
  const archiveData = archiveStore.archiveData
  if (!archiveData) return []

  return [
    {
      name: 'achieve',
      label: '成就加成',
      bonus: archiveData.achieve?.getRoleBonus() || {}
    },
    {
      name: 'equip',
      label: '装备加成',
      bonus: archiveData.equip?.getRoleBonus() || {}
    },
    {
      name: 'pet',
      label: '宠物加成',
      bonus: archiveData.pet?.getFightPet()?.getRoleBonus() || {}
    },
    {
      name: 'tower',
      label: '虚天塔加成',
      bonus: archiveData.tower?.getRoleBonus() || {}
    },
    {
      name: 'peak',
      label: '巅峰加成',
      bonus: archiveData.peak?.getRoleBonus() || {}
    },
    {
      name: 'vip',
      label: 'VIP加成',
      bonus: archiveData.vip?.getRoleBonus() || {}
    },
    {
      name: 'post',
      label: '总统加成',
      bonus: archiveData.post?.getRoleBonus() || {}
    },
    {
      name: 'union',
      label: '军队加成',
      bonus: archiveData.union?.getRoleBonus() || {}
    },
    {
      name: 'bossCard',
      label: '魂卡加成',
      bonus: archiveData.bossCard?.getRoleBonus() || {}
    },
    {
      name: 'head',
      label: '头衔加成',
      bonus: archiveData.head?.getRoleBonus() || {}
    }
  ]
})

// 概览统计
const overviewStats = computed(() => {
  const bonus = allRoleBonus.value
  const nonZeroCount = Object.values(bonus).filter(value => value !== 0).length
  const maxModuleCount = Math.max(...Object.keys(bonus).map(key => 
    moduleBonusData.value.filter(module => module.bonus[key] !== undefined).length
  ), 0)

  return [
    {
      key: 'totalBonus',
      label: '总加成属性',
      value: nonZeroCount,
      icon: Trophy,
      iconClass: 'text-primary',
      valueClass: 'text-primary'
    },
    {
      key: 'maxModules',
      label: '最多模块数',
      value: maxModuleCount,
      icon: List,
      iconClass: 'text-info',
      valueClass: 'text-info'
    },
    {
      key: 'totalModules',
      label: '总模块数',
      value: moduleBonusData.value.length,
      icon: List,
      iconClass: 'text-success',
      valueClass: 'text-success'
    }
  ]
})

// 详细加成列表
const detailedBonusList = computed(() => {
  const bonus = allRoleBonus.value
  const result = []

  for (const [key, totalValue] of Object.entries(bonus)) {
    if (totalValue === 0) continue

    const modules = moduleBonusData.value
      .filter(module => module.bonus[key] !== undefined && module.bonus[key] !== 0)
      .map(module => ({
        name: module.name,
        label: module.label,
        value: module.bonus[key]
      }))

    result.push({
      name: key,
      totalValue,
      modules,
      moduleCount: modules.length,
      category: getAttributeCategory(key)
    })
  }

  // 按分类排序，伤害相关属性优先显示
  result.sort((a, b) => {
    const categoryOrder = { '伤害': 1, '生命': 2, '碎片': 3, '其他': 4 }
    const aOrder = categoryOrder[a.category as keyof typeof categoryOrder] || 4
    const bOrder = categoryOrder[b.category as keyof typeof categoryOrder] || 4
    
    if (aOrder !== bOrder) {
      return aOrder - bOrder
    }
    return a.name.localeCompare(b.name)
  })

  return result
})

// 获取可用模块列表
const availableModules = computed(() => {
  return moduleBonusData.value.map(module => ({
    value: module.name,
    label: module.label
  }))
})

// 判断属性分类
const getAttributeCategory = (attributeName: string): string => {
  // 伤害相关属性
  const damageKeywords = [
    'hurt', 'dps', 'damage', 'attack', 'crit', 'critical', 'hit',
    'weapon', 
    'hurtAll', 'hurtMul', 'hurtMul_rifle', 'hurtMul_sniper', 'dpsAll', 'dpsAllBlack',
    'dpsMul', 'dpsMul_flamer', 'dpsMul_pistol', 'dpsMul_rifle', 'dpsMul_rocket',
    'dpsMul_shotgun', 'dpsMul_sniper', 'dpsVip', 'dpsWhole', 'moreDpsMul',
    'critPro3', 'damageMul', 'zodiacArmsHurtAdd', 'vehicleDpsMul',
    'capacity', 'capacityMul', 'capacityMulBlack', 'charger', 'chargerMul',
    'chargerMulBlack', 'reload', 'maxJumpNumAdd',
    'fightDedut', 'skillCd', 
  ]
  
  // 生命相关属性
  const lifeKeywords = [
    'hp', 'life', 'def', 'dodge', 'head', 'vehicleDef',
    'hpMul', 'lifeAll', 'lifeAllBlack', 'lifeMul', 'lifeRate', 'lifeRateBlack', 
    'lifeRateMul', 'lifeVip', 'defMul', 'headMul', 'headVip', 'vehicleDefMul',
    'moreLifeMul', 'bulletDedut','skillDedut'
  ]
  
  // 碎片相关属性
  const fragmentKeywords = [
    'drop', 'num', 'pro', 'stone', 'gem', 'device', 'parts', 'arms', 'equip',
    'blackArmsDropPro', 'blackEquipDropPro', 'bloodStoneDropPro', 'converStoneDropPro',
    'deviceDropPro', 'gemDropPro', 'godStoneDropPro', 'lifeCatalystDropPro',
    'orredArmsDropPro', 'orredEquipDropPro', 'petBookDropPro', 'ranBlackArmsDropPro',
    'rareArmsDropPro', 'rareEquipDropPro', 'rareGeneDropPro', 'specialPartsDropPro',
    'taxStampDropPro', 'weaponDropPro', 'arenaStampDropNum', 'demBallDropNum',
    'demStroneDropNum', 'madheartDropNum', 'vehicleCashDropNum'
  ]
  
  if (damageKeywords.some(keyword => 
    attributeName.toLowerCase().includes(keyword.toLowerCase())
  )) {
    return '伤害'
  }
  
  if (lifeKeywords.some(keyword => 
    attributeName.toLowerCase().includes(keyword.toLowerCase())
  )) {
    return '生命'
  }
  
  if (fragmentKeywords.some(keyword => 
    attributeName.toLowerCase().includes(keyword.toLowerCase())
  )) {
    return '碎片'
  }
  
  return '其他'
}

// 筛选后的加成列表
const filteredBonusList = computed(() => {
  let list = [...detailedBonusList.value]

  // 搜索筛选
  if (searchKeyword.value) {
    list = list.filter(item => 
      item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  // 分类筛选
  if (categoryFilter.value) {
    list = list.filter(item => item.category === categoryFilter.value)
  }

  // 模块筛选
  if (moduleFilter.value) {
    list = list.filter(item => 
      item.modules.some(module => module.name === moduleFilter.value)
    )
  }

  // 排序
  list.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'total':
        return Math.abs(b.totalValue) - Math.abs(a.totalValue)
      case 'modules':
        return b.moduleCount - a.moduleCount
      default:
        return 0
    }
  })

  return list
})

// 分页后的列表
const paginatedBonusList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredBonusList.value.slice(start, end)
})

// 格式化加成值（已使用 translate.ts 中的 formatBonusValue 函数）

// 获取加成标签类型
const getBonusTagType = (value: number): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
  if (value > 0) return 'success'
  if (value < 0) return 'danger'
  return 'info'
}

// 获取值显示类型
const getValueClass = (value: number): string => {
  if (value > 0) return 'text-success'
  if (value < 0) return 'text-danger'
  return 'text-info'
}

// 获取分类标签类型
const getCategoryTagType = (category: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
  const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    '伤害': 'danger',
    '生命': 'success',
    '碎片': 'warning',
    '其他': 'info'
  }
  return typeMap[category] || 'info'
}

// 获取模块标签类型
const getModuleTagType = (moduleName: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
  const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
    'achieve': 'primary',
    'equip': 'success',
    'pet': 'warning',
    'tower': 'danger',
    'peak': 'info',
    'vip': 'primary',
    'post': 'success',
    'union': 'warning',
    'bossCard': 'danger',
    'head': 'info'
  }
  return typeMap[moduleName] || 'info'
}

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
  categoryFilter.value = ''
  moduleFilter.value = ''
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
</script>

<style scoped>
.role-bonus-module {
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

.bonus-overview {
  margin-bottom: 24px;
}

.overview-card {
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-2px);
}

.overview-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.overview-icon {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f5f7fa;
}

.overview-info {
  flex: 1;
}

.overview-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.overview-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.bonus-detail-section {
  margin-top: 24px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-row {
  align-items: center;
}

.module-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.module-tag {
  margin: 2px;
}

.total-value {
  font-weight: 600;
  font-size: 14px;
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
  .role-bonus-module {
    padding: 16px;
  }
  
  .filter-row .el-col {
    margin-bottom: 12px;
  }
  
  .module-list {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .module-tag {
    margin: 1px 0;
  }
}
</style>
