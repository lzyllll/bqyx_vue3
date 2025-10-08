import { Type } from 'class-transformer';
import { SaveObject } from '../base';

/**
 * 掉落实现类
 */
export class Drop {
  /** 所有武器黑芯片数量 */
  allArmsBlackChipNum: number;
  /** 所有黑芯片数量 */
  allBlackChipNum: number;
  /** 所有90级武器黑装数量 */
  allNintyArmsBlackNum: number;
  /** 所有90级装备黑装数量 */
  allNintyEquipBlackNum: number;
  /** 21年植树节 */
  arbor21: number;
  /** 21年植树节全部 */
  arbor21All: number;
  /** 武器黑芯片数量 */
  armsBlackChipNum: number;
  /** 黑芯片数量 */
  blackChipNum: number;
  /** 血石数量 */
  bloodStoneNum: number;
  /** 圣诞枪 */
  chrisGun: number;
  /** 每日全部 */
  @Type(() => SaveObject)
  dayAll: SaveObject<unknown>;
  /** 每日对象 */
  @Type(() => SaveObject)
  dayObj: SaveObject<unknown>;
  /** 装置数量 */
  deviceNum: number;
  /** 23年冬至 */
  dongzhi23: number;
  /** 龙族宝箱数量 */
  dragonChestNum: number;
  /** 梯队1 */
  echelon1: number;
  /** 装备宝石 */
  equipGem: number;
  /** 铁拳书 */
  ironChiefBook: number;
  /** 钥匙数量 */
  keyNum: number;
  /** 疯狂之心 */
  madheart: number;
  /** 魔法宝箱数量 */
  magicChestNum: number;
  /** 疯狂之心A */
  mhA: number;
  /** 90级武器黑装数量 */
  nintyArmsBlackNum: number;
  /** 90级装备黑装数量 */
  nintyEquipBlackNum: number;
  /** 普通宝箱数量 */
  normalChestNum: number;
  /** 零件数量 */
  partsNum: number;
  /** 20年万圣节 */
  pumpkin20: number;
  /** 20年万圣节全部 */
  pumpkin20All: number;
  /** 红包 */
  redBag: number;
  /** 红包全部 */
  redBagAll: number;
  /** 精炼黑装数量 */
  refiningBlackNum: number;
  /** 老虎宝箱 */
  tigerChest: number;
  /** 时间C更多 */
  timeCMore: number;
  /** 武器数量 */
  weaponNum: number;
  /** 每周对象 */
  @Type(() => SaveObject)
  weekObj: SaveObject<unknown>;
  /** 2021年五一芯片 */
  wuyiChip2021: number;
}