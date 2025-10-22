// 武器类型枚举与常量集合，以及通用工具方法

// 枚举：武器类型（与旧版常量字符串保持一致）


/**
 * 生肖武器
 */
export var Year_arm_arr = 
  ['yearDragon', 'yearSheep', 'yearTiger']


export enum ArmsType {
  LINE = "line",
  POINT = "point",
  rifle = "rifle",
  sniper = "sniper",
  shotgun = "shotgun",
  pistol = "pistol",
  rocket = "rocket",
  crossbow = "crossbow",
  flamer = "flamer",
  howitzer = "howitzer",
  wavegun = "wavegun",
  laser = "laser",
  lightning = "lightning",
  cutter = "cutter",
  weather = "weather",
  energy = "energy",
  blink = "blink",
  props = "props"
}

// 通用：根据索引安全获取数组元素（越界时返回首/尾元素）
export function getElementLimit<T>(arr: T[], index: number): T {
  if (!arr || arr.length === 0) {
    throw new Error("getElementLimit: empty array");
  }
  if (index < 0) {
    return arr[0];
  }
  if (index > arr.length - 1) {
    return arr[arr.length - 1];
  }
  return arr[index];
}

// 常用类型集合
export const filterArr: ArmsType[] = [
  ArmsType.rifle,
  ArmsType.sniper,
  ArmsType.shotgun,
  ArmsType.pistol,
  ArmsType.rocket,
  ArmsType.laser
];

export const TYPE_ARR: ArmsType[] = [
  ArmsType.rifle,
  ArmsType.sniper,
  ArmsType.shotgun,
  ArmsType.pistol,
  ArmsType.rocket,
  ArmsType.crossbow,
  ArmsType.flamer,
  ArmsType.howitzer,
  ArmsType.wavegun,
  ArmsType.laser,
  ArmsType.lightning,
  ArmsType.weather,
  ArmsType.cutter,
  ArmsType.energy,
  ArmsType.blink,
  ArmsType.props
];

// 中文映射占位（如需可在后续填充）
export const CN_ARR: string[] | null = null;

export const uiArr: ArmsType[] = [
  ArmsType.rifle,
  ArmsType.sniper,
  ArmsType.shotgun,
  ArmsType.pistol,
  ArmsType.rocket,
  ArmsType.crossbow,
  ArmsType.flamer
];

export const NORMAL_TYPE_ARR: ArmsType[] = [
  ArmsType.rifle,
  ArmsType.sniper,
  ArmsType.shotgun,
  ArmsType.pistol,
  ArmsType.rocket
];

export const nocomArr: ArmsType[] = [
  ArmsType.rifle,
  ArmsType.sniper,
  ArmsType.pistol,
  ArmsType.crossbow,
  ArmsType.howitzer,
  ArmsType.wavegun,
  ArmsType.weather,
  ArmsType.cutter,
  ArmsType.lightning,
  ArmsType.flamer,
  ArmsType.energy
];

export const otherArr: ArmsType[] = [
  ArmsType.howitzer,
  ArmsType.wavegun,
  ArmsType.lightning,
  ArmsType.cutter,
  ArmsType.weather,
  ArmsType.energy,
  ArmsType.blink
];

export const onlyOneArr: ArmsType[] = [
  ArmsType.lightning,
  ArmsType.cutter,
  ArmsType.wavegun
];

export const highSpeedArr: ArmsType[] = [
  ArmsType.rifle,
  ArmsType.pistol,
  ArmsType.flamer,
  ArmsType.energy
];

export const lockAllSpecialArr: ArmsType[] = [
  ArmsType.howitzer,
  ArmsType.wavegun,
  ArmsType.laser,
  ArmsType.lightning,
  ArmsType.weather,
  ArmsType.cutter,
  ArmsType.energy,
  ArmsType.blink,
  ArmsType.props
];

export const penetrationNumMore5Arr: ArmsType[] = [
  ArmsType.flamer,
  ArmsType.wavegun,
  ArmsType.weather,
  ArmsType.cutter,
  ArmsType.laser,
  ArmsType.blink
];

export const penetrationNumMore5NameArr: string[] = [
  "greedySnake",
  "flySnake"
];

export const armsSpeed_jie: ArmsType[] = [
  ArmsType.rocket,
  ArmsType.crossbow,
  ArmsType.sniper,
  ArmsType.cutter,
  ArmsType.energy,
  ArmsType.rocket,
  ArmsType.crossbow
];

export const armsSpeed_jieHurt: ArmsType[] = [
  ...armsSpeed_jie,
  ArmsType.flamer
];

export const ID_ARR: string[] = [
  "01","02","03","04","05","06","07","08",
  "09","10","11","12","13","14","15","16"
];

// 类型容量倍数数组，对应 TYPE_ARR 顺序
export const CapacityMul_arr: number[] = [
  4, 1, 1, 2, 1, 2, 7, 0.1, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 1
];

// 攻击间隔加成映射
export const AttackGapAddMap: Record<string, number> = {
  [ArmsType.rifle]: 0.7,
  [ArmsType.flamer]: 0.5,
  [ArmsType.laser]: 0,
  [ArmsType.weather]: 0.2
};

// 根据武器类型获取攻击间隔加成
export function getAttackGapAdd(type: string): number {
  return AttackGapAddMap[type] ?? 1;
}

// 根据武器类型获取容量倍数
export function getCapacityMulByType(type: string): number {
  const typeIndex = TYPE_ARR.indexOf(type as any);
  return getElementLimit(CapacityMul_arr, typeIndex);
}

// 根据武器类型获取重装间隔倍数
export function getReloadGapMul(type0: string): number {
  if (type0 === ArmsType.weather) {
    return 0.5;
  }
  if (type0 === ArmsType.howitzer) {
    return 0.5;
  }
  return 1;
}

//精准度Mul 根据武器类型
export function getAngleMul(type:string){
  if(type == ArmsType.shotgun){
    return 0.3
  }
  return 1
}