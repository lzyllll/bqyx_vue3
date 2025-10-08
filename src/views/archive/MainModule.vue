<template>
  <div class="main-module">
      <el-card class="module-card">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon"><User /></el-icon>
            <div>
              <h2>主模块信息</h2>
              <p class="module-desc">玩家主要属性和游戏数据</p>
            </div>
          </div>
        </template>
        
        <!-- 主要信息展示 -->
        <div class="main-stats">
          <el-row :gutter="20">
            <el-col :span="8" v-for="stat in mainStats" :key="stat.key">
              <el-card class="stat-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon">
                    <el-icon :class="stat.iconClass">
                      <component :is="stat.icon" />
                    </el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-label">{{ stat.label }}</div>
                    <div class="stat-value" :class="stat.valueClass">
                      {{ stat.value }}
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        
        <!-- 角色信息 -->
        <div class="role-section">
          <el-divider content-position="left">
            <el-icon><Avatar /></el-icon>
            <span>角色信息</span>
          </el-divider>
          <el-card>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="角色">
                <el-tag type="primary">{{ data?.role || '未知' }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="UID MD5">
                <el-text type="info">{{ data?.uidMd5 || '未知' }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="版本号">
                <el-tag type="success">{{ data?.versionNumber || '未知' }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="AI等级">
                <el-tag type="warning">{{ data?.ai || 0 }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
        
        <!-- 游戏数据 -->
        <div class="game-data-section">
          <el-divider content-position="left">
            <el-icon><Trophy /></el-icon>
            <span>游戏数据</span>
          </el-divider>
          <el-card>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="金币">
                <el-text type="warning">{{ formatNumber(data?.coin || 0) }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="分数">
                <el-text type="success">{{ formatNumber(data?.score || 0) }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="最大DP">
                <el-text type="primary">{{ formatNumber(data?.maxDp || 0) }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="技能数量1">
                <el-text type="info">{{ data?.SkillNum1 || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="技能数量2">
                <el-text type="info">{{ data?.SkillNum2 || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="零件数量">
                <el-text type="warning">{{ data?.partsC || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="周年币">
                <el-text type="warning">{{ formatNumber(data?.anniCoin || 0) }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="十连币">
                <el-text type="success">{{ formatNumber(data?.tenCoin || 0) }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="金铲子">
                <el-text type="warning">{{ data?.goldSpade || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="女孩技能数量">
                <el-text type="info">{{ data?.girlSkillNum || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="记忆武器">
                <el-text type="primary">{{ data?.memArms || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="交换数量">
                <el-text type="success">{{ data?.swapNum || 0 }}</el-text>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
        
        <!-- 特殊状态 -->
        <div class="status-section">
          <el-divider content-position="left">
            <el-icon><Setting /></el-icon>
            <span>特殊状态</span>
          </el-divider>
          <el-card>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="更改名称">
                <el-tag :type="data?.changeNameB ? 'success' : 'info'">
                  {{ data?.changeNameB ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="交换装备">
                <el-tag :type="data?.swapEquipB ? 'success' : 'info'">
                  {{ data?.swapEquipB ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="载具返回">
                <el-tag :type="data?.vehicleBackB ? 'success' : 'info'">
                  {{ data?.vehicleBackB ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="今年武器">
                <el-tag :type="data?.thisYearArms ? 'success' : 'info'">
                  {{ data?.thisYearArms ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="年度武器">
                <el-tag :type="data?.yearArms ? 'success' : 'info'">
                  {{ data?.yearArms ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="礼物18">
                <el-tag :type="data?.gift18 ? 'success' : 'info'">
                  {{ data?.gift18 ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="T38">
                <el-tag :type="data?.t38 ? 'success' : 'info'">
                  {{ data?.t38 ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="WT27B">
                <el-tag :type="data?.wt27B ? 'success' : 'info'">
                  {{ data?.wt27B ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
        
        <!-- 数值统计 -->
        <div class="stats-section">
          <el-divider content-position="left">
            <el-icon><Medal /></el-icon>
            <span>数值统计</span>
          </el-divider>
          <el-card>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="每日抽奖">
                <el-text type="primary">{{ data?.dayLottery || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="每日清扫">
                <el-text type="success">{{ data?.daySweeping || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="删除SS">
                <el-text type="danger">{{ data?.delSS || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="DEMBS">
                <el-text type="warning">{{ data?.dembs || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="S18">
                <el-text type="info">{{ data?.s18 || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="BS">
                <el-text type="primary">{{ data?.bs || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="荒芜">
                <el-text type="warning">{{ data?.barren || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="瘦弱">
                <el-text type="info">{{ data?.thin || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="武器283">
                <el-text type="success">{{ data?.arms283 || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="粽子25">
                <el-text type="warning">{{ data?.zongzi25 || 0 }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="粽子25数量">
                <el-text type="warning">{{ data?.zongzi25_num || 0 }}</el-text>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
        
        <!-- 安全信息 -->
        <div class="security-section" v-if="data?.isZuobiB || data?.zuobiReason">
          <el-divider content-position="left">
            <el-icon><Warning /></el-icon>
            <span>安全信息</span>
          </el-divider>
          <el-card>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="是否作弊">
                <el-tag :type="data?.isZuobiB ? 'danger' : 'success'">
                  {{ data?.isZuobiB ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="作弊原因" v-if="data?.zuobiReason">
                <el-text type="danger">{{ data.zuobiReason }}</el-text>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
        
        <!-- 详细数据 -->
        <JsonViewer 
          :json-data="jsonData"
          title="详细数据"
          collapse-title="查看完整JSON数据"
          :rows="10"
        />
      </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useArchiveStore } from '@/stores/archive'

import { User, Trophy, Star, Setting, Avatar, Coin, Medal, Warning } from '@element-plus/icons-vue'
import type { Main } from '@/types/archive/module/main'
import JsonViewer from '@/components/JsonViewer.vue'

const archiveStore = useArchiveStore()
// 获取主模块数据
const data = computed((): Main | null => {
  return archiveStore.getModuleData('main') as Main | null
})

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 主要统计数据
const mainStats = computed(() => [
  {
    key: 'coin',
    label: '金币',
    value: formatNumber(data.value?.coin || 0),
    icon: Coin,
    iconClass: 'text-warning',
    valueClass: 'text-warning'
  },
  {
    key: 'score',
    label: '分数',
    value: formatNumber(data.value?.score || 0),
    icon: Trophy,
    iconClass: 'text-success',
    valueClass: 'text-success'
  },
  {
    key: 'maxDp',
    label: '最大DP',
    value: formatNumber(data.value?.maxDp || 0),
    icon: Star,
    iconClass: 'text-primary',
    valueClass: 'text-primary'
  },
  {
    key: 'anniCoin',
    label: '周年币',
    value: formatNumber(data.value?.anniCoin || 0),
    icon: Medal,
    iconClass: 'text-warning',
    valueClass: 'text-warning'
  },
  {
    key: 'tenCoin',
    label: '十年币',
    value: formatNumber(data.value?.tenCoin || 0),
    icon: Coin,
    iconClass: 'text-success',
    valueClass: 'text-success'
  },
  {
    key: 'role',
    label: '角色',
    value: data.value?.role || '未知',
    icon: Avatar,
    iconClass: 'text-info',
    valueClass: 'text-info'
  }
])

// JSON数据
const jsonData = computed(() => {
  return JSON.stringify(data.value, null, 2)
})
</script>

<style scoped>
.main-module {
  padding: 20px;
  overflow-y: auto;
}

.module-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 24px;
  color: #409eff;
}

.card-header h2 {
  margin: 0;
  color: #303133;
  font-size: 20px;
}

.module-desc {
  margin: 4px 0 0 0;
  color: #909399;
  font-size: 14px;
}

.main-stats {
  margin-bottom: 24px;
}

.stat-card {
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f5f7fa;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.text-primary {
  color: #409eff !important;
}

.text-success {
  color: #67c23a !important;
}

.text-warning {
  color: #e6a23c !important;
}

.text-danger {
  color: #f56c6c !important;
}

.text-info {
  color: #909399 !important;
}

.role-section,
.game-data-section,
.status-section,
.stats-section,
.security-section,
.data-section {
  margin-top: 24px;
}

.json-viewer {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .main-module {
    padding: 16px;
  }
  
  .stat-content {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 24px;
  }
  
  .stat-value {
    font-size: 16px;
  }
}
</style>