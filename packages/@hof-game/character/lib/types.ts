
export interface IAttr
{
	str: number,
	int: number,
	dex: number,
	spd: number,
	luk: number,
}

export interface ICharacterAttrBase extends IAttr
{
	level: number,

	hp: number,
	sp: number,

	maxhp: number,
	maxsp: number,

	M_MAXHP: number,
	P_MAXHP: number,

	M_MAXSP: number,
	P_MAXSP: number,

	P_STR: number,
	P_INT: number,
	P_DEX: number,
	P_SPD: number,
	P_LUK: number,
}

export interface ICharacterAttrCalc
{
	STR: number,
	INT: number,
	DEX: number,
	SPD: number,
	LUK: number,

	HP: number,
	SP: number,

	MAXHP: number,
	MAXSP: number,
}

export interface ICharacter extends ICharacterAttrBase, ICharacterAttrCalc
{
	atk: number[],
	def: number[],

	SPECIAL?: {
		Pierce?: number[]
		Barrier?: boolean,
	}

	isChar: boolean,
}
