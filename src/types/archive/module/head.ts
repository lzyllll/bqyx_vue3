import { Type } from 'class-transformer';
import { TimeRecord } from '../base';
import HeadTitlesDict from '@/assets/data/headTitle/headClass.json'
import HeadHonorDict from '@/assets/data/headTitle/headHonor.json'
import { type HeadTitleBonus, type HonorTitleBonus } from '../Bonus';
import { TypeRecord } from '@/utils/decorator/typeRecords';
/**
 * 头像信息实现类
 */
export class HeadInfo {
  index: number;  // 3
  name: string;   // "wantUpgrade"
  getTimeStr: string;    //"2022-06-05 16:49:44"
}

/**
 * 头像实现类
 */
export class Head {
  /** 当前头衔 */
  nowHead: string | null;
  /** 当前索引 */
  nowIndex: number;
  /** 所有头衔的记录 */
  @TypeRecord(HeadInfo)
  obj: Record<string, HeadInfo>;
  
  getCompletedTitleNames(): string[] {
    return Object.values(this.obj).map(item => item?.name || '').filter(name => name)
  }

  /**获取总的头衔分数 */
  getTotalScore(): number {
    var names = this.getCompletedTitleNames()
    var totalScore = 0
    for (var name of names) {
      totalScore += HeadTitlesDict[name]?.['score'] ?? 0
    }
    return totalScore
  }

  /**根据头衔分数，获取荣誉等级加成 */
  getHonorTitleBonus(): HonorTitleBonus {
    var totalScore = this.getTotalScore()
    for (const honor of HeadHonorDict) {
      if (totalScore >= honor.min) {
        return honor.roleBonus || {}
      }
    }
    return {}
  }
  /**根据当前头衔，获取加成 */
  getNowTitleBonus(): HeadTitleBonus {
    return HeadTitlesDict[this.nowHead]?.["roleBonus"] ?? {}
  }
}

/**
 * 头像计数实现类
 */
export class HeadCount {
  /** 武器重制数量 */
  armsRemakeNum: number;
  /** 问答全部正确数量 */
  @Type(() => TimeRecord)
  askAllRightNum: TimeRecord;
  /** 连续登录天数 */
  @Type(() => TimeRecord)
  continuousLoginDay: TimeRecord;
  /** 装备重制数量 */
  equipRemakeNum: number;
  /** 爆头等级数量 */
  headShotLevelNum: number;
  /** 宠物进化数量 */
  petEvoNum: number;
  /** 第一名名称数组 */
  @Type(() => Object)
  topOneNameArr: unknown[];
  /** 载具进化数量 */
  vehicleEvoNum: number;
}