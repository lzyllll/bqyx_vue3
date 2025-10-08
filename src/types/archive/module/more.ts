import { Type } from 'class-transformer';
import { ArrayContainer } from '../base';
import { ArmsItem } from './arms';
import { Base } from './baseInfo';
import { EquipItem } from './equip';
import { Love } from './love';
import { Partner } from './partner';
import { Skill } from './skill';
import { SkillBag } from './skill';

/**
 * 更多计数实现类
 */
export class MoreCount {
  /** 子弹数量 */
  bulletNum: number;
  /** 死亡数量 */
  dieNum: number;
  /** 击杀Boss数量 */
  killBossNum: number;
  /** 击杀数量 */
  killNum: number;
}

/**
 * 更多保存实现类
 */
export class MoreSave {
  /** 武器 */
  @Type(() => ArrayContainer)
  arms: ArrayContainer<ArmsItem>;
  /** 基础 */
  @Type(() => Base)
  base: Base;
  /** 计数 */
  @Type(() => MoreCount)
  count: MoreCount;
  /** 装备 */
  @Type(() => ArrayContainer)
  equip: ArrayContainer<EquipItem>;
  /** 好感度 */
  @Type(() => Love)
  love: Love;
  /** 队友 */
  @Type(() => Partner)
  partner: Partner;
  /** 技能 */
  @Type(() => Skill)
  skill: Skill;
  /** 技能背包 */
  @Type(() => SkillBag)
  skillBag: SkillBag;
}

/**
 * 更多项实现类
 */
export class MoreItem {
  /** 保存 */
  @Type(() => MoreSave)
  SAVE: MoreSave;
  /** 中文名称 */
  cnName: string;
  /** 颜色 */
  color: string;
  /** ID */
  id: string;
  /** 物品等级 */
  itemsLevel: number;
  /** 物品类型 */
  itemsType: string;
  /** 名称 */
  name: string;
  /** 是否新品 */
  newB: boolean;
  /** 位置 */
  site: number;
}

/**
 * 更多实现类，为其他队友的数据，装备什么的
 */
export class More {
  /** 数组 */
  @Type(() => Object)
  arr: unknown[];
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
 * 更多背包实现类
 */
export class MoreBag {
  /** 其他对应的数组 */
  @Type(() => MoreItem)
  arr: MoreItem[];
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