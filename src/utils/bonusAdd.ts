import type { RoleBonus } from "@/types/archive/Bonus";


export function BonusMerge(obj1: RoleBonus, obj2: Partial<RoleBonus>): RoleBonus {
    const result: any = { ...obj1 }; // 先拷贝第一个对象
    // 遍历第二个对象的所有属性
    for (const key in obj2) {

        const value2 = obj2[key];
        if (result.hasOwnProperty(key)) {
            // 如果两个对象都有这个属性，相加
            result[key] = (result[key] as number) + value2;
        } else {
            // 如果只有第二个对象有这个属性，直接赋值
            result[key] = value2;
        }

    }
    return result;
}