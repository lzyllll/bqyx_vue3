import { Expose, plainToClass, Transform, Type } from 'class-transformer';
import { BagItemBase } from '../base';

import CarsDict from '@/assets/data/vehicle/cars.json'
import StrengthenDict from '@/assets/data/equip/itemsStrengthenClass.json'
import evoDict from '@/assets/data/equip/evoAdd.json'
import { getOrZero } from '@/utils/safeGet';
import { BonusMerge } from '@/utils/bonusAdd';
import { isDarkgoldOrHigher } from '@/utils/colorJudge';
import { type RoleBonus } from '../Bonus';


/**
 * 装备部位类型枚举
 */
export enum EquipPartType {
  HEAD = 'head',
  COAT = 'coat',
  PANTS = 'pants',
  BELT = 'belt',
  FASHION = 'fashion',
  VEHICLE = 'vehicle',
  WEAPON = 'weapon',
  DEVICE = 'device',
  SHIELD = 'shield',
  JEWELRY = 'jewelry'
}


/**
 * 装备物品实现类
 * 注意：根据BagItemBase实现类的定义，某些字段可能是可选的
 */
export class EquipItem extends BagItemBase {
  /** 装备部位类型 */
  partType: string;
  /** 图片名称 */
  imgName: string;
  /** 属性对象 */
  @Type(() => Object)
  obj: Record<string, number>;
  /** 技能数组 */
  @Type(() => String)
  skillArr: string[];
  /** 英雄技能加成对象 */
  @Type(() => Object)
  heroSkillAddObj: Record<string, number>;
  /** 强化最高等级 */
  sMaxLv: number;
  /** 属性编号 */
  proNum: number;
  /** 入库时间 */
  inHouseTime: string | null;
  /**武器位置，用于判断类型 */

  /**
   * 根据强化等级，获取对应加成
   */
  private getStrengthenBonus(): Object {
    if (!this.strengthenLv) {
      return {}
    }
    var strengthenLevel = getOrZero(this.strengthenLv)
    const bonus: RoleBonus = {};
    const addValue: number = StrengthenDict.addMul[strengthenLevel]
    if (this.partType === EquipPartType.COAT) {
      bonus.lifeMul = addValue;
    } else if (this.partType === EquipPartType.PANTS) {
      bonus.dpsMul = addValue;
    } else if (this.partType === EquipPartType.HEAD) {
      bonus.lifeRateMul = addValue;
      bonus.skillDedut = StrengthenDict.skillDedutAddMul[strengthenLevel];
    } else if (this.partType === EquipPartType.BELT) {
      bonus.bulletDedut = Number((strengthenLevel * 0.01).toFixed(2));
    }
    return bonus as RoleBonus;
  }
  /**通过强化等级获取 */
  private getHurtMul() {
    const maxIndex = evoDict.hurtMulArr.length - 1;
    const safeIndex = Math.min(this.evoLv, maxIndex); // 安全获取，最大的，不会越界
    return evoDict.hurtMulArr[safeIndex];
  }
  /**通过强化等级获取 */
  private getHurtAdd() {
    const maxIndex = evoDict.hurtAddArr.length - 1;
    const safeIndex = Math.min(this.evoLv, maxIndex); // 安全获取，最大的，不会越界
    return evoDict.hurtAddArr[safeIndex];
  }
  /**
   * 进化等级对应的加成
   */
  private getEvoLevelBonus(obj: Object): RoleBonus {
    //不改变this.obj
    const copyObj = Object.assign({}, obj);
    var isDarkGold = isDarkgoldOrHigher(this.color)
    if (!this.evoLv) {
      return copyObj
    }
    // 如果有 dps神级,一般为裤子，头盔，衣服，腰带
    if (copyObj.hasOwnProperty('dpsAllBlack')) {
      if (isDarkGold) {

        copyObj['dpsAllBlack'] += this.getHurtAdd()
      } else {
        copyObj['dpsAllBlack'] *= this.getHurtMul()
      }
    }
    return copyObj

  }
  //获取属性加成
  getRoleBonus(): RoleBonus {
    // 如果为vehicle类型,属性需要从字典中获取
    if (this.partType === EquipPartType.VEHICLE) {
      return CarsDict[this.name]['roleBonus'] as RoleBonus
    }
    // todo 将一些固定的武器，属性从字典中获取
    // 因为作者可能会因为存档大小，而精减，之前出现过删减其他属性
    //原始的加成
    var bonus: RoleBonus = Object.assign({}, this.obj)
    //强化的加成
    bonus = BonusMerge(this.getStrengthenBonus(), bonus)
    // 进化等级的加成,这里需要原属性，因为有可能乘法
    bonus = this.getEvoLevelBonus(bonus)
    return bonus as RoleBonus
  }
}
export class EquipItems {
  head?: EquipItem
  coat?: EquipItem
  pants?: EquipItem
  belt?: EquipItem
  fashion?: EquipItem
  vehicle?: EquipItem
  /**副手 */
  weapon?: EquipItem
  device?: EquipItem
  jewelry?: EquipItem

}
/**
 * 装备实现类
 */
