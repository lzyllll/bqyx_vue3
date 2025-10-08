import { Type } from 'class-transformer';

/**
 * 技能项实现类
 * 注意：某些字段可能是可选的或可以为null，例如cnName和name可能为null
 */
export class SkillItem {
  /** 附加等级 */
  addLevel: number;
  /** 基础标签 */
  baseLabel: string;
  /** 中文名称（可能为null） */
  cnName: string | null;
  /** 颜色 */
  color: string;
  /** 每日熟练度 */
  dayProfi: number;
  /** 是否有效果 */
  effB: boolean;
  /** ID */
  id: string;
  /** 物品等级 */
  itemsLevel: number;
  /** 物品类型 */
  itemsType: string;
  /** 是否锁定 */
  lockB: boolean;
  /** 等级 */
  lv: number;
  /** 名称（可能为null） */
  name: string | null;
  /** 是否新品 */
  newB: boolean;
  /** 熟练度 */
  profi: number;
  /** 位置 */
  site: number;
  /** 学习身体等级 */
  studyBodyLv: number;
}

/**
 * 技能实现类
 */
export class Skill {
  /** 技能数组 */
  @Type(() => SkillItem)
  arr: SkillItem[];
  /** 删除名称数组 */
  @Type(() => Object)
  delNameArr: unknown[];
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

/**
 * 技能背包实现类
 */
export class SkillBag {
  /** 技能数组 */
  @Type(() => SkillItem)
  arr: SkillItem[];
  /** 删除名称数组 */
  @Type(() => Object)
  delNameArr: unknown[];
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