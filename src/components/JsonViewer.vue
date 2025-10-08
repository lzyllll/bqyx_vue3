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
                        :model-value="jsonData"
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
import { Document } from '@element-plus/icons-vue'

interface Props {
    jsonData: string
    title?: string
    collapseTitle?: string
    rows?: number
}

withDefaults(defineProps<Props>(), {
    title: '详细数据',
    collapseTitle: '查看完整JSON数据',
    rows: 10
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
