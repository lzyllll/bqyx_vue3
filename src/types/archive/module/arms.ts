import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { BagItemBase } from '../base';
import { PartsItem } from './parts';

/**
 * 弹跳数据实现类
 */
export class BounceData {
  /** 身体 */
  body: number;
  /** 地板 */
  floor: number;
  /** 是否胶水地板 */
  glueFloorB: boolean;
  /** 伤害数量增加 */
  hurtNumAdd: number;
  /** 是否初始生命 */
  liveInitB: boolean;
  /** 是否不死 */
  noDieB: boolean;
  /** 无命中时间 */
  noHitTime: number;
  /** 摇摆字符串 */
  shakeString: string | null;
  /** 速度倍数 */
  vMul: number;
}

/**
 * 暴击数据实现类
 */
export class CritData {
  /** 倍数 */
  mul: number;
  /** 概率 */
  pro: number;
}

/**
 * 跟随数据实现类
 */
export class FollowData {
  /** 延迟 */
  delay: number;
  /** 命中是否为目标 */
  hitIsTargetB: boolean;
  /** 最大时间 */
  maxTime: number;
  /** 是否无LM */
  noLM: boolean;
  /** 值 */
  value: number;
}

/**
 * 零件保存实现类
 */
export class PartsSave {
  /** 零件数组 */
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
  lockObj: Record<string, unknown>;
}

/**
 * 武器项实现类
 * 注意：根据BagItemBase实现类的定义，某些字段可能是可选的
 */
export class ArmsItem extends BagItemBase {
  /** 武器图片标签 */
  armsImgLabel: string;
  /** 攻击间隔 */
  attackGap: number;
  /** 未知 */
  bh: number;
  /** 弹跳数据 */
  @Type(() => BounceData)
  bounceD: BounceData;
  /** 子弹数量 */
  bulletNum: number;
  /** 子弹摇摆宽度 */
  bulletShakeWidth: number;
  /** 子弹宽度 */
  bulletWidth: number;
  /** 容量 */
  capacity: number;
  /** 暴击数据 */
  @Type(() => CritData)
  critD: CritData;
  /** 元素类型 */
  ele: string | null;
  /** 元素等级 */
  eleLv: number;
  /** 是否首选 */
  firstChoiceB: boolean;
  /** 跟随数据 */
  @Type(() => FollowData)
  followD: FollowData;
  /** 神器技能数组 */
  @Type(() => String)
  godSkillArr: string[];
  /** 伤害比率 */
  hurtRatio: number;
  /** 未知数组 */
  @Type(() => Object)
  l: unknown[];
  /** 零件保存 */
  @Type(() => PartsSave)
  partsSave: PartsSave | null;
  /** 穿透间隔 */
  penetrationGap: number;
  /** 穿透数量 */
  penetrationNum: number;
  /** 重新装弹间隔 */
  reloadGap: number;
  /** 未知 */
  s: unknown | null;
  /** 摇摆角度 */
  shakeAngle: number;
  /** 射击角度 */
  shootAngle: number;
  /** 射击音效URL */
  shootSoundUrl: string;
  // 继承自 BagItemBase 的其他属性
}

export class ArmsItems {
  first: ArmsItem;
  second: ArmsItem;
  third: ArmsItem;
  fourth: ArmsItem;
  fifth: ArmsItem;
  sixth: ArmsItem;
}

// 自动生成 posDict  {1:"first",2:'second".....}
const armsItemsInstance = new ArmsItems();
const posDict: Record<number, string> = {};
Object.keys(armsItemsInstance).forEach((key, index) => {
  posDict[index + 1] = key;
});

/**
 * 武器实现类
 */
export class Arms {
  /** 武器数组 */
  @Type(() => ArmsItem)
  @Transform(({ value }) => {
    var result = new ArmsItems()
    for (let i = 0; i < value.length; i++) {
      var item = plainToInstance(ArmsItem, value[i])
      result[posDict[item.site]] = item
    }
    console.log(result)
    return result
  })
  @Expose({ name: 'arr' })
  items: ArmsItem;
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

/**
 * 武器背包实现类
 */
export class ArmsBag {
  /** 武器数组 */
  @Type(() => ArmsItem)
  arr: ArmsItem[];
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

/**
 * 武器仓库实现类
 */
export class ArmsHouse {
  /** 武器数组 */
  @Type(() => ArmsItem)
  arr: ArmsItem[];
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

/**
 * 武器塔防实现类
 */
export class ArmsTor {
  /** 数组 */
  @Type(() => Object)
  arr: unknown[];
  /** 是否隐藏血条 */
  hideHB: boolean;
  /** 最后ID */
  lastId: number;
  /** 模块ID */
  mId: string | null;
}