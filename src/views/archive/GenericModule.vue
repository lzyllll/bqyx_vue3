<template>
  <div class="generic-module">
      <div class="module-header">
        <h2>{{ moduleName }}</h2>
        <p class="module-desc">{{ moduleDescription }}</p>
      </div>
      
      
      <!-- 属性加成显示 -->
      <div v-if="hasRoleBonus && totalBonus.length > 0" class="bonus-section">
        <BonusDisplay 
          :bonus-list="totalBonus"
          :title="`${moduleName}属性加成`"
          :subtitle="`${moduleName}属性总加成`"
          :empty-text="`暂无${moduleName}加成`"
          :compact="false"
        />
      </div>
      
      <div class="data-preview">
        <el-card>
          <template #header>
            <div class="card-header">
              <h3>{{ moduleName }}数据</h3>
            </div>
          </template>
          <div v-if="data" class="data-content">
            <el-collapse>
              <el-collapse-item title="查看完整数据" name="full">
                <pre class="json-data">{{ JSON.stringify(data, null, 2) }}</pre>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div v-else class="no-data">
            <el-empty description="该模块暂无数据" />
          </div>
        </el-card>
      </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useArchiveStore } from '@/stores/archive'
import BonusDisplay from '@/components/BonusDisplay.vue'
import { getFormattedBonusList } from '@/utils/translate'
import { BonusMerge } from '@/utils/bonusAdd'

const archiveStore = useArchiveStore()



const route = useRoute()
// 获取 path 最后一部分
// 获取模块key
const moduleKey = computed(() => route.path.split('/').pop() as string)

// 获取模块信息
const moduleInfo = computed(() => {
  return archiveStore.getModuleData(moduleKey.value)
})

const moduleName = computed(() => {
  return moduleInfo.value?.name || moduleKey.value
})

const moduleDescription = computed(() => {
  return moduleInfo.value?.description || '存档模块数据'
})

// 获取模块数据
const data = computed(() => {
  return archiveStore.getModuleData(moduleKey.value)
})

// 检测是否有getRoleBonus方法
const hasRoleBonus = computed(() => {
  if (!data.value) return false
  
  // 检查数据对象是否有getRoleBonus方法
  if (typeof data.value.getRoleBonus === 'function') {
    return true
  }
  
  // 检查数据对象中是否有数组，数组中的项目是否有getRoleBonus方法
  if (Array.isArray(data.value)) {
    return data.value.some(item => 
      item && typeof (item as any).getRoleBonus === 'function'
    )
  }
  
  // 检查数据对象中是否有对象属性，这些属性是否有getRoleBonus方法
  if (typeof data.value === 'object' && data.value !== null) {
    return Object.values(data.value).some(item => 
      item && typeof (item as any).getRoleBonus === 'function'
    )
  }
  
  return false
})

// 计算总加成
const totalBonus = computed(() => {
  if (!data.value || !hasRoleBonus.value) return []
  
  let totalBonusObj = {}
  
  try {
    // 如果数据对象本身有getRoleBonus方法
    if (typeof data.value.getRoleBonus === 'function') {
      const bonus = data.value.getRoleBonus()
      totalBonusObj = BonusMerge(totalBonusObj, bonus)
    }
    
    // 如果数据是数组
    if (Array.isArray(data.value)) {
      data.value.forEach(item => {
        if (item && typeof (item as any).getRoleBonus === 'function') {
          const bonus = (item as any).getRoleBonus()
          totalBonusObj = BonusMerge(totalBonusObj, bonus)
        }
      })
    }
    
    // 如果数据是对象，遍历其属性
    if (typeof data.value === 'object' && data.value !== null) {
      Object.values(data.value).forEach(item => {
        if (item && typeof (item as any).getRoleBonus === 'function') {
          const bonus = (item as any).getRoleBonus()
          totalBonusObj = BonusMerge(totalBonusObj, bonus)
        }
      })
    }
    
    return getFormattedBonusList(totalBonusObj)
  } catch (error) {
    console.warn('计算加成时出错:', error)
    return []
  }
})


</script>

<style scoped>
.generic-module {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 20px;
}

.module-header {
  margin-bottom: 20px;
}

.module-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.module-desc {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.card-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 500;
}

.module-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.summary-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.data-preview h3 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.data-content {
  margin-top: 16px;
}

.json-data {
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  max-height: 500px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
  color: #2c3e50;
}

.bonus-section {
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .module-summary {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
  }
}
</style>


