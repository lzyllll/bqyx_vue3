import { Type } from 'class-transformer';
import { SaveObject } from '../base';

/**
 * 食物实现类
 */
export class Food {
  /** 书籍对象 */
  @Type(() => SaveObject)
  bookObj: SaveObject<Record<string, number>>;
  /** 掉落全部 */
  dropAll: number;
  /** 掉落数量 */
  dropNum: number;
  /** 全部食用 */
  eatAll: number;
  /** 食用名称 */
  eatName: string | null;
  /** 食用名称数组 */
  @Type(() => Object)
  eatNameArr: unknown[];
  /** 食用数量 */
  eatNum: number;
  /** 食用时间 */
  eatTime: number;
  /** 利润 */
  profi: number;
  /** 全部利润 */
  profiAll: number;
  /** 原材料对象 */
  @Type(() => SaveObject)
  rawObj: SaveObject<Record<string, number>>;
}