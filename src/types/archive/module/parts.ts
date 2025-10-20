import { Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { BagItemBase } from '../base';

/**
 * 零件物品实现类
 */
export class PartsItem extends BagItemBase {
  // 覆盖父类的 color 字段，应用自定义颜色逻辑
  @Transform(({ obj }) => {
    const name: string = obj.name;
    // 注意：这里 name 没有被父类转换
    //不确定这转换顺序是什么样的
    const level = obj.itemsLevel;

    // 如果名称不是 'loaderparts',统一返回 darkgold
    if (!name.startsWith('loaderParts')) {
      return 'darkgold';
    }

    if (level <= 54) {
      return 'white';
    } else if (level === 57) {
      return 'green';
    } else if (level === 60) {
      return 'blue';
    } else if (level === 63) {
      return 'purple';
    } else if (level === 66) {
      return 'orange';
    } else if (level >= 69 && level <= 84) {
      return 'red';
    } else if (level >= 87 && level <= 90) {
      return 'black';
    } else if (level === 93) {
      return 'darkgold';
    } else {
      // 其他未定义等级的情况，也可以默认返回 darkgold 或其他
      return 'darkgold';
    }
  }, { toClassOnly: true })
  color: string = undefined as any; // 提供初始化器，消除 TS2612 错误,覆盖
}


// 基础零件类
export class BasePart extends PartsItem {
  /**
   * 获取当前零件的加成值
   */
  getValue(): number {
    return 0;
  }
  protected getDpsByLv():number {
    var lv = this.itemsLevel
    if (lv >= 51 && lv <= 104) return lv * lv * 15 - 28000;
    if (lv >= 1 && lv < 51) return lv * lv * 4 + 20;
    return 1;
  }
  /**
   * 
   * 除了dps零件，等级的倍率
   */
  protected getMulByLv() {
    var partLv = this.itemsLevel
    if (partLv == 0) { return 0; }
    // 武器不是只能装小于他等级的零件吗，为什么判断
    // if (partLv > armsLv) { partLv = armsLv };
    const dpsArms = this.getDpsByLv();
    const dpsPart = this.getDpsByLv();
    return dpsArms > 0 ? (1 - (1 - dpsPart / dpsArms) * 0.4) : 1;
  }
}

// 伤害零件类
export class DpsPart extends BasePart {
  /**
   * 
   * @returns 零件加成 max   在xml里    
   *  {"maxLevel": 15, "max": 0.3},
   *  {"maxLevel": 20, "max": 0.3},
   *  {"maxLevel": 25, "max": 0.3},
   */
  getValue(): number {
    const lv = this.itemsLevel ?? 0;
    if (lv > 87) return 1.5;
    if (lv >= 84) return 1.4;
    if (lv >= 70) return 1.3;
    if (lv >= 65) return 1.2;
    if (lv >= 60) return 1.1;
    if (lv >= 55) return 1;
    if (lv >= 50) return .9;
    if (lv >= 45) return .75;
    if (lv >= 40) return .6;
    if (lv >= 35) return .45;
    return .3;
  }
  /**
   * 获取零件对于dps的加成  max * dps
   * 比如 602350 * 1.5
   */
  getDps():number{
    return this.getValue() * this.getDpsByLv()
  }

}

// 弹容零件类
export class CapacityPart extends BasePart {
  getValue(): number {
    const lv = this.itemsLevel ?? 0;
    if (lv > 87) return .89;
    if (lv >= 84) return .88;
    if (lv >= 70) return .87;
    if (lv >= 65) return .86;
    if (lv >= 60) return .85;
    if (lv >= 55) return .83;
    if (lv >= 50) return .81;
    if (lv >= 45) return .73;
    if (lv >= 40) return .65;
    if (lv >= 35) return .57;
    if (lv >= 30) return .49;
    if (lv >= 25) return .41;
    if (lv >= 20) return .33;
    return .25;
  }
  getAttackGapMul(){
    return this.getValue() * this.getMulByLv()
  }
}

// 攻速零件类
export class AttackGapPart extends BasePart {
  getValue(): number {
    const lv = this.itemsLevel ?? 0;
    if (lv > 87) return -0.58;
    if (lv >= 84) return -0.57;
    if (lv >= 70) return -0.56;
    if (lv >= 65) return -0.55;
    if (lv >= 60) return -0.54;
    if (lv >= 55) return -0.52;
    if (lv >= 50) return -0.5;
    if (lv >= 45) return -0.46;
    if (lv >= 40) return -0.42;
    if (lv >= 35) return -0.38;
    if (lv >= 30) return -0.34;
    if (lv >= 25) return -0.3;
    if (lv >= 20) return -0.26;
    return -0.22;
  }
  /**零件的射速加成倍率 */
  getShotSpeedMul(){
    return this.getValue() * this.getMulByLv()
  }
}

// 装弹零件类
export class ReloadPart extends BasePart {
  getValue(): number {
    const lv = this.itemsLevel ?? 0;
    if (lv > 87) return -0.81;
    if (lv >= 84) return -0.8;
    if (lv >= 70) return -0.79;
    if (lv >= 65) return -0.77;
    if (lv >= 60) return -0.75;
    if (lv >= 55) return -0.72;
    if (lv >= 50) return -0.69;
    if (lv >= 45) return -0.62;
    if (lv >= 40) return -0.55;
    if (lv >= 35) return -0.48;
    if (lv >= 30) return -0.41;
    if (lv >= 25) return -0.34;
    if (lv >= 20) return -0.27;
    return -0.2;
  }
  /**
   * 零件的装弹加成
   */
  getReloadGapMul(){
    return this.getValue() * this.getMulByLv()
  }
}

// 精准零件类
export class PrecisionPart extends BasePart {
  getValue(): number {
    const lv = this.itemsLevel ?? 0;
    if (lv > 87) return -0.65;
    if (lv >= 84) return -0.64;
    if (lv >= 70) return -0.63;
    if (lv >= 65) return -0.61;
    if (lv >= 60) return -0.59;
    if (lv >= 55) return -0.57;
    if (lv >= 50) return -0.55;
    if (lv >= 45) return -0.5;
    if (lv >= 40) return -0.45;
    if (lv >= 35) return -0.4;
    if (lv >= 30) return -0.35;
    if (lv >= 25) return -0.3;
    if (lv >= 20) return -0.25;
    return -0.2;
  }
  /**
   *  获取shakeAngle加成
   */
  getShakeAngle(){
    return this.getValue() * this.getMulByLv()
  }
  /**
   *  获取shookAngle加成
   */
  getShookeAngle(){
    return this.getValue() * this.getMulByLv() / 2
  }
}

// 射程零件类
export class ShootRangePart extends BasePart {
  getValue(): number {
    const lv = this.itemsLevel ?? 0;
    if (lv > 87) return 610;
    if (lv >= 84) return 600;
    if (lv >= 70) return 585;
    if (lv >= 65) return 570;
    if (lv >= 60) return 550;
    if (lv >= 55) return 525;
    if (lv >= 50) return 500;
    if (lv >= 45) return 450;
    if (lv >= 40) return 400;
    if (lv >= 35) return 350;
    if (lv >= 30) return 300;
    if (lv >= 25) return 250;
    if (lv >= 20) return 200;
    return 150;
  }
  getShootRange(){
    return this.getValue() * this.getMulByLv()
  }
}


/**猎人  伤害加成 */
export class huntPart extends BasePart {
  getHurtMul(): number {
    return (this.itemsLevel - 1) * 0.1;
  }
}

/**腐蚀芯片 伤害加成 */
export class acidicPart extends BasePart {
  getHurtMul(): number {
    return (this.itemsLevel - 1) * 0.1;
  }
}



export class PartsItems {
  dpsPart?: DpsPart;      // 伤害零件
  capacityPart?: CapacityPart = new CapacityPart();    // 弹容零件
  attackGapPart?: AttackGapPart = new AttackGapPart();   // 攻速零件
  reloadPart?: ReloadPart = new ReloadPart();      // 装弹零件
  precisionPart?: PrecisionPart = new PrecisionPart();   // 精准零件
  shootRangePart?: ShootRangePart = new ShootRangePart();  // 射程零件
  acidicPart?: acidicPart = new acidicPart();  //腐蚀芯片
  huntPart?: huntPart = new huntPart();    //猎人技能器
  rareParts?: PartsItem[] = []; //稀零
}



// 零件配置接口
interface PartConfig {
  field: keyof PartsItems;
  class: any;
}

// 零件位置配置映射
export const PartPositionConfig: Record<number, PartConfig> = {
  0: { field: 'dpsPart', class: DpsPart },
  1: { field: 'capacityPart', class: CapacityPart },
  2: { field: 'attackGapPart', class: AttackGapPart },
  3: { field: 'reloadPart', class: ReloadPart },
  4: { field: 'precisionPart', class: PrecisionPart },
  5: { field: 'shootRangePart', class: ShootRangePart },
  6: { field: 'acidicPart', class: acidicPart },
  7: { field: 'huntPart', class: huntPart }
};

/**
 * 零件保存实现类
 */
export class PartsSave {
  /** 
   * 零件数组 
   * */
  @Expose({ name: 'arr' })
  // @Type(()=>PartsItems)
  @Transform(({ value }) => {
    // 遍历这个arr,根据位置分发
    const partsItems = new PartsItems();
    partsItems.rareParts = [];

    if (!value || !Array.isArray(value)) {
      return partsItems;
    }
    // 根据位置分发
    value.forEach((partItem) => {
      if (!partItem) return;

      const position = partItem.site;
      //"1"
      const posToTypeConfig = PartPositionConfig[position];
      //{ field: 'precisionPart', class: PrecisionPart }

      if (posToTypeConfig) {
        // 普通零件位置
        const transformedItem = plainToInstance(posToTypeConfig.class, partItem);
        (partsItems as any)[posToTypeConfig.field] = transformedItem;
      } else {
        // 稀有零件 位置 > 7
        if (!partsItems.rareParts) {
          partsItems.rareParts = [];
        }
        partsItems.rareParts.push(plainToInstance(PartsItem, partItem));
      }
    });
    return partsItems;
  },{ toClassOnly: true })
  partsItems?: PartsItems;
  obj: PartsItems;
  /** 抓取最大数量 */
  gripMaxNum: number;
  /** 最后ID */
  lastId: number;
  /** 锁定长度 */
  lockLen: number;
  /** 锁定对象 */
  @Type(() => Object)
  lockObj: Record<string, unknown>;


  /**
   * 获取零件伤害倍数
   * @returns 伤害倍数
   */
  getDpsMul() {
    return (this.partsItems.acidicPart.getHurtMul()??0) + (this.partsItems.huntPart.getHurtMul()??0);
  }

  /**
   * 获取零件dps加成
   * @returns 
   */
  getDps(){
    return (this.partsItems?.dpsPart?.getDps()) ?? 0 
  }
}

/**
 * 零件背包实现类
 */
export class PartsBag {
  /** 数组 */
  @Type(() => PartsItem)
  arr: PartsItem[];
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