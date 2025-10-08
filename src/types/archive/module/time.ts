/**
 * 时间实现类
 */
export class Time {
  /** 双倍武器掉落时间 */
  doubleArmsDropTime: number;
  /** 双倍装备掉落时间 */
  doubleEquipDropTime: number;
  /** 双倍经验时间 */
  doubleExpTime: number;
  /** 双倍材料掉落时间 */
  doubleMaterialsDropTime: number;
  /** 当前阅读时间 */
  nowReadTime: string;
  /** 上次阅读时间 */
  prevReadTime: string;
  /** 星期六 */
  week6: number;
  /** 星期索引 */
  weekIndex: number;
}