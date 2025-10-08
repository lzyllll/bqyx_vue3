

interface ModuleInfo{
  key: string;
  name: string;
  description: string;
  category: string;
}
// 模块信息配置
export const moduleInfos: ModuleInfo[] = [
  { key: 'main', name: '全局数据', description: '基础游戏数据', category: '基础' },
  { key: 'equip', name: '装备', description: '装备系统数据', category: '装备' },
  { key: 'base', name: '基础信息', description: '玩家基础信息', category: '基础' },
  { key: 'arena', name: '竞技场', description: '竞技场相关数据', category: '战斗' },
  { key: 'head', name: '称号', description: '称号系统数据', category: '角色' },
  { key: 'partsBag', name: '零件背包', description: '零件背包数据', category: '背包' },

  { key: 'wilder', name: '秘境', description: '秘境探索数据', category: '探索' },
  { key: 'skillBag', name: '技能背包', description: '技能背包数据', category: '背包' },

  { key: 'active', name: '活跃度', description: '活跃度数据', category: '角色' },
  { key: 'pay', name: '消费记录', description: '消费记录数据', category: '经济' },
  { key: 'task', name: '任务进度', description: '任务进度数据', category: '任务' },
  { key: 'peak', name: '巅峰等级', description: '巅峰等级数据', category: '角色' },
  { key: 'drop', name: '掉落统计', description: '掉落统计数据', category: '统计' },
  { key: 'geneBag', name: '基因体背包', description: '基因体背包数据', category: '背包' },
  { key: 'gift', name: '礼包', description: '礼包数据', category: '经济' },
  { key: 'hooker', name: '修罗挂机', description: '修罗挂机数据', category: '战斗' },
  { key: 'equipBag', name: '装备背包', description: '装备背包数据', category: '背包' },
  { key: 'love', name: '好感度', description: '好感度数据', category: '角色' },
  { key: 'bossCard', name: '魂卡', description: '魂卡数据', category: '装备' },
  { key: 'goods', name: '购买记录', description: '购买记录数据', category: '经济' },
  { key: 'armsBag', name: '武器背包', description: '武器背包数据', category: '背包' },
  { key: 'armsHouse', name: '武器仓库', description: '武器仓库数据', category: '仓库' },
  { key: 'arms', name: '已装备武器', description: '已装备武器数据', category: '装备' },
  { key: 'thingsBag', name: '物品背包', description: '物品背包数据', category: '背包' },
  { key: 'count', name: '数据统计', description: '数据统计数据', category: '统计' },
  { key: 'pet', name: '尸宠', description: '尸宠数据', category: '角色' },
  { key: 'ask', name: '每日问答', description: '每日问答数据', category: '任务' },
  { key: 'achieve', name: '成就勋章', description: '成就勋章数据', category: '角色' },
  { key: 'bossEdit', name: '首领编辑器', description: '首领编辑器数据', category: '编辑' },
  { key: 'city', name: '主城熔炼', description: '主城熔炼数据', category: '经济' },
  { key: 'partner', name: '队友AI', description: '队友AI数据', category: '角色' },
  { key: 'worldMap', name: '关卡统计', description: '关卡统计数据', category: '探索' },
  { key: 'guide', name: '引导提示', description: '引导提示数据', category: '系统' },
  { key: 'space', name: '太空探索', description: '太空探索数据', category: '探索' },
  { key: 'tower', name: '虚天塔', description: '虚天塔数据', category: '战斗' },
  { key: 'post', name: '职务', description: '职务数据', category: '角色' },
  { key: 'setting', name: '游戏设置', description: '游戏设置数据', category: '系统' },
  { key: 'food', name: '美食屋', description: '美食屋数据', category: '经济' },
  { key: 'time', name: '时间与增益', description: '时间与增益数据', category: '系统' },
  { key: 'armsTor', name: '武器制作', description: '武器制作数据', category: '制作' },
  { key: 'headCount', name: '荣誉统计', description: '荣誉统计数据', category: '统计' },
  { key: 'union', name: '军队', description: '军队数据', category: '社交' },
  { key: 'equipHouse', name: '装备仓库', description: '装备仓库数据', category: '仓库' },
  { key: 'vip', name: 'VIP详情', description: 'VIP详情数据', category: '角色' },
  { key: 'blackMarket', name: '黑市商人', description: '黑市商人数据', category: '经济' },
  { key: 'skill', name: '技能', description: '技能数据', category: '角色' },
  { key: 'more', name: '更多数据', description: '更多数据', category: '其他' },
  { key: 'moreBag', name: '更多背包', description: '更多背包数据', category: '背包' },
  { key: 'state', name: '状态数据', description: '状态数据', category: '系统' }
]

// 获取模块信息
export function getModuleInfo(key: string): ModuleInfo | undefined {
  return moduleInfos.find(module => module.key === key)
}

// 按分类获取模块
export function getModulesByCategory(): Record<string, ModuleInfo[]> {
  const categories: Record<string, ModuleInfo[]> = {}
  
  moduleInfos.forEach(module => {
    const category = module.category || '其他'
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push(module)
  })
  
  return categories
}




