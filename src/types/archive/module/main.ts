import { Type } from 'class-transformer';

/**
 * 主实现类
 */
export class Main {
  /** 技能数量1 */
  SkillNum1: number;
  /** 技能数量2 */
  SkillNum2: number;
  /** AB27 */
  ab27: string;
  /** AI */
  ai: number;
  /** 周年币 */
  anniCoin: number;
  /** 武器283 */
  arms283: number;
  /** 武器皮肤 */
  @Type(() => Object)
  armsSkin: unknown[];
  /** BP1 */
  @Type(() => Object)
  bP1: unknown[];
  /** 荒芜 */
  barren: number;
  /** 之前 */
  before: string | null;
  /** 书籍对象 */
  @Type(() => Object)
  bookObj: Record<string, unknown>;
  /** BS */
  bs: number;
  /** 更改名称B */
  changeNameB: boolean;
  /** 金币 */
  coin: number;
  /** 每日抽奖 */
  dayLottery: number;
  /** 每日清扫 */
  daySweeping: number;
  /** 删除SS */
  delSS: number;
  /** DEMBS */
  dembs: number;
  /** 礼物18 */
  gift18: boolean;
  /** 女孩技能数量 */
  girlSkillNum: number;
  /** 金铲子 */
  goldSpade: number;
  /** 是否作弊B */
  isZuobiB: boolean;
  /** 最大DP */
  maxDp: number;
  /** 记忆武器 */
  memArms: number;
  /** 零件C */
  partsC: number;
  /** 密码 */
  pass: string | null;
  /** 角色 */
  role: string;
  /** S18 */
  s18: number;
  /** 分数 */
  score: number;
  /** 交换装备B */
  swapEquipB: boolean;
  /** 交换数量 */
  swapNum: number;
  /** T38 */
  t38: boolean;
  /** 十连币 */
  tenCoin: number;
  /** 瘦弱 */
  thin: number;
  /** 今年武器 */
  thisYearArms: boolean;
  /** UP1 */
  @Type(() => Object)
  uP1: unknown[];
  /** UID MD5 */
  uidMd5: string;
  /** 载具返回B */
  vehicleBackB: boolean;
  /** 版本号 */
  versionNumber: number;
  /** 每周武器数组 */
  @Type(() => Object)
  weekArmsArr: unknown[];
  /** WT27B */
  wt27B: boolean;
  /** 年度武器 */
  yearArms: boolean;
  /** 粽子25 */
  zongzi25: number;
  /** 粽子25数量 */
  zongzi25_num: number;
  /** 作弊原因 */
  zuobiReason: string | null;
}