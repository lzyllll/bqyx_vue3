import { Type } from 'class-transformer';

/**
 * 任务项实现类
 */
export class TaskItem {
  /** AN */
  aN: number;
  /** C */
  c: number;
  /** CN */
  cN: number;
  /** DI */
  di: boolean;
  /** 困难 */
  diff: number;
  /** 等级 */
  lev: string | null;
  /** LV */
  lv: number;
  /** 地图 */
  map: string | null;
  /** 名称 */
  name: string;
  /** 开启B */
  openB: boolean;
  /** SN */
  sN: number;
  /** 状态 */
  state: string;
}

/**
 * 任务实现类
 */
export class Task {
  /** 数据数组 */
  @Type(() => TaskItem)
  dataArr: TaskItem[];
  /** 疯狂G */
  madG: number;
  /** 疯狂N */
  madN: number;
  /** 仅完成B */
  onlyCompleteB: boolean;
  /** 交换数量 */
  swapNum: number;
  /** 今日购买数量对象 */
  @Type(() => Object)
  todayBuyNumObj: Record<string, string>;
  /** 今日完成数量对象 */
  @Type(() => Object)
  todayCompleteNumObj: Record<string, string>;
  /** 每周掉落日期字符串 */
  weekDropDateStr: string | null;
  /** 每周乘数索引 */
  weekMulIndex: number;
}