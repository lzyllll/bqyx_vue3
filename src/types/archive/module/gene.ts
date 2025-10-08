import { Type } from 'class-transformer';
import { BagItemBase } from '../base';

/**
 * 宠物属性实现类
 */
export class PetAttributes {
  /**战斗力加成 */
  dpsMul?: number;
  /**伤害加成 */
  hurtMul?: number;
  /**生命加成 */
  lifeMul?: number;
  /**头部防御加成 */
  headMul?: number;
  /**生命回复数值 */
  lifeRate?: number;
  /**三倍爆击加成 */
  critPro3?: number;
  /**冷却减免加成 */
  cdMul?: number;
  /**闪避率加成 */
  dodge?: number;
  /**近战减免加成 */
  fightDedut?: number;
  /**速度加成 */
  moveMul?: number;
}

/**
 * 宠物成长属性实现类
 */
export class PetGrowAttributes {
  /**战斗力加成 */
  dpsMul?: number;
  /**伤害加成 */
  hurtMul?: number;
  /**生命加成 */
  lifeMul?: number;
  /**头部防御加成 */
  headMul?: number;
  /**生命回复加成 */
  lifeRate?: number;
  /**三倍爆击加成 */
  critPro3?: number;
  /**冷却减免加成 */
  cdMul?: number;
  /**闪避率加成 */
  dodge?: number;
  /**近战减免加成 */
  fightDedut?: number;
  /**速度加成 */
  moveMul?: number;
}

/**
 * 基因物品实现类
 * 注意：根据BagItemBase实现类的定义，某些字段可能是可选的
 */
export class GeneItem extends BagItemBase {
  /** 成长对象 */
  @Type(() => PetAttributes)
  growObj: PetAttributes;
  /** 基因类型（可能为null） */
  itemsType: string | null = '' as any;
  /** 后天技能数组 */
  @Type(() => String)
  laterSkillArr: string[];
  /** 天赋技能数组 */
  @Type(() => String)
  talentSkillArr: string[];
  /** 属性对象 */
  @Type(() => PetGrowAttributes)
  obj: PetGrowAttributes;
  // 继承自 BagItemBase 的其他属性
}

/**
 * 基因背包实现类
 */
export class GeneBag {
  /** 基因数组 */
  @Type(() => GeneItem)
  arr: GeneItem[];
  /** 抓取最大数量 */
  gripMaxNum: number;
  /** 最后ID */
  lastId: number;
  /** 锁定长度 */
  lockLen: number;
  /** 锁定对象 */
  @Type(() => Object)
  lockObj: Record<string, number>;
}