<template>
    <div class="equip-total-bonus-section">
        <el-divider v-if="showDivider" content-position="left">
            <el-icon>
                <TrendCharts />
            </el-icon>
            <span>{{ title }}</span>
        </el-divider>

        <el-card class="total-bonus-card">
            <div v-if="bonusList.length > 0" class="total-bonus-content">
                <div class="bonus-title">{{ subtitle }}</div>
                <div class="bonus-list-three-columns">
                    <div v-for="bonus in bonusList" :key="bonus.key" :class="['bonus-item', { 'bonus-item-compact': compact }]">
                        <span class="bonus-key">{{ bonus.key }}</span>
                        <span class="bonus-value">{{ bonus.value }}</span>
                    </div>
                </div>
            </div>
            <div v-else class="no-bonus">
                <el-icon>
                    <InfoFilled />
                </el-icon>
                <span>{{ emptyText }}</span>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { TrendCharts, InfoFilled } from '@element-plus/icons-vue'

interface BonusItem {
    key: string
    value: string
}

interface Props {
    bonusList: BonusItem[]
    title?: string
    subtitle?: string
    emptyText?: string
    compact?: boolean
    showDivider?: boolean
}

withDefaults(defineProps<Props>(), {
    title: '装备总加成',
    subtitle: '装备属性总加成',
    emptyText: '暂无装备加成',
    compact: true,
    showDivider: true
})
</script>

<style scoped>
.equip-total-bonus-section {
    margin-bottom: 24px;
}

.total-bonus-card {
    margin-bottom: 16px;
}

.total-bonus-content {
    padding: 0;
}

.bonus-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
}

.bonus-list-three-columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
}

.bonus-item {
    display: flex;
    align-items: center;
    font-size: 13px;
    justify-content: space-between;
    padding: 8px 12px;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    background-color: #fafafa;
    transition: all 0.3s ease;
}

.bonus-item:hover {
    border-color: #409eff;
    background-color: #f0f9ff;
    box-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
}

.bonus-item-compact {
    gap: 8px;
    justify-content: flex-start;
}

.bonus-key {
    color: #606266;
}

.bonus-value {
    color: #67c23a;
    font-weight: 500;
}

.no-bonus {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #909399;
    padding: 20px;
}
</style>
