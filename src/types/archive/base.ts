import 'reflect-metadata';
import { Transform, Type } from 'class-transformer';

/**
 * 时间记录对象实现类，用于记录各种时间相关的数据
 */
export class TimeRecord {
  timeStr: string | null;
  todayAddB: boolean;
  value: number;
}

/**
 * 通用保存对象容器实现类，用于包装保存的数据对象
 * @template T 保存的对象类型
 */
export class SaveObject<T> {
  @Type(() => Object)
  saveObj: T;
}

/**
 * 数组容器实现类，用于包装数组数据及其相关属性
 * @template T 数组元素类型
 */
export class ArrayContainer<T> {
  @Type(() => Object)
  arr: T[];
  gripMaxNum: number;
  lastId: number;
  lockLen: number;
  @Type(() => Object)
  lockObj: Record<string, number>;
}

/**
 * 背包物品基础实现类，定义了所有背包物品的通用属性
 * 注意：某些字段可能是可选的，具体取决于物品类型
 */
export class BagItemBase {
  /** 物品ID */
  id: string;
  /** 物品名称 */
  // 将 loaderparts_1  转为 loaderparts
  @Transform(({ value,obj }) => {
    if (typeof value === 'string' && value.includes('_') ) {
      // 如果有下划线，取下划线前的部分
      return value.split('_')[0];
    }
    return value;
  })
  name: string;
  /** 物品中文名称 */
  cnName: string;
  /** 物品等级 */
  @Transform(({ value,obj }) => {
    return (value??0) + (obj.addLevel??0);
  })
  /** 物品等级 */
  itemsLevel: number;
  /** 物品强化了的等级 */
  addLevel: number;
  /** 物品类型 */
  itemsType: string | null;
  /** 物品颜色/品质 */
  color: string;
  /** 是否为新物品 */
  newB: boolean;
  /** 物品所在位置/槽位 */
  site: number;
  /** 获取时间 */
  getTime: string;
  /** 服务器时间 */
  severTime: string;
  /** 是否锁定 */
  lockB: boolean;
  /** 是否为商店购买 */
  shopB: boolean;
  /** 物品数量（对于可堆叠物品） */
  nowNum?: number;
  /** 进化等级 */
  evoLv?: number;
  /** 强化等级 */
  strengthenLv?: number;
  /** 强化次数 */
  strengthenNum?: number;
  /** 是否可升级 */
  upgradeB?: boolean;
  /** 自动使用 */
  autoUseB?: boolean;
  /**位置，用来判断类型 */
}


