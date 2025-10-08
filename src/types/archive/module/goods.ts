import { Type } from 'class-transformer';

/**
 * 商品实现类
 */
export class Goods {
  /** 购买数量对象 */
  @Type(() => Object)
  buyNumObj: Record<string, string>;
  /** 2025年7月偏移 */
  offset2025_7: number;
  /** 今日购买数量对象 */
  @Type(() => Object)
  todayBuyNumObj: Record<string, number>;
}