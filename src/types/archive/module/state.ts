import { Type } from 'class-transformer';

/**
 * 状态实现类
 */
export class State {
  /** 对象 */
  @Type(() => Object)
  obj: Record<string, unknown>;
}