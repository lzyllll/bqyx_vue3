<template>
  <div class="weapon-add">
    <div class="page-header">
      <el-button @click="goBack" class="back-button">
        <el-icon><ArrowLeft /></el-icon>
        返回列表
      </el-button>
      <h1>添加武器</h1>
    </div>

    <el-card class="add-card">
      <el-form
        ref="weaponFormRef"
        :model="weaponForm"
        :rules="rules"
        label-width="120px"
        class="weapon-form"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="武器标题" prop="title">
          <el-input
            v-model="weaponForm.title"
            placeholder="请输入武器标题"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="武器描述" prop="description">
          <el-input
            v-model="weaponForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入武器描述"
          />
        </el-form-item>
        
        <el-divider content-position="left">武器配置</el-divider>
        
        <el-form-item label="武器名称" prop="cnName">
          <el-input
            v-model="weaponForm.cnName"
            placeholder="请输入武器名称"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="武器类型" prop="baseLabel">
          <el-input
            v-model="weaponForm.baseLabel"
            placeholder="请输入武器类型"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="PN" prop="pn">
          <el-input
            v-model="weaponForm.pn"
            placeholder="请输入PN"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="weaponForm.name"
            placeholder="请输入名称"
            size="large"
          />
        </el-form-item>
        
        <el-form-item label="容量">
          <el-input-number
            v-model="weaponForm.capacity"
            :min="0"
            :max="999"
            placeholder="请输入容量"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="子弹数量">
          <el-input-number
            v-model="weaponForm.bulletNum"
            :min="0"
            :max="999"
            placeholder="请输入子弹数量"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="攻击间隔">
          <el-input-number
            v-model="weaponForm.attackGap"
            :min="0"
            :precision="2"
            placeholder="请输入攻击间隔"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="重装间隔">
          <el-input-number
            v-model="weaponForm.reloadGap"
            :min="0"
            :precision="2"
            placeholder="请输入重装间隔"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="技能数组">
          <el-input
            v-model="skillArrInput"
            placeholder="请输入技能数组，用逗号分隔"
            @blur="updateSkillArr"
          />
          <div v-if="weaponForm.skillArr.length > 0" class="skill-tags">
            <el-tag
              v-for="(skill, index) in weaponForm.skillArr"
              :key="index"
              closable
              @close="removeSkill(index)"
              class="skill-tag"
            >
              {{ skill }}
            </el-tag>
          </div>
        </el-form-item>
        
        <el-form-item label="神技数组">
          <el-input
            v-model="godSkillArrInput"
            placeholder="请输入神技数组，用逗号分隔"
            @blur="updateGodSkillArr"
          />
          <div v-if="weaponForm.godSkillArr.length > 0" class="skill-tags">
            <el-tag
              v-for="(skill, index) in weaponForm.godSkillArr"
              :key="index"
              closable
              type="warning"
              @close="removeGodSkill(index)"
              class="skill-tag"
            >
              {{ skill }}
            </el-tag>
          </div>
        </el-form-item>
        
        <el-divider content-position="left">原生字符串模式</el-divider>
        
        <el-form-item label="原生字符串">
          <el-input
            v-model="rawExtraString"
            type="textarea"
            :rows="4"
            placeholder="请输入原生extra字符串"
          />
        </el-form-item>
        
        <el-form-item>
          <div class="form-actions">
            <el-button @click="goBack" size="large">
              取消
            </el-button>
            <el-button
              type="primary"
              size="large"
              :loading="weaponStore.loading"
              @click="handleSubmit"
            >
              添加武器
            </el-button>
            <el-button
              type="success"
              size="large"
              :loading="weaponStore.loading"
              @click="handleSubmitRaw"
            >
              添加原生字符串
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useWeaponStore } from '@/stores/weapon'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { WeaponObject } from '@/types'

const router = useRouter()
const weaponStore = useWeaponStore()

const weaponFormRef = ref<FormInstance>()

