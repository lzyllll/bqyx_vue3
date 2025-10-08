<template>
  <div class="boss-list">
    <div class="page-header">
      <h1>Boss列表</h1>
      <p>自定义Boss,添加首领需要登录</p>
    </div>

    <el-card class="boss-card" v-loading="bossStore.loading">
      <template #header>
        <div class="card-header">
          <span>Boss列表</span>
          <el-button v-if="authStore.isAuthenticated" type="primary" @click="goToAddBoss">
            <el-icon>
              <Plus />
            </el-icon>
            添加Boss
          </el-button>
        </div>
      </template>

      <div v-if="bossStore.bosses.length === 0 && !bossStore.loading" class="empty-state">
        <el-empty description="暂无Boss数据">
          <el-button v-if="authStore.isAuthenticated" type="primary" @click="goToAddBoss">
            添加第一个Boss
          </el-button>
        </el-empty>
      </div>

      <div v-else class="boss-grid">
        <el-card v-for="boss in bossStore.bosses" :key="boss.id" class="boss-item" shadow="hover">
          <div class="boss-content">
            <div class="boss-header">
              <h3>{{ boss.title }}</h3>
              <el-tag type="info" size="small">{{ boss.owner }}</el-tag>
            </div>

            <p class="boss-description">{{ boss.description }}</p>

            <div class="boss-meta">
              <span class="boss-date">
                <el-icon>
                  <Calendar />
                </el-icon>
                {{ formatDate(boss.created) }}
              </span>
            </div>

            <div class="boss-extra" v-if="boss.extra_obj">
              <el-collapse>
                <el-collapse-item title="Boss详情" name="1">
                  <div class="extra-content">
                    <div v-if="boss.extra_obj.n" class="boss-name">
                      <strong>首领类型:</strong> {{ getBossTypeName(boss.extra_obj.n) }}
                    </div>
                    <div v-if="boss.extra_obj.pn" class="boss-pn">
                      <strong>发布人昵称:</strong> {{ boss.extra_obj.pn }}
                    </div>
                    <div v-if="boss.extra_obj.ud" class="boss-ud">
                      <strong>UID:</strong> {{ boss.extra_obj.ud }}
                    </div>
                    <div v-if="boss.extra_obj.mp" class="boss-mp">
                      <strong>地图:</strong> {{ getMapName(boss.extra_obj.mp) }}
                    </div>
                    <div v-if="boss.extra_obj.lv !== undefined" class="boss-level">
                      <strong>等级:</strong> {{ boss.extra_obj.lv }}
                    </div>
                    <div v-if="boss.extra_obj.li !== undefined" class="boss-li">
                      <strong>生命系数:</strong> {{ boss.extra_obj.li }}
                    </div>
                    <div v-if="boss.extra_obj.dp !== undefined" class="boss-dp">
                      <strong>伤害系数:</strong> {{ boss.extra_obj.dp }}
                    </div>
                    <div v-if="boss.extra_obj.tm !== undefined" class="boss-tm">
                      <strong>倒计时:</strong> {{ boss.extra_obj.tm }}秒
                    </div>

                    <div v-if="boss.extra_obj.sk && boss.extra_obj.sk.length > 0" class="boss-skills">
                      <strong>技能:</strong>
                      <el-tag v-for="skill in boss.extra_obj.sk" :key="skill" size="small" class="skill-tag">
                        {{  displaySkillName(skill) }}
                      </el-tag>
                    </div>

                    <div v-if="boss.extra_obj.ar && boss.extra_obj.ar.length > 0" class="boss-arms">
                      <strong>武器:</strong>
                      <el-tag v-for="arm in boss.extra_obj.ar" :key="arm" size="small" class="arm-tag">
                        {{ arm }}
                      </el-tag>
                    </div>

                    <div class="boss-flags">
                      <div v-if="boss.extra_obj.sc !== undefined">
                        <strong>关闭自身技能:</strong> {{ boss.extra_obj.sc ? '是' : '否' }}
                      </div>
                      <div v-if="boss.extra_obj.si !== undefined">
                        <strong>强制单人:</strong> {{ boss.extra_obj.si ? '是' : '否' }}
                      </div>
                      <div v-if="boss.extra_obj.ve !== undefined">
                        <strong>禁止载具:</strong> {{ boss.extra_obj.ve ? '是' : '否' }}
                      </div>
                      <div v-if="boss.extra_obj.pa !== undefined">
                        <strong>禁止队友:</strong> {{ boss.extra_obj.pa ? '是' : '否' }}
                      </div>
                      <div v-if="boss.extra_obj.pr !== undefined">
                        <strong>禁止道具:</strong> {{ boss.extra_obj.pr ? '是' : '否' }}
                      </div>
                      <div v-if="boss.extra_obj.pe !== undefined">
                        <strong>禁止尸宠:</strong> {{ boss.extra_obj.pe ? '是' : '否' }}
                      </div>
                      <div v-if="boss.extra_obj.hb !== undefined">
                        <strong>困难设定:</strong> {{ boss.extra_obj.hb ? '是' : '否' }}
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>

          <template #footer>
            <div class="boss-actions">
              <el-button size="small" @click="viewBoss(boss.id)">
                <el-icon>
                  <View />
                </el-icon>
                查看
              </el-button>
              <el-button v-if="authStore.isAuthenticated" type="danger" size="small" @click="deleteBoss(boss.id)"
                :loading="deletingId === boss.id">
                <el-icon>
                  <Delete />
                </el-icon>
                删除
              </el-button>
            </div>
          </template>
        </el-card>
      </div>

      <!-- 分页 -->
      <div v-if="bossStore.pagination.count > 0" class="pagination-container">
        <el-pagination v-model:current-page="currentPage" :page-size="10" :total="bossStore.pagination.count"
          layout="total, prev, pager, next" @current-change="handlePageChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBossStore } from '@/stores/boss'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Calendar, View, Delete } from '@element-plus/icons-vue'

