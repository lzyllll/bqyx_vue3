import { Type } from 'class-transformer';
import { SaveObject } from '../base';

/**
 * 工艺项实现类
 */
export class CraftItem {
  /** 经验 */
  exp: number;
  /** 等级 */
  lv: number;
  /** 名称 */
  n: string;
  /** 当前 */
  now: string;
  /** P0 */
  @Type(() => SaveObject)
  p0: SaveObject<Record<string, number>>;
}

/**
 * 太空工艺实现类
 */
export class SpaceCraft {
  /** 数组 */
  @Type(() => CraftItem)
  arr: CraftItem[];
  /** 隐藏HB */
  hideHB: boolean;
  /** 最后ID */
  lastId: number;
  /** 当前 */
  now: string;
}

/**
 * 太空实现类
 */
export class Space {
  /** C */
  @Type(() => SaveObject)
  c: SaveObject<unknown>;
  /** CG数组 */
  @Type(() => Object)
  cgArr: unknown[];
  /** 工艺 */
  @Type(() => SpaceCraft)
  craft: SpaceCraft;
  /** 地图O */
  @Type(() => Object)
  mapO: Record<string, unknown>;
}