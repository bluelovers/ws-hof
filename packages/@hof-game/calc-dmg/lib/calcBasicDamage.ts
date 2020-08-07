import { ICharacter, IAttr } from '@hof-game/character/lib/types';

export enum EnumSkillType
{
	/**
	 * 物理
	 */
	base = 0,
	/**
	 * 魔法
	 */
	magic = 1,
}

export interface ISkill
{
	type: EnumSkillType,
	inf?: keyof IAttr,
	pow: number,
}

export interface IOptionsCalcBasicDamage
{
	multiply?: number,
	pierce?: boolean,
}

/**
 * 基本的なダメージ計算(物理or魔法)
 */
export function _CalcBasicDamage(attrValue: number, skillPow: number, equipAtk: number)
{
	let $dmg = Math.sqrt(attrValue) * 10;
	$dmg += equipAtk ?? 0; //装備の物攻
	$dmg *= skillPow / 100;

	return $dmg
}

export function _calcPierce(pierceValue: number, skillPow: number)
{
	return pierceValue * skillPow / 100
}

export function _getSkillAttr($skill: ISkill, $char: ICharacter): number
{
	let inf = $skill.inf ?? $skill.type === EnumSkillType.magic ? 'int' : 'str';

	return $char[inf.toUpperCase()]
}

export function _calcReceiveBasicDamage($dmg: number, $Pierce: number, $skill: ISkill, $char: ICharacter, $target: ICharacter, $option: IOptionsCalcBasicDamage): number
{
	$skill.type |= 0;

	let msg: string[] = []

	// 1回攻撃を防いで0にする。
	if ($target.SPECIAL?.Barrier)
	{
		$target.SPECIAL.Barrier = false;
		msg.push(`Attack has disappeared.`)
		$dmg = 0;
	}

	let $min = $dmg * (1 / 10); //最低保証ダメジ

	//相手の防御力による軽減
	if (!$option?.pierce)
	{
		if ($skill.type === EnumSkillType.base)
		{ //物理
			$dmg *= 1 - $target.def["0"] / 100;
			$dmg -= $target.def["1"];
		}
		else
		{
			//魔法
			$dmg *= 1 - $target.def["2"] / 100;
			$dmg -= $target.def["3"];
		}
	}
	$dmg += $Pierce;
	//ダメージのばらつき
	//$dmg	*= mt_rand(90,110)/100;
	//$dmg	*= mt_rand(90,110)/100;
	//最低ダメージかどうか
	if ($dmg < $min) $dmg = $min;

	$dmg = Math.ceil($dmg);

	if ($target.isChar && $dmg > 20)
	{
		if ($target.HP > 10 && $dmg >= $target.HP)
		{
			$dmg = $target.HP - 1;
		}
		else if ($target.level < 10 && $target.MAXHP < 200)
		{
			$dmg -= Math.max(10, 25 - $target.level);
		}
	}

	return $dmg; //最終ダメージ
}

/**
 * 基本的なダメージ計算式でダメージだけ返す。
 */
export function calcBasicDamage($skill: ISkill, $char: ICharacter, $target: ICharacter, $option?: IOptionsCalcBasicDamage)
{
	let $dmg: number = 0;
	let $Pierce: number = 0;

	let skillAttr = _getSkillAttr($skill, $char);
	let skillType = $skill.type === EnumSkillType.magic ? EnumSkillType.magic : EnumSkillType.base;

	$dmg = _CalcBasicDamage(skillAttr, $skill.pow, $char.atk[skillType]);

	// 追加防御無視ダメージ
	if ($char.SPECIAL?.Pierce?.[skillType])
	{
		$Pierce = _calcPierce($char.SPECIAL.Pierce[skillType], $skill.pow);
	}

	if ($option?.["multiply"]) $dmg *= $option["multiply"];

	return _calcReceiveBasicDamage($dmg, $Pierce, $skill, $char, $target, $option)
}
