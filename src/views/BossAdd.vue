<template>
  <div class="boss-add">
    <div class="page-header">
      <el-button @click="goBack" class="back-button">
        <el-icon>
          <ArrowLeft />
        </el-icon>
        返回列表
      </el-button>
      <h1>添加Boss</h1>
    </div>
    
    <!-- 模式选择 -->
    <div v-if="!selectedMode" class="mode-selection">
      <el-card class="mode-card">
        <h2>选择添加模式</h2>
        <p>请选择您想要使用的Boss添加方式</p>
        <div class="mode-buttons">
          <el-button 
            type="primary" 
            size="large" 
            @click="selectMode('custom')"
            class="mode-button"
          >
            <el-icon><Edit /></el-icon>
            自定义编辑模式
            
          </el-button>
          <el-button 
            type="success" 
            size="large" 
            @click="selectMode('raw')"
            class="mode-button"
          >
            <el-icon><Document /></el-icon>
            原生字符串模式
          
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 自定义编辑模式 -->
    <div v-if="selectedMode === 'custom'" class="custom-mode">
      <el-card class="add-card">
        <el-form ref="bossFormRef" :model="bossForm" :rules="rules" label-width="80px" class="boss-form"
          @submit.prevent="handleSubmit">
          
          <!-- 基本信息 -->
          <div class="form-section">
            <h3 class="section-title">基本信息</h3>
            <div class="form-row">
              <el-form-item label="标题" prop="title" class="form-item-full">
                <el-input v-model="bossForm.title" placeholder="请输入Boss标题" />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="描述" prop="description" class="form-item-full">
                <el-input v-model="bossForm.description" type="textarea" :rows="4" placeholder="请输入Boss描述" />
              </el-form-item>
            </div>
          </div>

          <!-- Boss配置 -->
          <div class="form-section">
            <h3 class="section-title">Boss配置</h3>
            <div class="form-row">
              <el-form-item label="首领类型" prop="n" class="form-item-half">
                <el-cascader
                  v-model="bossTypeCascaderValue"
                  :options="bossTypeCascaderOptions"
                  :props="{ expandTrigger: 'hover' }"
                  placeholder="请选择Boss类型"
                  filterable
                  clearable
                  @change="onBossTypeCascaderChange"
                  style="width: 100%;"
                />
              </el-form-item>
              <el-form-item label="发布人" prop="pn" class="form-item-half">
                <el-input v-model="bossForm.pn" placeholder="请输入昵称" />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="UID" class="form-item-half">
                <el-input v-model="bossForm.ud" placeholder="请输入UID+index" />
              </el-form-item>
              <el-form-item label="地图" class="form-item-half">
                <el-cascader
                  v-model="mapCascaderValue"
                  :options="mapCascaderOptions"
                  :props="{ expandTrigger: 'hover' }"
                  placeholder="请选择地图"
                  filterable
                  clearable
                  @change="onMapCascaderChange"
                  style="width: 100%;"
                />
              </el-form-item>
            </div>
            <div class="form-row numbers-row">
              <el-form-item label="等级" class="form-item-quarter">
                <el-input-number 
                  v-model="bossForm.lv" 
                  :min="40" 
                  :max="99" 
                  placeholder="等级" 
                  :controls="false"
                  :step="1"
                  class="number-input"
                />
              </el-form-item>
              <el-form-item label="生命系数" class="form-item-quarter">
                <el-input-number 
                  v-model="bossForm.li" 
                  :max="2147483647" 
                  placeholder="生命系数" 
                  :controls="false"
                  :step="1"
                  class="number-input"
                />
              </el-form-item>
              <el-form-item label="伤害系数" class="form-item-quarter">
                <el-input-number 
                  v-model="bossForm.dp" 
                  :max="2147483647" 
                  placeholder="伤害系数" 
                  :controls="false"
                  :step="1"
                  class="number-input"
                />
              </el-form-item>
              <el-form-item label="倒计时" class="form-item-quarter">
                <el-input-number 
                  v-model="bossForm.tm" 
                  :max="2147483647" 
                  placeholder="倒计时(秒)" 
                  :controls="false"
                  :step="1"
                  class="number-input"
                />
              </el-form-item>
            </div>
          </div>

          <!-- 技能和武器 -->
          <div class="form-section">
            <h3 class="section-title">技能和武器</h3>
            <el-form-item label="技能数组">
              <el-tabs v-model="skillInputMode" class="skill-tabs">
                <el-tab-pane label="可视化选择" name="visual">
                  <SkillSelector v-model="bossForm.sk" />
                </el-tab-pane>
                <el-tab-pane label="手动输入" name="manual">
                  <el-input v-model="skInput" placeholder="请输入技能数组，用逗号分隔" @blur="updateSk" />
                  <div v-if="bossForm.sk.length > 0" class="skill-tags">
                    <el-tag v-for="(skill, index) in displaySkills" :key="index" closable @close="removeSk(index)"
                      class="skill-tag">
                      {{ skill.displayName}}
                    </el-tag>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-form-item>

            <el-form-item label="武器数组">
              <el-input v-model="arInput" placeholder="请输入武器数组，用逗号分隔" @blur="updateAr" />
              <div v-if="bossForm.ar.length > 0" class="arm-tags">
                <el-tag v-for="(arm, index) in bossForm.ar" :key="index" closable @close="removeAr(index)" 
                class="arm-tag">
                  {{ arm }}
                </el-tag>
              </div>
            </el-form-item>
          </div>

          <!-- Boss标志 -->
          <div class="form-section">
            <h3 class="section-title">Boss标志</h3>
            <div class="switch-grid">
              <div class="switch-item">
                <el-switch v-model="bossForm.si" />
                <span class="switch-label">强制单人</span>
              </div>
              <div class="switch-item">
                <el-switch v-model="bossForm.ve" />
                <span class="switch-label">禁止载具</span>
              </div>
              <div class="switch-item">
                <el-switch v-model="bossForm.pa" />
                <span class="switch-label">禁止队友</span>
              </div>
              <div class="switch-item">
                <el-switch v-model="bossForm.pr" />
                <span class="switch-label">禁止道具</span>
              </div>
              <div class="switch-item">
                <el-switch v-model="bossForm.pe" />
                <span class="switch-label">禁止尸宠</span>
              </div>
              <div class="switch-item">
                <el-switch v-model="bossForm.hb" />
                <span class="switch-label">困难设定</span>
              </div>
              <div class="switch-item">
                <el-switch v-model="bossForm.sc" />
                <span class="switch-label">关闭自身技能</span>
              </div>
            </div>
          </div>

          <el-form-item>
            <div class="form-actions">
              <el-button @click="resetMode" size="large">
                返回模式选择
              </el-button>
              <el-button @click="goBack" size="large">
                取消
              </el-button>
              <el-button type="primary" size="large" :loading="bossStore.loading" @click="handleSubmit">
                添加Boss
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 原生字符串模式 -->
    <div v-if="selectedMode === 'raw'">
      <el-card class="add-card">
        <el-form ref="rawFormRef" :model="rawForm" :rules="rawRules" label-width="120px" class="boss-form"
          @submit.prevent="handleSubmitRaw">
          <el-form-item label="Boss标题" prop="title">
            <el-input v-model="rawForm.title" placeholder="请输入Boss标题" size="large" />
          </el-form-item>

          <el-form-item label="Boss描述" prop="description">
            <el-input v-model="rawForm.description" type="textarea" :rows="4" placeholder="请输入Boss描述" />
          </el-form-item>

          <el-form-item label="原生字符串" prop="extra">
            <el-input 
              v-model="rawForm.extra" 
              type="textarea" 
              :rows="8" 
              placeholder="请输入原生extra字符串" 
            />
          </el-form-item>

          <el-form-item>
            <div class="form-actions">
              <el-button @click="resetMode" size="large">
                返回模式选择
              </el-button>
              <el-button @click="goBack" size="large">
                取消
              </el-button>
              <el-button type="success" size="large" :loading="bossStore.loading" @click="handleSubmitRaw">
                添加Boss
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBossStore } from '@/stores/boss'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Edit, Document } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { BossObject } from '@/types'
import bossSkillMapRaw from '@/assets/data/EditBossSkill.json'
import mapDataRaw from '@/assets/data/map.json'
import bossTypeDataRaw from '@/assets/data/EditBoss.json'
import SkillSelector from '@/components/SkillSelector.vue'
//类型声明
//加载对照
const bossSkillMap = bossSkillMapRaw as Record<string, string>
const mapData = mapDataRaw as any
const bossTypeData = bossTypeDataRaw as any

