import { Type } from 'class-transformer';
import { type BossCardBonus} from '../Bonus';

/**
 * Boss卡片项实现类
 */
export class BossCardItem {
  /** 伤害系数 */
  dp: number;
  /** 进化等级 */
  ev: number;
  /** ID */
  id: string;
  /** 生命系数 */
  li: number;
  /** 未知 */
  lk: number;
  /** 名称 */
  n: string;
  /** 属性加成字典 */
  @Type(() => Object)
  o: Record<string, number>;
  /** 星级 */
  s: number;
  /** 技能数组 如44_1,44_2，具体看EditBossSkill.json */
  @Type(() => String)
  sr: string[];
}

/**
 * Boss卡片实现类
 */
export class BossCard {
  /** 数组 */
  @Type(() => BossCardItem)
  arr: BossCardItem[];
  /** 是否自动下降 */
  autoDown: boolean;
  /** 背包 */
  bag: number;
  /** 未知 */
  demV: number;
  /** 未知数组 */
  @Type(() => Object)
  emPk: unknown[];
  /** 进化6 */
  evo6: number;
  /** 进化7 */
  evo7: number;
  /** 进化8 */
  evo8: number;
  /** 未知ID */
  fid: string | null;
  /** 未知 */
  g6: number;
  /** 未知 */
  g7: number;
  /** 礼物ID数组 */
  @Type(() => Object)
  giftIdA: unknown[];
  /** 高级抽卡次数 */
  hNum: number;
  /** 是否隐藏血条 */
  hideHB: boolean;
  /** 最后ID */
  lastId: number;
  /** 普通抽卡次数 */
  num: number;
  /** 未知 */
  on: number;
  /** 获取PK石 */
  pkStone: number;
  /** PK胜利 */
  pkWin: number;
  /** PK胜利获取的星级 */
  pkWinStar: number;
  /** 未知 */
  rn: number;
  /** 7星抽卡次数 */
  s7N: number;
  /** 星级 */
  starF: number;
  /** 总数 */
  sumN: number;
  /** 未知 */
  t: number;
  /** 未知 */
  v: number;
  /** 未知数组 */
  @Type(() => Object)
  wePk: unknown[];
  
  /**
   * 获取角色加成，遍历所有魂卡，获取每个属性的最大加成
   */
  getRoleBonus():BossCardBonus {
    var bonus: BossCardBonus = {}
    //遍历所有魂卡
    for (const card of this.arr) {
      //遍历魂卡的每个属性
      for (const key in card.o) {
        //如果bonus已存在，那么就max比较，否则直接赋值
        if (bonus.hasOwnProperty(key)) { // 确保是对象自身的属性，不是原型链上的
          bonus[key] = Math.max(card.o[key],bonus[key])
        }else{
          bonus[key] = card.o[key]
        }
      }
    }
    return bonus

  }



}