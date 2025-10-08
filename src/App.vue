<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { getBackgroundImageStyle } from './utils/backgroundImages';

console.log(getBackgroundImageStyle('darkgold', 'arm'))
// 主应用组件，使用路由渲染
</script>

<style>
#app {
  min-height: 100vh;
  background-color: #f5f7fa;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
