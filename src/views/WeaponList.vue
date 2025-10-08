<template>
  <div class="weapon-list">
    <div class="page-header">
      <h1>武器列表</h1>
      <p>自定义武器，添加武器需要登录</p>
    </div>

    <el-card class="weapon-card" v-loading="weaponStore.loading">
      <template #header>
        <div class="card-header">
          <span>武器列表</span>
          <el-button v-if="authStore.isAuthenticated" type="primary" @click="goToAddWeapon">
            <el-icon><Plus /></el-icon>
            添加武器
          </el-button>
        </div>
      </template>

      <div v-if="weaponStore.weapons.length === 0 && !weaponStore.loading" class="empty-state">
        <el-empty description="暂无武器数据">
          <el-button v-if="authStore.isAuthenticated" type="primary" @click="goToAddWeapon">
            添加第一个武器
          </el-button>
        </el-empty>
      </div>

      <div v-else class="weapon-grid">
        <el-card
          v-for="weapon in weaponStore.weapons"
          :key="weapon.id"
          class="weapon-item"
          shadow="hover"
        >
          <div class="weapon-content">
            <div class="weapon-header">
              <h3>{{ weapon.title }}</h3>
              <el-tag type="info" size="small">{{ weapon.owner }}</el-tag>
            </div>
            
            <p class="weapon-description">{{ weapon.description }}</p>
            
            <div class="weapon-meta">
              <span class="weapon-date">
                <el-icon><Calendar /></el-icon>
                {{ formatDate(weapon.created) }}
              </span>
            </div>
            
            <div class="weapon-extra" v-if="weapon.extra_obj">
              <el-collapse>
                <el-collapse-item title="武器详情" name="1">
                  <div class="extra-content">
                    <div v-if="weapon.extra_obj.cnName" class="weapon-name">
                      <strong>武器名称:</strong> {{ weapon.extra_obj.cnName }}
                    </div>
                    <div v-if="weapon.extra_obj.baseLabel" class="weapon-base">
                      <strong>武器类型:</strong> {{ weapon.extra_obj.baseLabel }}
                    </div>
                    <div v-if="weapon.extra_obj.pn" class="weapon-pn">
                      <strong>PN:</strong> {{ weapon.extra_obj.pn }}
                    </div>
                    <div v-if="weapon.extra_obj.name" class="weapon-name">
                      <strong>名称:</strong> {{ weapon.extra_obj.name }}
                    </div>
                    <div v-if="weapon.extra_obj.capacity" class="weapon-capacity">
                      <strong>容量:</strong> {{ weapon.extra_obj.capacity }}
                    </div>
                    <div v-if="weapon.extra_obj.bulletNum" class="weapon-bullet">
                      <strong>子弹数量:</strong> {{ weapon.extra_obj.bulletNum }}
                    </div>
                    <div v-if="weapon.extra_obj.attackGap" class="weapon-attack">
                      <strong>攻击间隔:</strong> {{ weapon.extra_obj.attackGap }}s
                    </div>
                    <div v-if="weapon.extra_obj.reloadGap" class="weapon-reload">
                      <strong>重装间隔:</strong> {{ weapon.extra_obj.reloadGap }}s
                    </div>
                    <div v-if="weapon.extra_obj.skillArr && weapon.extra_obj.skillArr.length > 0" class="weapon-skills">
                      <strong>技能数组:</strong>
                      <el-tag v-for="skill in weapon.extra_obj.skillArr" :key="skill" size="small" class="skill-tag">
                        {{ skill }}
                      </el-tag>
                    </div>
                    <div v-if="weapon.extra_obj.godSkillArr && weapon.extra_obj.godSkillArr.length > 0" class="weapon-god-skills">
                      <strong>神技数组:</strong>
                      <el-tag v-for="skill in weapon.extra_obj.godSkillArr" :key="skill" size="small" type="warning" class="skill-tag">
                        {{ skill }}
                      </el-tag>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
          
          <template #footer>
            <div class="weapon-actions">
              <el-button size="small" @click="viewWeapon(weapon.id)">
                <el-icon><View /></el-icon>
                查看
              </el-button>
              <el-button
                v-if="authStore.isAuthenticated"
                type="danger"
                size="small"
                @click="deleteWeapon(weapon.id)"
                :loading="deletingId === weapon.id"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </template>
        </el-card>
      </div>

      <!-- 分页 -->
      <div v-if="weaponStore.pagination.count > 0" class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="10"
          :total="weaponStore.pagination.count"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWeaponStore } from '@/stores/weapon'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Calendar, View, Delete } from '@element-plus/icons-vue'

const router = useRouter()
const weaponStore = useWeaponStore()
const authStore = useAuthStore()

const currentPage = ref(1)
const deletingId = ref<number | null>(null)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const goToAddWeapon = () => {
  router.push('/weapon/add')
}

const viewWeapon = (id: number) => {
  router.push(`/weapon/${id}`)
}

const deleteWeapon = async (id: number) => {
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
    
    deletingId.value = id
    const result = await weaponStore.deleteWeapon(id)
    
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
  weaponStore.fetchWeapons(page)
}

onMounted(() => {
  weaponStore.fetchWeapons(1)
})
</script>

<style scoped>
.weapon-list {
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

.weapon-card {
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

.weapon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.weapon-item {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.weapon-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.weapon-content {
  padding: 16px 0;
}

.weapon-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.weapon-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
  flex: 1;
}

.weapon-description {
  margin: 0 0 16px 0;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.weapon-meta {
  margin-bottom: 16px;
}

.weapon-date {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #999;
  font-size: 12px;
}

.weapon-extra {
  margin-bottom: 16px;
}

.extra-content {
  padding: 12px 0;
}

.extra-content > div {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}

.skill-tag {
  margin: 2px 4px 2px 0;
}

.weapon-actions {
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
  .weapon-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .weapon-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .weapon-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .weapon-actions {
    flex-direction: column;
  }
}
</style>
