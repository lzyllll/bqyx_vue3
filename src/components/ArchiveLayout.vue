<template>
  <div class="archive-layout">
    <ArchiveNavigation />
    <div class="archive-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import ArchiveNavigation from '@/components/ArchiveNavigation.vue'
</script>

<style scoped>
.archive-layout {
  display: flex;
  height: 100vh;
}

.archive-content {
  flex: 1;
  overflow-y: auto;
}
</style>

