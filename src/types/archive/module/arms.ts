import { Expose, plainToClass, plainToInstance, Transform, Type } from 'class-transformer';
import { BagItemBase } from '../base';
import { AttackGapPart, CapacityPart, DpsPart, PartsItem, PartsSave, PrecisionPart, ReloadPart, ShootRangePart } from './parts';
import { getArmInfo, getExtraMul } from '@/utils/armsInfo';
import { EvoArmInfoStartAdd, AutoFillArmsInfo } from '@/utils/decorator/typeRecords';
import { ColorType, isBlackOrMore } from '@/utils/archive/colors';
import { getEvoMul } from '@/utils/archive/evo';
import { getAddMulStrengthen } from '@/utils/archive/strengthen';
import type { RoleBonus } from '../Bonus';

// import { TransformFromArmInfo } from '@/utils/decorator/typeRecords'
const LONG_LINE = "longLine";
const BLINK = "blink";
const FLAMER = 'flamer';
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
 * 武器项实现类
 * 注意：根据BagItemBase实现类的定义，某些字段可能是可选的
 */




export class ArmsItem extends BagItemBase {
  /**声明覆盖，添加装饰器，修正evoLv */
  //该函数用于将evoLv 添加，因为传入的evoLv是5，但有的，比如处女座，传入1，但需要FirstLv:13 来修正
  @EvoArmInfoStartAdd("evoMustFirstLv")
  declare evoLv?: number;
  /** 武器图片标签 */
  armsImgLabel: string;
  /** 攻击间隔 */
  attackGap: number;
  /** 未知 */
  bh: number;
  /** 弹跳数据 */
  @Type(() => BounceData)
  bounceD: BounceData;

  /** 子弹摇摆宽度 */
  bulletShakeWidth: number;

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


  /**
   * 由于无法用transform在类上赋予，
   * 只好用fresh() 返回处理好的对象,在store中上传json时使用
   */

  /** 子弹宽度 */
  // @TransformFromArmInfo('bulletWidth', '')
  bulletWidth: number;
  // @TransformFromArmInfo('hitType', '')
  hitType: string;
  // @TransformFromArmInfo('armsType', '')
  // @TransformFromArmInfo('bulletSpeed', 0)
  bulletSpeed: number;
  // @TransformFromArmInfo('bulletLife', 0.001)
  bulletLife: number;
  // 武器类型  激光，ak，狙击什么的
  armsType: string;
  //
  shootNum: number;
  /** 子弹数量 可能在存储数据中，比如普通黑枪*/
  bulletNum: number;

  evoMaxLv: number;

  evoMustFirstLv: number = 0;

  /**
 * 获取射击速度（只有武器属性，无任何加成）
 * @returns 
 */
  getAttackSpeed() {
    return this.attackGap > 0 ? 1 / this.attackGap : 0;
  }

  /**
   * 计算射程，注意，面板显示的时候需要 * 1.2
   * @returns 
   */
  getShootRange(): number {
    if (this.hitType === LONG_LINE) {
      return this.bulletWidth;
    } else if (this.armsType === BLINK) {
      return this.getAIShootRange() || 1000;
    }

    const bulletSpeedMul = (type: string): number => {
      return type === FLAMER ? 0.6 : 1;
    };

    const maxLine0 = this.bulletSpeed * this.bulletLife * 30 * bulletSpeedMul(this.armsType);
    const v0 = this.bulletSpeed * 30 * 0.7 + this.bulletWidth;

    // 如果没有 bulletSpeed
    if (!maxLine0) {
      return v0;
    }
    return maxLine0 > v0 ? v0 : maxLine0;
  }
  /**
   * 获取ui射程
   * @returns 
   */
  getUIShootRange(): number {
    return this.getShootRange() * 1.2;
  }
  /**
   * 只用于计算ai射程
   * @returns 
   */
  private getOnlyAnglePrecision(): number {
    const s0 = Math.max(1 - this.shakeAngle / 30, 0.4);
    const a0 = Math.max(1 - this.shootAngle / 30, 0.3);
    return s0 * a0;
  }
  /**
   * 计算ai射程
   * @param precisionB0 
   * @returns 
   */
  getAIShootRange(precisionB0: boolean = true): number {
    const armInfo = getArmInfo(this.name);
    var aiShootRange = armInfo?.aiShootRange || 0;
    if (aiShootRange === 0) {
      let v0 = 1.0;
      if (precisionB0) {
        v0 = this.getOnlyAnglePrecision();
        v0 = 1 - (1 - v0) * 0.4;
        v0 = Math.max(v0, 0.6);
      }
      return Math.floor(v0 * this.getShootRange());
    }
    return aiShootRange;
  }

  /**
   *  获取精准度，用于计算hurt之类的
   * @returns 
   */
  getPrecision() {
    const val1 = Math.max(1 - this.shakeAngle / 30, 0.4);
    const val2 = Math.max(1 - this.shootAngle / 30, 0.3);
    const val3 = Math.min((this.getShootRange() + 500) / 1100, 1);
    return val1 * val2 * val3;
  }

