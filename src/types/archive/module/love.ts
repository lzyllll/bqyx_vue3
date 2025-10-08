import { Type } from 'class-transformer';

/**
 * 喜欢讨厌项实现类
 */
export class LikeHateItem {
  /** 讨厌数组 */
  @Type(() => String)
  hateArr: string[];
  /** 喜欢数组 */
  @Type(() => String)
  likeArr: string[];
}

/**
 * 好感度实现类
 */
export class Love {
  /** 全部礼物数量 */
  allGiftNum: number;
  /** 全部赠送数量 */
  allGivingNum: number;
  /** 上次获取礼物时间字符串 */
  beforeGetGiftTimeStr: string | null;
  /** 购买赠送数量 */
  buyGivingNum: number;
  /** 死亡数量 */
  dieNum: number;
  /** 时装添加时间 */
  fashionAddTime: string | null;
  /** 获取女孩礼物B */
  getGirlGiftB: boolean;
  /** 获取女孩礼物B8 */
  getGirlGiftB8: boolean;
  /** 讨厌礼物数量 */
  hateGiftNum: number;
  /** 讨厌名称 */
  hateName: string | null;
  /** 隐藏数量 */
  hideNum: number;
  /** 喜欢礼物数量 */
  likeGiftNum: number;
  /** 喜欢讨厌数组 */
  @Type(() => LikeHateItem)
  likeHateArr: LikeHateItem[];
  /** 喜欢名称 */
  likeName: string | null;
  /** 显示数量 */
  showNum: number;
  /** 谈话数组 */
  @Type(() => String)
  talkArr: string[];
  /** 今日赠送数量 */
  todayGivingNum: number;
  /** 值 */
  value: number;
}