<template>
  <div class="weapon-edit">
    <div class="page-header">
      <el-button @click="goBack" class="back-button">
        <el-icon>
          <ArrowLeft />
        </el-icon>
        返回详情
      </el-button>
      <h1>修改武器</h1>
    </div>
    <el-card class="edit-card">
      <el-form ref="weaponFormRef" :model="weaponForm" :rules="rules" label-width="120px" class="weapon-form"
        @submit.prevent="handleSubmit">
        <el-form-item label="武器标题" prop="title">
          <el-input v-model="weaponForm.title" placeholder="请输入武器标题" size="large" />
        </el-form-item>

        <el-form-item label="武器描述" prop="description">
          <el-input v-model="weaponForm.description" type="textarea" :rows="4" placeholder="请输入武器描述" />
        </el-form-item>

        <el-divider content-position="left">武器配置</el-divider>

        <el-form-item label="武器名称">
          <el-input v-model="weaponForm.cnName" placeholder="请输入武器名称" size="large" />
        </el-form-item>

        <el-form-item label="武器类型">
          <el-input v-model="weaponForm.baseLabel" placeholder="请输入武器类型" size="large" />
        </el-form-item>

        <el-form-item label="PN">
          <el-input v-model="weaponForm.pn" placeholder="请输入PN" size="large" />
        </el-form-item>

        <el-form-item label="名称">
          <el-input v-model="weaponForm.name" placeholder="请输入名称" size="large" />
        </el-form-item>

        <el-form-item label="容量">
          <el-input-number v-model="weaponForm.capacity" :min="0" placeholder="请输入容量" style="width: 100%" />
        </el-form-item>

        <el-form-item label="子弹数量">
          <el-input-number v-model="weaponForm.bulletNum" :min="0" placeholder="请输入子弹数量" style="width: 100%" />
        </el-form-item>

        <el-form-item label="攻击间隔">
          <el-input-number v-model="weaponForm.attackGap" :min="0" :precision="2" placeholder="请输入攻击间隔" style="width: 100%" />
        </el-form-item>

        <el-form-item label="重装间隔">
          <el-input-number v-model="weaponForm.reloadGap" :min="0" :precision="2" placeholder="请输入重装间隔" style="width: 100%" />
        </el-form-item>

        <el-form-item label="子弹宽度">
          <el-input-number v-model="weaponForm.bulletWidth" :min="0" placeholder="请输入子弹宽度" style="width: 100%" />
        </el-form-item>

        <el-form-item label="穿透数量">
          <el-input-number v-model="weaponForm.penetrationNum" :min="0" placeholder="请输入穿透数量" style="width: 100%" />
        </el-form-item>

        <el-form-item label="穿透间隔">
          <el-input-number v-model="weaponForm.penetrationGap" :min="0" :precision="2" placeholder="请输入穿透间隔" style="width: 100%" />
        </el-form-item>

        <el-form-item label="射击角度">
          <el-input-number v-model="weaponForm.shootAngle" :min="0" placeholder="请输入射击角度" style="width: 100%" />
        </el-form-item>

        <el-form-item label="双发概率">
          <el-input-number v-model="weaponForm.twoShootPro" :min="0" :max="1" :precision="2" placeholder="请输入双发概率" style="width: 100%" />
        </el-form-item>

        <el-form-item label="子弹生命">
          <el-input-number v-model="weaponForm.bulletLife" :min="0" placeholder="请输入子弹生命" style="width: 100%" />
        </el-form-item>

        <el-form-item label="射击音效">
          <el-input v-model="weaponForm.shootSoundUrl" placeholder="请输入射击音效URL" size="large" />
        </el-form-item>

        <el-form-item label="子弹图片">
          <el-input v-model="weaponForm.bulletImg" placeholder="请输入子弹图片URL" size="large" />
        </el-form-item>

        <el-form-item label="命中图片">
          <el-input v-model="weaponForm.hitImg" placeholder="请输入命中图片URL" size="large" />
        </el-form-item>

        <el-form-item label="技能数组">
          <el-input v-model="skillInput" placeholder="请输入技能数组，用逗号分隔" @blur="updateSkills" />
          <div v-if="weaponForm.skillArr.length > 0" class="skill-tags">
            <el-tag v-for="(skill, index) in weaponForm.skillArr" :key="index" closable @close="removeSkill(index)"
              class="skill-tag">
              {{ skill }}
            </el-tag>
          </div>
        </el-form-item>

        <el-form-item label="神技数组">
          <el-input v-model="godSkillInput" placeholder="请输入神技数组，用逗号分隔" @blur="updateGodSkills" />
          <div v-if="weaponForm.godSkillArr.length > 0" class="skill-tags">
            <el-tag v-for="(skill, index) in weaponForm.godSkillArr" :key="index" closable @close="removeGodSkill(index)"
              class="skill-tag" type="warning">
              {{ skill }}
            </el-tag>
          </div>
        </el-form-item>

        <el-divider content-position="left">弹跳数据</el-divider>

        <el-form-item label="伤害增加">
          <el-input-number v-model="weaponForm.bounceD.hurtNumAdd" :min="0" placeholder="请输入伤害增加" style="width: 100%" />
        </el-form-item>

        <el-form-item label="身体">
          <el-input-number v-model="weaponForm.bounceD.body" :min="0" placeholder="请输入身体" style="width: 100%" />
        </el-form-item>

        <el-form-item label="地面">
          <el-input-number v-model="weaponForm.bounceD.floor" :min="0" placeholder="请输入地面" style="width: 100%" />
        </el-form-item>

        <el-divider content-position="left">原生字符串模式</el-divider>

        <el-form-item label="原生字符串">
          <el-input v-model="rawExtraString" type="textarea" :rows="4" placeholder="请输入原生extra字符串" />
        </el-form-item>

        <el-form-item>
          <div class="form-actions">
            <el-button @click="goBack" size="large">
              取消
            </el-button>
            <el-button type="primary" size="large" :loading="weaponStore.loading" @click="handleSubmit">
              修改武器
            </el-button>
            <el-button type="success" size="large" :loading="weaponStore.loading" @click="handleSubmitRaw">
              修改原生字符串
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWeaponStore } from '@/stores/weapon'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { WeaponObject } from '@/types'

