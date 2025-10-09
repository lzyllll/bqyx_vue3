import { Type } from 'class-transformer';
import { BagItemBase } from '../base';

/**
 * 物品实现类
 * 注意：根据BagItemBase实现类,但不进行class-transformer转换
 * 因为bagItemBase会分隔 _
 * 为了更好显示 oscgchip_pant.png 适应这样的图片
 */

export class ThingsItem{
  // 继承自 BagItemBase 的所有属性
  id: string;
  /** 物品名称 */
  // 将 loaderparts_1  转为 loaderparts
  name: string;
  /** 物品中文名称 */
  cnName: string;
  /** 物品等级 */
  itemsLevel: number;
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
  /** 附加等级 */
  addLevel?: number;
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
}

/**
 * 物品背包实现类
 */
export class ThingsBag {
  /** 物品数组 */
  @Type(() => ThingsItem)
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