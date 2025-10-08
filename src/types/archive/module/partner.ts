import { Type } from 'class-transformer';
import { SaveObject } from '../base';

/**
 * 队友AI实现类
 */
export class PartnerAI {
  /** 对象 */
  @Type(() => Object)
  obj: Record<string, unknown>;
}

/**
 * 队友实现类
 */
export class Partner {
  /** 能力 */
  @Type(() => SaveObject)
  ability: SaveObject<unknown>;
  /** AI数组 */
  @Type(() => PartnerAI)
  aiArr: PartnerAI[];
  /** AI索引 */
  aiIndex: number;
  /** 每日功勋 */
  dayExploit: number;
  /** 功勋 */
  exploit: number;
}