const weaponForm = reactive<WeaponObject & {
  title: string;
  description: string;
  skillArr: string[];
  godSkillArr: string[];
}>({
  title: '',
  description: '',
  cnName: '',
  baseLabel: '',
  pn: '',
  name: '',
  capacity: undefined,
  bulletNum: undefined,
  attackGap: undefined,
  reloadGap: undefined,
  skillArr: [],
  godSkillArr: []
})

const skillArrInput = ref('')
const godSkillArrInput = ref('')
const rawExtraString = ref('')

const rules: FormRules = {
  title: [
    { required: true, message: '请输入武器标题', trigger: 'blur' },
    { min: 2, message: '标题长度不能少于2位', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入武器描述', trigger: 'blur' },
    { min: 5, message: '描述长度不能少于5位', trigger: 'blur' }
  ],
  baseLabel: [
    { required: true, message: '请输入武器类型', trigger: 'blur' }
  ],
  pn: [
    { required: true, message: '请输入PN', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ]
}

const updateSkillArr = () => {
  if (skillArrInput.value.trim()) {
    const skills = skillArrInput.value.split(',').map(s => s.trim()).filter(s => s)
    weaponForm.skillArr = [...weaponForm.skillArr, ...skills]
    skillArrInput.value = ''
  }
}

const updateGodSkillArr = () => {
  if (godSkillArrInput.value.trim()) {
    const skills = godSkillArrInput.value.split(',').map(s => s.trim()).filter(s => s)
    weaponForm.godSkillArr = [...weaponForm.godSkillArr, ...skills]
    godSkillArrInput.value = ''
  }
}

const removeSkill = (index: number) => {
  weaponForm.skillArr.splice(index, 1)
}

const removeGodSkill = (index: number) => {
  weaponForm.godSkillArr.splice(index, 1)
}

const goBack = () => {
  router.push('/')
}

const handleSubmit = async () => {
  if (!weaponFormRef.value) return
  
  await weaponFormRef.value.validate(async (valid) => {
    if (valid) {
      const weaponData = {
        extra: {
          cnName: weaponForm.cnName,
          baseLabel: weaponForm.baseLabel,
          pn: weaponForm.pn,
          name: weaponForm.name,
          capacity: weaponForm.capacity,
          bulletNum: weaponForm.bulletNum,
          attackGap: weaponForm.attackGap,
          reloadGap: weaponForm.reloadGap,
          skillArr: weaponForm.skillArr,
          godSkillArr: weaponForm.godSkillArr
        },
        title: weaponForm.title,
        description: weaponForm.description
      }
      
      const result = await weaponStore.addWeapon(weaponData)
      
      if (result.success) {
        ElMessage.success('武器添加成功')
        router.push('/')
      } else {
        ElMessage.error(result.message)
      }
    }
  })
}

const handleSubmitRaw = async () => {
  if (!weaponFormRef.value) return
  
  // 只验证标题和描述
  const basicRules = {
    title: [
      { required: true, message: '请输入武器标题', trigger: 'blur' },
      { min: 2, message: '标题长度不能少于2位', trigger: 'blur' }
    ],
    description: [
      { required: true, message: '请输入武器描述', trigger: 'blur' },
      { min: 5, message: '描述长度不能少于5位', trigger: 'blur' }
    ]
  }
  
  if (!weaponForm.title || weaponForm.title.length < 2) {
    ElMessage.error('请输入有效的武器标题')
    return
  }
  
  if (!weaponForm.description || weaponForm.description.length < 5) {
    ElMessage.error('请输入有效的武器描述')
    return
  }
  
  if (!rawExtraString.value.trim()) {
    ElMessage.error('请输入原生字符串')
    return
  }
  
  const weaponData = {
    extra: rawExtraString.value.trim(),
    title: weaponForm.title,
    description: weaponForm.description
  }
  
  const result = await weaponStore.addWeapon(weaponData)
  
  if (result.success) {
    ElMessage.success('武器添加成功')
    router.push('/')
  } else {
    ElMessage.error(result.message)
  }
}
</script>

<style scoped>
.weapon-add {
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

.weapon-form {
  padding: 24px 0;
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

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  width: 100%;
}

@media (max-width: 768px) {
  .weapon-add {
    max-width: 100%;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .el-button {
    width: 100%;
  }
}
</style>
