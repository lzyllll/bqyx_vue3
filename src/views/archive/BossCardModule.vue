<template>
    <div class="equip-module">
        <el-card class="module-card">
            <template #header>
                <div class="card-header">
                    <el-icon class="header-icon">
                        <Tools />
                    </el-icon>
                    <div>
                        <h2>魂卡模块</h2>
                        <p class="module-desc">魂卡信息</p>
                    </div>
                </div>
            </template>



            <!-- 魂卡总加成 -->
            <BonusDisplay 
                :bonus-list="getTotalCardBonus()"
                title="魂卡总加成"
                subtitle="魂卡属性总加成"
                empty-text="暂无装备加成"
            />


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

import { Tools, List, Trophy, Star, Setting, Box, Plus } from '@element-plus/icons-vue'
import type { BossCard } from '@/types/archive/module/bossCard'
import { getFormattedBonusList } from '@/utils/translate'
import BonusDisplay from '@/components/BonusDisplay.vue'
import JsonViewer from '@/components/JsonViewer.vue'

const archiveStore = useArchiveStore()

// 获取装备模块数据
const data = computed((): BossCard | null => {
    return archiveStore.getModuleData('bossCard') as BossCard | null
})


// 获取魂卡总属性加成
const getTotalCardBonus = () => {
    return getFormattedBonusList(data.value.gerRoleBonus())
}


// JSON数据
const jsonData = computed(() => {
    return JSON.stringify(data.value, null, 2)
})
</script>

<style scoped>
.equip-module {
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

.equip-stats {
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

.equip-display-section,
.data-section {
    margin-top: 24px;
}

.main-equip-area {
    margin-bottom: 24px;
}

.other-equip-area {
    margin-bottom: 24px;
}

.equip-slot {
    border: 2px dashed #dcdfe6;
    border-radius: 8px;
    padding: 16px;
    text-align: center;
    transition: all 0.3s ease;
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.equip-slot:hover {
    border-color: #409eff;
    background-color: #f0f9ff;
}

.equip-slot.empty {
    background-color: #fafafa;
}

.equip-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.equip-image {
    width: 56px;
    height: 56px;
    border-radius: 4px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.equip-level {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #409eff;
    color: white;
    font-size: 10px;
    padding: 2px 4px;
    border-radius: 8px;
    font-weight: bold;
    min-width: 16px;
    text-align: center;
}

.equip-info {
    text-align: center;
}

.equip-name {
    font-size: 12px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 4px;
    word-break: break-all;
}

.equip-quality {
    display: flex;
    justify-content: center;
}

.empty-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #909399;
    font-size: 12px;
}

.empty-slot .el-icon {
    font-size: 24px;
}

/* 悬浮卡片样式 */
.equip-popover-content {
    padding: 0;
}

.popover-header {
    margin-bottom: 12px;
}

.popover-title {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

.popover-category {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.popover-description {
    font-size: 14px;
    color: #606266;
    margin-bottom: 12px;
    line-height: 1.4;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.description-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
}

.desc-label {
    color: #909399;
    font-weight: 500;
}

.desc-value {
    color: #303133;
    font-weight: 600;
}

.shop-source {
    color: #e6a23c;
    font-weight: 600;
}

.popover-time {
    border-top: 1px solid #ebeef5;
    padding-top: 12px;
    margin-top: 12px;
}

.time-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    margin-bottom: 4px;
}

.time-label {
    color: #909399;
    font-weight: 500;
}

.time-value {
    color: #606266;
    font-weight: 500;
}

.popover-bonus {
    border-top: 1px solid #ebeef5;
    padding-top: 12px;
}

.bonus-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
}

.json-viewer {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    line-height: 1.5;
}

@media (max-width: 768px) {
    .equip-module {
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