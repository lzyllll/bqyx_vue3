import { Type } from 'class-transformer';

/**
 * 竞技场顶级保存实现类
 */
export class ArenaTopSave {
  /** 额外信息 */
  extra: string;
  /** 索引 */
  index: number;
  /** 排名 */
  rank: number;
  /** 分数 */
  score: number;
  /** 顶级定义名称 */
  topDefineName: string;
  /** UID */
  uid: string;
  /** 用户名 */
  uname: string;
}

/**
 * 竞技场记录项实现类
 */
export class ArenaRecordItem {
  /** 清理HTML */
  clearHtml: number;
  /** 死亡次数 */
  dieNum: number;
  /** 死亡排序索引 */
  dieSortIndex: number;
  /** 死亡时间 */
  dieTime: string | null;
  /** 击杀次数 */
  killNum: number;
  /** 击杀排序索引 */
  killSortIndex: number;
  /** 击杀时间 */
  killTime: string | null;
  /** 玩家名称 */
  playerName: string;
  /** 分数 */
  score: number;
  /** 顶级保存 */
  @Type(() => ArenaTopSave)
  topSave: ArenaTopSave;
}

/**
 * 竞技场记录实现类
 */
export class ArenaRecord {
  /** 记录对象 */
  @Type(() => ArenaRecordItem)
  obj: Record<string, ArenaRecordItem>;
  /** 排序索引 */
  sortIndex: number;
}

/**
 * 竞技场系统实现类
 */
export class Arena {
  /** 总数量 */
  allNum: number;
  /** 竞技场印记数量 */
  arenaStampNum: number;
  /** 之前排名 */
  before: number;
  /** 可增加数量 */
  canAddNum: number;
  /** 挑战次数 */
  challengeNum: number;
  /** 最大分数 */
  maxScore: number;
  /** 新日阶段 */
  newDayPhase: number;
  /** 当前阶段 */
  nowPhase: number;
  /** 阶段礼物是否领取 */
  phaseGiftB: boolean;
  /** 阶段结束提示是否显示 */
  phaseOverTipB: boolean;
  /** 记录 */
  @Type(() => ArenaRecord)
  record: ArenaRecord;
  /** 分数 */
  score: number;
  /** 赛季失败次数 */
  seasonFailNum: number;
  /** 赛季胜利次数 */
  seasonWinNum: number;
  /** 连胜次数 */
  streakNum: number;
  /** 提示284 */
  tip284: boolean;
  /** 今日次数 */
  todayNum: number;
  /** 顶级名称 */
  topName: string | null;
  /** 顶级设置是否开启 */
  topSetB: boolean;
  /** UID对象 */
  @Type(() => Object)
  uidObj: Record<string, unknown>;
  /** 用户名对象 */
  @Type(() => Object)
  unameObj: Record<string, unknown>;
  /** 胜利次数 */
  winNum: number;
}