import { safeLoad } from 'js-yaml';
import { calcAttributes } from '@hof-game/character/lib/attr';
import { calcBasicDamage } from '../lib/calcBasicDamage';

describe(`describe`, () =>
{

	test(`test`, () =>
	{
		const input = safeLoad(`no: 1000
name: GoblinAxe
img: mon_053
level: 1
maxhp: 140
hp: 140
maxsp: 80
sp: 80
str: 8
int: 3
dex: 5
spd: 5
luk: 1
special: {  }
atk:
    - 20
    - 10
def:
    - 10
    - 3
    - 5
    - 0
info:
    desc: SPがあるときは、強い攻撃をたまにしてくる程度。
reward:
    moneyhold: '40'
    itemtable:
        6000: '1000'
        6001: '1000'
        6002: '600'
        6003: '200'
        7100: '100'
    exphold: '20'
behavior:
    guard: life75
    pattern:
        -
            judge: 1940
            quantity: 50
            action: 9000
        -
            judge: 1205
            quantity: 40
            action: 1017
        -
            judge: 1000
            quantity: 0
            action: 1000
`) as any;

		let attr = calcAttributes(input, input);

		let skill = safeLoad(`no: 1000
name: Attack
img: skill_042
exp: 通常攻撃
sp: 0
type: 0
learn: 0
target:
    - enemy
    - individual
    - 1
pow: 100
`) as any

		let actual = calcBasicDamage(skill, attr, attr);

		expect(actual).toMatchSnapshot();

	});

})
