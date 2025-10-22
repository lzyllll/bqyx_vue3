<template>
  <div class="archive-parser">
    <!-- Header -->
    <div class="page-header">
      <h1>存档解析器</h1>
      <div class="header-actions">
        <el-button type="primary" @click="uploadFile" :icon="Upload">
          上传存档文件
        </el-button>
        <el-button @click="clearData" :icon="Delete">
          清空数据
        </el-button>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Toggle Sidebar Button -->
      <el-button 
        class="toggle-sidebar-btn" 
        @click="toggleSidebar" 
        v-show="!sidebarVisible"
        type="primary"
        :icon="Menu"
        circle
      />

      <!-- Aside -->


      <!-- Main Content -->
      <div class="main-content">
        <!-- Upload Section -->
        <div class="upload-section" 
             @dragover.prevent="onDragOver" 
             @dragenter.prevent="onDragOver"
             @dragleave.prevent="onDragLeave"
             @drop.prevent="onDrop">
          <el-icon class="upload-icon">
            <Upload />
          </el-icon>
          <h3>拖拽JSON文件到此处或点击上传</h3>
          <p>支持爆枪英雄存档JSON文件</p>
          <el-button type="primary" @click="uploadFile">
            选择文件
          </el-button>
        </div>

        <!-- Navigation Buttons -->
        <div class="navigation-section">
          <h3>快速导航</h3>
          <div class="nav-buttons">
            <el-button type="success" @click="goToWeapons" :icon="Document">
              武器仓库
            </el-button>
            <el-button type="warning" @click="goToBosses" :icon="Document">
              Boss仓库
            </el-button>
            <el-button type="info" @click="goToArchive" :icon="Document">
              存档模块
            </el-button>
          </div>
        </div>
        
        <!-- 备用拖拽区域 -->
        <div class="drop-zone" 
             @dragover.prevent="onDragOver" 
             @dragenter.prevent="onDragOver"
             @dragleave.prevent="onDragLeave"
             @drop.prevent="onDrop">
          <p>或者拖拽文件到整个页面区域</p>
        </div>

      </div>
    </div>

    <!-- Hidden File Input -->
    <input ref="fileInput" type="file" accept=".json" style="display: none;" @change="onFileSelect">
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Upload, Delete, Menu, Document } from '@element-plus/icons-vue'
import { moduleInfos, getModuleInfo } from '@/utils/moduleRenderers'
import { useArchiveStore } from '@/stores/archive'
import type { ArchiveData } from '@/types/archive/root'


// 响应式数据
const router = useRouter()
const archiveStore = useArchiveStore()
const selectedModule = ref<string | null>(null)
const showRawJson = ref(false)
const sidebarVisible = ref(true)
const archiveInfo = ref<any>(null)


// 计算属性
const archiveData = computed(() => {
  return archiveStore.archiveData
})



// 方法
const uploadFile = () => {
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  fileInput?.click()
}

const onFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    parseFile(file)
  }
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  const target = event.currentTarget as HTMLElement
  target.classList.add('dragover')
}

const onDragLeave = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  const target = event.currentTarget as HTMLElement
  target.classList.remove('dragover')
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  const target = event.currentTarget as HTMLElement
  target.classList.remove('dragover')
  
  console.log('Drop event triggered')
  const files = event.dataTransfer?.files
  console.log('Files:', files)
  
  if (files && files.length > 0) {
    console.log('Processing file:', files[0].name)
    parseFile(files[0])
  } else {
    console.log('No files found in drop event')
  }
}

const parseFile = (file: File) => {
  if (!file.name.endsWith('.json')) {
    ElMessage.error('请选择JSON文件')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const jsonData = JSON.parse(e.target?.result as string)
      
      // 使用Pinia store存储数据
      archiveStore.setArchiveData(jsonData as ArchiveData)
      
      // 设置存档信息
      //现在不展示了
      archiveInfo.value = {
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(2) + ' KB',
        parseTime: new Date().toLocaleString(),
        totalModules: Object.keys(jsonData).length
      }
      
      selectedModule.value = null
      ElMessage.success('存档文件解析成功！')
      
      // 自动跳转到成就模块
      setTimeout(() => {
        router.push('/archive/main')
      }, 10)
    } catch (error: any) {
      ElMessage.error('JSON文件格式错误：' + error.message)
    }
  }
  reader.readAsText(file)
}





const clearData = () => {
  archiveStore.clearData()
  selectedModule.value = null
  showRawJson.value = false
  archiveInfo.value = null
  // 跳转回存档解析器首页
  router.push('/archive-parser')
  ElMessage.success('数据已清空')
}

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

