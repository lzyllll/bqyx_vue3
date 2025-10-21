import bulletData from '@/assets/data/arms/bullet.json'



/**
 * 有些非合成武器的bulletNum，width等是一个列表，这个是随机掉落的范围，
 * 所以需要先从存档数据中获取值,如果没有，再从获取，合成武器都是一个值，不是范围
 */
interface BulletAttr{
    evoMustFirstLv?: number
    dpsMul?: number
    aiShootRange?: number
    type?: string
    bulletNum?: number
    shootNum?: number
    bulletLife?: number
    bulletSpeed?: number
    hitType?: string
    bulletWidth?: number
    extraMul?:number,
    uiDpsMul?:number
    evoMaxLv?:number

}
export function getArmInfo(name:string):BulletAttr{
    return bulletData[name]
}



/**
 * 
 * @param name 
 * @returns 如果有extraMul 返回指定，比如猩焰1.5，否则返回1
 */
export function getExtraMul(name:string){
    return (bulletData[name]?.extraMul) ?? 1
}
