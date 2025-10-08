# 武器管理系统 (TypeScript版本)

基于Vue 3 + TypeScript + Element Plus构建的武器管理系统，提供完整的武器和Boss CRUD功能。

## 功能特性

- 🔐 用户认证（登录/注册）
- 📋 武器列表展示和管理
- 📋 Boss列表展示和管理
- ➕ 添加新武器和Boss
- 👁️ 查看武器和Boss详情
- 🗑️ 删除武器和Boss
- 📱 响应式设计
- 🔧 TypeScript支持

## 技术栈

- **前端框架**: Vue 3 (Composition API + TypeScript)
- **UI组件库**: Element Plus
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **HTTP客户端**: Axios
- **构建工具**: Vite
- **类型检查**: TypeScript

## 项目结构

```
src/
├── api/                 # API服务层
│   └── index.ts        # 接口封装
├── components/         # 组件
│   └── Layout.vue      # 主布局组件
├── router/             # 路由配置
│   └── index.ts       # 路由定义
├── stores/            # 状态管理
│   ├── auth.ts        # 认证状态
│   ├── weapon.ts      # 武器状态
│   └── boss.ts        # Boss状态
├── types/             # TypeScript类型定义
│   └── index.ts       # 类型定义
├── views/             # 页面组件
│   ├── Login.vue      # 登录页
│   ├── Register.vue   # 注册页
│   ├── WeaponList.vue # 武器列表
│   ├── WeaponDetail.vue # 武器详情
│   ├── WeaponAdd.vue  # 添加武器
│   ├── BossList.vue   # Boss列表
│   ├── BossDetail.vue # Boss详情
│   └── BossAdd.vue    # 添加Boss
├── App.vue            # 根组件
└── main.ts           # 入口文件
```

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 类型检查：
```bash
npm run type-check
```

4. 构建生产版本：
```bash
npm run build
```

## API接口

系统使用以下API接口：

### 认证相关
- `POST /user/` - 用户注册
- `POST /token/` - 获取Token

### 武器管理
- `GET /CustomWeapon/` - 获取武器列表
- `GET /CustomWeapon/{id}/` - 获取武器详情
- `POST /CustomWeapon/` - 添加武器
- `DELETE /CustomWeapon/{id}/` - 删除武器

### Boss管理
- `GET /CustomBoss/` - 获取Boss列表
- `GET /CustomBoss/{id}/` - 获取Boss详情
- `POST /CustomBoss/` - 添加Boss
- `DELETE /CustomBoss/{id}/` - 删除Boss

## 数据结构

### 武器对象 (WeaponObject)
```typescript
interface WeaponObject {
  cnName?: string;           // 武器名称
  baseLabel?: string;         // 基础标签
  pn?: string;               // PN
  name?: string;              // 名称
  capacity?: number;          // 容量
  bulletNum?: number;        // 子弹数量
  attackGap?: number;        // 攻击间隔
  reloadGap?: number;        // 重装间隔
  skillArr?: string[];       // 技能数组
  godSkillArr?: string[];    // 神技数组
  // ... 更多字段
}
```

### Boss对象 (BossObject)
```typescript
interface BossObject {
  n?: string;                 // 名称
  pn?: string;               // PN
  ud?: string;               // UD
  mp?: string;               // MP
  lv?: number;               // 等级
  li?: number;               // LI
  sk?: string[];             // 技能数组
  si?: boolean;              // SI标志
  ve?: boolean;              // VE标志
  pa?: boolean;              // PA标志
  pr?: boolean;              // PR标志
  pe?: boolean;              // PE标志
  hb?: boolean;              // HB标志
}
```

## 使用说明

1. **注册账号**: 首次使用需要注册账号
2. **登录系统**: 使用用户名和密码登录
3. **管理武器**: 可以查看、添加、删除武器
4. **管理Boss**: 可以查看、添加、删除Boss
5. **查看详情**: 点击武器或Boss卡片查看详细信息

## 开发说明

- 所有API调用都通过`src/api/index.ts`统一管理
- 状态管理使用Pinia，分为认证状态、武器状态和Boss状态
- 路由守卫确保只有登录用户才能访问管理页面
- 响应式设计支持移动端和桌面端
- 完整的TypeScript类型支持

## 注意事项

- 确保后端API服务正常运行
- Token会自动保存在localStorage中
- 未登录用户会被重定向到登录页面
- 所有字段都是可选的，支持空值
