<template>
  <div class="weapon-detail">
    <div class="page-header">
      <el-button @click="goBack" class="back-button">
        <el-icon><ArrowLeft /></el-icon>
        返回列表
      </el-button>
      <h1>武器详情</h1>
    </div>

    <el-card v-loading="weaponStore.loading" class="detail-card">
      <div v-if="weaponStore.currentWeapon" class="weapon-detail-content">
        <div class="weapon-header">
          <h2>{{ weaponStore.currentWeapon.title }}</h2>
          <el-tag type="info">{{ weaponStore.currentWeapon.owner }}</el-tag>
        </div>
        
        <div class="weapon-description">
          <h3>描述</h3>
          <p>{{ weaponStore.currentWeapon.description }}</p>
        </div>
        
        <div class="weapon-extra" v-if="weaponStore.currentWeapon.extra_obj">
          <h3>武器配置</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="武器名称" v-if="weaponStore.currentWeapon.extra_obj.cnName">
              {{ weaponStore.currentWeapon.extra_obj.cnName }}
            </el-descriptions-item>
            <el-descriptions-item label="武器类型" v-if="weaponStore.currentWeapon.extra_obj.baseLabel">
              {{ weaponStore.currentWeapon.extra_obj.baseLabel }}
            </el-descriptions-item>
            <el-descriptions-item label="PN" v-if="weaponStore.currentWeapon.extra_obj.pn">
              {{ weaponStore.currentWeapon.extra_obj.pn }}
            </el-descriptions-item>
            <el-descriptions-item label="名称" v-if="weaponStore.currentWeapon.extra_obj.name">
              {{ weaponStore.currentWeapon.extra_obj.name }}
            </el-descriptions-item>
            <el-descriptions-item label="容量" v-if="weaponStore.currentWeapon.extra_obj.capacity">
              {{ weaponStore.currentWeapon.extra_obj.capacity }}
            </el-descriptions-item>
            <el-descriptions-item label="子弹数量" v-if="weaponStore.currentWeapon.extra_obj.bulletNum">
              {{ weaponStore.currentWeapon.extra_obj.bulletNum }}
            </el-descriptions-item>
            <el-descriptions-item label="攻击间隔" v-if="weaponStore.currentWeapon.extra_obj.attackGap">
              {{ weaponStore.currentWeapon.extra_obj.attackGap }}s
            </el-descriptions-item>
            <el-descriptions-item label="重装间隔" v-if="weaponStore.currentWeapon.extra_obj.reloadGap">
              {{ weaponStore.currentWeapon.extra_obj.reloadGap }}s
            </el-descriptions-item>
            <el-descriptions-item label="子弹宽度" v-if="weaponStore.currentWeapon.extra_obj.bulletWidth">
              {{ weaponStore.currentWeapon.extra_obj.bulletWidth }}
            </el-descriptions-item>
            <el-descriptions-item label="穿透数量" v-if="weaponStore.currentWeapon.extra_obj.penetrationNum">
              {{ weaponStore.currentWeapon.extra_obj.penetrationNum }}
            </el-descriptions-item>
            <el-descriptions-item label="穿透间隔" v-if="weaponStore.currentWeapon.extra_obj.penetrationGap">
              {{ weaponStore.currentWeapon.extra_obj.penetrationGap }}
            </el-descriptions-item>
            <el-descriptions-item label="射击角度" v-if="weaponStore.currentWeapon.extra_obj.shootAngle">
              {{ weaponStore.currentWeapon.extra_obj.shootAngle }}
            </el-descriptions-item>
            <el-descriptions-item label="双发概率" v-if="weaponStore.currentWeapon.extra_obj.twoShootPro">
              {{ weaponStore.currentWeapon.extra_obj.twoShootPro }}
            </el-descriptions-item>
            <el-descriptions-item label="子弹生命" v-if="weaponStore.currentWeapon.extra_obj.bulletLife">
              {{ weaponStore.currentWeapon.extra_obj.bulletLife }}
            </el-descriptions-item>
            <el-descriptions-item label="射击音效" v-if="weaponStore.currentWeapon.extra_obj.shootSoundUrl">
              {{ weaponStore.currentWeapon.extra_obj.shootSoundUrl }}
            </el-descriptions-item>
            <el-descriptions-item label="子弹图片" v-if="weaponStore.currentWeapon.extra_obj.bulletImg">
              {{ weaponStore.currentWeapon.extra_obj.bulletImg }}
            </el-descriptions-item>
            <el-descriptions-item label="命中图片" v-if="weaponStore.currentWeapon.extra_obj.hitImg">
              {{ weaponStore.currentWeapon.extra_obj.hitImg }}
            </el-descriptions-item>
          </el-descriptions>
          
          <div v-if="weaponStore.currentWeapon.extra_obj.skillArr && weaponStore.currentWeapon.extra_obj.skillArr.length > 0" class="skill-section">
            <h4>技能数组</h4>
            <div class="skill-tags">
              <el-tag v-for="skill in weaponStore.currentWeapon.extra_obj.skillArr" :key="skill" class="skill-tag">
                {{ skill }}
              </el-tag>
            </div>
          </div>
          
          <div v-if="weaponStore.currentWeapon.extra_obj.godSkillArr && weaponStore.currentWeapon.extra_obj.godSkillArr.length > 0" class="skill-section">
            <h4>神技数组</h4>
            <div class="skill-tags">
              <el-tag v-for="skill in weaponStore.currentWeapon.extra_obj.godSkillArr" :key="skill" type="warning" class="skill-tag">
                {{ skill }}
              </el-tag>
            </div>
          </div>
          
          <div v-if="weaponStore.currentWeapon.extra_obj.bounceD" class="bounce-section">
            <h4>弹跳数据</h4>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="伤害增加" v-if="weaponStore.currentWeapon.extra_obj.bounceD.hurtNumAdd">
                {{ weaponStore.currentWeapon.extra_obj.bounceD.hurtNumAdd }}
              </el-descriptions-item>
              <el-descriptions-item label="身体" v-if="weaponStore.currentWeapon.extra_obj.bounceD.body">
                {{ weaponStore.currentWeapon.extra_obj.bounceD.body }}
              </el-descriptions-item>
              <el-descriptions-item label="地面" v-if="weaponStore.currentWeapon.extra_obj.bounceD.floor">
                {{ weaponStore.currentWeapon.extra_obj.bounceD.floor }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
        
        <div class="weapon-meta">
          <h3>元数据</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="创建时间">
              {{ formatDate(weaponStore.currentWeapon.created) }}
            </el-descriptions-item>
            <el-descriptions-item label="武器ID">
              {{ weaponStore.currentWeapon.id }}
            </el-descriptions-item>
            <el-descriptions-item label="原始数据" v-if="weaponStore.currentWeapon.extra">
              <el-input
                v-model="weaponStore.currentWeapon.extra"
                type="textarea"
                :rows="3"
                readonly
                placeholder="原始数据"
              />
              <el-button @click="copyExtraData" type="primary" size="small" class="copy-button">
                <el-icon><CopyDocument /></el-icon>
                复制
              </el-button>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div class="weapon-actions">
          <el-button type="primary" @click="editWeapon">
            <el-icon><Edit /></el-icon>
            修改武器
          </el-button>
          <el-button type="danger" @click="deleteWeapon">
            <el-icon><Delete /></el-icon>
            删除武器
          </el-button>
        </div>
      </div>
      
      <div v-else-if="!weaponStore.loading" class="error-state">
        <el-result
          icon="error"
          title="武器不存在"
          sub-title="请检查武器ID是否正确"
        >
          <template #extra>
            <el-button type="primary" @click="goBack">
              返回列表
            </el-button>
          </template>
        </el-result>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWeaponStore } from '@/stores/weapon'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Delete, CopyDocument, Edit } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const weaponStore = useWeaponStore()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const goBack = () => {
  router.push('/')
}

