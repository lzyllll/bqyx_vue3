import { Type } from 'class-transformer';
import { type PostBonus } from '../Bonus';
import PostBonusDict from '@/assets/data/post/PostBonus.json'
/**
 * 职位实现类
 */
export class Post {
  /** 全部卡片记录数组 */
  @Type(() => Object)
  allCardRecordArr: unknown[];
  /** 贿赂 */
  bribe: number;
  /** 卡片记录数组 */
  @Type(() => Object)
  cardRecordArr: unknown[];
  /** 是否掉落B */
  dropB: boolean;
  /** 经验日 */
  expDay: number;
  /** 经验时间 */
  expTime: string | null;
  /** 额外日数量 */
  extraDayNum: number;
  /** 首次时间 */
  firstTime: string | null;
  /** 礼物时间 */
  giftTime: string | null;
  /** 普通礼物增加 */
  normalGiftAdd: number;
  /** 普通礼物贿赂 */
  normalGiftBribe: number;
  /** 当前职位 */
  nowPost: string | null;
  /** 职位经验 */
  postExp: number;
  /** 职位等级 */
  postLv: number;
  /** 超级礼物增加 */
  superGiftAdd: number;
  /** 超级礼物贿赂 */
  superGiftBribe: number;
  /** 提示字符串 */
  tipStr: string | null;
  /** 总礼物经验 */
  totalGiftExp: number;


  /**
   *  获取总统对角色的加成
   */
  getRoleBonus():PostBonus{
    /**todo 应该对职位进行判断 然后 添增礼好感，抽奖次数，每日抽奖的相关属性加成 */
    //先对当前职位判断一下，是否职位过期
    if(this.nowPost){
      return (PostBonusDict as PostBonus[])[this.postLv]
    }
    return PostBonusDict[0]
    
  }
}