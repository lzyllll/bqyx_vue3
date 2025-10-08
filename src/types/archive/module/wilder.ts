import { Type } from 'class-transformer';

/**
 * 野人项实现类
 */
export class WilderItem {
  /** 全部 */
  all: number;
  /** 购买数量 */
  buyNum: number;
  /** D */
  d: number;
  /** 困难 */
  diff: string;
  /** 掉落数量 */
  dropNum: number;
  /** 兑换数量 */
  exchangeNum: number;
  /** 已兑换数量 */
  haveExchangeNum: number;
  /** 是否周末B */
  isWeekendB: boolean;
  /** 名称 */
  name: string;
  /** 无掉落值对象 */
  @Type(() => Object)
  noDropValueObj: Record<string, number>;
  /** 数量 */
  num: number;
  /** 扫荡数量 */
  sweepingNum: number;
  /** 时间状态 */
  timeState: number;
  /** 每周无使用数量 */
  weekNoUseNum: number;
  /** 胜利数量 */
  winNum: number;
}

/**
 * 野人实现类
 */
export class Wilder {
  /** 钥匙数量 */
  keyNum: number;
  /** 掠夺B */
  lootB: boolean;
  /** 对象 */
  @Type(() => WilderItem)
  obj: Record<string, WilderItem>;
  /** 今日点击B */
  todayClickB: boolean;
}