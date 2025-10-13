<template>
  <div class="arms-display">
    <div class="arms-image-container">
      <div 
        class="arms-image"
        :style="getArmsImageStyle(armsItem)"
      >
        <!-- 锁定标识 -->
        <div v-if="armsItem.lockB" class="lock-badge">
          <el-icon><Lock /></el-icon>
        </div>
        
        <!-- 等级显示 -->
        <div v-if="armsItem.itemsLevel > 1" class="level-badge">
          Lv.{{ armsItem.itemsLevel }}
        </div>
        
        <!-- 新武器标识 -->
        <div v-if="armsItem.newB" class="new-badge">新</div>
      </div>
    </div>
    
    <!-- 武器信息 -->
    <div class="arms-info">
      <!-- 品质标签 -->
      <el-tag 
        :type="getColorTagType(armsItem.color) as any" 
        size="small"
        class="quality-tag"
      >
        {{ translateColorName(armsItem.color) }}
      </el-tag>
      
      <!-- 武器名称 -->
      <el-tag 
        type="info" 
        size="small"
        class="name-tag"
      >
        {{ armsItem.cnName }}
      </el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Lock } from '@element-plus/icons-vue'
import type { ArmsItem } from '@/types/archive/module/arms'
import { getArmsBackgroundStyle } from '@/utils/backgroundImages'
import { getColorTagType, translateColorName } from '@/utils/colorUtils'

interface Props {
  armsItem: ArmsItem
}

const props = defineProps<Props>()

// 获取武器图片样式
const getArmsImageStyle = (item: ArmsItem) => {
  return getArmsBackgroundStyle(
    { 
      name: item.name, 
      imgName: item.name 
    }, 
    item.color
  )
}
</script>

<style scoped>
.arms-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.arms-image-container {
  position: relative;
  width: 200px;
  height: 80px;
}

.arms-image {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  position: relative;
  border: 2px solid #e0e0e0;
}


.lock-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 10px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.level-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #409eff;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
}

.new-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: #f56c6c;
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
}

.arms-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.quality-tag {
  font-size: 10px;
  height: 18px;
  line-height: 16px;
}

.name-tag {
  font-size: 10px;
  height: 18px;
  line-height: 16px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .arms-image-container {
    width: 160px;
    height: 64px;
  }
  
  .lock-badge,
  .level-badge,
  .new-badge {
    font-size: 9px;
    padding: 1px 3px;
  }
  
  .quality-tag,
  .name-tag {
    font-size: 9px;
    height: 16px;
    line-height: 14px;
  }
}
</style>