export class Equip {
  /** 装备字典对象 */
  @Expose({ name: 'arr' })
  @Transform(({ value }) => {
    var result = new EquipItems()
    for (let i = 0; i < value.length; i++) {
      var item = plainToClass(EquipItem, value[i])
      result[item.partType] = item
    }
    return result
  })
  items: EquipItems;
  /** 抓取最大数量 */
  gripMaxNum: number;
  /** 最后ID */
  lastId: number;
  /** 锁定长度 */
  lockLen: number;
  /** 锁定对象 */
  @Type(() => Object)
  lockObj: Record<string, number>;
  /** 是否显示时装 */
  showFashionB: boolean;
  /**
   * 输出展示一下，服装对应属性，用于测试
   */
  showNameAndBonus() {
    for (const equip of Object.values(this.items) as EquipItem[]) {
      console.log(equip.cnName, ':', equip.getRoleBonus());
    }

  }

  /**
   *  返回套装的加成
   * @return
   */
  getRoleBonus() {
    var bonus:RoleBonus = {}
    for (const equip of Object.values(this.items) as EquipItem[]) {
      bonus = BonusMerge(bonus,equip.getRoleBonus())
    }
    return bonus
  }
}

/**
 * 装备背包实现类
 */
export class EquipBag {
  /** 装备数组 */
  @Type(() => EquipItem)
  arr: EquipItem[];
  /** 抓取最大数量 */
  gripMaxNum: number;
  /** 最后ID */
  lastId: number;
  /** 锁定长度 */
  lockLen: number;
  /** 锁定对象 */
  @Type(() => Object)
  lockObj: Record<string, number>;
  /** 是否显示时装 */
  showFashionB: boolean;
}

/**
 * 装备仓库实现类
 */
export class EquipHouse {
  /** 装备数组 */
  @Type(() => EquipItem)
  arr: EquipItem[];
  /** 抓取最大数量 */
  gripMaxNum: number;
  /** 最后ID */
  lastId: number;
  /** 锁定长度 */
  lockLen: number;
  /** 锁定对象 */
  @Type(() => Object)
  lockObj: Record<string, number>;
  /** 是否显示时装 */
  showFashionB: boolean;
}

/**
 * 装备容器实现类
 */
export class EquipContainer {
  /** 装备数组 */
  @Type(() => EquipItem)
  arr: EquipItem[];
  /** 抓取最大数量 */
  gripMaxNum: number;
  /** 最后ID */
  lastId: number;
  /** 锁定长度 */
  lockLen: number;
  /** 锁定对象 */
  @Type(() => Object)
  lockObj: Record<string, number>;
  /** 是否显示时装 */
  showFashionB: boolean;
}