const router = useRouter()
const route = useRoute()
const weaponStore = useWeaponStore()

const weaponFormRef = ref<FormInstance>()

const weaponForm = reactive<WeaponObject & {
  title: string;
  description: string;
  skillArr: string[];
  godSkillArr: string[];
  bounceD: {
    hurtNumAdd?: number;
    body?: number;
    floor?: number;
  };
}>({
  title: '',
  description: '',
  cnName: '',
  baseLabel: '',
  pn: '',
  name: '',
  capacity: 0,
  bulletNum: 0,
  attackGap: 0,
  reloadGap: 0,
  bulletWidth: 0,
  penetrationNum: 0,
  penetrationGap: 0,
  shootAngle: 0,
  twoShootPro: 0,
  bulletLife: 0,
  shootSoundUrl: '',
  bulletImg: '',
  hitImg: '',
  skillArr: [],
  godSkillArr: [],
  bounceD: {
    hurtNumAdd: 0,
    body: 0,
    floor: 0
  }
})

const skillInput = ref('')
const godSkillInput = ref('')
const rawExtraString = ref('')

const rules: FormRules = {
  title: [
    { required: true, message: '请输入武器标题', trigger: 'blur' },
    { min: 2, message: '标题长度不能少于2位', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入武器描述', trigger: 'blur' },
    { min: 5, message: '描述长度不能少于5位', trigger: 'blur' }
  ]
}

const updateSkills = () => {
  if (skillInput.value.trim()) {
    const skills = skillInput.value.split(',').map(s => s.trim()).filter(s => s)
    weaponForm.skillArr = [...weaponForm.skillArr, ...skills]
    skillInput.value = ''
  }
}

const updateGodSkills = () => {
  if (godSkillInput.value.trim()) {
    const skills = godSkillInput.value.split(',').map(s => s.trim()).filter(s => s)
    weaponForm.godSkillArr = [...weaponForm.godSkillArr, ...skills]
    godSkillInput.value = ''
  }
}

const removeSkill = (index: number) => {
  weaponForm.skillArr.splice(index, 1)
}

const removeGodSkill = (index: number) => {
  weaponForm.godSkillArr.splice(index, 1)
}

const goBack = () => {
  router.push(`/weapon/${route.params.id}`)
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
          bulletWidth: weaponForm.bulletWidth,
          penetrationNum: weaponForm.penetrationNum,
          penetrationGap: weaponForm.penetrationGap,
          shootAngle: weaponForm.shootAngle,
          twoShootPro: weaponForm.twoShootPro,
          bulletLife: weaponForm.bulletLife,
          shootSoundUrl: weaponForm.shootSoundUrl,
          bulletImg: weaponForm.bulletImg,
          hitImg: weaponForm.hitImg,
          skillArr: weaponForm.skillArr,
          godSkillArr: weaponForm.godSkillArr,
          bounceD: weaponForm.bounceD
        },
        title: weaponForm.title,
        description: weaponForm.description
      }

      const result = await weaponStore.updateWeapon(Number(route.params.id), weaponData)

      if (result.success) {
        ElMessage.success('武器修改成功')
        router.push(`/weapon/${route.params.id}`)
      } else {
        ElMessage.error(result.message)
      }
    }
  })
}

