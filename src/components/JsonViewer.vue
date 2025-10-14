<template>
    <div class="data-section">
        <el-divider content-position="left">
            <el-icon><Document /></el-icon>
            <span>{{ title }}</span>
        </el-divider>
        <el-card>
            <el-collapse>
                <el-collapse-item :title="collapseTitle" name="full">
                    <el-input
                        :model-value="safeJsonData"
                        type="textarea"
                        :rows="rows"
                        readonly
                        class="json-viewer"
                    />
                </el-collapse-item>
            </el-collapse>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Document } from '@element-plus/icons-vue'

interface Props {
    jsonData: string
    title?: string
    collapseTitle?: string
    rows?: number
}

const props = withDefaults(defineProps<Props>(), {
    title: '详细数据',
    collapseTitle: '查看完整JSON数据',
    rows: 10
})

// 安全地处理 JSON 数据，避免 NaN 和 undefined 问题
const safeJsonData = computed(() => {
    if (!props.jsonData) return '{}'
    
    try {
        // 如果已经是字符串，直接返回
        if (typeof props.jsonData === 'string') {
            return props.jsonData
        }
        
        // 如果是对象，安全地序列化
        return JSON.stringify(props.jsonData, (key, value) => {
            if (typeof value === 'number' && isNaN(value)) {
                return null
            }
            if (value === undefined) {
                return null
            }
            return value
        }, 2)
    } catch (error) {
        console.warn('JSON 序列化失败:', error)
        return '数据格式错误，无法显示'
    }
})
</script>

<style scoped>
.data-section {
    margin-bottom: 24px;
}

.json-viewer {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    line-height: 1.5;
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
}

:deep(.el-textarea__inner) {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    line-height: 1.5;
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
}
</style>
