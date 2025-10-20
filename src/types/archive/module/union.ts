import { Expose, Transform, Type } from 'class-transformer';
import { type RoleBonus } from '../Bonus';
import UnionBonusDict from '@/assets/data//union/unionBuildingPropertyClass.json'
import { BonusMerge } from '@/utils/bonusAdd';
/**
 * 公会烹饪实现类
 */
export class UnionCooking {
  /** 名称 */

  name: string;

  /** 状态 */
  @Transform(({ value }) => {
    if (value === "complete" || value === "ing") return true;
    if (value === 'no') return false;
    return false; // 保持其他值不变
  })
  state: boolean;
  /** 剩余时间 */
  surplusTime: number;
}

/**军队烹饪的食物  */
export class CookingObj {
  @Type(() => UnionCooking)
  sandwich: UnionCooking;

  @Type(() => UnionCooking)
  hamburger: UnionCooking;

  @Type(() => UnionCooking)
  slicedBread: UnionCooking;
  /**获取当前进食的食物名 */
  getNowEating(): 'sandwich' | 'slicedBread' | 'hamburger' | null {
    if (this.sandwich.state) {
      return this.sandwich.name as 'sandwich'
    } else if (this.slicedBread.state) {
      return this.slicedBread.name as 'slicedBread'
    } else if (this.hamburger.state) {
      return this.hamburger.name as 'hamburger'
    }
    return null
  }

}


/**
 * 公会物品实现类
 */
export class UnionThings {
  /** 悬挂B */
  hangingB: boolean;
  /** 名称 */
  name: string;
  /** 当前 */
  now: number;
}

/**
 * 公会地质挖矿实现类
 */
export class UnionGeology {
  /** 拥有时间 */
  haveTime: number;
  /** 物品对象 */
  @Type(() => UnionThings)
  thingsObj: Record<string, UnionThings>;
}

/**
 * 公会建筑对象实现类
 */
export class UnionBuildingObj {
  /** 经验 */
  exp: number;
  /** 等级 */
  lv: number;
  /** 名称 */
  name: string;
}

/**
 * 公会发送任务实现类
 */
export class UnionSendTask {
  /** 索引 */
  index: number;
  /** 名称 */
  name: string;
  /** 挂机时间 */
  onHookTime: number;
  /** 状态 */
  state: string;
  /** 剩余时间 */
  surplusTime: number;
}

/**军队建筑 */
export class BuildingRecords {
  /**炊事馆 */
  @Type(() => UnionBuildingObj)
  cooking?: UnionBuildingObj;
  /**地质研究所 */
  @Type(() => UnionBuildingObj)
  geology?: UnionBuildingObj;

  /**联邦大厦 */
  @Type(() => UnionBuildingObj)
  federal?: UnionBuildingObj;

  /**守望者 */
  @Type(() => UnionBuildingObj)
  watchmen?: UnionBuildingObj;
}
/**
 * 公会建筑实现类
 */
export class UnionBuilding {
  /** 购买补给数量 */
  buySuppliesNum: number;
  /** 烹饪对象 */
  @Type(() => CookingObj)
  cookingObj: CookingObj;
  /** 每日补给数量 */
  daySuppliesNum: number;
  /** 食用数量 */
  eatNum: number;
  /** 兑换补给数量 */
  exchangeSuppliesNum: number;
  /** 联邦礼物B */
  federalGiftB: boolean;
  /** 联邦状态 */
  federalState: number;
  /** 联邦任务数量 */
  federalTaskNum: number;
  /** 地质学 */
  @Type(() => UnionGeology)
  geology: UnionGeology;
  /** 发送任务礼物时间 */
  haveSendTaskGiftTime: number;
  /** 建筑对象 */
  @Type(() => BuildingRecords)
  obj: BuildingRecords;
  /** 发送任务数量 */
  sendTaskNum: number;
  /** 发送任务对象 */
  @Type(() => UnionSendTask)
  sendTaskObj: Record<string, UnionSendTask>;
}

/**
 * 公会任务实现类
 */
export class UnionTask {
  /** 获取B */
  getB: boolean;
}

/**
 * 公会实现类
 */
export class Union {
  /** AF贡献 */
  afCon: number;
  /** B礼物B */
  bGiftB: boolean;
  /** B数量 */
  bNum: number;
  /** BE贡献 */
  beCon: number;
  /** BG数量 */
  bgNum: number;
  /** 建筑 */
  @Type(() => UnionBuilding)
  building: UnionBuilding;
  /** 贡献 */
  con: number;
  /** 日贡 */
  conDay: number;
  /** 贡献记录，最近三周 */
  @Type(() => Object)
  conObj: Record<string, number>;
  /** 捐赠数量对象 */
  @Type(() => Object)
  donationNumObj: Record<string, string>;
  /** 首次时间 */
  firstTime: string;
  /** 争霸分数 滞后需要当前时间判断 */
  lt: number;
  /** 最大贡献 */
  maxCon: number;
  /** 争霸地图  滞后需要当前时间判断*/
  mp: string | null;
  /** 退出T */
  quitT: string | null;
  /** 移除数量 */
  removeNum: number;
  /** 任务对象 */
  @Type(() => UnionTask)
  taskObj: Record<string, UnionTask>;
  /** 今日礼物B */
  todayGiftB: boolean;
  /** 公会ID */
  unionId: number;


  /**获取守望者建筑对成员的属性加成 */
  getWatchManBonus(): RoleBonus {
    var bonus: RoleBonus = {}
    var level = this.building.obj.watchmen.lv ?? 0
    if (level >= 10) {
      bonus.dpsAll = 0.15
    }
    if (level >= 11) {
      bonus.lifeAll = 0.15
    }
    if (level >= 13) {
      bonus.vehicleDefMul= 0.30
    }
    if (level >= 16) {
      bonus.weaponDropPro = 0.15
    }
    if (level >= 18) {
      bonus.lottery = 9
    }
    return bonus
  }

  getCookBonus(): RoleBonus {
    //获取是否吃了东西
    const unionFood = this.building.cookingObj.getNowEating()

    //食堂等级
    const cookLevel = this.building.obj.cooking.lv
    if (!unionFood) {
      return {};
    }
    var bonus: RoleBonus = {}
    switch (unionFood) {
      case 'sandwich':
        bonus.dpsAll = UnionBonusDict.dpsAll[cookLevel]
        bonus.rareArmsDropPro = UnionBonusDict.rareArmsDropPro[cookLevel]
        return bonus;
      case 'slicedBread':
        bonus.dpsAll = UnionBonusDict.dpsAll[cookLevel]
        bonus.rareEquipDropPro = UnionBonusDict.rareEquipDropPro[cookLevel]
        return bonus;
      case 'hamburger':
        bonus.dpsAll = UnionBonusDict.dpsAll[cookLevel]
        bonus.coinMul = UnionBonusDict.coinMul[cookLevel]
        bonus.ranBlackArmsDropPro = UnionBonusDict.ranBlackArmsDropPro[cookLevel]
        return bonus;
      default:
        return bonus;
    }
  }
  /**
   * 该模块的所有加成
   * @returns 军队加成
   */
  getRoleBonus():RoleBonus{
    var bonus: RoleBonus = {}
    //守望者
    bonus = BonusMerge(bonus, this.getWatchManBonus())
    //食物
    bonus = BonusMerge(bonus, this.getCookBonus())
    return bonus
  }


}