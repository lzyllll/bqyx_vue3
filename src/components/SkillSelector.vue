<template>
  <div class="skill-selector">
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索技能..."
        clearable
        size="large"
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <div class="category-tabs">
      <el-radio-group v-model="selectedCategory" size="large" class="category-radio-group">
        <el-radio-button label="1">攻击类</el-radio-button>
        <el-radio-button label="2">限制类</el-radio-button>
        <el-radio-button label="3">防御类</el-radio-button>
        <el-radio-button label="4">其他类</el-radio-button>
      </el-radio-group>
    </div>
    
    <div class="subcategory-tabs" v-if="currentCategory">
      <el-radio-group v-model="selectedSubcategory" size="small" class="subcategory-radio-group">
        <el-radio-button 
          v-for="subcategory in currentCategory.subcategories" 
          :key="subcategory.id"
          :label="subcategory.id"
          v-show="subcategory.skills.length > 0"
        >
          {{ subcategory.name }}
        </el-radio-button>
      </el-radio-group>
    </div>
    
    <div class="skill-categories">
      <div class="skills-grid">
        <div
          v-for="skill in currentSkills"
          :key="skill.key"
          class="skill-item"
          :class="{ 'selected': isSelected(skill.key) }"
          @click="toggleSkill(skill.key)"
          draggable="true"
          @dragstart="onDragStart($event, skill)"
          @dragend="onDragEnd"
          :title="skill.key"
        >
          <div class="skill-name">{{ skill.name }}</div>
        </div>
      </div>
    </div>
    
    <div class="selected-skills">
      <div class="selected-header">
        <h3>已选技能 ({{ selectedSkills.length }})</h3>
        <el-button 
          v-if="selectedSkills.length > 0"
          type="danger" 
          size="small" 
          @click="clearAll"
          plain
        >
          清空全部
        </el-button>
      </div>
      <div class="selected-list">
        <el-tag
          v-for="(skill, index) in selectedSkills"
          :key="`${skill.key}-${index}`"
          closable
          @close="removeSkill(index)"
          class="selected-skill-tag"
          :title="skill.key"
        >
          {{ skill.name }}
        </el-tag>
        <div v-if="selectedSkills.length === 0" class="empty-state">
          <p>暂无选中技能</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Close, Search } from '@element-plus/icons-vue'
import bossSkillMapRaw from '@/assets/data/EditBossSkill.json'

const bossSkillMap = bossSkillMapRaw as Record<string, string>

interface Skill {
  key: string
  name: string
}

interface Subcategory {
  id: string
  name: string
  skills: Skill[]
}

interface Category {
  id: string
  name: string
  subcategories: Subcategory[]
}

// 技能分类数据
const categories = ref<Category[]>([
  {
    id: '1',
    name: '攻击类',
    subcategories: [
      {
        id: '11',
        name: '变身召唤',
        skills: getSkillsByPrefix('11_')
      },
      {
        id: '12',
        name: '攻击状态',
        skills: getSkillsByPrefix('12_')
      },
      {
        id: '13',
        name: '攻击子弹',
        skills: getSkillsByPrefix('13_')
      },
      {
        id: '14',
        name: '针对队友',
        skills: getSkillsByPrefix('14_')
      },
      {
        id: '15',
        name: '其他',
        skills: getSkillsByPrefix('15_')
      }
    ]
  },
  {
    id: '2',
    name: '限制类',
    subcategories: [
      {
        id: '21',
        name: '技能限制',
        skills: getSkillsByPrefix('21_')
      },
      {
        id: '22',
        name: '运动限制',
        skills: getSkillsByPrefix('22_')
      },
      {
        id: '23',
        name: '攻击限制',
        skills: getSkillsByPrefix('23_')
      }
    ]
  },
  {
    id: '3',
    name: '防御类',
    subcategories: [
      {
        id: '31',
        name: '未归类',
        skills: getSkillsByPrefix('31_')
      },
      {
        id: '32',
        name: '回血',
        skills: getSkillsByPrefix('32_')
      },
      {
        id: '33',
        name: '敏感',
        skills: getSkillsByPrefix('33_')
      },
      {
        id: '34',
        name: '针对攻击',
        skills: getSkillsByPrefix('34_')
      },
      {
        id: '35',
        name: '免疫',
        skills: getSkillsByPrefix('35_')
      }
    ]
  },
  {
    id: '4',
    name: '其他类',
    subcategories: [
      {
        id: '41',
        name: '运动',
        skills: getSkillsByPrefix('41_')
      },
      {
        id: '42',
        name: '隐身',
        skills: getSkillsByPrefix('42_')
      },
      {
        id: '43',
        name: '图像和天气',
        skills: getSkillsByPrefix('43_')
      },
      {
        id: '44',
        name: '测试专用',
        skills: getSkillsByPrefix('44_')
      }
    ]
  }
])

