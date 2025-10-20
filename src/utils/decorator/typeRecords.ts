import { Transform, plainToClass, plainToInstance } from 'class-transformer';
import { getArmInfo } from '../armsInfo';
import { Arms, ArmsItem } from '@/types/archive/module/arms';

/**
 * [自定义工具] 一个自定义的 class-transformer 装饰器，用于安全地转换 Record<string, T> (字典/哈希表) 类型。
 * 
 * ## 使用原因：
 * 
 * `class-transformer` 原生的 `@Type()` 装饰器在处理 `Record<string, T>` 结构时，
 * 存在一个已知的副作用：它可能会将 `T` 类型的属性名（例如 "killNum", "playerName"）
 * 作为“幽灵键”错误地附加到父对象上。这会导致在使用 `for...in` 或 `Object.keys` 遍历时
 * 产生意外的 `undefined` 值，引发运行时错误。
 * 
 * 本装饰器通过采用一个明确的、手动的转换逻辑，完全绕过了这个有问题的自动化过程，
 * 从而从根源上解决了此问题。
 * 
 * ## 使用方法：
 * 
 * 用法与 `@Type()` 的**目的**类似，但**参数形式不同**。
 * 它直接接收目标类的构造函数作为参数，而不是一个返回构造函数的回调函数。
 * 
 * @example
 * ```typescript
 * import { TypeRecord } from '../../common/decorators/TypeRecord';
 * 
 * // 注意，其中所有添加的单引号用以维持格式预览不错乱，使用时请自行去除。
 * export class MyContainer {
 *   '@Expose()'
 *   '@TypeRecord(MyItem)' // 直接传入类名 MyItem
 *   items: Record<string, MyItem>;
 * 
 *   // 对比原生 '@Type' 的用法:
 *   // '@Type(() => MyItem)'
 *   // otherProperty: MyItem;
 * }
 * ```
 * 
 * @param classType - 字典中值的类构造函数 (例如 `ArenaRecordItem`)。
 * @returns 返回一个可供 class-transformer 使用的属性装饰器。
 */
export function TypeRecord<T>(classType: new (...args: any[]) => T) {
  // 返回一个 @Transform 装饰器，其内部包含了封装好的安全逻辑
  return Transform(({ value, type }) => {
    // 方向 1: 从纯 JS 对象转换为类实例 (plainToClass)
    if (type === 1) { 
      const recordMap: Record<string, T> = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          // 为每一个值调用 plainToClass，将其转换为指定 classType 的实例
          recordMap[key] = plainToClass(classType, value[key]);
        }
      }
      return recordMap;
    }
    
    // 方向 2: 从类实例转换回纯 JS 对象 (classToPlain)
    // class-transformer 的 classToPlain 会自动处理深度转换，可以直接返回原始的 value 对象。
    return value;
    
  }, { toPlainOnly: true, toClassOnly: true });
}


export function EvoArmInfoStartAdd(key:any) {
  return Transform(({ obj }) => {
    const armInfo = getArmInfo(obj.name);
    return (armInfo?.[key]??0 )+ (obj.evoLv ?? 0)
  }, { toClassOnly: true });
}



/**
 * 自动处理 ArmsItem 的 armInfo 数据填充
 * 遍历数组并对每个项目使用 plainToInstance 转换
 */
export function AutoFillArmsInfo() {
  return Transform(({ value }) => {
    // 只在 plainToInstance 时处理
    
    if (!Array.isArray(value)) return value;
    
    // 遍历数组，对每个 ArmsItem 进行转换
    return value.map(item => {
      if (!item || typeof item !== 'object') return item;
      
      const armInfo = getArmInfo(item.name);
      
      // 自动填充缺失的属性
      const filledItem = {
        ...item,
        bulletWidth: item.bulletWidth ?? armInfo.bulletWidth,
        hitType: item.hitType ?? armInfo.hitType ?? '',
        armsType: armInfo.type ?? '',
        bulletSpeed: item.bulletSpeed ?? armInfo.bulletSpeed ?? 0,
        bulletLife: item.bulletLife ?? armInfo.bulletLife ?? 0,
        shootNum: item.shootNum ?? armInfo.shootNum ?? 1,
        bulletNum: item.bulletNum ?? armInfo.bulletNum ?? 1,
        evoMaxLv: item.evoMaxLv ?? armInfo.evoMaxLv ?? 0,
        evoMustFirstLv: armInfo.evoMustFirstLv ?? 0
      };
      return plainToInstance(ArmsItem,filledItem);
    });
  });
}