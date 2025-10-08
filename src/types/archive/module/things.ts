import { BagItemBase } from '../base';

/**
 * 物品实现类
 * 注意：根据BagItemBase实现类的定义，某些字段可能是可选的
 */
export class ThingsItem extends BagItemBase {
  // 继承自 BagItemBase 的所有属性
}

/**
 * 物品背包实现类
 */
export class ThingsBag {
  /** 物品数组 */
  arr: ThingsItem[];
  /** 抓取最大数量 */
  gripMaxNum: number;
  /** 最后ID */
  lastId: number;
  /** 锁定长度 */
  lockLen: number;
  /** 锁定对象 */
  lockObj: Record<string, number>;
}