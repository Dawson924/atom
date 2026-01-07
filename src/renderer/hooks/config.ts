import { convertUnitsPrecise } from '@common/utils/byte';
import { ConfigService, SystemService } from '@renderer/api';
import { debounce, set } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

export type ConfigState = {
    language: string;
    theme: string;
    window: {
        title: string,
        size: {
            width: number,
            height: number
        }
    },
    animation: { effect: boolean }
};

export const useConfig = () => {
    const [config, setConfig] = useState<ConfigState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadConfig = useCallback(async () => {
        try {
            setLoading(true);
            const [language, theme, window, animation] = await Promise.all([
                ConfigService.get('appearance.language'),
                ConfigService.get('appearance.theme'),
                ConfigService.get('appearance.window'),
                ConfigService.get('appearance.animation'),
            ]);
            setConfig({ language, theme, window, animation });
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateConfig = useCallback(
        async (key: keyof ConfigState | string, value: any) => {
            try {
                await ConfigService.set(`appearance.${key}`, value);
                setConfig(prev => {
                    if (!prev) return null;
                    const newConfig = { ...prev };
                    set(newConfig, key, value);
                    return newConfig;
                });
            } catch (err) {
                setError((err as Error).message);
            }
        },
        []
    );

    useEffect(() => {
        loadConfig();
    }, [loadConfig]);

    return { config, loading, error, updateConfig };
};

type LaunchOptions = {
    minecraftFolder: string;
    javaPath: string;
    jvmArgs: string;
    mcArgs: string;
    allocatedMemory: number; // GB
};

type MemoryInfo = {
    total: number; // GB
    usage: number; // GB
};

export const useLaunchOptions = () => {
    const [config, setConfig] = useState<LaunchOptions>({
        minecraftFolder: '',
        javaPath: '',
        jvmArgs: '',
        mcArgs: '',
        allocatedMemory: 0,
    });
    const [memory, setMemory] = useState<MemoryInfo>({
        total: 0,
        usage: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const convertByteToGB = (bytes: number) => convertUnitsPrecise(bytes, 'B', 'GB', 1024, 1);
    const convertGBToMB = (gigabytes: number) => convertUnitsPrecise(gigabytes, 'GB', 'MB', 1024, 0);

    const loadConfig = useCallback(async () => {
        try {
            setLoading(true);
            const [
                minecraftFolder,
                javaPath,
                allocatedMemoryMB,
                jvmArgs,
                mcArgs,
                totalMemoryBytes,
                memoryUsageBytes,
            ] = await Promise.all([
                ConfigService.get<string>('launch.folder'),
                ConfigService.get<string>('launch.runtime.executable'),
                ConfigService.get<number>('launch.runtime.allocatedMemory'),
                ConfigService.get<string>('launch.extraArguments.jvm'),
                ConfigService.get<string>('launch.extraArguments.mc'),
                SystemService.totalMemory(),
                SystemService.memoryUsage(),
            ]);

            const allocatedMemoryGB = convertUnitsPrecise(allocatedMemoryMB, 'MB', 'GB');
            const totalMemoryGB = convertByteToGB(totalMemoryBytes);
            const memoryUsageGB = convertByteToGB(memoryUsageBytes);

            setConfig({
                minecraftFolder,
                javaPath,
                jvmArgs,
                mcArgs,
                allocatedMemory: allocatedMemoryGB,
            });
            setMemory({ total: totalMemoryGB, usage: memoryUsageGB });
        } catch (err) {
            setError(`${(err as Error).message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateConfig = useCallback(
        (updates: Partial<LaunchOptions>) => {
            const newConfig = { ...config, ...updates };
            setConfig(newConfig);
            Object.entries(updates).forEach(([key, value]) => {
                if (key === 'allocatedMemory') {
                    ConfigService.set('launch.runtime.allocatedMemory', convertGBToMB(value as number));
                } else {
                    ConfigService.set(`launch.${key}`, value as string);
                }
            });
        },
        [config]
    );

    const updateMemoryUsage = useCallback(
        debounce(async () => {
            try {
                const usageGB = convertByteToGB(await SystemService.memoryUsage());
                setMemory(prev => ({ ...prev, usage: usageGB }));
            } catch (err) {
                setError(`更新内存失败：${(err as Error).message}`);
            }
        }, 500), // 防抖 500ms
        []
    );

    useEffect(() => {
        loadConfig();
        const interval = setInterval(updateMemoryUsage, 1000);
        return () => {
            clearInterval(interval);
            updateMemoryUsage.cancel(); // 清理防抖
        };
    }, [loadConfig, updateMemoryUsage]);

    return { config, memory, loading, error, updateConfig };
};
