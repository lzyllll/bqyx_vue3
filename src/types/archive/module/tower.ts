import { Type } from 'class-transformer';
import { SaveObject } from '../base';
import { type RoleBonus } from '../Bonus';
import { PercentNum } from '@/utils/percent';

/**
 * 虚天塔实现类
 */
export class Tower {
  /** BLV */
  blv: number;
  /** DO */
  @Type(() => SaveObject)
  dO: SaveObject<unknown>;
  /** GO */
  @Type(() => SaveObject)
  gO: SaveObject<unknown>;
  /** NG */
  ng: string | null;
  /** P0 */
  @Type(() => SaveObject)
  p0: SaveObject<unknown>;
  /** P1 */
  @Type(() => SaveObject)
  p1: SaveObject<unknown>;
  /** P2 */
  @Type(() => SaveObject)
  p2: SaveObject<unknown>;
  /** 当前P */
  pNow: string;
  /** 全部U */
  uAll: number;
  /** UP */
  uP: number;
  /** 无尽等级 */
  unendLv: number;
  /** WS */
  ws: boolean;

  /** 根据虚天塔层数，获取全体战力加成 每级0.3%*/
  getRoleBonus():Pick<RoleBonus,'dpsWhole'| 'ranBlackArmsDropPro'>{
    return {
      dpsWhole:this.unendLv * PercentNum(0.03),
      ranBlackArmsDropPro:this.unendLv * PercentNum(1)
    }

  }
}