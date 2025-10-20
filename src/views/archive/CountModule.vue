<template>
  <div class="count-module">
    <el-card class="module-card">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon">
            <DataAnalysis />
          </el-icon>
          <div>
            <h2>统计模块</h2>
            <p class="module-desc">游戏数据统计</p>
          </div>
        </div>
      </template>

      <!-- 核心统计 -->
      <div class="stats-section">
        <div class="section-header">
          <el-icon class="section-icon">
            <TrendCharts />
          </el-icon>
          <div>
            <h3>核心统计</h3>
            <p class="section-desc">主要游戏数据</p>
          </div>
        </div>
        
        <StatsCards :stats="coreStats" :span="6" />
      </div>

      <!-- 战斗统计 -->
      <div class="stats-section">
        <div class="section-header">
          <el-icon class="section-icon">
            <Aim />
          </el-icon>
          <div>
            <h3>战斗统计</h3>
            <p class="section-desc">击杀和战斗相关数据</p>
          </div>
        </div>
        
        <StatsCards :stats="combatStats" :span="8" />
      </div>

      <!-- Boss 击杀记录 -->
      <div v-if="data?.killKingNameArr && data.killKingNameArr.length > 0" class="boss-kills-section">
        <div class="section-header">
          <el-icon class="section-icon">
            <Trophy />
          </el-icon>
          <div>
            <h3>Boss 击杀记录</h3>
            <p class="section-desc">已击败的 Boss 类型</p>
          </div>
        </div>
        
        <div class="boss-kills-grid">
          <el-tag 
            v-for="bossName in data.killKingNameArr" 
            :key="bossName"
            type="danger"
            size="default"
            class="boss-tag"
          >
            {{ translateBossName(bossName) }}
          </el-tag>
        </div>
      </div>

      <!-- 任务完成记录 -->
      <div v-if="data?.task5NameArr && data.task5NameArr.length > 0" class="tasks-section">
        <div class="section-header">
          <el-icon class="section-icon">
            <List />
          </el-icon>
          <div>
            <h3>任务完成记录</h3>
            <p class="section-desc">已完成的任务类型</p>
          </div>
        </div>
        
        <div class="tasks-grid">
          <el-tag 
            v-for="taskName in data.task5NameArr" 
            :key="taskName"
            type="success"
            size="default"
            class="task-tag"
          >
            {{ translateTaskName(taskName) }}
          </el-tag>
        </div>
      </div>

      <!-- 今日数据 -->
      <div class="stats-section">
        <div class="section-header">
          <el-icon class="section-icon">
            <Calendar />
          </el-icon>
          <div>
            <h3>今日数据</h3>
            <p class="section-desc">当日活动统计</p>
          </div>
        </div>
        
        <StatsCards :stats="todayStats" :span="8" />
      </div>

      <!-- 其他统计 -->
      <div class="stats-section">
        <div class="section-header">
          <el-icon class="section-icon">
            <More />
          </el-icon>
          <div>
            <h3>其他统计</h3>
            <p class="section-desc">游戏体验相关数据</p>
          </div>
        </div>
        
        <StatsCards :stats="otherStats" :span="8" />
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

import { 
  DataAnalysis, 
  TrendCharts, 
  Trophy, 
  List, 
  Calendar, 
  More,
  Timer,
  Coin,
  User,
  Star,
  Setting,
  Box,
  Aim
} from '@element-plus/icons-vue'
import type { Count } from '@/types/archive/module/count'
import StatsCards from '@/components/StatsCards.vue'
import JsonViewer from '@/components/JsonViewer.vue'

const archiveStore = useArchiveStore()

// 获取统计模块数据
const data = computed((): Count | null => {
  return archiveStore.getModuleData('count') as Count | null
})

// 核心统计数据
const coreStats = computed(() => {
  if (!data.value) return []
  
  return [
    {
      key: 'killNum',
      label: '总击杀数',
      value: formatNumber(data.value.killNum),
      icon: Aim,
      iconClass: 'text-danger',
      valueClass: 'text-danger'
    },
    {
      key: 'killBossNum',
      label: 'Boss击杀数',
      value: formatNumber(data.value.killBossNum),
      icon: Trophy,
      iconClass: 'text-warning',
      valueClass: 'text-warning'
    },
    {
      key: 'onlineTime',
      label: '在线时间(小时)',
      value: formatTime(data.value.onlineTime),
      icon: Timer,
      iconClass: 'text-primary',
      valueClass: 'text-primary'
    },
    {
      key: 'dieNum',
      label: '死亡次数',
      value: data.value.dieNum,
      icon: User,
      iconClass: 'text-info',
      valueClass: 'text-info'
    }
  ]
})

