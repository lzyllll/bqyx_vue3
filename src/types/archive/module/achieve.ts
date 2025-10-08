import { Expose, Transform, Type, plainToClass } from 'class-transformer';
import { PercentNum } from '@/utils/percent';
import { type RoleBonus } from '../Bonus';
import achievesDict from '@/assets/data/achieves/achieveClass.json'
/**
 * 单个成就项实现类
 */
export class AchieveItem {
  /** 是否领取了礼物 */
  gB: boolean;
  /** 信息描述 */
  info: string | null;
  /** 信息值 */
  infoValue: number;
  /** 名称 */

  name: string;
  /** 完成状态 */
  @Transform(({ value }) => {
    if (value === "complete") return true;
    if (value === 'no') return false;
    return false; // 保持其他值不变
  })
  state: boolean;
  /** 是否穿戴 */
  wearB: boolean;
  /** 穿戴索引 */
  wearIndex: number;

}

/**
 * 成就系统实现类
 */
export class Achieve {

  @Transform(({ value }) => {
    const result: Record<string, AchieveItem> = {};
    for (const key in value) {
      result[key] = plainToClass(AchieveItem, value[key]);
    }
    return result
  })
  obj: Record<string, AchieveItem>;
  /** 是否只显示未完成成就 */
  state: boolean;

  onlyNoCompleteB: boolean;

  /**
   * 获取已完成的成就总数
   * @returns 已完成的成就 总数
   */
  getCompletedAchievesLength(): number {
    return Object.values(this.obj)
      .filter(item => item.state)
      .length
  }
  /**获取已完成成就数，计算全体战斗力加成 */
  getCompletedAchievesBonus(): RoleBonus {
    //数量-150
    var achieveLength = Math.max(this.getCompletedAchievesLength() - 150, 0)
    // 0.04% 每个，最大为 5%
    var value = achieveLength * PercentNum(0.04)
    return {
      dpsWhole: Math.min(value, PercentNum(5))
    }
  }
  /**
   *  获取已装备的成就名
   */
  getEquipedAchieves(): string[] {

    return Object.values(this.obj)
      .filter(item => item.wearB)
      .map(item => item.name);
  }
  getEquipedAchievesRoleBonus(): RoleBonus {
    var bonus: RoleBonus = {}
    //遍历获取的成就名
    for (const achieveName of this.getEquipedAchieves()) {
      var achieveBonus = achievesDict[achieveName]?.roleBonus ?? {}
      //遍历成就名的加成属性，加成
      for (const key in achieveBonus) {
        if (bonus.hasOwnProperty(key)) {
          bonus[key] += achieveBonus[key]
        } else {
          bonus[key] = achieveBonus[key]
        }
      }
    }
    return bonus

  }
}