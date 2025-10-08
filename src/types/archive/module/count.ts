import { Type } from 'class-transformer';

/**
 * 计数实现类
 */
export class Count {
  /** 黑市最大数量 */
  blackMarketMaxNum: number;
  /** Boss无橙装次数 */
  bossNoOrangeNum: number;
  /** 子弹数量 */
  bulletNum: number;
  /** 魅惑最大数量 */
  charmMaxNum: number;
  /** 死亡数量 */
  dieNum: number;
  /** 双倍在线时间 */
  doubleOnlineTime: number;
  /** 掉落武器数量 */
  dropArmsNum: number;
  /** 掉落装备数量 */
  dropEquipNum: number;
  /** 滑翔时间 */
  glidingTime: number;
  /** 是否受伤 */
  hurtB: boolean;
  /** 远视最大倍数 */
  hyperopiaMaxMul: number;
  /** 击杀Boss数量 */
  killBossNum: number;
  /** 击杀Boss名称数组 */
  @Type(() => String)
  killKingNameArr: string[];
  /** 击杀数量 */
  killNum: number;
  /** 等级在线时间 */
  levelOnlineTime: number;
  /** 抽奖全橙装次数 */
  lotteryAllOrangeNum: number;
  /** 抽奖代币 */
  lotteryCoin: number;
  /** 最大坠落高度 */
  maxFallHigh: number;
  /** 最大坠落值 */
  maxFallValue: number;
  /** 最大飞行高度 */
  maxFlyHigh: number;
  /** 最大Boss等级 */
  maxKingLevel: number;
  /** 导弹最大数量 */
  moreMissileMaxNum: number;
  /** 近视最大倍数 */
  myopiaMaxMul: number;
  /** 普通等级数量 */
  normalLevelNum: number;
  /** 是否一血 */
  oneHB: boolean;
  /** 在线时间 */
  onlineTime: number;
  /** 20级在线时间 */
  onlineTime20: number;
  /** 翻滚次数 */
  rollNum: number;
  /** 技能礼物数量 */
  skillGiftNum: number;
  /** 任务5名称数组 */
  @Type(() => String)
  task5NameArr: string[];
  /** 今日竞技场次数 */
  todayArenaNum: number;
  /** 今日竞技场印记 */
  todayArenaStamp: number;
  /** 今日功勋卡 */
  todayExploitCards: number;
  /** 今日击杀敌人数量 */
  todayKillEnemyNum: number;
  /** 今日技能石数量 */
  todaySkillStoneNum: number;
  /** 今日强化次数 */
  todayStrengthNum: number;
  /** 今日工会贡献 */
  todayUnionContribution: number;
  /** 今日使用金钱 */
  todayUseMoney: number;
  /** 载具击杀数量 */
  vehicleKillNum: number;
  /** 武器击杀数量 */
  weaponKillNum: number;
}