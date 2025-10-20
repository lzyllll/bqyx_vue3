/**
 * 武器/装备颜色等级枚举
 */
export enum ColorType {
  WHITE = "white",
  GREEN = "green",
  BLUE = "blue",
  PURPLE = "purple",
  ORANGE = "orange",
  RED = "red",
  BLACK = "black",
  DARKGOLD = "darkgold",
  PURGOLD = "purgold",
  YAGOLD = "yagold"
}

// 颜色类型数组，按等级排序
export const COLOR_TYPE_ARR = [
  ColorType.WHITE, 
  ColorType.GREEN, 
  ColorType.BLUE, 
  ColorType.PURPLE, 
  ColorType.ORANGE, 
  ColorType.RED, 
  ColorType.BLACK, 
  ColorType.DARKGOLD, 
  ColorType.PURGOLD, 
  ColorType.YAGOLD
];

/**
 * 获取颜色等级索引
 * @param color 颜色类型
 * @returns 颜色等级索引，如果未找到返回-1
 */
export function getColorLevel(color: ColorType): number {
  return COLOR_TYPE_ARR.indexOf(color);
}

/**
 * 获取颜色等级名称
 * @param level 等级索引
 * @returns 颜色类型，如果索引无效返回undefined
 */
export function getColorByLevel(level: number): ColorType | undefined {
  return COLOR_TYPE_ARR[level];
}

/**
 * 检查是否为有效颜色
 * @param color 颜色类型
 * @returns 是否为有效颜色
 */
export function isValidColor(color: ColorType): boolean {
  return COLOR_TYPE_ARR.includes(color);
}

/**
 * 判断给定的等级是否是 BLack或者更高
 * @param level 要判断的等级
 * @returns 如果是 BLack 或更高等级，返回 true；否则返回 false
 */
export function isBlackOrMore(level: ColorType): boolean {
  if (!isValidColor(level)) {
    return false; // 不在等级列表中，直接返回 false
  }

  // 获取 DARKGOLD 的索引，并比较当前等级的索引是否 >= DARKGOLD 的索引
  const darkgoldIndex = getColorLevel(ColorType.BLACK);
  const currentIndex = getColorLevel(level);

  return currentIndex >= darkgoldIndex;
}