  /**
   * 用于计算ui面板显示的精准度
   * @returns 
   */
  getUIPrecision() {
    const val1 = Math.max(1 - this.shakeAngle / 30, 0.4);
    const val2 = Math.max(1 - this.shootAngle / 30, 0.3);
    const val3 = Math.min((720 / 1.2 + 500) / 1100, 1);
    return val1 * val2 * val3;
  }

  /**
   * 强化等级的加成 星星的那个
   * 在addMul的json下，乘了5
   * @returns 
   */
  getHurtmulByStrengthenlv() {
    var lv = this.strengthenLv ?? 0
    return getAddMulStrengthen(lv) * 5
  }

  /**
   * 计算dps   计算武器伤害的第一步
   * @param hurtRatio0 伤害比率，如果为-1则使用当前武器的伤害比率
   * @returns DPS值
   */
  getDps(hurtRatio0: number = -1): number {
    if (hurtRatio0 <= -1) {
      hurtRatio0 = this.hurtRatio;
    }
    const l_dps0 = hurtRatio0 * this.bulletNum * this.shootNum / this.attackGap * this.getPrecision();
    const r_mul0 = 1 - this.reloadGap / (this.attackGap * this.capacity + this.reloadGap);
    return r_mul0 * l_dps0;
  }

  /**
   * 获取DPSMUL 先根据名称看有没有dpsMul，然后再倍成 颜色加成（黑色以上1.3，其他1）
   * @param color 颜色类型，如果为undefined则使用当前武器的颜色
   * @returns DPS倍数
   */
  getDpsMul(): number {
    //这里获取的是武器的dpsMul
    const armInfo = getArmInfo(this.name);
    //如果没有默认为1
    const dpsMul = armInfo?.dpsMul ?? 1;
    const colorDpsMul = isBlackOrMore(this.color as any) ? 1.3 : 1.0;
    return dpsMul * colorDpsMul;
  }


  /**
   * 获取进化倍数
   * @returns 进化倍数
   */
  getEvoMul(): number {
    // return 1
    var mul = getEvoMul(this.evoLv ?? 0)
    // 无法进化的武器
    if (this.evoMaxLv == 0) {
      return 1
    }
    //处女座
    if (["consVirgo"].includes(this.name)) {
      var arr = [0, 2.4, 3.4]
      //由于使用了装饰器，直接从开始level + 进化的次数,
      // 所以需要还原 - 开始level = 进化的次数
      return arr[this.evoLv - this.evoMustFirstLv]
    }

    //darkGod
    //隼武，集源
    if (["extremeGun", "falconGun"].includes(this.name)) {
      var darkgod_arr = [0, 1.50, 1.80, 2.10, 2.50, 3.00, 3.40, 3.80]
      return darkgod_arr[this.evoLv - this.evoMustFirstLv]
    }
    //卡特巨炮
    if (['rocketCate'].includes(this.name)) {
      var rocket_arr = [
        0,
        0.90, 1.00, 1.10, 1.45, 1.55, 1.65, 1.80, 1.95,
        1.95, 1.95, 1.95, 1.95, 1.95, 2.10, 2.20, 2.30
      ]

      //这里不需要 - startLevel
      return rocket_arr[this.evoLv]
    }

    //生肖武器
    //"辰龙", "未羊", "寅虎"
    if (['yearDragon', 'yearSheep', '"yearTiger'].includes(this.name)) {
      var year_arr = [100, 125]
      return year_arr[this.evoLv - this.evoMustFirstLv]
    }



    // 暗金武器进化maxlv大于1级时
    if (this.color == ColorType.PURGOLD && this.evoMaxLv > 1) {
      // 暗金武器进化等级小于等于14级时，进化倍数*0.8
      // 因为我用了0 占位，所以需要-1 
      //占位好处是，直接从列表，等级加成对应 即 evoLv1 = arr[1]
      if ((this.evoLv - 1) <= 13) {
        mul *= 0.8
      }
    }
    return mul;
  }

  /**
   * 获取武器角色加成
   * @returns 角色加成对象
   */
  getRoleBonus(): Record<string, any> {
    // 武器本身不提供角色加成，返回空对象
    return {};
  }

