import { Type } from 'class-transformer';
import { SaveObject } from '../base';

/**
 * 礼物项实现类
 */
export class GiftItem {
  /** 每日B */
  dailyB: boolean;
  /** 蛋对象 */
  @Type(() => Object)
  eggObj: Record<string, unknown>;
  /** 蛋TO */
  @Type(() => Object)
  eggTO: Record<string, unknown>;
  /** 获取对象 */
  @Type(() => Object)
  getObj: Record<string, boolean>;
  /** 数量 */
  num: number;
}

/**
 * 礼物项2实现类
 */
export class GiftItem2 {
  /** 购买数量 */
  buyNum: number;
  /** 使用数量 */
  useNum: number;
}

/**
 * 每日礼物实现类
 */
export class GiftDaily {
  /** 全部 */
  all: number;
  /** 礼物获取对象 */
  @Type(() => Object)
  giftGetObj: Record<string, boolean>;
  /** 签到数组 */
  @Type(() => String)
  signArr: string[];
  /** VIP礼物获取对象 */
  @Type(() => Object)
  vipGiftGetObj: Record<string, boolean>;
}

/**
 * 礼物保证实现类
 */
export class GiftEnsure {
  /** 全部触发 */
  allTrigger: number;
  /** 掉落数量 */
  dropNum: number;
  /** 触发 */
  trigger: number;
}

/**
 * 礼物项3实现类
 */
export class GiftItem3 {
  /** 每日B */
  dailyB: boolean;
  /** 蛋对象 */
  @Type(() => Object)
  eggObj: Record<string, unknown>;
  /** EN */
  en: number;
  /** 获取对象 */
  @Type(() => Object)
  getObj: Record<string, unknown>;
  /** GN */
  gn: number;
  /** 数量 */
  num: number;
}

/**
 * 礼物项4实现类
 */
export class GiftItem4 {
  /** 每日B */
  dailyB: boolean;
  /** 获取对象 */
  @Type(() => Object)
  getObj: Record<string, boolean>;
  /** 数量 */
  num: number;
}

/**
 * 礼物项5实现类
 */
export class GiftItem5 {
  /** 蛋糕数量 */
  cakeNum: number;
  /** 循环 */
  loop: number;
  /** 使用数量 */
  useNum: number;
}

/**
 * 礼物实现类
 */
export class Gift {
  /** YXD */
  YXD: number;
  /** 25年春节签到 */
  @Type(() => GiftItem)
  annSign25: GiftItem;
  /** 周年庆游戏 */
  @Type(() => GiftItem2)
  anniverGm: GiftItem2;
  /** CAO */
  @Type(() => SaveObject)
  caO: SaveObject<unknown>;
  /** 2020年春节B */
  chunJie2020B: boolean;
  /** CW对象 */
  @Type(() => SaveObject)
  cwObj: SaveObject<unknown>;
  /** 每日 */
  @Type(() => GiftDaily)
  daily: GiftDaily;
  /** 暗金补充B */
  darkgoldSuppleB: boolean;
  /** 龙族宝箱保证 */
  @Type(() => GiftEnsure)
  dragonChestEnsure: GiftEnsure;
  /** 2019年独家7B */
  dujia2019_7B: boolean;
  /** 快车 */
  fastCar: boolean;
  /** 礼物获取数量对象 */
  @Type(() => Object)
  giftGetNumObj: Record<string, number>;
  /** 24年国庆 */
  @Type(() => GiftItem3)
  guoQing24: GiftItem3;
  /** 是否周末B */
  isWeekendB: boolean;
  /** 2020年开学1B */
  kaixue2020_1B: boolean;
  /** 等级礼物对象 */
  @Type(() => Object)
  levelGiftObj: Record<string, boolean>;
  /** 百万包最好B */
  millionpackBestB: boolean;
  /** 百万包每日B */
  millionpackDayB: boolean;
  /** 25年夏季 */
  @Type(() => GiftItem4)
  summer25: GiftItem4;
  /** 宝藏数量 */
  treasureNum: number;
  /** 野人钥匙 */
  wilderKey: number;
  /** WS23 */
  @Type(() => Object)
  ws23: unknown[];
  /** WS数量23 */
  wsNum23: number;
  /** 24年中秋 */
  @Type(() => GiftItem5)
  zhongQiu24: GiftItem5;
}