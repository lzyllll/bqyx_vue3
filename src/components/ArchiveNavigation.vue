<template>
  <div class="archive-navigation">
    <div class="nav-header">
      <h3>存档模块</h3>
      <el-button 
        @click="goBack" 
        type="primary" 
        size="small"
        :icon="ArrowLeft"
      >
        返回解析器
      </el-button>
    </div>
    
    <!-- 搜索框 -->
    <div class="search-section">
      <el-input
        v-model="searchText"
        placeholder="搜索模块名称或描述"
        clearable
        size="small"
        @input="handleSearch"
        style="position: sticky; top: 0; z-index: 10; background: white;"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <div class="module-categories">
      <div v-for="(modules, category) in filteredModulesByCategory" :key="category" class="category">
        <h4>{{ category }}</h4>
        <div class="module-list">
          <div 
            v-for="module in modules" 
            :key="module.key"
            class="module-item"
            :class="{ active: isCurrentModule(module.key) }"
            @click="navigateToModule(module.key)"
          >
            <div class="module-name">{{ module.name }}</div>
            <div class="module-desc">{{ module.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Search } from '@element-plus/icons-vue'
import { moduleInfos, getModulesByCategory } from '@/utils/moduleRenderers'

const router = useRouter()
const route = useRoute()

// 搜索文本
const searchText = ref('')

// 按分类获取模块
const modulesByCategory = computed(() => {
  return getModulesByCategory()
})

// 过滤后的模块分类
const filteredModulesByCategory = computed(() => {
  if (!searchText.value.trim()) {
    return modulesByCategory.value
  }
  
  const filtered: Record<string, any[]> = {}
  const searchLower = searchText.value.toLowerCase()
  
  Object.entries(modulesByCategory.value).forEach(([category, modules]) => {
    const filteredModules = modules.filter(module => 
      module.name.toLowerCase().includes(searchLower) ||
      module.description.toLowerCase().includes(searchLower)
    )
    
    if (filteredModules.length > 0) {
      filtered[category] = filteredModules
    }
  })
  
  return filtered
})

// 处理搜索
const handleSearch = () => {
  // 搜索逻辑已在 computed 中处理
}

// 路由映射
const routeMap: Record<string, string> = {
  'main': '/archive/main',
  'base': '/archive/base',
  'arena': '/archive/arena',
  'arms': '/archive/arms',
  'equip': '/archive/equip',
  'skill': '/archive/skill',
  'partsBag': '/archive/partsBag',
  'head': '/archive/head',
  'wilder': '/archive/wilder',
  'skillBag': '/archive/skillBag',
  'active': '/archive/active',
  'pay': '/archive/pay',
  'task': '/archive/task',
  'peak': '/archive/peak',
  'drop': '/archive/drop',
  'geneBag': '/archive/geneBag',
  'gift': '/archive/gift',
  'hooker': '/archive/hooker',
  'equipBag': '/archive/equipBag',
  'love': '/archive/love',
  'bossCard': '/archive/bossCard',
  'goods': '/archive/goods',
  'armsBag': '/archive/armsBag',
  'armsHouse': '/archive/armsHouse',
  'thingsBag': '/archive/thingsBag',
  'count': '/archive/count',
  'pet': '/archive/pet',
  'ask': '/archive/ask',
  'achieve': '/archive/achieve',
  'bossEdit': '/archive/bossEdit',
  'city': '/archive/city',
  'partner': '/archive/partner',
  'worldMap': '/archive/worldMap',
  'guide': '/archive/guide',
  'space': '/archive/space',
  'tower': '/archive/tower',
  'post': '/archive/post',
  'setting': '/archive/setting',
  'food': '/archive/food',
  'time': '/archive/time',
  'armsTor': '/archive/armsTor',
  'headCount': '/archive/headCount',
  'union': '/archive/union',
  'equipHouse': '/archive/equipHouse',
  'vip': '/archive/vip',
  'blackMarket': '/archive/blackMarket',
  'more': '/archive/more',
  'moreBag': '/archive/moreBag',
  'state': '/archive/state'
}

// 检查是否为当前模块
const isCurrentModule = (moduleKey: string): boolean => {
  const currentPath = route.path
  const moduleRoute = routeMap[moduleKey]
  return moduleRoute ? currentPath === moduleRoute : false
}

// 导航到模块
const navigateToModule = (moduleKey: string) => {
  const moduleRoute = routeMap[moduleKey]
  if (moduleRoute) {
    router.push(moduleRoute)
  } else {
    console.warn(`未找到模块 ${moduleKey} 对应的路由`)
  }
}

// 返回解析器
const goBack = () => {
  router.push('/archive-parser')
}
</script>

<style scoped>
.archive-navigation {
  background: white;
  border-right: 1px solid #e4e7ed;
  height: 100vh;
  overflow-y: auto;
  width: 280px;
}

.nav-header {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-header h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
}

.search-section {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
}

.module-categories {
  padding: 16px;
}

.category {
  margin-bottom: 24px;
}

.category h4 {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 14px;
  font-weight: 600;
}

.module-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.module-item {
  padding: 12px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.module-item:hover {
  background: #f5f7fa;
  border-color: #e4e7ed;
}

.module-item.active {
  background: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

.module-name {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 14px;
}

.module-desc {
  font-size: 12px;
  color: #909399;
}

@media (max-width: 768px) {
  .archive-navigation {
    width: 100%;
    height: auto;
  }
}
</style>
