<template>
  <div class="boss-edit">
    <div class="page-header">
      <el-button @click="goBack" class="back-button">
        <el-icon>
          <ArrowLeft />
        </el-icon>
        返回详情
      </el-button>
      <h1>修改Boss</h1>
    </div>
    <el-card class="edit-card">
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

        <!-- 原生字符串模式 -->
        <div class="form-section">
          <h3 class="section-title">原生字符串模式</h3>
          <el-form-item label="原生字符串">
            <el-input v-model="rawExtraString" type="textarea" :rows="4" placeholder="请输入原生extra字符串" />
          </el-form-item>
        </div>

        <el-form-item>
          <div class="form-actions">
            <el-button @click="goBack" size="large">
              取消
            </el-button>
            <el-button type="primary" size="large" :loading="bossStore.loading" @click="handleSubmit">
              修改Boss
            </el-button>
            <el-button type="success" size="large" :loading="bossStore.loading" @click="handleSubmitRaw">
              修改原生字符串
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBossStore } from '@/stores/boss'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
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
const route = useRoute()
const bossStore = useBossStore()

const bossFormRef = ref<FormInstance>()

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

const goBack = () => {
  router.push(`/boss/${route.params.id}`)
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

      const result = await bossStore.updateBoss(Number(route.params.id), bossData)

      if (result.success) {
        ElMessage.success('Boss修改成功')
        router.push(`/boss/${route.params.id}`)
      } else {
        ElMessage.error(result.message)
      }
    }
  })
}

const handleSubmitRaw = async () => {
  if (!bossFormRef.value) return

  // 只验证标题和描述
  if (!bossForm.title || bossForm.title.length < 2) {
    ElMessage.error('请输入有效的Boss标题')
    return
  }

  if (!bossForm.description || bossForm.description.length < 5) {
    ElMessage.error('请输入有效的Boss描述')
    return
  }

  if (!rawExtraString.value.trim()) {
    ElMessage.error('请输入原生字符串')
    return
  }

  const bossData = {
    extra: rawExtraString.value.trim(),
    title: bossForm.title,
    description: bossForm.description
  }

  const result = await bossStore.updateBoss(Number(route.params.id), bossData)

  if (result.success) {
    ElMessage.success('Boss修改成功')
    router.push(`/boss/${route.params.id}`)
  } else {
    ElMessage.error(result.message)
  }
}

// 初始化表单数据
const initForm = () => {
  if (bossStore.currentBoss) {
    bossForm.title = bossStore.currentBoss.title
    bossForm.description = bossStore.currentBoss.description
    
    if (bossStore.currentBoss.extra_obj) {
      const extra = bossStore.currentBoss.extra_obj
      bossForm.n = extra.n || ''
      bossForm.pn = extra.pn || ''
      bossForm.ud = extra.ud || ''
      bossForm.mp = extra.mp || ''
      bossForm.lv = extra.lv || 40
      bossForm.li = extra.li || 1
      bossForm.dp = extra.dp || 1
      bossForm.tm = extra.tm || 0
      bossForm.sk = extra.sk || []
      bossForm.ar = extra.ar || []
      bossForm.si = extra.si || false
      bossForm.ve = extra.ve || false
      bossForm.pa = extra.pa || false
      bossForm.pr = extra.pr || false
      bossForm.pe = extra.pe || false
      bossForm.hb = extra.hb || false
      bossForm.sc = extra.sc || false
      
      // 根据已选择的Boss类型自动设置级联选择器值
      if (extra.n) {
        for (const category in bossTypeData) {
          if (bossTypeData[category][extra.n]) {
            bossTypeCascaderValue.value = [category, extra.n]
            break
          }
        }
      }
      
      // 根据已选择的地图自动设置级联选择器值
      if (extra.mp) {
        for (const category in mapData) {
          if (mapData[category][extra.mp]) {
            mapCascaderValue.value = [category, extra.mp]
            break
          }
        }
      }
    }
    
    if (bossStore.currentBoss.extra) {
      rawExtraString.value = bossStore.currentBoss.extra
    }
  }
}

onMounted(async () => {
  const bossId = Number(route.params.id)
  if (bossId) {
    await bossStore.fetchBoss(bossId)
    initForm()
  }
})
</script>

<style scoped>
.boss-edit {
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

.edit-card {
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

/* 响应式断点 */
@media (max-width: 1200px) {
  .numbers-row {
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .boss-edit {
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
    flex-direction: column;
    gap: 8px;
  }

  .numbers-row .form-item-quarter {
    flex: none;
    width: 100%;
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
</style>