  /**
   * 计算武器最终伤害
   * @param roleBonus 角色加成对象
   * @returns 最终伤害值
   */
  getHurt(roleBonus: RoleBonus): number {
    // 获取对应类型DPS倍数加成
    //例如

    //dpsMul_rifle
    const eaDpsMul0 = roleBonus[`dpsMul_${this.armsType}`] || 0;
    //dps_rifle
    const eaDps0 = roleBonus[`dps_${this.armsType}`] || 0;
    //hurtMul_rifle
    const eaHurtMul = roleBonus[`hurtMul_${this.armsType}`] || 0;
    //hurt_rifle
    const eaHurt = roleBonus[`hurt_${this.armsType}`] || 0;
    // 加成
    //重命名一下，遍于自己理解
    const playerDpsMul = roleBonus.dpsMul || 0;
    const playerDps = roleBonus.dps || 0;
    const vipDpsMul = roleBonus.dpsVip || 0;
    const dpsWhole = roleBonus.dpsWhole || 0;
    const playerHurt = roleBonus.hurt || 0;
    const playerHurtMul = roleBonus.hurtMul || 0;
    const dpsGod1 = roleBonus.dpsAll || 0;
    const dpsGod2 = roleBonus.dpsAllBlack || 0;
    const hurtGod = roleBonus.hurtAll || 0;
    // 获取零件加成
    // 30% 比如猎人
    var partsDpsMul = this.partsSave?.getDpsMul() || 0;


    //伤害部件加成
    const partsDps = this.partsSave?.getDps() || 0;


    // 更多DPS加成（队友加成）
    const moreDps = 0;

    // 对应类型加成


    // 计算基础DPS
    const dps0 = this.getDps();
    console.log(dps0)

    // console.log(`this.getDps():${dps0}`)
    const dps2 = dps0 * (1 + partsDpsMul) * (1 + playerDpsMul + eaDpsMul0) +
      (playerDps + eaDps0 + partsDps) * this.getDpsMul();

    // console.log(
    //   `DPS计算: ${dps0} * ${1 + partsDpsMul} * ${1 + playerDpsMul + eaDpsMul0} + (${playerDps} + ${eaDps0} + ${partsDps}) * ${this.getDpsMul()} = ${dps2}`
    // );

    // 应用各种DPS加成
    const finalDps = dps2 * (1 + vipDpsMul) * (1 + moreDps) * (1 + dpsWhole);

    // 计算伤害增加值
    let hurtAdd = 0;
    if (Math.abs(dps0 - finalDps) > 1) {
      hurtAdd = this.getArmsDataHurt(finalDps) - this.hurtRatio;
    }

    // 计算基础伤害
    let hurt = this.hurtRatio;

    // 应用各种伤害加成
    hurt = hurt * (1 + playerHurtMul + this.getHurtmulByStrengthenlv() + eaHurtMul) +
      this.getArmsTypeAdd() * (playerHurt + eaHurt) + hurtAdd;


    // 应用神级加成
    hurt *= (1 + dpsGod1 + dpsGod2 + hurtGod);

    // 应用进化等级加成
    //todo 
    //这里需要分类讨论
    // 无法进化的武器 86黑武，非合成武器（无法进阶的） * 1 无变化
    //


    hurt *= this.getEvoMul();
    //部件 品质伤害 暗金，紫金之芯
    // if (parts0.colorHurtMul > 0) {
    //   hurt2 *= 1 + parts0.colorHurtMul;
    // }

    //部件 红武增强器
    // if(parts0.redHurtMul > 0)
    // {
    //   if(this.getSaveColor() == EquipColor.RED || this.getSaveColor() == EquipColor.ORANGE)
    //   {
    //       hurt2 *= 1 + parts0.redHurtMul;
    //   }
    // }

    //是否为生肖武器
    //  if(this.def.isZodiacB())
    //  {
    //     hurt2 *= 1 + ea0.zodiacArmsHurtAdd;
    //  }

    //武器的extraMul,
    // rareMul 稀零 比如u型关什么的 todo
    // if (parts0.rareHurtMul != 0 || extraMul != 1) {
    //   this.baseHurt = hurt2;
    //   hurt2 *= 1 + parts0.rareHurtMul;
    //   hurt2 *= extraMul;
    // }
    hurt *= getExtraMul(this.name)


    return hurt;
  }

  /**
   * 根据DPS计算伤害
   * 相当于as3 里的ArmsDataCreator.getHurt
   * @param dps DPS值
   * @returns 伤害值
   */
  private getArmsDataHurt(dps: number): number {
    const rMul0 = 1 - this.reloadGap / (this.attackGap * this.capacity + this.reloadGap);
    return dps / rMul0 / (this.bulletNum * this.shootNum / this.attackGap * this.getPrecision());
  }


  /**
   * 获取武器类型加成
   * @returns 类型加成值
   */
  private getArmsTypeAdd(): number {
    const armsTypeAddMap: Record<string, number> = {
      'rifle': 0.4,
      'sniper': 7,
      'shotgun': 3.7 / 7,
      'pistol': 1,
      'rocket': 7.5,
      'crossbow': 7,
      'howitzer': 7,
      'wavegun': 5,
      'cutter': 5,
      'laser': 0.3,
      'lightning': 3.7 / 7,
      'weather': 7,
      'flamer': 0.3
    };
    return armsTypeAddMap[this.armsType] ?? 0.5;
  }

}



/**
 * 武器实现类
 */
export class Arms {
  /** 武器数组 */
  @Expose({ name: 'arr' })
  @AutoFillArmsInfo()
  items: ArmsItem[];
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

  // @Expose({ name: 'arr' })
  @Expose({ name: 'arr' })
  @AutoFillArmsInfo()
  items: ArmsItem[];
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
  // @Expose({ name: 'arr' })
  @Expose({ name: 'arr' })
  @AutoFillArmsInfo()
  items: ArmsItem[];
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

