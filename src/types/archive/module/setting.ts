import { Type } from 'class-transformer';

/**
 * 按键设置实现类
 */
export class KeySetting {
  /** 数组对象 */
  @Type(() => Object)
  arrObj: Record<string, number[]>;
  /** 类型 */
  type: string;
}

/**
 * 设置按键实现类
 */
export class SettingKey {
  /** 对象 */
  @Type(() => KeySetting)
  obj: Record<string, KeySetting>;
}

/**
 * 设置实现类
 */
export class Setting {
  /** 全部文本 */
  allText: boolean;
  /** 武器过滤 */
  @Type(() => Object)
  armsFilter: Record<string, unknown>;
  /** 武器批量分解颜色数组 */
  @Type(() => String)
  arms_batchDecomposeColorArr: string[];
  /** 武器批量出售颜色数组 */
  @Type(() => String)
  arms_batchSellColorArr: string[];
  /** 自动抽奖B */
  autoLotteryB: boolean;
  /** 自动保存B */
  autoSaveB: boolean;
  /** 血量 */
  blood: number;
  /** Boss生命B */
  bossLifeB: boolean;
  /** 缓冲 */
  buff: boolean;
  /** 关闭鞭炮B */
  closeWhippB: boolean;
  /** 暴击文本 */
  critText: boolean;
  /** 光标 */
  cursor: string;
  /** 梯队B */
  echelonB: boolean;
  /** 无尽B */
  endlessB: boolean;
  /** 装备批量分解颜色数组 */
  @Type(() => String)
  equip_batchDecomposeColorArr: string[];
  /** 装备批量出售颜色数组 */
  @Type(() => String)
  equip_batchSellColorArr: string[];
  /** 前额B */
  fHead: boolean;
  /** 过滤EF */
  filterEF: boolean;
  /** 首选B */
  firstChooseB: boolean;
  /** 字体引导B */
  fontLeadB: boolean;
  /** 帧率 */
  frame: number;
  /** 基因批量分解颜色数组 */
  @Type(() => String)
  gene_batchDecomposeColorArr: string[];
  /** 基因批量出售颜色数组 */
  @Type(() => String)
  gene_batchSellColorArr: string[];
  /** 幽灵教学B */
  ghostTeB: boolean;
  /** 伤害文本 */
  hurtText: boolean;
  /** 按键 */
  @Type(() => SettingKey)
  key: SettingKey;
  /** 登录音乐 */
  loginMu: string;
  /** 主音乐 */
  mainMu: string;
  /** 无地面 */
  noFloor: boolean;
  /** 父母文本 */
  parnText: boolean;
  /** 零件合成最大等级 */
  partsComposeMaxLv: number;
  /** 零件SA B */
  partsSaB: boolean;
  /** 暂停退出B */
  pauseAffterOutB: boolean;
  /** 质量 */
  quality: string;
  /** 屏幕震动 */
  screenShake: number;
  /** 敏感度 */
  sensitivity: number;
  /** 射击震动 */
  shootShake: number;
  /** 简单数字B */
  simpleNumberB: boolean;
  /** 技能特殊B */
  skillSpecialB: boolean;
  /** 喷射文本 */
  spurtingText: boolean;
  /** 真实BossB */
  trueBossB: boolean;
  /** 版本 */
  ver: number;
  /** 音量 */
  volume: number;
}