import bossSkillMapRaw from '@/assets/data/EditBossSkill.json'
import mapDataRaw from '@/assets/data/map.json'
import bossTypeDataRaw from '@/assets/data/EditBoss.json'
//类型声明
//加载对照
const bossSkillMap = bossSkillMapRaw as Record<string, string>
const mapData = mapDataRaw as any
const bossTypeData = bossTypeDataRaw as any

const router = useRouter()
const bossStore = useBossStore()
const authStore = useAuthStore()


const currentPage = ref(1)
const deletingId = ref<number | null>(null)

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
//api 
const goToAddBoss = () => {
  router.push('/boss/add')
}

const viewBoss = (id: number) => {
  router.push(`/boss/${id}`)
}

const deleteBoss = async (id: number) => {
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

    deletingId.value = id
    const result = await bossStore.deleteBoss(id)

    if (result.success) {
      ElMessage.success('删除成功')
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  } finally {
    deletingId.value = null
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  bossStore.fetchBosses(page)
}

onMounted(() => {
  bossStore.fetchBosses(1)
})
</script>

<style scoped>
.boss-list {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.boss-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #333;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.boss-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.boss-item {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.boss-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.boss-content {
  padding: 16px 0;
}

.boss-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.boss-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
  flex: 1;
}

.boss-description {
  margin: 0 0 16px 0;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.boss-meta {
  margin-bottom: 16px;
}

.boss-date {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #999;
  font-size: 12px;
}

.boss-extra {
  margin-bottom: 16px;
}

.extra-content {
  padding: 12px 0;
}

.extra-content>div {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}

.boss-flags {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 8px;
  margin-top: 12px;
}

.skill-tag {
  margin: 2px 4px 2px 0;
}

.boss-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

@media (max-width: 1024px) and (min-width: 769px) {
  .boss-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .boss-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .boss-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .boss-actions {
    flex-direction: column;
  }
}
</style>
