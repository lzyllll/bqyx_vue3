// 武器对象类型定义
export interface WeaponObject {
  bounceD?: {
    hurtNumAdd?: number;
    body?: number;
    floor?: number;
  };
  shootSoundUrl?: string;
  bulletNum?: number;
  skillArr?: string[];
  bulletImg?: string;
  bulletLife?: number;
  hitImg?: string;
  penetrationGap?: number;
  baseLabel?: string;
  shootAngle?: number;
  attackGap?: number;
  penetrationNum?: number;
  name?: string;
  twoShootPro?: number;
  godSkillArr?: string[];
  capacity?: number;
  pn?: string;
  bulletWidth?: number;
  reloadGap?: number;
  cnName?: string;
}

// Boss对象类型定义
export interface BossObject {
  /** 技能 */
  sk?: string[];
  /** 强制单人 */
  si?: boolean;
  /** 昵称 */
  pn?: string;
  /** 禁止载具 */
  ve?: boolean;
  /** 生命系数 */
  li?: number;
  /** 地图 */
  mp?: string;
  /** 禁止队友 */
  pa?: boolean;
  /** 首领名称 */
  n?: string;
  /** uid+index */
  ud?: string;
  /** 禁止道具 */
  pr?: boolean;
  /** 禁止尸宠 */
  pe?: boolean;
  /** 等级 */
  lv?: number;
  /** 困难设定 - 饺子等道具无法使用，某些技能、武器、装备也将受到限制 */
  hb?: boolean;
  /** 倒计时（秒）- 设置为0可取消倒计时 */
  tm?: number;
  /** 伤害系数 */
  dp?: number;
  /** 关闭自身技能 */
  sc?: boolean;
  /** 武器 */
  ar?: string[];
}

// 武器API响应类型
export interface Weapon {
  id: number;
  extra: string;
  extra_obj: WeaponObject;
  owner: string;
  created: string;
  title: string;
  description: string;
}

// Boss API响应类型
export interface Boss {
  id: number;
  extra: string;
  extra_obj: BossObject;
  owner: string;
  created: string;
  title: string;
  description: string;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// 用户类型
export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  date_joined: string;
}

// 认证响应类型
export interface AuthResponse {
  token: string;
}

// API错误响应类型
export interface ApiError {
  detail: string;
}

// 表单数据类型
export interface WeaponFormData {
  title: string;
  description: string;
  weaponData: WeaponObject;
}

export interface BossFormData {
  title: string;
  description: string;
  bossData: BossObject;
}
