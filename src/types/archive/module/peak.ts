import { plainToInstance, Transform, Type } from 'class-transformer';
import { SaveObject } from '../base';
import { PetAttributes } from './gene';
import pointDict from '@/assets/data/peak/pointMul.json'
import { type PeakBonus, type RoleBonus } from '../Bonus';
import { BonusMerge } from '@/utils/bonusAdd';


/**
 * classTransfer装饰器的进一步封装，转换为范型的saveObject
 * 原生type装饰器不支持，只能自己写了
 */
function SaveObjectPeakPoint() {
  return Transform(({ value }) => {
    const saveObject = new SaveObject<PeakPoint>();
    if (value && typeof value === 'object') {
      // 将获取的json的saveObject转换
      if (value.saveObj) {
        saveObject.saveObj = plainToInstance(PeakPoint, value.saveObj);
      }
    }
    return saveObject;
  }, { toClassOnly: true });
}

/**
 * 加成点数,具体数值，需要自己算
 */
export class PeakPoint{
  critPro3?:number
  dodge?:number
  nuclear_peak?:number
  bulletDedut?:number
  sacrifice_peak?:number
  lifeAll?:number
  dpsAll?:number
  fightDedut?:number
  cdMul?:number
  moveMul?:number
  gaze_peak?:number
   /**
     * 获取属性值乘以对应的倍率
     * @param name 属性名称
     * @returns 属性值 * 倍率，如果属性不存在则返回 undefined
     */
    getRoleBonsValue(name: keyof typeof pointDict): number | undefined {
        const value = this[name];
        if (value === undefined || value === null) {
            return undefined;
        }
        
        const multiplier = pointDict[name];
        return value * multiplier;
    }

    /**
     * 获取所有属性的倍率计算结果
     * @returns 包含所有属性倍率计算结果的对象
     */
    getAllRoleBonusValues(): PeakBonus {
        const result: Record<string, number> = {};
        
        Object.keys(pointDict).forEach(key => {
            const value = this[key as keyof PeakPoint] as number;
            if (value !== undefined && value !== null) {
                result[key] = value * pointDict[key as keyof typeof pointDict];
            }
        });
        
        return result;
    }

    /**
     * 获取指定属性的倍率值
     * @param name 属性名称
     * @returns 对应的倍率值
     */
    static getMultiplier(name: keyof typeof pointDict): number {
        return pointDict[name];
    }

  
}
/**
 * 巅峰实现类
 */
export class Peak {
  /** 每日经验 */
  dayExp: number;
  /** DP日 */
  dpDay: number;
  /** 全体加成 */
  dpN: number;
  /** 经验 */
  exp: number;
  /** 等级 */
  lv: number;
  /** 当前使用的对象 */
  now: string | null;
  /** 点数对象 */
  @SaveObjectPeakPoint()
  pointObj: SaveObject<PeakPoint>;
  /** 点数对象2 */
  @SaveObjectPeakPoint()
  pointObj2: SaveObject<PeakPoint>;
  /** 点数对象3 */
  @SaveObjectPeakPoint()
  pointObj3: SaveObject<PeakPoint>;

  /**获取当前使用的巅峰方案 */
  getCurrentPoint(): PeakPoint | null {
    var now = (this.now!='') ? this.now : '1'

    const pointObjMap: Record<string,SaveObject<PeakPoint>> = {
      '1': this.pointObj,
      '2': this.pointObj2,
      '3': this.pointObj3
    };
    
    return pointObjMap[now]?.saveObj || null;
  }


  /**获取全体战力加成 */
  getDpsWhole():Pick<RoleBonus,'dpsWhole'>{
    //每个点数0.5%
    return {
      dpsWhole:(this.dpN??0) / 2 / 100
    }
  }
  /**
   * 该模块的所有加成
   * @returns 巅峰加成
   */
  getRoleBonus():RoleBonus{
    var bonus = {}
    //巅峰点数加成
    bonus = BonusMerge(bonus, this.getCurrentPoint()?.getAllRoleBonusValues()||{})  
    //全体战力加成
    bonus = BonusMerge(bonus, this.getDpsWhole())
    return bonus
  }
}