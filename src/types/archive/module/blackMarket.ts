import { Type } from 'class-transformer';
import { ArrayContainer } from '../base';
import { ArmsItem } from './arms';
import { EquipContainer } from './equip';

/**
 * 黑市实现类
 */
export class BlackMarket {
  /** 是否增加 */
  addB: boolean;
  /** 武器 */
  @Type(() => ArrayContainer)
  arms: ArrayContainer<ArmsItem>;
  /** 购买数量 */
  buyNum: number;
  /** 装备 */
  @Type(() => EquipContainer)
  equip: EquipContainer;
  /** 血石数量 */
  fleshNum: number;
  /** 商品名称数组 */
  @Type(() => Object)
  goodsNameArr: unknown[];
}