<template>
    <div class="vip-module">
        <el-card class="module-card">
            <template #header>
                <div class="card-header">
                    <el-icon class="header-icon">
                        <Crown />
                    </el-icon>
                    <div>
                        <h2>VIP模块</h2>
                        <p class="module-desc">VIP等级和特权信息</p>
                    </div>
                </div>
            </template>



            <!-- VIP等级信息 -->
            <div class="vip-level-section">
                <el-card class="vip-level-card">
                    <div class="vip-level-content">
                        <div class="vip-level-info">
                            <el-icon class="vip-level-icon">
                                <Star />
                            </el-icon>
                            <div class="vip-level-text">
                                <h3>VIP等级</h3>
                                <div class="vip-level-number">{{ data?.level || 0 }}</div>
                            </div>
                        </div>
                        <div class="vip-level-badge">
                            <el-tag type="warning" size="large" effect="dark">
                                VIP {{ data?.level || 0 }}
                            </el-tag>
                        </div>
                    </div>
                </el-card>
            </div>

            <!-- VIP加成信息 -->
            <BonusDisplay 
                :bonus-list="getVipBonus()"
                title="VIP特权加成"
                subtitle="VIP等级加成效果"
                empty-text="暂无VIP加成"
                :compact="false"
            />

            <!-- 每日礼包状态 -->
            <div class="gift-section">
                <el-divider content-position="left">
                    <el-icon><Present /></el-icon>
                    <span>每日礼包</span>
                </el-divider>
                <el-card>
                    <div class="gift-grid">
                        <div 
                            v-for="(claimed, giftKey) in data?.obj || {}" 
                            :key="giftKey"
                            :class="['gift-item', { 'claimed': claimed }]"
                        >
                            <div class="gift-icon-wrapper">
                                <el-icon :class="['gift-icon', claimed ? 'claimed' : 'unclaimed']">
                                    <Present />
                                </el-icon>
                            </div>
                            <div class="gift-info">
                                <div class="gift-name">{{ getGiftName(giftKey) }}</div>
                                <el-tag :type="claimed ? 'success' : 'info'" size="small" :effect="claimed ? 'dark' : 'light'">
                                    {{ claimed ? '已领取' : '未领取' }}
                                </el-tag>
                            </div>
                        </div>
                    </div>
                </el-card>
            </div>

            <!-- VIP升级奖励状态 -->
            <div class="upgrade-section">
                <el-divider content-position="left">
                    <el-icon><Trophy /></el-icon>
                    <span>升级奖励</span>
                </el-divider>
                <el-card>
                    <div class="gift-grid">
                        <div 
                            v-for="(claimed, giftKey) in data?.upLevelObj || {}" 
                            :key="giftKey"
                            :class="['gift-item', { 'claimed': claimed }]"
                        >
                            <div class="gift-icon-wrapper">
                                <el-icon :class="['gift-icon', claimed ? 'claimed' : 'unclaimed']">
                                    <Trophy />
                                </el-icon>
                            </div>
                            <div class="gift-info">
                                <div class="gift-name">{{ getGiftName(giftKey) }}</div>
                                <el-tag :type="claimed ? 'success' : 'info'" size="small" :effect="claimed ? 'dark' : 'light'">
                                    {{ claimed ? '已领取' : '未领取' }}
                                </el-tag>
                            </div>
                        </div>
                    </div>
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
import { Star, Present, Trophy } from '@element-plus/icons-vue'
import type { Vip } from '@/types/archive/module/vip'
import { getFormattedBonusList } from '@/utils/translate'
import BonusDisplay from '@/components/BonusDisplay.vue'
import JsonViewer from '@/components/JsonViewer.vue'

const archiveStore = useArchiveStore()

// 获取VIP模块数据
const data = computed((): Vip | null => {
    return archiveStore.getModuleData('vip') as Vip | null
})

// 获取VIP加成信息
const getVipBonus = () => {
    if (!data.value) return []
    return getFormattedBonusList(data.value.getRoleBonus())
}

// 检查是否有每日礼包
const hasDailyGift = computed(() => {
    if (!data.value?.obj) return false
    return Object.values(data.value.obj).some(claimed => claimed)
})

// 获取礼包名称
const getGiftName = (giftKey: string): string => {
    const giftNames: Record<string, string> = {
        'm100': '100钻石礼包',
        'm200': '200钻石礼包', 
        'm500': '500钻石礼包',
        'm1000': '1000钻石礼包',
        'm2000': '2000钻石礼包',
        'm5000': '5000钻石礼包'
    }
    return giftNames[giftKey] || giftKey
}

// JSON数据
const jsonData = computed(() => {
    return JSON.stringify(data.value, null, 2)
})
</script>

<style scoped>
.vip-module {
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
    color: #f39c12;
}

.module-desc {
    color: #909399;
    margin: 0;
    font-size: 14px;
}

/* VIP等级样式 */
.vip-level-section {
    margin-bottom: 24px;
}

.vip-level-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
}

.vip-level-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
}

.vip-level-info {
    display: flex;
    align-items: center;
    gap: 16px;
}

.vip-level-icon {
    font-size: 32px;
    color: #ffd700;
}

.vip-level-text h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: white;
}

.vip-level-number {
    font-size: 36px;
    font-weight: bold;
    color: #ffd700;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.vip-level-badge {
    display: flex;
    align-items: center;
}

/* 礼包和升级奖励样式 */
.gift-section,
.upgrade-section {
    margin-bottom: 24px;
}

.gift-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    padding: 16px;
}

.gift-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: 2px solid #ebeef5;
    border-radius: 10px;
    background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.gift-item:hover {
    border-color: #409eff;
    background: linear-gradient(145deg, #f0f9ff 0%, #e6f7ff 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(64, 158, 255, 0.2);
}

.gift-item.claimed {
    border-color: #67c23a;
    background: linear-gradient(145deg, #f0f9ff 0%, #e8f5e8 100%);
}

.gift-item.claimed:hover {
    border-color: #52c41a;
    background: linear-gradient(145deg, #e6f7ff 0%, #d9f7be 100%);
}

.gift-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: 2px solid #e8e8e8;
    transition: all 0.3s ease;
}

.gift-item.claimed .gift-icon-wrapper {
    background: white;
    border-color: #67c23a;
}

.gift-icon {
    font-size: 20px;
    transition: all 0.3s ease;
}

.gift-icon.claimed {
    color: #52c41a;
    transform: scale(1.1);
}

.gift-icon.unclaimed {
    color: #8c8c8c;
}

.gift-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.gift-name {
    font-weight: 600;
    font-size: 14px;
    color: #262626;
    margin: 0;
}

.gift-item.claimed .gift-name {
    color: #389e0d;
}

@media (max-width: 1200px) {
    .gift-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .vip-module {
        padding: 16px;
    }
    
    .vip-level-content {
        flex-direction: column;
        gap: 16px;
        text-align: center;
    }
    
    .vip-level-number {
        font-size: 28px;
    }
    
    .gift-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }
    
    .gift-item {
        padding: 12px;
    }
    
    .gift-icon-wrapper {
        width: 36px;
        height: 36px;
    }
    
    .gift-icon {
        font-size: 18px;
    }
}
</style>
