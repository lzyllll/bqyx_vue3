<template>
    <div v-if="bonusList.length > 0" class="bonus-list-container">
        <div class="bonus-title">{{ title }}</div>
        <div class="bonus-list">
            <div 
                v-for="bonus in bonusList" 
                :key="bonus.key"
                :class="['bonus-item', { 'bonus-item-compact': compact }]"
            >
                <span class="bonus-key">{{ bonus.key }}</span>
                <span class="bonus-value">{{ bonus.value }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface BonusItem {
    key: string
    value: string
}

interface Props {
    bonusList: BonusItem[]
    title?: string
    compact?: boolean
}

withDefaults(defineProps<Props>(), {
    title: '属性加成',
    compact: true
})
</script>

<style scoped>
.bonus-list-container {
    padding: 12px 0;
}

.bonus-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
}

.bonus-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
}

.bonus-item {
    display: flex;
    align-items: center;
    font-size: 13px;
    justify-content: space-between;
    padding: 6px 10px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
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
</style>
