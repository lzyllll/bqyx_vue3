import { Type } from 'class-transformer';
import { SaveObject } from '../base';

/**
 * 时装实现类
 */
export class Dress {
  /** 数组 */
  @Type(() => Object)
  arr: unknown[];
  /** ID索引 */
  idIndex: number;
  /** 空间 */
  @Type(() => SaveObject)
  space: SaveObject<unknown>;
}

/**
 * 城市系统实现类
 */
export class City {
  /** 总数量 */
  allNum: number;
  /** 计数对象 */
  @Type(() => Object)
  countObj: Record<string, number>;
  /** 时装 */
  @Type(() => Dress)
  dress: Dress;
  /** 是否有礼物 */
  giftB: boolean;
  /** 数量 */
  num: number;
  /** 计划数组 */
  @Type(() => String)
  planArr: string[];
}