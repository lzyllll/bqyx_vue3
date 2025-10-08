
var WHITE = "white"
var GREEN = "green"
var BLUE = "blue"
var PURPLE = "purple"
var ORANGE = "orange"
var RED = "red"
var BLACK = "black"
var DARKGOLD = "darkgold"
var PURGOLD = "purgold"
var YAGOLD = "yagold"


var COLOR_TYPE_ARR = [WHITE, GREEN, BLUE, PURPLE, ORANGE, RED, BLACK, DARKGOLD, PURGOLD, YAGOLD]

export function isDarkgoldOrHigher(level: string): boolean {
    /**
     * 判断给定的等级是否是 DARKGOLD 或更高（即 DARKGOLD, PURGOLD, YAGOLD）
     * @param level 要判断的等级字符串（如 "darkgold", "purgold"）
     * @returns 如果是 DARKGOLD 或更高等级，返回 True；否则返回 False
     */
    const levelLower = level.toLowerCase();  // 转换为小写，避免大小写问题
    
    if (!COLOR_TYPE_ARR.includes(levelLower)) {
        return false;  // 不在等级列表中，直接返回 false
    }

    // 获取 DARKGOLD 的索引，并比较当前等级的索引是否 >= DARKGOLD 的索引
    const darkgoldIndex = COLOR_TYPE_ARR.indexOf(DARKGOLD);
    const currentIndex = COLOR_TYPE_ARR.indexOf(levelLower);

    return currentIndex >= darkgoldIndex;
}