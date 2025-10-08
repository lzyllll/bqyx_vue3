// 根实现类定义 - 包含所有模块的聚合
import { Type } from 'class-transformer';
// 导入所有模块的实现类（稍后会创建）
import { Achieve } from './module/achieve';
import { Active } from './module/active';
import { Arena } from './module/arena';
import { Arms, ArmsBag, ArmsHouse, ArmsTor } from './module/arms';
import { Ask } from './module/ask';
import { Base } from './module/baseInfo';
import { BlackMarket } from './module/blackMarket';
import { BossCard } from './module/bossCard';
import { City } from './module/city';
import { Count } from './module/count';
import { Drop } from './module/drop';
import { Equip, EquipBag, EquipHouse } from './module/equip';
import { Food } from './module/food';
import { GeneBag } from './module/gene';
import { Gift } from './module/gift';
import { Goods } from './module/goods';
import { Guide } from './module/guide';
import { Head, HeadCount } from './module/head';
import { Love } from './module/love';
import { Main } from './module/main';
import { More, MoreBag } from './module/more';
import { Partner } from './module/partner';
import { PartsBag } from './module/parts';
import { Pay } from './module/pay';
import { Peak } from './module/peak';
import { Pet } from './module/pet';
import { Post } from './module/post';
import { Setting } from './module/setting';
import { Skill, SkillBag } from './module/skill';
import { Space } from './module/space';
import { State } from './module/state';
import { Task } from './module/task';
import { ThingsBag } from './module/things';
import { Time } from './module/time';
import { Tower } from './module/tower';
import { Union } from './module/union';
import { Vip } from './module/vip';
import { Wilder } from './module/wilder';
import { WorldMap } from './module/worldMap';

/**
 * 测试数据根实现类，包含所有游戏模块的数据
 * 注意：背包中的某些物品字段可能是可选的（optional）
 */
export class ArchiveData {
  @Type(() => Achieve)
  achieve: Achieve;
  
  @Type(() => Active)
  active: Active;
  
  @Type(() => Arena)
  arena: Arena;
  
  @Type(() => Arms)
  arms: Arms;
  
  @Type(() => ArmsBag)
  armsBag: ArmsBag;
  
  @Type(() => ArmsHouse)
  armsHouse: ArmsHouse;
  
  @Type(() => ArmsTor)
  armsTor: ArmsTor;
  
  @Type(() => Ask)
  ask: Ask;
  
  @Type(() => Base)
  base: Base;
  
  @Type(() => BlackMarket)
  blackMarket: BlackMarket;
  
  @Type(() => BossCard)
  bossCard: BossCard;
  
  @Type(() => City)
  city: City;
  
  @Type(() => Count)
  count: Count;
  
  @Type(() => Drop)
  drop: Drop;
  
  @Type(() => Equip)
  equip: Equip;
  
  @Type(() => EquipBag)
  equipBag: EquipBag;
  
  @Type(() => EquipHouse)
  equipHouse: EquipHouse;
  
  @Type(() => Food)
  food: Food;
  
  @Type(() => GeneBag)
  geneBag: GeneBag;
  
  @Type(() => Gift)
  gift: Gift;
  
  @Type(() => Goods)
  goods: Goods;
  
  @Type(() => Guide)
  guide: Guide;
  
  @Type(() => Head)
  head: Head;
  
  @Type(() => HeadCount)
  headCount: HeadCount;
  /**送礼记录，对话后喜欢与讨厌的记录 */
  @Type(() => Love)
  love: Love;
  /**人物角色主要的属性 */
  @Type(() => Main)
  main: Main;
  /**队友装备，武器什么的 */
  @Type(() => More)
  more: More;
  /**不知道是什么背包 */
  @Type(() => MoreBag)
  moreBag: MoreBag;
  /**队友能力加成 */
  @Type(() => Partner)
  partner: Partner;
  /**零件背包 */
  @Type(() => PartsBag)
  partsBag: PartsBag;
  /**支付信息记录 */
  @Type(() => Pay)
  pay: Pay;
  /**巅峰加成 */
  @Type(() => Peak)
  peak: Peak;
  /**宠物 */
  @Type(() => Pet)
  pet: Pet;
  /**职位 */
  @Type(() => Post)
  post: Post;
  /**设置 */
  @Type(() => Setting)
  setting: Setting;
  /**技能栏 */
  @Type(() => Skill)
  skill: Skill;
  /**技能背包 */
  @Type(() => SkillBag)
  skillBag: SkillBag;
  /**太空 */
  @Type(() => Space)
  space: Space;
  /**不知道 */
  @Type(() => State)
  state: State;
  /**任务 */
  @Type(() => Task)
  task: Task;
  /**物品背包 */
  @Type(() => ThingsBag)
  thingsBag: ThingsBag;
  /**时间 */
  @Type(() => Time)
  time: Time;
  /**虚天塔 */
  @Type(() => Tower)
  tower: Tower;
  /**军队 */
  @Type(() => Union)
  union: Union;
  /**vip */
  @Type(() => Vip)
  vip: Vip;
  /**秘镜 */
  @Type(() => Wilder)
  wilder: Wilder;
  /**世界地图关卡 */
  @Type(() => WorldMap)
  worldMap: WorldMap;
}