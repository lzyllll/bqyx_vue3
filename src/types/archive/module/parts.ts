import { Transform, Type } from 'class-transformer';
import { BagItemBase } from '../base';

/**
 * 零件物品实现类
 */
export class PartsItem extends BagItemBase {
  // 覆盖父类的 color 字段，应用自定义颜色逻辑
  @Transform(({ obj }) => {
    const name:string = obj.name; 
    // 注意：这里 name 没有被父类转换
    //不确定这转换顺序是什么样的
    const level = obj.itemsLevel;

    // 如果名称不是 'loaderparts',统一返回 darkgold
    if (!name.startsWith('loaderParts')) {
      return 'darkgold';
    }

    if (level <= 54) {
      return 'white';
    } else if (level === 57) {
      return 'green';
    } else if (level === 60) {
      return 'blue';
    } else if (level === 63) {
      return 'purple';
    } else if (level === 66) {
      return 'orange';
    } else if (level >= 69 && level <= 84) {
      return 'red';
    } else if (level >= 87 && level <= 90) {
      return 'black';
    } else if (level === 93) {
      return 'darkgold';
    } else {
      // 其他未定义等级的情况，也可以默认返回 darkgold 或其他
      return 'darkgold';
    }
  }, { toClassOnly: true })
  color: string = undefined as any; // 提供初始化器，消除 TS2612 错误,覆盖
}

/**
 * 零件背包实现类
 */
export class PartsBag {
  /** 数组 */
  @Type(() => PartsItem)
  arr: PartsItem[];
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