// 根据前缀获取技能
function getSkillsByPrefix(prefix: string): Skill[] {
  return Object.entries(bossSkillMap)
    .filter(([key]) => key.startsWith(prefix))
    .map(([key, name]) => ({ key, name }))
    .sort((a, b) => a.key.localeCompare(b.key))
}

// Props
const props = defineProps<{
  modelValue: string[]
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

// 选中的技能
const selectedSkills = ref<Skill[]>([])
// 搜索关键词
const searchKeyword = ref('')
// 选中的分类
const selectedCategory = ref('1')
// 选中的子分类
const selectedSubcategory = ref('')

// 当前分类
const currentCategory = computed(() => {
  return categories.value.find(category => category.id === selectedCategory.value)
})

// 当前技能列表
const currentSkills = computed(() => {
  if (!currentCategory.value) return []
  
  let skills: Skill[] = []
  
  if (selectedSubcategory.value) {
    // 显示选中的子分类技能
    const subcategory = currentCategory.value.subcategories.find(sub => sub.id === selectedSubcategory.value)
    if (subcategory) {
      skills = subcategory.skills
    }
  } else {
    // 显示当前分类下所有子分类的技能
    currentCategory.value.subcategories.forEach(subcategory => {
      skills = [...skills, ...subcategory.skills]
    })
  }
  
  // 应用搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    skills = skills.filter(skill => 
      skill.key.toLowerCase().includes(keyword) || 
      skill.name.toLowerCase().includes(keyword)
    )
  }
  
  return skills
})

// 监听分类变化，重置子分类选择
watch(selectedCategory, () => {
  selectedSubcategory.value = ''
})

// 初始化选中的技能
watch(() => props.modelValue, (newValue) => {
  selectedSkills.value = newValue.map(key => ({
    key,
    name: bossSkillMap[key] || key
  }))
}, { immediate: true })

// 检查技能是否已选中
const isSelected = (key: string) => {
  return selectedSkills.value.some(skill => skill.key === key)
}

// 切换技能选择
const toggleSkill = (key: string) => {
  const index = selectedSkills.value.findIndex(skill => skill.key === key)
  if (index > -1) {
    selectedSkills.value.splice(index, 1)
  } else {
    selectedSkills.value.push({
      key,
      name: bossSkillMap[key] || key
    })
  }
  updateModelValue()
}

// 移除技能
const removeSkill = (index: number) => {
  selectedSkills.value.splice(index, 1)
  updateModelValue()
}

// 清空所有技能
const clearAll = () => {
  selectedSkills.value = []
  updateModelValue()
}

// 更新modelValue
const updateModelValue = () => {
  emit('update:modelValue', selectedSkills.value.map(skill => skill.key))
}

// 拖拽相关
const draggedSkill = ref<Skill | null>(null)

const onDragStart = (event: DragEvent, skill: Skill) => {
  draggedSkill.value = skill
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
  }
}

const onDragEnd = () => {
  draggedSkill.value = null
}
</script>

<style scoped>
.skill-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 600px;
  overflow: hidden;
  width: 600px;
  max-width: 100%;
}

.search-section {
  flex-shrink: 0;
}

.search-input {
  width: 100%;
}

.category-tabs {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.category-radio-group {
  width: 100%;
  max-width: 100%;
}

.subcategory-tabs {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.subcategory-radio-group {
  width: 100%;
  max-width: 100%;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-categories {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
}

.skill-item {
  padding: 5px 4px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
  text-align: center;
}

.skill-item:hover {
  border-color: #409eff;
  background: #f0f9ff;
}

.skill-item.selected {
  border-color: #409eff;
  background: #e6f7ff;
}

.skill-name {
  font-size: 14px;
  color: #303133;
  line-height: 1.4;
  word-break: break-word;
}

.selected-skills {
  flex-shrink: 0;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
  max-height: 180px;
}

.selected-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.selected-skills h3 {
  margin: 0;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.selected-list {
  max-height: 500px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-skill-tag {
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #909399;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* PC端优化 */
@media (min-width: 1024px) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .skill-item {
    padding: 8px 16px;
  }
  
  .skill-name {
    font-size: 15px;
  }
}

/* 确保PC端至少2列 */
@media (min-width: 768px) {
  .skills-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
  }
}

@media (max-width: 768px) {
  .skill-selector {
    max-height: none;
    min-width: auto;
  }
  
  .category-radio-group {
    flex-direction: column;
    gap: 6px;
  }
  
  .subcategory-radio-group {
    flex-direction: column;
    gap: 4px;
  }
  
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .selected-skills {
    max-height: 120px;
  }
}
</style>
