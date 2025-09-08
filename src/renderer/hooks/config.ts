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

// 自定义 Hook 管理配置
export const useAppearanceConfig = () => {
    const [config, setConfig] = useState<ConfigState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 获取配置
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

    // 更新配置
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

type LaunchConfig = {
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

export const useLaunchConfig = () => {
    // 状态管理
    const [config, setConfig] = useState<LaunchConfig>({
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

    // 内存单位转换工具函数（可提取到 utils）
    const convertByteToGB = (bytes: number) => convertUnitsPrecise(bytes, 'B', 'GB', 1024, 1);
    const convertGBToMB = (gigabytes: number) => convertUnitsPrecise(gigabytes, 'GB', 'MB', 1024, 0);

    // 加载配置
    const loadConfig = useCallback(async () => {
        try {
            setLoading(true);
            const [
                minecraftFolder,
                javaPath,
                allocatedMemoryMB, // 假设接口返回 MB
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

            // 统一转换单位
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
            setError(`加载配置失败：${(err as Error).message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    // 更新配置（支持批量更新）
    const updateConfig = useCallback(
        (updates: Partial<LaunchConfig>) => {
            const newConfig = { ...config, ...updates };
            setConfig(newConfig);
            // 批量提交到服务端（示例：仅更新变化的字段）
            Object.entries(updates).forEach(([key, value]) => {
                if (key === 'allocatedMemory') {
                    // 特殊处理内存单位转换
                    ConfigService.set('launch.runtime.allocatedMemory', convertGBToMB(value as number));
                } else {
                    ConfigService.set(`launch.${key}`, value as string);
                }
            });
        },
        [config]
    );

    // 实时更新内存使用（添加防抖优化）
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
        const interval = setInterval(updateMemoryUsage, 1000); // 每秒尝试更新（通过防抖减少实际调用）
        return () => {
            clearInterval(interval);
            updateMemoryUsage.cancel(); // 清理防抖
        };
    }, [loadConfig, updateMemoryUsage]);

    return { config, memory, loading, error, updateConfig };
};
