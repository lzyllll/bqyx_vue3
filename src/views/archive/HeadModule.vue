<template>
     <div class="generic-module">
         <div class="module-header">
           <h2>{{ moduleName }}</h2>
           <p class="module-desc">{{ moduleDescription }}</p>
         </div>
         
         <!-- 头衔展示区域 -->
         <div v-if="data" class="head-display">
           <!-- 当前头衔展示 -->
           <div class="current-head-section">
             <h3>当前头衔</h3>
             <div class="current-head-card" v-if="data.nowHead">
               <div class="head-info">
                 <div class="head-name">{{ getCurrentHeadName() }}</div>
                 <div class="head-description">{{ getCurrentHeadDescription() }}</div>
                 <div class="head-type">
                   <el-tag :type="getHeadTypeColor(getCurrentHeadType())" size="small">
                     {{ getCurrentHeadType() }}
                   </el-tag>
                 </div>
               </div>
               <div class="head-bonus" v-if="getCurrentHeadBonus().length > 0">
                 <div class="bonus-title">头衔加成</div>
                 <div class="bonus-list">
                   <div 
                     v-for="bonus in getCurrentHeadBonus()" 
                     :key="bonus.key"
                     class="bonus-item"
                   >
                     <span class="bonus-key">{{ bonus.key }}</span>
                     <span class="bonus-value">{{ bonus.value }}</span>
                   </div>
                 </div>
               </div>
             </div>
             <div v-else class="no-head">
               未设置头衔
             </div>
           </div>

           <!-- 荣誉加成展示 -->
           <div class="honor-bonus-section">
             <h3>荣誉加成</h3>
             <div class="honor-score-info">
               <div class="score-item">
                 <span class="score-label">当前荣誉分数：</span>
                 <span class="score-value">{{ getTotalScore() }}</span>
               </div>
               <div class="score-item">
                 <span class="score-label">获得头衔数量：</span>
                 <span class="score-value">{{ getCompletedTitlesCount() }}</span>
               </div>
             </div>
             <div class="honor-bonus-card" v-if="getHonorBonus().length > 0">
               <div class="bonus-list">
                 <div 
                   v-for="bonus in getHonorBonus()" 
                   :key="bonus.key"
                   class="bonus-item"
                 >
                   <span class="bonus-key">{{ bonus.key }}</span>
                   <span class="bonus-value">{{ bonus.value }}</span>
                 </div>
               </div>
             </div>
             <div v-else class="no-bonus">
               暂无荣誉加成
             </div>
           </div>

           <!-- 头衔列表 -->
           <div class="head-list-section">
             <h3>头衔列表</h3>
             <div class="head-grid">
               <el-popover
                 v-for="(headInfo, key) in data.obj" 
                 :key="key"
                 placement="top"
                 :width="300"
                 trigger="hover"
               >
                 <template #reference>
                   <div class="head-item">
                     <div class="head-name">{{ getHeadTitleName(key) }}</div>
                     <div class="head-description">{{ getHeadTitleDescription(key) }}</div>
                     <div class="head-type">
                       <el-tag :type="getHeadTypeColor(getHeadTitleType(key))" size="small">
                         {{ getHeadTitleType(key) }}
                       </el-tag>
                     </div>
                     <div class="head-time">{{ headInfo?.getTimeStr || '未知时间' }}</div>
                   </div>
                 </template>
                 
                 <div class="head-popover">
                   <div class="popover-header">
                     <div class="popover-title">{{ getHeadTitleName(key) }}</div>
                     <div class="popover-type">
                       <el-tag :type="getHeadTypeColor(getHeadTitleType(key))" size="small">
                         {{ getHeadTitleType(key) }}
                       </el-tag>
                     </div>
                   </div>
                   <div class="popover-description">{{ getHeadTitleDescription(key) }}</div>
                   <div class="popover-bonus" v-if="getHeadTitleBonus(key).length > 0">
                     <div class="bonus-title">属性加成</div>
                     <div class="bonus-list">
                       <div 
                         v-for="bonus in getHeadTitleBonus(key)" 
                         :key="bonus.key"
                         class="bonus-item"
                       >
                         <span class="bonus-key">{{ bonus.key }}</span>
                         <span class="bonus-value">{{ bonus.value }}</span>
                       </div>
                     </div>
                   </div>
                   <div class="popover-time">
                     <div class="time-label">获得时间：</div>
                     <div class="time-value">{{ headInfo?.getTimeStr || '未知时间' }}</div>
                   </div>
                 </div>
               </el-popover>
             </div>
           </div>
         </div>
         
         <div class="data-preview">
           <h3>{{ moduleName }}数据</h3>
           <div v-if="data" class="data-content">
             <el-collapse>
               <el-collapse-item title="查看完整数据" name="full">
                 <pre class="json-data">{{ JSON.stringify(data, null, 2) }}</pre>
               </el-collapse-item>
             </el-collapse>
           </div>
           <div v-else class="no-data">
             <p>该模块暂无数据</p>
           </div>
         </div>
     </div>
   </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useArchiveStore } from '@/stores/archive'
  import type { Head } from '@/types/archive/module/head'
  import { translateHeadTitle, getHeadTitleInfo, getFormattedBonusList } from '@/utils/translate'
  
  const archiveStore = useArchiveStore()
  const moduleKey = "head"
  
  // 获取模块信息
  const moduleInfo = computed(() => {
    return archiveStore.getModuleData(moduleKey)
  })
  
  const moduleName = computed(() => {
    return moduleInfo.value?.name || moduleKey
  })
  
  const moduleDescription = computed(() => {
    return moduleInfo.value?.description || '存档模块数据'
  })
  
  // 获取模块数据
  const data = computed(() => {
    var a = archiveStore.getModuleData(moduleKey) as Head | null
    console.log(a.obj)
    return archiveStore.getModuleData(moduleKey) as Head | null
  })

  // 获取当前头衔名称
  const getCurrentHeadName = () => {
    if (!data.value?.nowHead) return ''
    return translateHeadTitle(data.value.nowHead)
  }

  // 获取当前头衔描述
  const getCurrentHeadDescription = () => {
    if (!data.value?.nowHead) return ''
    const headInfo = getHeadTitleInfo(data.value.nowHead)
    return headInfo?.description || ''
  }

  // 获取当前头衔类型
  const getCurrentHeadType = () => {
    if (!data.value?.nowHead) return ''
    const headInfo = getHeadTitleInfo(data.value.nowHead)
    return headInfo?.type || ''
  }

  // 获取当前头衔加成
  const getCurrentHeadBonus = () => {
    if (!data.value?.nowHead) return []
    const headInfo = getHeadTitleInfo(data.value.nowHead)
    if (!headInfo?.roleBonus) return []
    return getFormattedBonusList(headInfo.roleBonus)
  }

  // 获取荣誉加成
  const getHonorBonus = () => {
    if (!data.value) return []
    const honorBonus = data.value.getHonorTitleBonus()
    return getFormattedBonusList(honorBonus)
  }

  // 获取总荣誉分数
  const getTotalScore = () => {
    if (!data.value) return 0
    return data.value.getTotalScore()
  }

  // 获取已完成头衔数量
  const getCompletedTitlesCount = () => {
    if (!data.value) return 0
    return data.value.getCompletedTitleNames().length
  }

  // 获取头衔名称
  const getHeadTitleName = (key: string) => {
    return translateHeadTitle(key)
  }

  // 获取头衔描述
  const getHeadTitleDescription = (key: string) => {
    const headInfo = getHeadTitleInfo(key)
    return headInfo?.description || ''
  }

  // 获取头衔类型
  const getHeadTitleType = (key: string) => {
    const headInfo = getHeadTitleInfo(key)
    return headInfo?.type || ''
  }

  // 获取头衔加成
  const getHeadTitleBonus = (key: string) => {
    const headInfo = getHeadTitleInfo(key)
    if (!headInfo?.roleBonus) return []
    return getFormattedBonusList(headInfo.roleBonus)
  }

  // 获取头衔类型颜色
  const getHeadTypeColor = (type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
    const colorMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
      '新的': 'success',
      '排行榜': 'warning',
      '收集': 'info',
      '军队': 'danger',
      '其他': 'primary'
    }
    return colorMap[type] || 'primary'
  }
  </script>
  
  <style scoped>
  .generic-module {
    background: #f8f9fa;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 20px;
    margin: 20px;
    overflow-y: auto;
  }
  
  .module-header {
    margin-bottom: 20px;
  }
  
  .module-header h2 {
    margin: 0 0 8px 0;
    color: #303133;
    font-size: 20px;
  }
  
  .module-desc {
    margin: 0;
    color: #909399;
    font-size: 14px;
  }

  /* 头衔展示样式 */
  .head-display {
    margin-bottom: 30px;
  }

  .current-head-section,
  .honor-bonus-section,
  .head-list-section {
    margin-bottom: 30px;
  }

  .current-head-section h3,
  .honor-bonus-section h3,
  .head-list-section h3 {
    margin: 0 0 16px 0;
    color: #303133;
    font-size: 18px;
    font-weight: 600;
  }

  .current-head-card {
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    gap: 20px;
  }

  .head-info {
    flex: 1;
  }

  .head-name {
    font-size: 20px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
  }

  .head-description {
    color: #606266;
    font-size: 14px;
    margin-bottom: 12px;
    line-height: 1.5;
  }

  .head-type {
    margin-bottom: 8px;
  }

  .head-bonus {
    flex: 1;
    background: #f8f9fa;
    border-radius: 6px;
    padding: 16px;
  }

  .bonus-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
  }

  .bonus-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .bonus-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
  }

  .bonus-key {
    color: #606266;
    font-size: 14px;
  }

  .bonus-value {
    color: #409eff;
    font-weight: 600;
    font-size: 14px;
  }

  .no-head,
  .no-bonus {
    text-align: center;
    color: #909399;
    font-size: 14px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    border: 1px dashed #dcdfe6;
  }

  .honor-score-info {
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    display: flex;
    gap: 24px;
  }

  .score-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .score-label {
    color: #606266;
    font-size: 14px;
    font-weight: 500;
  }

  .score-value {
    color: #409eff;
    font-size: 16px;
    font-weight: 600;
  }

  .honor-bonus-card {
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 20px;
  }

  .head-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .head-item {
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .head-item:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
  }

  .head-item .head-name {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 6px;
  }

  .head-item .head-description {
    color: #606266;
    font-size: 12px;
    margin-bottom: 8px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .head-item .head-type {
    margin-bottom: 8px;
  }

  .head-item .head-time {
    color: #909399;
    font-size: 12px;
  }

  .head-popover {
    padding: 16px;
  }

  .popover-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .popover-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  .popover-type {
    flex-shrink: 0;
  }

  .popover-description {
    color: #606266;
    font-size: 14px;
    margin-bottom: 16px;
    line-height: 1.5;
  }

  .popover-bonus {
    margin-bottom: 16px;
  }

  .popover-bonus .bonus-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
  }

  .popover-bonus .bonus-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .popover-bonus .bonus-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 0;
  }

  .popover-bonus .bonus-key {
    color: #606266;
    font-size: 13px;
  }

  .popover-bonus .bonus-value {
    color: #409eff;
    font-weight: 600;
    font-size: 13px;
  }

  .popover-time {
    border-top: 1px solid #e4e7ed;
    padding-top: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .time-label {
    color: #909399;
    font-size: 12px;
  }

  .time-value {
    color: #606266;
    font-size: 12px;
  }
  
  .data-preview h3 {
    margin: 0 0 16px 0;
    color: #303133;
    font-size: 16px;
  }
  
  .data-content {
    margin-top: 16px;
  }
  
  .json-data {
    background: #f8f9fa;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    padding: 12px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    line-height: 1.5;
    max-height: 400px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }
  
  .no-data {
    text-align: center;
    padding: 40px;
    color: #909399;
  }
  
  .no-data p {
    margin: 0;
    font-size: 14px;
  }
  
  @media (max-width: 768px) {
    .head-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 12px;
    }
  }
  </style>
  
  
  