const router = useRouter()
const bossStore = useBossStore()

// 模式选择状态
const selectedMode = ref<'custom' | 'raw' | null>(null)

// 表单引用
const bossFormRef = ref<FormInstance>()
const rawFormRef = ref<FormInstance>()

// 原生字符串表单
const rawForm = reactive({
  title: '',
  description: '',
  extra: ''
})

// 地图级联选择器数据
const mapCascaderOptions = computed(() => {
  return Object.entries(mapData).map(([categoryKey, categoryData]) => ({
    value: categoryKey,
    label: getMapCategoryLabel(categoryKey),
    children: Object.entries(categoryData as Record<string, any>).map(([mapKey, mapName]) => ({
      value: mapKey,
      label: String(mapName)
    }))
  }))
})

// 获取地图分类标签
const getMapCategoryLabel = (categoryKey: string) => {
  const labels: { [key: string]: string } = {
    'space': '太空区域',
    'spaceTask': '太空任务',
    'big': '大型区域',
    'other': '其他区域',
    'task': '任务区域',
    'infected_area': '感染区域'
  }
  return labels[categoryKey] || categoryKey
}

// Boss类型级联选择器数据
const bossTypeCascaderOptions = computed(() => {
  return Object.entries(bossTypeData).map(([categoryKey, categoryData]) => ({
    value: categoryKey,
    label: getCategoryLabel(categoryKey),
    children: Object.entries(categoryData as Record<string, any>).map(([typeKey, typeName]) => ({
      value: typeKey,
      label: String(typeName)
    }))
  }))
})

