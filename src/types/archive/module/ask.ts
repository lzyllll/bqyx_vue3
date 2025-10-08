/**
 * 问答系统实现类
 */
export class Ask {
  /** 正确数量 */
  correctNum: number;
  /** 错误数量 */
  errorNum: number;
  /** 是否有礼物 */
  giftB: boolean;
  /** 当前保存版本 */
  nowSaveVersion: string;
  /** 当前赛季 */
  nowSeason: string;
  /** 是否结束 */
  overB: boolean;
  /** 分数 */
  score: number;
  /** 今日分数 */
  todayScore: number;
  /** 今日时间 */
  todayTime: number;
}