import { Type } from 'class-transformer';
import VipBonusDicts from '@/assets/data/vip/vipBonus.json'
import { type VipBonus } from '../Bonus';
/**
 * VIP实现类
 */
export class Vip {
  /** 每日对象 */
  @Type(() => Object)
  dayObj: Record<string, unknown>;
  /** 等级 */
  level: number;
  /** 对象 */
  @Type(() => Object)
  obj: Record<string, boolean>;
  /** 升级对象 */
  @Type(() => Object)
  upLevelObj: Record<string, boolean>;

  /**获取vip的加成 */
  getRoleBonus():VipBonus{
    return VipBonusDicts[this.level]
  }

  /**获取指定属性加成 */
  getBonus(name:'dpsVip'|'expMul'|'lifeMul'|"defenceMul"):number{
    return VipBonusDicts[this.level][name]
  }

}