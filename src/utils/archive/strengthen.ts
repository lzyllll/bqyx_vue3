

import strengthenTable from '@/assets/data/arms/strengthen.json'

/**
 * 
 * @param lv 
 * @returns rate :比如0.10
 */
export function getAddMulStrengthen(lv:number){
    // console.log('lv:',lv)
    // console.log('addMul27:',strengthenTable['addMul'][27])
    // console.log('addMul28:',strengthenTable['addMul'][28])
    // console.log(`addMul${lv}:`,strengthenTable['addMul'][lv])
    return strengthenTable['addMul'][Math.min(lv,30)]
}