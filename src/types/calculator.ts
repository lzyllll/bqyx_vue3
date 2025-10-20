/**
 * 计算器相关的类型定义
 */

// 武器类型
export type WeaponType = 
  | 'rifle' | 'pistol' | 'shotgun' | 'sniper' | 'rocket' 
  | 'crossbow' | 'flamer' | 'howitzer' | 'wavegun' | 'laser' 
  | 'lightning' | 'weather' | 'cutter' | 'energy'

// 武器颜色
export type WeaponColor = 
  | 'white' | 'green' | 'blue' | 'purple' | 'orange' 
  | 'red' | 'black' | 'darkgold' | 'purgold' | 'yagold'

// 计算输入参数
export interface CalculatorInputs {
  // 武器基础属性
  arms_lv: number                    // 武器等级
  arms_name: string                  // 武器名称
  arms_type: WeaponType              // 武器类型
  strengthen_lv: number              // 强化等级
  evo_lv: number                     // 进化等级
  
  // 零件等级
  parts_dps_lv: number              // 伤害零件等级
  parts_capacity_lv: number         // 弹容零件等级
  parts_attack_gap_lv: number       // 攻速零件等级
  parts_reload_lv: number           // 装弹零件等级
  parts_precision_lv: number        // 精准零件等级
  parts_shoot_range_lv: number      // 射程零件等级
  
  // 基础面板属性
  capacity0: number                  // 基础弹容
  attack_gap0: number               // 基础攻击间隔
  reload_gap0: number               // 基础装弹时间
  shake_angle0: number              // 基础抖动角度
  shoot_angle0: number              // 基础射击角度
  shoot_range0: number              // 基础射程
  bullet_num: number                // 子弹数量
  
  // 技能相关
  god_skill_num: number             // 神技数量
  base_special_num: number          // 基础特殊技能数
  skill_num: number                 // 技能数量
  element: number                   // 元素伤害
  
  // 装备加成
  parts_dps_mul: number             // 零件伤害倍数
  ea0_dps_mul: number               // 装备伤害倍数0
  ea_dps_mul0: number               // 装备伤害倍数1
  ea_dps0: number                   // 装备伤害0
  ea0_dps: number                   // 装备伤害1
  pet_dps: number                   // 宠物伤害
  
  ea0_hurt_mul: number              // 装备伤害倍数0
  ea_hurt_mul0: number              // 装备伤害倍数1
  ea0_hurt: number                  // 装备伤害0
  ea_hurt0: number                  // 装备伤害1
  
  ea0_capacity_mul: number          // 装备弹容倍数0
  ea_capacity_mul0: number          // 装备弹容倍数1
  ea0_capacity: number              // 装备弹容0
  ea_capacity0: number              // 装备弹容1
  
  ea0_attack_gap: number            // 装备攻速0
  ea0_reload: number                // 装备装弹0
  ea_reload0: number                // 装备装弹1
  
  // 全局倍数
  get_dps_mul: number               // 获得伤害倍数
  dps_mul: number                   // 伤害倍数
  get_hurt_add: number              // 获得伤害加成
  get_capacity_mul: number          // 获得弹容倍数
  get_attack_gap_add: number        // 获得攻速加成
  get_reload_mul: number            // 获得装弹倍数
  get_angle_add_mul: number         // 获得角度加成倍数
  
  vip_dps_mul: number               // VIP伤害倍数
  whole_dps_mul: number             // 整体伤害倍数
  more_dps_mul: number              // 更多伤害倍数
  
  dps_all: number                   // 全体伤害
  hurt_all: number                  // 全体伤害
  red_hurt_mul: number              // 红武伤害倍数
  zodiac_hurt_add: number           // 生肖伤害加成
  
  ui_dps_mul: number                // UI伤害倍数
  show_dps_mul: number              // 显示伤害倍数
}

// 计算结果
export interface CalculatorResults {
  // 基础计算结果
  dps0: number                      // 基础伤害
  strengthen_hurt_mul: number       // 强化伤害倍数
  evo_hurt_mul: number             // 进化伤害倍数
  arms_color: WeaponColor          // 武器颜色
  type_ui_dps_mul: number          // 类型UI伤害倍数
  
  // 零件属性
  parts_dps: number                // 零件伤害
  parts_capacity_mul: number       // 零件弹容倍数
  parts_attack_gap_mul: number     // 零件攻速倍数
  parts_reload_mul: number         // 零件装弹倍数
  parts_shake_angle: number        // 零件抖动角度
  parts_shoot_angle: number        // 零件射击角度
  parts_shoot_range: number        // 零件射程
  
  // 技能与元素
  skill_special_mul: number        // 技能特殊倍数
  ele_add_dps: number             // 元素附加伤害
  
  // 核心计算结果
  hurt_ratio0: number             // 基础伤害比例
  dps1: number                    // 计算伤害1
  hurt_add1: number               // 附加伤害1
  hurt1: number                   // 伤害1
  hurt_ratio: number              // 伤害比例
  
  // 面板属性
  capacity_real: number           // 实际弹容
  capacity: number                // 弹容（向上取整）
  attack_gap: number              // 攻击间隔
  attack_speed: number            // 攻击速度
  reload_gap: number              // 装弹时间
  precision_real: number         // 实际精准度
  precision: number               // 精准度
  precision0: number              // 基础精准度
  shoot_range: number             // 射程
  
  // 最终结果
  final_dps: number               // 最终伤害
}

// 角色总战力计算参数
export interface CharacterPowerInputs {
  individualPowers: number[]       // 各武器战力
  tripleCrit: number              // 三倍暴击率
  weaponNum: number               // 武器数量
  uniqueWeaponTypeNum: number     // 独特武器类型数量
}

