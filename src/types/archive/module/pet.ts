import { Type } from 'class-transformer';
import { SaveObject } from '../base';
import { GeneItem } from './gene';
import { SkillItem } from './skill';
import PetStrengthenDps from '@/assets/data/pet/PetStrengthenDps.json'
import PetsInfo from '@/assets/data/pet/pets.json'
import { getOrZero } from '@/utils/safeGet';
/**
 * 宠物基础实现类
 */
export class PetBase {
  /** DPS增加 */
  dpsAdd: number;
  /** 经验 */
  exp: number;
  /** 头部增加 */
  headAdd: number;
  /** ID */
  id: string;
  /** 等级 */
  level: number;
  /** 生命增加 */
  lifeAdd: number;
  /** 名称 */
  name: string;
  /** 玩家名称 */
  playerName: string;
  /** 补充功能B */
  suppleFunB: boolean;
}

/**
 * 宠物派遣实现类
 */
export class PetDispatch {
  /** ID数组 */
  @Type(() => Object)
  idArr: unknown[];
  /** 开始时间 */
  startTime: number;
  /** 今日B */
  todayB: boolean;
}

/**
 * 宠物地图项实现类
 */
export class PetMapItem {
  /** 名称 */
  name: string;
  /** 当前掉落数量 */
  nowDropNum: number;
}

/**
 * 宠物地图实现类
 */
export class PetMap {
  /** 对象 */
  @Type(() => PetMapItem)
  obj: Record<string, PetMapItem>;
}

/**
 * 宠物项实现类
 */
export class PetItem {
  /** 基础 */
  @Type(() => PetBase)
  base: PetBase;
  /** 战斗B */
  fightB: boolean;
  /** 基因 */
  @Type(() => GeneItem)
  gene: GeneItem;
  /** 技能 */
  @Type(() => SkillItem)
  skill: SkillItem;
  /** 补充B */
  suppleB: boolean;
  
  /**超级宠物有加成1.3否则为1 */
  getSuperMul():number{
    return PetsInfo[this.base.name]?.superB ? 1.3 : 1
  }

  /**根据宠物等级的基础加成 */
  getBaseDps():number {
    //至少为1
    this.base.level = Math.max(1,this.base.level)
    if (this.base.level < 51) {
      return this.base.level * this.base.level * 4 + 20;
    }
    return this.base.level * this.base.level * 15 - 28000;
  }

  /**根据强化等级获取数值 limit可限制为最高99*/
  getStrengthenDps(limit=true):number|undefined{
    if(limit){
      return PetStrengthenDps[Math.min(99,this.base.level)]
    }
    return PetStrengthenDps[this.base.level]

  }

  
  /**
   * 强化等级加成，等级最大为99  
   * 对应PetDataGroup的getAddData()
  */

  getPlayerAddDps():number{
    var strengthenDps = this.getStrengthenDps(true)
    var baseDps = this.getBaseDps()
    /**基础和成长的加成相加 */
    var dpsMul = (getOrZero(this.gene.obj.dpsMul) + getOrZero(this.gene.growObj.dpsMul))
    var hurtMul = (getOrZero(this.gene.obj.hurtMul) + getOrZero(this.gene.growObj.hurtMul))
    var mul  = (1+dpsMul + hurtMul) * this.getSuperMul()
    var value =  (strengthenDps + baseDps) * mul
    return Math.ceil(Math.ceil(value) / 8)
  }
  /**
   * 获取尸宠的对玩家的生命加成，todo
   */
  getPlayerAddLife():number{
    return 0
  }

  getRoleBonus():Record<string, any>{
    return {
      dps: this.getPlayerAddDps(),
      life: this.getPlayerAddLife(),
    }
  }
  

}

/**
 * 宠物实现类
 */
export class Pet {
  /** 数组 */
  @Type(() => PetItem)
  arr: PetItem[];
  /** 派遣 */
  @Type(() => PetDispatch)
  dispatch: PetDispatch;
  /** ID索引 */
  idIndex: number;
  /** 锁定长度 */
  lockLen: number;
  /** 地图 */
  @Type(() => PetMap)
  map: PetMap;

  /**获取当前出战的宠物 */
  getFightPet(): PetItem | undefined {
    var pets = this.arr
    for (var pet of pets) {
      //获取出战宠物
      if (pet.fightB) {
        return pet
      }
    }
    return null
  }
}