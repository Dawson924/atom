// byte.ts

type ByteUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB';
type UnitScale = 1024 | 1000;

const UNIT_POWERS: Record<ByteUnit, number> = {
    'B': 0,
    'KB': 1,
    'MB': 2,
    'GB': 3,
    'TB': 4,
    'PB': 5,
    'EB': 6
};

/**
 * 直接单位转换核心函数
 * @param value 原始数值
 * @param fromUnit 原始单位
 * @param toUnit 目标单位
 * @param scale 进制基准（默认1024）
 * @param precision 结果精度（默认保留2位小数）
 */
export function convertUnits(
    value: number,
    fromUnit: ByteUnit,
    toUnit: ByteUnit,
    scale: UnitScale = 1024
): number {
    const fromPower = UNIT_POWERS[fromUnit];
    const toPower = UNIT_POWERS[toUnit];
    const factor = Math.pow(scale, fromPower - toPower);

    return value * factor;
}

export function convertUnitsPrecise(
    value: number,
    fromUnit: ByteUnit,
    toUnit: ByteUnit,
    scale: UnitScale = 1024,
    precision: number = 1
): number {
    const fromPower = UNIT_POWERS[fromUnit];
    const toPower = UNIT_POWERS[toUnit];
    const factor = Math.pow(scale, fromPower - toPower);

    return precise(value * factor, precision);
}

export function precise(
    value: number,
    fractionDigits: number = 1
): number {
    return parseFloat(value.toFixed(fractionDigits));
}

// 生成快捷方法（按需添加）
export const convertGBtoB = (gb: number, scale?: UnitScale) =>
    convertUnits(gb, 'GB', 'B', scale);

export const convertMBtoKB = (mb: number, scale?: UnitScale) =>
    convertUnits(mb, 'MB', 'KB', scale);
