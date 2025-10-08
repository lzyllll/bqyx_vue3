import { Type } from 'class-transformer';
import { SaveObject } from '../base';

/**
 * 计数保存实现类
 */
export class CountSave {
  /** 武器掉落 */
  armsNum: number;
  /** 射出子弹 */
  bulletNum: number;
  /** 银币掉落 */
  coin: number;
  /** 装备掉落 */
  equipNum: number;
  /** 经验掉落 */
  exp: number;
  /** 尸宠基因掉落 */
  geneNum: number;
  /** 爆头次数 */
  headshotNum: number;
  /** 受击次数 */
  hitNum: number;
  /** 杀敌次数 */
  killEnemyNum: number;
  /** 橙色记录 */
  orangeNum: number;
  /** 重生次数 */
  rebirthNum: number;
  /** 不知道 */
  star: number;
  /** 在该地图所待时间 */
  time: number;
}

/**
 * 世界地图项实现类
 */
export class WorldMapItem {
  /** 挑战等级 */
  challengeLevel: number;
  /** 挑战数量数组 */
  @Type(() => String)
  challengeNumArr: string[];
  /** 计数保存 */
  @Type(() => CountSave)
  countSave: CountSave;
  /** 无双水晶总掉落 */
  db: number;
  /** 万能球总掉落 */
  dm: number;
  /** 本周无双水晶总掉落 滞后的，需要时间判断 */
  demBall: number;
  /** 本周无双水晶总掉落 滞后的，需要时间判断*/
  demStone: number;
  /** 修罗8 胜利次数 */
  demWin: number;
  /** 困难解锁 */
  diffUnlock: number;
  /** 失败数量 */
  failNum: number;
  /** 等级名称 */
  levelName: string | null;
  /** 最大无尽等级 */
  maxEndlessGrade: number;
  /** 最大无尽分数 */
  maxEndlessScore: number;
  /** 名称 */
  name: string;
  /** 退出数量 */
  quitNum: number;
  /** 时间对象 */
  @Type(() => Object)
  timeObj: Record<string, unknown>;
  /** 胜利B */
  winB: boolean;
  /** 胜利数量 */
  winNum: number;
}

/**
 * 世界地图实现类
 */
export class WorldMap {
  /** CH */
  ch: number;
  /** CHA */
  chA: number;
  /** 掉落火箭B */
  dropRocketB: boolean;
  /** 对象 */
  @Type(() => WorldMapItem)
  obj: Record<string, WorldMapItem>;
  /** 超级数量 */
  superNum: number;
  /** 扫荡数量 */
  sweepingNum: number;
  /** 今日无尽数量 */
  todayEndlessNum: number;
  /** 胜利最大困难地图数组 */
  @Type(() => Object)
  winMaxDiffMapArr: unknown[];
}