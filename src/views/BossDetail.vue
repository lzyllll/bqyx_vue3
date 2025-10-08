<template>
  <div class="boss-detail">
    <div class="page-header">
      <el-button @click="goBack" class="back-button">
        <el-icon>
          <ArrowLeft />
        </el-icon>
        返回列表
      </el-button>
      <h1>Boss详情</h1>
    </div>

    <el-card v-loading="bossStore.loading" class="detail-card">
      <div v-if="bossStore.currentBoss" class="boss-detail-content">
        <div class="boss-header">
          <h2>{{ bossStore.currentBoss.title }}</h2>
          <el-tag type="info">{{ bossStore.currentBoss.owner }}</el-tag>
        </div>

        <div class="boss-description">
          <h3>描述</h3>
          <p>{{ bossStore.currentBoss.description }}</p>
        </div>

        <div class="boss-extra" v-if="bossStore.currentBoss.extra_obj">
          <h3>Boss配置</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="首领类型" v-if="bossStore.currentBoss.extra_obj.n">
              {{ getBossTypeName(bossStore.currentBoss.extra_obj.n) }}
            </el-descriptions-item>
            <el-descriptions-item label="发布人昵称" v-if="bossStore.currentBoss.extra_obj.pn">
              {{ bossStore.currentBoss.extra_obj.pn }}
            </el-descriptions-item>
            <el-descriptions-item label="uid" v-if="bossStore.currentBoss.extra_obj.ud">
              {{ bossStore.currentBoss.extra_obj.ud }}
            </el-descriptions-item>
            <el-descriptions-item label="地图" v-if="bossStore.currentBoss.extra_obj.mp">
              {{ getMapName(bossStore.currentBoss.extra_obj.mp) }}
            </el-descriptions-item>
            <el-descriptions-item label="等级" v-if="bossStore.currentBoss.extra_obj.lv !== undefined">
              {{ bossStore.currentBoss.extra_obj.lv }}
            </el-descriptions-item>
            <el-descriptions-item label="生命系数" v-if="bossStore.currentBoss.extra_obj.li !== undefined">
              {{ bossStore.currentBoss.extra_obj.li }}
            </el-descriptions-item>
            <el-descriptions-item label="伤害系数" v-if="bossStore.currentBoss.extra_obj.dp !== undefined">
              {{ bossStore.currentBoss.extra_obj.dp }}
            </el-descriptions-item>
            <el-descriptions-item label="倒计时" v-if="bossStore.currentBoss.extra_obj.tm !== undefined">
              {{ bossStore.currentBoss.extra_obj.tm }}秒
            </el-descriptions-item>
          </el-descriptions>

          <div class="boss-flags">
            <h4>Boss标志</h4>
            <el-descriptions :column="3" border>
              <el-descriptions-item label="关闭自身技能" v-if="bossStore.currentBoss.extra_obj.sc !== undefined">
                <el-tag :type="bossStore.currentBoss.extra_obj.sc ? 'success' : 'danger'">
                  {{ bossStore.currentBoss.extra_obj.sc ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="强制单人" v-if="bossStore.currentBoss.extra_obj.si !== undefined">
                <el-tag :type="bossStore.currentBoss.extra_obj.si ? 'success' : 'danger'">
                  {{ bossStore.currentBoss.extra_obj.si ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="禁止载具" v-if="bossStore.currentBoss.extra_obj.ve !== undefined">
                <el-tag :type="bossStore.currentBoss.extra_obj.ve ? 'success' : 'danger'">
                  {{ bossStore.currentBoss.extra_obj.ve ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="禁止队友" v-if="bossStore.currentBoss.extra_obj.pa !== undefined">
                <el-tag :type="bossStore.currentBoss.extra_obj.pa ? 'success' : 'danger'">
                  {{ bossStore.currentBoss.extra_obj.pa ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="禁止道具" v-if="bossStore.currentBoss.extra_obj.pr !== undefined">
                <el-tag :type="bossStore.currentBoss.extra_obj.pr ? 'success' : 'danger'">
                  {{ bossStore.currentBoss.extra_obj.pr ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="禁止尸宠" v-if="bossStore.currentBoss.extra_obj.pe !== undefined">
                <el-tag :type="bossStore.currentBoss.extra_obj.pe ? 'success' : 'danger'">
                  {{ bossStore.currentBoss.extra_obj.pe ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="困难设定" v-if="bossStore.currentBoss.extra_obj.hb !== undefined">
                <el-tag :type="bossStore.currentBoss.extra_obj.hb ? 'success' : 'danger'">
                  {{ bossStore.currentBoss.extra_obj.hb ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <div v-if="bossStore.currentBoss.extra_obj.sk && bossStore.currentBoss.extra_obj.sk.length > 0"
            class="skill-section">
            <h4>技能数组</h4>
            <div class="skill-tags">
              <el-tag v-for="skill in bossStore.currentBoss.extra_obj.sk" :key="skill" class="skill-tag">
                {{ displaySkillName(skill) }}
              </el-tag>
            </div>
          </div>

          <div v-if="bossStore.currentBoss.extra_obj.ar && bossStore.currentBoss.extra_obj.ar.length > 0"
            class="arms-section">
            <h4>武器数组</h4>
            <div class="arms-tags">
              <el-tag v-for="arm in bossStore.currentBoss.extra_obj.ar" :key="arm" class="arm-tag">
                {{ arm }}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="boss-meta">
          <h3>元数据</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="创建时间">
              {{ formatDate(bossStore.currentBoss.created) }}
            </el-descriptions-item>
            <el-descriptions-item label="Boss ID">
              {{ bossStore.currentBoss.id }}
            </el-descriptions-item>
            <el-descriptions-item label="原始数据" v-if="bossStore.currentBoss.extra">
              <el-input v-model="bossStore.currentBoss.extra" type="textarea" :rows="3" readonly placeholder="原始数据" />
              <el-button @click="copyExtraData" type="primary" size="small" class="copy-button">
                <el-icon><CopyDocument /></el-icon>
                复制
              </el-button>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="boss-actions">
          <el-button type="primary" @click="editBoss">
            <el-icon>
              <Edit />
            </el-icon>
            修改Boss
          </el-button>
          <el-button type="danger" @click="deleteBoss">
            <el-icon>
              <Delete />
            </el-icon>
            删除Boss
          </el-button>
        </div>
      </div>

      <div v-else-if="!bossStore.loading" class="error-state">
        <el-result icon="error" title="Boss不存在" sub-title="请检查Boss ID是否正确">
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
import { useBossStore } from '@/stores/boss'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Delete, CopyDocument, Edit } from '@element-plus/icons-vue'
import bossSkillMapRaw from '@/assets/data/EditBossSkill.json'
import mapDataRaw from '@/assets/data/map.json'
import bossTypeDataRaw from '@/assets/data/EditBoss.json'
//类型声明
//加载对照
const bossSkillMap = bossSkillMapRaw as Record<string, string>
const mapData = mapDataRaw as any
const bossTypeData = bossTypeDataRaw as any

const router = useRouter()
const route = useRoute()
const bossStore = useBossStore()


//显示
const displaySkillName = (key: string): string => {
  return bossSkillMap[key] || key
}

// 获取地图中文名称
const getMapName = (mapKey: string): string => {
  if (!mapKey) return ''
  
  // 遍历所有地图分类查找对应的中文名称
  for (const category in mapData) {
    if (mapData[category][mapKey]) {
      return mapData[category][mapKey]
    }
  }
  
  // 如果找不到，返回原始key
  return mapKey
}

// 获取Boss类型中文名称
const getBossTypeName = (bossTypeKey: string): string => {
  if (!bossTypeKey) return ''
  
  // 遍历所有Boss类型分类查找对应的中文名称
  for (const category in bossTypeData) {
    if (bossTypeData[category][bossTypeKey]) {
      return bossTypeData[category][bossTypeKey]
    }
  }
  
  // 如果找不到，返回原始key
  return bossTypeKey
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const goBack = () => {
  router.push('/boss')
}

const editBoss = () => {
  router.push(`/boss/${route.params.id}/edit`)
}

const copyExtraData = async () => {
  if (!bossStore.currentBoss?.extra) return
  
  try {
    await navigator.clipboard.writeText(bossStore.currentBoss.extra)
    ElMessage.success('原始数据已复制到剪贴板')
  } catch (error) {
    // 如果现代API不可用，使用传统方法
    const textArea = document.createElement('textarea')
    textArea.value = bossStore.currentBoss.extra
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('原始数据已复制到剪贴板')
  }
}

const deleteBoss = async () => {
  if (!bossStore.currentBoss) return

  try {
    await ElMessageBox.confirm(
      '确定要删除这个Boss吗？此操作不可撤销。',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const result = await bossStore.deleteBoss(bossStore.currentBoss.id)

    if (result.success) {
      ElMessage.success('删除成功')
      router.push('/boss')
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
  const bossId = Number(route.params.id)
  if (bossId) {
    await bossStore.fetchBoss(bossId)
  }
})
</script>

<style scoped>
.boss-detail {
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

.boss-detail-content {
  padding: 24px 0;
}

.boss-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.boss-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.boss-description,
.boss-extra,
.boss-meta {
  margin-bottom: 32px;
}

.boss-description h3,
.boss-extra h3,
.boss-meta h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.boss-description p {
  margin: 0;
  color: #666;
  line-height: 1.6;
  font-size: 16px;
}

.boss-flags {
  margin: 24px 0;
}

.boss-flags h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
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

.boss-actions {
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
  .boss-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .boss-actions {
    justify-content: center;
  }
}
</style>