// 导航方法
const goToWeapons = () => {
  router.push('/weapons')
}

const goToBosses = () => {
  router.push('/bosses')
}

const goToArchive = () => {
  router.push('/archive/main')
}
/** 
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
**/

// 生命周期
onMounted(() => {
  const handleResize = () => {
    sidebarVisible.value = window.innerWidth > 768
  }
  window.addEventListener('resize', handleResize)
  handleResize()
  
  // 添加全局拖拽处理
  const handleGlobalDragOver = (event: DragEvent) => {
    event.preventDefault()
  }
  
  const handleGlobalDrop = (event: DragEvent) => {
    event.preventDefault()
    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
      console.log('Global drop event:', files[0].name)
      parseFile(files[0])
    }
  }
  
  document.addEventListener('dragover', handleGlobalDragOver)
  document.addEventListener('drop', handleGlobalDrop)
  
  // 清理事件监听器
  return () => {
    document.removeEventListener('dragover', handleGlobalDragOver)
    document.removeEventListener('drop', handleGlobalDrop)
  }
})
</script>

<style scoped>
.archive-parser {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.page-header h1 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.toggle-sidebar-btn {
  position: fixed;
  top: 80px;
  left: 20px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.aside {
  width: 280px;
  background: white;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.aside.collapsed {
  width: 0;
  border-right: none;
}

.module-list {
  padding: 16px;
}

.module-list h3 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.module-item {
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.module-item:hover {
  background: #f5f7fa;
  border-color: #e4e7ed;
}

.module-item.active {
  background: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

.module-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.module-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.module-desc {
  font-size: 12px;
  color: #909399;
}

.main-content {
  flex: 1;
  background: white;
  overflow-y: auto;
  padding: 20px;
}

.upload-section {
  text-align: center;
  padding: 60px 20px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  background: #fafafa;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.upload-section.dragover {
  border-color: #409eff;
  background: #f0f9ff;
}

.drop-zone {
  padding: 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
  border: 1px dashed #e4e7ed;
  border-radius: 6px;
  margin-top: 20px;
  transition: all 0.3s ease;
}

.drop-zone:hover {
  border-color: #409eff;
  color: #409eff;
}

/* 导航区域样式 */
.navigation-section {
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.navigation-section h3 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.nav-buttons .el-button {
  min-width: 120px;
  height: 40px;
  font-weight: 600;
}

.upload-icon {
  font-size: 48px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.upload-section h3 {
  margin: 0 0 8px 0;
  color: #606266;
}

.upload-section p {
  margin: 0 0 16px 0;
  color: #909399;
  font-size: 14px;
}

.data-display {
  min-height: 400px;
}

.data-section {
  margin-bottom: 24px;
}

.data-section h3 {
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e4e7ed;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.archive-info-simple {
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #606266;
  font-weight: 500;
  min-width: 80px;
}

.info-value {
  color: #303133;
  font-weight: 600;
}

.info-card {
  text-align: center;
}

.json-viewer {
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.json-viewer pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #606266;
}

.empty-state p {
  margin: 0;
  color: #909399;
}

/* 模块渲染器样式 */
.module-summary {
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
}

.module-summary h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.module-summary h5 {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 14px;
}

.data-preview {
  margin-top: 16px;
}

.property-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.property-item {
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.property-key {
  font-weight: 600;
  color: #606266;
  font-size: 12px;
  margin-bottom: 4px;
}

.property-value {
  color: #303133;
  font-size: 14px;
  word-break: break-all;
}

/* 主模块样式 */
.main-module {
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
}

.main-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.main-details {
  margin-top: 20px;
}

/* 武器模块样式 */
.arms-module {
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
}

.arms-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.summary-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.weapon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.weapon-item {
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.weapon-name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.weapon-level {
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
}

.weapon-color {
  font-size: 12px;
  font-weight: 600;
}

/* 装备模块样式 */
.equip-module {
  background: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.equipment-item {
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.equipment-name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.equipment-level {
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
}

.equipment-type {
  font-size: 12px;
  color: #909399;
}

@media (max-width: 768px) {
  .aside {
    position: fixed;
    top: 60px;
    left: 0;
    height: calc(100vh - 60px);
    z-index: 1000;
    transform: translateX(-100%);
  }
  
  .aside.open {
    transform: translateX(0);
  }
  
  .main-content {
    padding: 16px;
  }
  
  .data-grid {
    grid-template-columns: 1fr;
  }
}
</style>