const editWeapon = () => {
  router.push(`/weapon/${route.params.id}/edit`)
}

const copyExtraData = async () => {
  if (!weaponStore.currentWeapon?.extra) return
  
  try {
    await navigator.clipboard.writeText(weaponStore.currentWeapon.extra)
    ElMessage.success('原始数据已复制到剪贴板')
  } catch (error) {
    // 如果现代API不可用，使用传统方法
    const textArea = document.createElement('textarea')
    textArea.value = weaponStore.currentWeapon.extra
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('原始数据已复制到剪贴板')
  }
}

const deleteWeapon = async () => {
  if (!weaponStore.currentWeapon) return
  
  try {
    await ElMessageBox.confirm(
      '确定要删除这个武器吗？此操作不可撤销。',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const result = await weaponStore.deleteWeapon(weaponStore.currentWeapon.id)
    
    if (result.success) {
      ElMessage.success('删除成功')
      router.push('/')
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(async () => {
  const weaponId = Number(route.params.id)
  if (weaponId) {
    await weaponStore.fetchWeapon(weaponId)
  }
})
</script>

<style scoped>
.weapon-detail {
  max-width: 1000px;
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

.detail-card {
  border-radius: 8px;
}

.weapon-detail-content {
  padding: 24px 0;
}

.weapon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.weapon-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.weapon-description,
.weapon-extra,
.weapon-meta {
  margin-bottom: 32px;
}

.weapon-description h3,
.weapon-extra h3,
.weapon-meta h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.weapon-description p {
  margin: 0;
  color: #666;
  line-height: 1.6;
  font-size: 16px;
}

.skill-section {
  margin: 24px 0;
}

.skill-section h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  margin: 0;
}

.bounce-section {
  margin: 24px 0;
}

.bounce-section h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.weapon-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.error-state {
  text-align: center;
  padding: 40px 0;
}

.copy-button {
  margin-top: 8px;
}

@media (max-width: 768px) {
  .weapon-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .weapon-actions {
    justify-content: center;
  }
}
</style>
