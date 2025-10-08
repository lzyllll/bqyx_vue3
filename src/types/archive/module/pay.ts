import { Type } from 'class-transformer';

/**
 * 充值实现类
 */
export class Pay {
  /** 购买的物品记录 */
  @Type(() => Object)
  obj: Record<string, number>;
  /** 版本 */
  ver: number;
}