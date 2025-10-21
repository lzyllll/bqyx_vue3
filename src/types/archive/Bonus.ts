

/**
 * 属性加成相关
 * 
 */

/** 掉率相关属性 */ 
export interface DropRateBonus {
  /**硬币掉率 */
  coinMul?:number
  /**经验加成 */
  expMul?:number;
  /** 红橙武器掉率 */
  orredArmsDropPro?: number;
  /** 红橙装备掉率 */
  orredEquipDropPro?: number;
  /** 稀有武器掉率 */
  rareArmsDropPro?: number;
  /** 稀有装备掉率 */
  rareEquipDropPro?: number;
  /** 随机黑武掉率 */
  ranBlackArmsDropPro?: number;
  /** 武器碎片掉率 */
  blackArmsDropPro?: number;
  /** 装备碎片掉率 */
  blackEquipDropPro?: number;
  /** 宝石掉率 */
  gemDropPro?: number;
  /** 特殊零件掉率 */
  specialPartsDropPro?: number;
  /** 红橙基因体掉率 */
  rareGeneDropPro?: number;
  /** 尸宠图鉴掉率 */
  petBookDropPro?: number;
  /** 商券掉率 */
  taxStampDropPro?: number;
  /** 生命催化剂掉率 */
  lifeCatalystDropPro?: number;
  /** 神能石掉率 */
  godStoneDropPro?: number;
  /** 转化石掉率 */
  converStoneDropPro?: number;
  /** 血石掉率 */
  bloodStoneDropPro?: number;
  /** 副手掉率 */
  weaponDropPro?: number;
  /** 无双水晶掉落 */
  demStroneDropNum?: number;
  /** 万能球掉落 */
  demBallDropNum?: number;
  /** 幸运值 */
  lottery?: number;
  /** 优胜券获取 */
  arenaStampDropNum?: number;
  /** 载具碎片掉落 */
  vehicleCashDropNum?: number;
}


export interface moreBonus{
  /** 队友战斗力 */
  moreDpsMul?: number;
  /** 队友生命值 */
  moreLifeMul?: number;
  /** 载具防御力 */
  vehicleDefMul?: number;
  /** 载具攻击力 */
  vehicleDpsMul?: number;

}
export interface CombatBonus{
  /** 重装间隔加成 */
  reload?:number;
  /**射速加成 如 0.06 */
  attackGap?:number;
  /** 穿透 */
  damageMul?: number;
  //弹容
  capacity?:number;
  /** 弹容black 加成 */
  capacityMulBlack?: number;
  /** 弹容 加成*/
  capacityMul?: number;
  /** 携弹量 */
  chargerMulBlack?: number;
  /** 生命回复/神级 */
  lifeRateBlack?: number;
  /** 生命回复**/
  lifeRateMul?:number;
  /** 生命 */
  lifeMul?:number;
  /** 生命值/神级1 */
  lifeAll?: number;
  /** 生命值/神级2 */
  lifeAllBlack?: number;
  /**头部防御 */
  defenceMul?:number;
  /** 防弹值 */
  bulletDedut?: number;
  /** 防化值 */
  skillDedut?: number;
  /** 近战伤害减免 */
  fightDedut?: number;
  /** 移动速度加成 */
  moveMul?: number;
  /** 冷却时间缩减 */
  cdMul?: number;
  /** 闪避率 */
  dodge?: number;
}
// 与战力,伤害加成相关的
export interface DpsBonus {
  /** 全体战斗力 如：50%*/
  dpsWhole?: number;
  /** 战斗力/神级1 如：50%*/
  dpsAll?:number;
  /** 战斗力/神级2  如：50%*/
  dpsAllBlack?: number;
  /** 战斗力vip 如:50%*/
  dpsVip?:number;
  /**战斗力+ 如65536*/
  dps?:number;
  /**战斗力 如:50%*/
  dpsMul?:number;


  /**伤害+ 如65536 */
  hurt?:number;
  /**伤害 如50% */
  hurtMul?:number;
  /**伤害/神级 如50% */
  hurtAll?:number;

  /** 三倍暴击 */
  critPro3?: number;

  /**指定武器类型相关 */
  /** 生肖武器伤害 如：50%*/
  zodiacArmsHurtAdd?: number;
  /** 步枪战斗力加成 如：50%*/
  dpsMul_rifle?: number;
  /** 狙击枪战斗力加成 如：50%*/
  dpsMul_sniper?: number;
  /** 霰弹枪战斗力加成 如：50%*/
  dpsMul_shotgun?: number;
  /** 手枪战斗力加成 如：50%*/
  dpsMul_pistol?: number;
  /** 火箭筒战斗力加成 如：50%*/
  dpsMul_rocket?: number;
  /** 火焰喷射器战斗力加成 如：50%*/
  dpsMul_flamer?: number;


  /** 步枪伤害加成 如：50%*/
  hurtMul_rifle?: number;
  /** 狙击枪伤害加成 如：50%*/
  hurtMul_sniper?: number;
  /** 霰弹枪伤害加成 如：50%*/
  hurtMul_shotgun?: number;
  /** 手枪伤害加成 如：50%*/
  hurtMul_pistol?: number;
  /** 火箭筒伤害加成 如：50%*/
  hurtMul_rocket?: number;
  /** 火焰喷射器伤害加成 如：50%*/
  hurtMul_flamer?: number;
}

// 其他属性
export interface OtherBonus {
  /** 弹跳次数 */
  maxJumpNumAdd?: number;
  /** 重力系数 */
  fgNE?: number;
  /** 赠礼好感度 */
  loveAdd?: number;
  /** 好感度 */
  dayLoveAdd?: number;
  /** 每日扫荡次数 */
  sweepingNum?: number;
  
}

// 原始完整接口（可选，如果需要保持完整）
export interface RoleBonus extends DropRateBonus, CombatBonus, OtherBonus,moreBonus,DpsBonus {


}

/**
 * 巅峰属性的加成，那些技能加成没有，只有属性加成
 */
export interface PeakBonus extends Pick<RoleBonus, 
  'dpsAllBlack' |      
  'lifeAllBlack' |     
  'fightDedut' |
  'vehicleDpsMul' |
  'critPro3' |
  'bulletDedut'|
  'moveMul'|
  'cdMul'|
  'dodge'
> {
}

/**总统加成 */
export interface PostBonus extends Pick<RoleBonus,
  "lifeAll"|
  "dpsAll"|
  'lottery'|
  'hurtAll'
>{
}

/**vip加成 */
export interface VipBonus extends Pick<RoleBonus,
'dpsVip'|'expMul'|'lifeMul'|"defenceMul"
>{

}

/**头衔加成 */
export interface HeadTitleBonus extends RoleBonus{

}
/**魂卡加成 */
export interface BossCardBonus extends RoleBonus{

}
/**和荣誉等级加成 */
export interface HonorTitleBonus extends Pick<RoleBonus,
      "expMul"|
      "lifeAll"|
      "dpsMul"|
      "rareArmsDropPro"|
      "rareEquipDropPro"|
      "blackArmsDropPro"|
      "blackEquipDropPro"
>{

}