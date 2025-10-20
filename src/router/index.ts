import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 路由组件懒加载
const Login = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const Layout = () => import('@/components/Layout.vue')
const WeaponList = () => import('@/views/WeaponList.vue')
const WeaponDetail = () => import('@/views/WeaponDetail.vue')
const WeaponAdd = () => import('@/views/WeaponAdd.vue')
const WeaponEdit = () => import('@/views/WeaponEdit.vue')
const BossList = () => import('@/views/BossList.vue')
const BossDetail = () => import('@/views/BossDetail.vue')
const BossAdd = () => import('@/views/BossAdd.vue')
const BossEdit = () => import('@/views/BossEdit.vue')
const ArchiveParser = () => import('@/views/ArchiveParser.vue')
const ArchiveLayout = () => import('@/components/ArchiveLayout.vue')
// 存档模块
const MainModule = () => import('@/views/archive/MainModule.vue')
const BaseModule = () => import('@/views/archive/BaseModule.vue')
const ArenaModule = () => import('@/views/archive/ArenaModule.vue')
const ArmsModule = () => import('@/views/archive/ArmsModule.vue')
const EquipModule = () => import('@/views/archive/EquipModule.vue')
const SkillModule = () => import('@/views/archive/SkillModule.vue')
const AchieveModule = () => import('@/views/archive/AchieveModule.vue')
const HeadModule = () => import('@/views/archive/HeadModule.vue')
const PeakModule = () => import('@/views/archive/PeakModule.vue')
const GenericModule = () => import('@/views/archive/GenericModule.vue')
const BossCardModule = () => import('@/views/archive/BossCardModule.vue')
const PetModule = () => import('@/views/archive/PetModule.vue')
const VipModule = () => import('@/views/archive/VipModule.vue')
const ThingsBagModule = () => import('@/views/archive/ThingsBagModule.vue')
const EquipBagModule = () => import('@/views/archive/EquipBagModule.vue')
const SkillBagModule = () => import('@/views/archive/SkillBagModule.vue')
const WorldMapModule = () => import('@/views/archive/WorldMapModule.vue')
const PayModule = () => import('@/views/archive/PayModule.vue')
const EquipHouseModule = () => import('@/views/archive/EquipHouseModule.vue')
const DropModule = () => import('@/views/archive/DropModule.vue')
const GeneBagModule = () => import('@/views/archive/GeneBagModule.vue')
const CountModule = () => import('@/views/archive/CountModule.vue')
const ArmsBagModule = () => import('@/views/archive/ArmsBagModule.vue')
const ArmsHouseModule = () => import('@/views/archive/ArmsHouseModule.vue')
const RoleBonusModule = () => import('@/views/archive/RoleBonusModule.vue')
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/archive-parser',
    name: 'ArchiveParser',
    component: ArchiveParser,
    meta: { requiresAuth: false }
  },
  // 存档模块布局
  {
    path: '/archive',
    component: ArchiveLayout,
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        redirect: '/archive/main'
      },
      {
        path: 'main',
        name: 'MainModule',
        component: MainModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'base',
        name: 'BaseModule',
        component: BaseModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'arena',
        name: 'ArenaModule',
        component: ArenaModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'arms',
        name: 'ArmsModule',
        component: ArmsModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'equip',
        name: 'EquipModule',
        component: EquipModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'skill',
        name: 'SkillModule',
        component: SkillModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'achieve',
        name: 'AchieveModule',
        component: AchieveModule,
        meta: { requiresAuth: false }
      },
      // 背包模块
      {
        path: 'partsBag',
        name: 'PartsBagModule',
        component: () => import('@/views/archive/PartsBagModule.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'skillBag',
        name: 'SkillBagModule',
        component: SkillBagModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'equipBag',
        name: 'EquipBagModule',
        component: EquipBagModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'skillBag',
        name: 'SkillBagModule',
        component: SkillBagModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'armsBag',
        name: 'ArmsBagModule',
        component: ArmsBagModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'armsHouse',
        name: 'ArmsHouseModule',
        component: ArmsHouseModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'thingsBag',
        name: 'ThingsBagModule',
        component: ThingsBagModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'geneBag',
        name: 'GeneBagModule',
        component: GeneBagModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'equipHouse',
        name: 'EquipHouseModule',
        component: EquipHouseModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'moreBag',
        name: 'MoreBagModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      // 角色模块
      {
        path: 'head',
        name: 'HeadModule',
        component: HeadModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'active',
        name: 'ActiveModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'peak',
        name: 'PeakModule',
        component: PeakModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'love',
        name: 'LoveModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'pet',
        name: 'PetModule',
        component: PetModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'vip',
        name: 'VipModule',
        component: VipModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'partner',
        name: 'PartnerModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'post',
        name: 'PostModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      // 战斗模块
      {
        path: 'hooker',
        name: 'HookerModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'tower',
        name: 'TowerModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      // 探索模块
      {
        path: 'wilder',
        name: 'WilderModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'worldMap',
        name: 'WorldMapModule',
        component: WorldMapModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'space',
        name: 'SpaceModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      // 经济模块
      {
        path: 'pay',
        name: 'PayModule',
        component: PayModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'gift',
        name: 'GiftModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'goods',
        name: 'GoodsModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'city',
        name: 'CityModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'blackMarket',
        name: 'BlackMarketModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'food',
        name: 'FoodModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      // 任务模块
      {
        path: 'task',
        name: 'TaskModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'ask',
        name: 'AskModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      // 统计模块
      {
        path: 'drop',
        name: 'DropModule',
        component: DropModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'count',
        name: 'CountModule',
        component: CountModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'headCount',
        name: 'HeadCountModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      // 装备模块
      {
        path: 'bossCard',
        name: 'BossCardModule',
        component: BossCardModule,
        meta: { requiresAuth: false }
      },
      // 编辑模块
      {
        path: 'bossEdit',
        name: 'BossEditModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      // 制作模块
      {
        path: 'armsTor',
        name: 'ArmsTorModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      // 社交模块
      {
        path: 'union',
        name: 'UnionModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      // 系统模块
      {
        path: 'guide',
        name: 'GuideModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'roleBonus',
        name: 'RoleBonusModule',
        component: RoleBonusModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'setting',
        name: 'SettingModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'time',
        name: 'TimeModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      {
        path: 'state',
        name: 'StateModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      },
      // 其他模块
      {
        path: 'more',
        name: 'MoreModule',
        component: GenericModule,
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        name: 'WeaponList',
        component: WeaponList,
        meta: { requiresAuth: false }
      },
      {
        path: 'weapon/:id',
        name: 'WeaponDetail',
        component: WeaponDetail,
        props: true,
        meta: { requiresAuth: false }
      },
      {
        path: 'weapon/add',
        name: 'WeaponAdd',
        component: WeaponAdd,
        meta: { requiresAuth: true }
      },
      {
        path: 'weapon/:id/edit',
        name: 'WeaponEdit',
        component: WeaponEdit,
        props: true,
        meta: { requiresAuth: true }
      },
      {
        path: 'boss',
        name: 'BossList',
        component: BossList,
        meta: { requiresAuth: false }
      },
      {
        path: 'boss/:id',
        name: 'BossDetail',
        component: BossDetail,
        props: true,
        meta: { requiresAuth: false }
      },
      {
        path: 'boss/add',
        name: 'BossAdd',
        component: BossAdd,
        meta: { requiresAuth: true }
      },
      {
        path: 'boss/:id/edit',
        name: 'BossEdit',
        component: BossEdit,
        props: true,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 检查是否需要认证
  const requiresAuth = to.meta.requiresAuth || (to.matched.some(record => record.meta.requiresAuth))
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