const handleSubmitRaw = async () => {
  if (!weaponFormRef.value) return

  // 只验证标题和描述
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

  const result = await weaponStore.updateWeapon(Number(route.params.id), weaponData)

  if (result.success) {
    ElMessage.success('武器修改成功')
    router.push(`/weapon/${route.params.id}`)
  } else {
    ElMessage.error(result.message)
  }
}

// 初始化表单数据
const initForm = () => {
  if (weaponStore.currentWeapon) {
    weaponForm.title = weaponStore.currentWeapon.title
    weaponForm.description = weaponStore.currentWeapon.description
    
    if (weaponStore.currentWeapon.extra_obj) {
      const extra = weaponStore.currentWeapon.extra_obj
      weaponForm.cnName = extra.cnName || ''
      weaponForm.baseLabel = extra.baseLabel || ''
      weaponForm.pn = extra.pn || ''
      weaponForm.name = extra.name || ''
      weaponForm.capacity = extra.capacity || 0
      weaponForm.bulletNum = extra.bulletNum || 0
      weaponForm.attackGap = extra.attackGap || 0
      weaponForm.reloadGap = extra.reloadGap || 0
      weaponForm.bulletWidth = extra.bulletWidth || 0
      weaponForm.penetrationNum = extra.penetrationNum || 0
      weaponForm.penetrationGap = extra.penetrationGap || 0
      weaponForm.shootAngle = extra.shootAngle || 0
      weaponForm.twoShootPro = extra.twoShootPro || 0
      weaponForm.bulletLife = extra.bulletLife || 0
      weaponForm.shootSoundUrl = extra.shootSoundUrl || ''
      weaponForm.bulletImg = extra.bulletImg || ''
      weaponForm.hitImg = extra.hitImg || ''
      weaponForm.skillArr = extra.skillArr || []
      weaponForm.godSkillArr = extra.godSkillArr || []
      weaponForm.bounceD = extra.bounceD || { hurtNumAdd: 0, body: 0, floor: 0 }
    }
    
    if (weaponStore.currentWeapon.extra) {
      rawExtraString.value = weaponStore.currentWeapon.extra
    }
  }
}

onMounted(async () => {
  const weaponId = Number(route.params.id)
  if (weaponId) {
    await weaponStore.fetchWeapon(weaponId)
    initForm()
  }
})
</script>

<style scoped>
.weapon-edit {
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
  .weapon-edit {
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









