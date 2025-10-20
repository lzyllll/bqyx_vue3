import evoData from '@/assets/data/arms/evo.json';
//注意 数字需要/100 比如   90变为0.9

/**
 * 获取进化倍数
 * @param evoLv 进化等级 (0-16)
 * @returns 进化倍数，如果等级无效返回1
 */
export function getEvoMul(evoLv: number): number {
  if (evoLv < 0 || evoLv >= evoData.hurtMulEvoArr.length) {
    return 1; // 等级无效时返回1
  }
  return evoData.hurtMulEvoArr[evoLv] / 100; // 转换为倍数形式
}


