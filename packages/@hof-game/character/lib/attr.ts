import { ICharacterAttrBase, ICharacter, ICharacterAttrCalc } from './types';

export function _calcHPSP(sp: number, M_MAXSP: number, P_MAXSP: number)
{
	let $sp = +sp * (1 + (+(M_MAXSP ?? 0) / 100)) + (+(P_MAXSP ?? 0));

	return Math.round($sp);
}

export function _calcAttrBase(value: number | string, plus: number | string)
{
	return +value + (+(plus ?? 0));
}

export function calcAttributes<T extends ICharacterAttrCalc>($base: ICharacterAttrBase, $this?: T)
{
	$this ??= {} as T;

	$this.MAXHP = _calcHPSP($base.maxhp, $base.M_MAXHP, $base.P_MAXHP);

	$this.HP = _calcHPSP($base.hp, $base.M_MAXHP, $base.P_MAXHP);

	$this.MAXSP = _calcHPSP($base.maxsp, $base.M_MAXSP, $base.P_MAXSP);

	$this.SP = _calcHPSP($base.sp, $base.M_MAXSP, $base.P_MAXSP);

	$this.HP = Math.min($this.HP, $this.MAXHP);
	$this.SP = Math.min($this.HP, $this.MAXHP);

	$this.STR = _calcAttrBase($base.str, $base.P_STR);
	$this.INT = _calcAttrBase($base.int, $base.P_INT);
	$this.DEX = _calcAttrBase($base.dex, $base.P_DEX);
	$this.SPD = _calcAttrBase($base.spd, $base.P_SPD);
	$this.LUK = _calcAttrBase($base.luk, $base.P_LUK);

	return $this
}
