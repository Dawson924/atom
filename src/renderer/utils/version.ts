import { ResolvedVersion } from '@xmcl/core';

const mainClassNameMap: Record<string, any> = {
    'net.minecraft.client.main.Main': 'minecraft',
    'net.fabricmc.loader.impl.launch.knot.KnotClient': 'fabric',
} as const;

export const getVersionLoader = (version: ResolvedVersion): string => {
    if (!version || !version.mainClass) return null;
    return mainClassNameMap[version.mainClass] || null;
};