// 获取分类标签
const getCategoryLabel = (categoryKey: string) => {
  const labels: { [key: string]: string } = {
    'vehicle': '载具',
    'enemy': '敌人', 
    'we': '我方',
    'wilder': '秘境'
  }
  return labels[categoryKey] || categoryKey
}



// Boss类型级联选择器值
const bossTypeCascaderValue = ref<string[]>([])

// Boss类型级联选择器变化处理
const onBossTypeCascaderChange = (value: any) => {
  if (value && Array.isArray(value) && value.length === 2) {
    bossForm.n = value[1] // 取第二个值作为具体类型
  } else {
    bossForm.n = ''
  }
}

// 地图级联选择器值
const mapCascaderValue = ref<string[]>([])

// 地图级联选择器变化处理
const onMapCascaderChange = (value: any) => {
  if (value && Array.isArray(value) && value.length === 2) {
    bossForm.mp = value[1] // 取第二个值作为具体地图
  } else {
    bossForm.mp = ''
  }
}

// 原生字符串表单验证规则
const rawRules: FormRules = {
  title: [
    { required: true, message: '请输入Boss标题', trigger: 'blur' },
    { min: 2, message: '标题长度不能少于2位', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入Boss描述', trigger: 'blur' },
    { min: 5, message: '描述长度不能少于5位', trigger: 'blur' }
  ],
  extra: [
    { required: true, message: '请输入原生字符串', trigger: 'blur' }
  ]
}

//不用display了，不然每变化一下，就要重新渲染
//添加页面会动态变化，而 list,detail不需要管
const displaySkills = computed(() => {
  // 只有 bossForm.sk 变化时才执行
  return bossForm.sk.map(skill => ({
    key: skill,
    displayName: bossSkillMap[skill] || '未知的技能' + skill
  }))
})


const bossForm = reactive<BossObject & {
  title: string;
  description: string;
  sk:string[],
  ar:string[],
}>({
  title: '',
  description: '',
  n: '',
  pn: '',
  ud: '',
  mp: '',
  lv: 40,
  li: 1,
  dp: 1,
  tm: 0,
  sk: [],
  ar: [],
  si: false,
  ve: false,
  pa: false,
  pr: false,
  pe: false,
  hb: false,
  sc: false,
})

const skInput = ref('')
const rawExtraString = ref('')
const arInput = ref('')
const skillInputMode = ref('visual')
const rules: FormRules = {
  title: [
    { required: true, message: '请输入Boss标题', trigger: 'blur' },
    { min: 2, message: '标题长度不能少于2位', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入Boss描述', trigger: 'blur' },
    { min: 5, message: '描述长度不能少于5位', trigger: 'blur' }
  ],
  n: [
    { required: true, message: '请输入Boss名称', trigger: 'blur' }
  ],
  pn: [
    { required: true, message: '请输入PN', trigger: 'blur' }
  ]
}

const updateSk = () => {
  if (skInput.value.trim()) {
    const skills = skInput.value.split(',').map(s => s.trim()).filter(s => s)
    bossForm.sk = [...bossForm.sk, ...skills]
    skInput.value = ''
  }
}


const updateAr = () => {
  if (arInput.value.trim()) {
    const skills = arInput.value.split(',').map(s => s.trim()).filter(s => s)
    bossForm.ar = [...bossForm.ar, ...skills]
    arInput.value = ''
  }
}


const removeSk = (index: number) => {
  bossForm.sk.splice(index, 1)
}

const removeAr = (index: number) => {
  bossForm.ar.splice(index, 1)
}

// 模式选择方法
const selectMode = (mode: 'custom' | 'raw') => {
  selectedMode.value = mode
}

const resetMode = () => {
  selectedMode.value = null
}

const goBack = () => {
  router.push('/boss')
}

const handleSubmit = async () => {
  if (!bossFormRef.value) return

  await bossFormRef.value.validate(async (valid) => {
    if (valid) {
      const bossData = {
        extra: {
           n: bossForm.n,
          pn: bossForm.pn,
          ud: bossForm.ud,
          mp: bossForm.mp,
          lv: bossForm.lv,
          li: bossForm.li,
          dp: bossForm.dp,
          tm: bossForm.tm,
          sk: bossForm.sk,
          ar: bossForm.ar,
          si: bossForm.si,
          ve: bossForm.ve,
          pa: bossForm.pa,
          pr: bossForm.pr,
          pe: bossForm.pe,
          hb: bossForm.hb,
          sc: bossForm.sc,
        },
        title: bossForm.title,
        description: bossForm.description
      }

      const result = await bossStore.addBoss(bossData)

      if (result.success) {
        ElMessage.success('Boss添加成功')
        router.push('/boss')
      } else {
        ElMessage.error(result.message)
      }
    }
  })
}

const handleSubmitRaw = async () => {
  if (!rawFormRef.value) return

  await rawFormRef.value.validate(async (valid) => {
    if (valid) {
      const bossData = {
        extra: rawForm.extra.trim(),
        title: rawForm.title,
        description: rawForm.description
      }

      const result = await bossStore.addBoss(bossData)

      if (result.success) {
        ElMessage.success('Boss添加成功')
        router.push('/boss')
      } else {
        ElMessage.error(result.message)
      }
    }
  })
}
</script>

<style scoped>
.boss-add {
  max-width: 1000px;
  margin: 0 auto;
}

.custom-mode {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-header h1 {
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.add-card {
  border-radius: 8px;
}

.boss-form {
  padding: 24px 0;
}

/* 表单分组样式 */
.form-section {
  margin-bottom: 32px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.section-title {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid #409eff;
  padding-bottom: 8px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row:last-child {
  margin-bottom: 0;
}

/* 表单项宽度 */
.form-item-half {
  flex: 1;
}

.form-item-quarter {
  flex: 1;
}

.form-item-full {
  width: 100%;
}

/* 数字输入框样式 */
.number-input {
  width: 100%;
}

.number-input :deep(.el-input-number) {
  width: 100%;
}

.number-input :deep(.el-input-number__input) {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  text-align: center;
  padding: 8px 12px;
}

/* 数字行flex布局 */
.numbers-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.numbers-row .form-item-quarter {
  flex: 1;
  min-width: 0;
}

/* 响应式断点 */
@media (max-width: 1200px) {
  .numbers-row {
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .numbers-row {
    flex-direction: column;
    gap: 8px;
  }
  
  .numbers-row .form-item-quarter {
    flex: none;
    width: 100%;
  }
}

/* 开关网格布局 */
.switch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px 0;
}

.switch-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  transition: all 0.2s;
}

.switch-item:hover {
  border-color: #409eff;
  background: #f0f9ff;
}

.switch-label {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

/* Boss类型级联选择器样式 */
.el-cascader {
  width: 100%;
}

.skill-tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}


.skill-tag {
  margin: 0;
}

.arm-tag{
  margin: 0;
}

.arm-tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  width: 100%;
}

@media (max-width: 768px) {
  .boss-add {
    max-width: 100%;
  }

  .custom-mode {
    max-width: 100%;
  }

  .form-section {
    padding: 16px;
    margin-bottom: 24px;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .numbers-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .switch-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .el-button {
    width: 100%;
  }
}

.skill-tabs {
  margin-top: 8px;
}

/* 模式选择样式 */
.mode-selection {
  max-width: 600px;
  margin: 0 auto;
}

.mode-card {
  text-align: center;
  padding: 40px 20px;
}

.mode-card h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.mode-card p {
  margin: 0 0 32px 0;
  color: #606266;
  font-size: 16px;
}

.mode-buttons {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.mode-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 32px;
  min-width: 200px;
  height: auto;
  border-radius: 8px;
  transition: all 0.3s;
}

.mode-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.mode-button .el-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.mode-description {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .mode-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .mode-button {
    width: 100%;
    max-width: 300px;
  }
}
</style>