// 战斗统计数据
const combatStats = computed(() => {
  if (!data.value) return []
  
  return [
    {
      key: 'weaponKillNum',
      label: '武器击杀',
      value: formatNumber(data.value.weaponKillNum),
      icon: Aim,
      iconClass: 'text-danger',
      valueClass: 'text-danger'
    },
    {
      key: 'vehicleKillNum',
      label: '载具击杀',
      value: formatNumber(data.value.vehicleKillNum),
      icon: Box,
      iconClass: 'text-warning',
      valueClass: 'text-warning'
    },
    {
      key: 'maxKingLevel',
      label: '最高Boss等级',
      value: data.value.maxKingLevel,
      icon: Star,
      iconClass: 'text-success',
      valueClass: 'text-success'
    }
  ]
})

// 今日数据统计
const todayStats = computed(() => {
  if (!data.value) return []
  
  return [
    {
      key: 'todayKillEnemyNum',
      label: '今日击杀',
      value: data.value.todayKillEnemyNum,
      icon: Aim,
      iconClass: 'text-danger',
      valueClass: 'text-danger'
    },
    {
      key: 'todaySkillStoneNum',
      label: '今日技能石',
      value: data.value.todaySkillStoneNum,
      icon: Star,
      iconClass: 'text-primary',
      valueClass: 'text-primary'
    },
    {
      key: 'todayArenaNum',
      label: '今日竞技场',
      value: data.value.todayArenaNum,
      icon: Trophy,
      iconClass: 'text-warning',
      valueClass: 'text-warning'
    }
  ]
})

// 其他统计数据
const otherStats = computed(() => {
  if (!data.value) return []
  
  return [
    {
      key: 'dropArmsNum',
      label: '掉落武器',
      value: formatNumber(data.value.dropArmsNum),
      icon: Box,
      iconClass: 'text-success',
      valueClass: 'text-success'
    },
    {
      key: 'dropEquipNum',
      label: '掉落装备',
      value: formatNumber(data.value.dropEquipNum),
      icon: Setting,
      iconClass: 'text-primary',
      valueClass: 'text-primary'
    },
    {
      key: 'lotteryCoin',
      label: '抽奖代币',
      value: data.value.lotteryCoin,
      icon: Coin,
      iconClass: 'text-warning',
      valueClass: 'text-warning'
    }
  ]
})

// 格式化数字
function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

// 格式化时间（秒转小时）
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  return hours.toString()
}

// 翻译Boss名称
function translateBossName(bossName: string): string {
  const bossTranslations: Record<string, string> = {
    'ZombieShell': '僵尸壳',
    'ZombieKing': '僵尸王',
    'FightShooter': '战斗射手',
    'FightKing': '战斗王',
    'IronZombieKing': '铁僵尸王',
    'ZombieBoomKing': '爆炸僵尸王',
    'TyphoonWitch': '台风女巫',
    'Arthur': '亚瑟',
    'SpiderKing': '蜘蛛王'
  }
  return bossTranslations[bossName] || bossName
}

// 翻译任务名称
function translateTaskName(taskName: string): string {
  const taskTranslations: Record<string, string> = {
    'rifleArms': '步枪武器',
    'expBase': '经验基地',
    'sniperKing': '狙击王',
    'bloodStoneThings': '血石物品',
    'coinChase': '金币追逐',
    'strengthenStoneThings': '强化石物品',
    'oldRocket': '旧火箭'
  }
  return taskTranslations[taskName] || taskName
}

// JSON数据
const jsonData = computed(() => {
  return JSON.stringify(data.value, null, 2)
})
</script>

<style scoped>
.count-module {
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

.stats-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-icon {
  font-size: 20px;
  color: #409eff;
}

.section-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
}

.section-desc {
  margin: 4px 0 0 0;
  color: #909399;
  font-size: 13px;
}

.boss-kills-section,
.tasks-section {
  margin-bottom: 32px;
}

.boss-kills-grid,
.tasks-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.boss-tag,
.task-tag {
  cursor: default;
  font-size: 13px;
}

.boss-tag:hover,
.task-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .count-module {
    padding: 16px;
  }
  
  .boss-kills-grid,
  .tasks-grid {
    gap: 6px;
  }
  
  .boss-tag,
  .task-tag {
    font-size: 12px;
  }
}
</style>
