import { Type } from 'class-transformer';

/**
 * 活跃度奖励项实现类
 */
export class ActiveItem {
  /** 天数 */
  day: number;
  /** 是否今日增加 */
  dayAddB: boolean;
  /** 是否有礼物 */
  giftB: boolean;
  /** 礼物数量 */
  giftNum: number;
}

/**
 * 活跃度系统实现类
 */
export class Active {
  /** 活跃度奖励项 */
  @Type(() => ActiveItem)
  acc25_6: ActiveItem;
  /** 拥有的礼物对象 */
  @Type(() => Object)
  haveGiftObj: Record<string, unknown>;
}