<template>
  <el-container class="layout-container">
    <el-header class="layout-header">
      <div class="header-content">
        <h1 class="logo">首领，武器分享仓库</h1>
        <div class="header-actions">
          <el-button @click="goToWeaponList">
            <el-icon><List /></el-icon>
            武器列表
          </el-button>
          <el-button @click="goToBossList">
            <el-icon><User /></el-icon>
            Boss管理
          </el-button>
          <el-button v-if="authStore.isAuthenticated" @click="logout">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
          <el-button v-else @click="goToLogin">
            <el-icon><User /></el-icon>
            登录
          </el-button>
        </div>
      </div>
    </el-header>
    
    <el-main class="layout-main">
      <router-view />
    </el-main>
    
    <el-footer class="layout-footer">
      <div class="footer-content">
        <div class="footer-links">
          <span class="footer-label">友情链接：</span>
          <a href="https://bqtj.huijiwiki.com/wiki/%E9%A6%96%E9%A1%B5" target="_blank" class="footer-link">
            爆枪wiki
          </a>
          <a href="https://bqyx-query.onrender.com/" target="_blank" class="footer-link">
            军队历史查询
          </a>
          <router-link to="/archive-parser" class="footer-link">
            存档解析器
          </router-link>
        </div>
        <div class="footer-copyright">
          © 2025 爆枪分享仓库
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { SwitchButton, User, List } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const goToWeaponList = () => {
  router.push('/')
}

const goToBossList = () => {
  router.push('/boss')
}

const goToLogin = () => {
  router.push('/login')
}

const logout = () => {
  authStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.layout-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.layout-main {
  background-color: #f5f7fa;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.layout-footer {
  background-color: #2c3e50;
  color: white;
  padding: 20px 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-label {
  color: #bdc3c7;
  font-size: 14px;
}

.footer-link {
  color: #3498db;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #5dade2;
  text-decoration: underline;
}

.footer-copyright {
  color: #bdc3c7;
  font-size: 14px;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  
  .logo {
    font-size: 20px;
  }
  
  .header-actions {
    gap: 8px;
  }
  
  .layout-main {
    padding: 16px;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .footer-links {
    justify-content: center;
  }
}
</style>
