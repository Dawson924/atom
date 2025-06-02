import { MinecraftFolder, MinecraftLocation, ResolvedVersion, Version } from '@xmcl/core';
import { InstallJarTask, InstallJsonTask, MinecraftVersion, installDependenciesTask } from '@xmcl/installer';
import { CONFIG } from '../store';
import { getGameProfile, getUserAccount } from './profile.util';
import { IpcMainEvent } from 'electron';
import axios from 'axios';
import { readdir, writeFile } from 'node:fs/promises';
import { resolveJarLocation } from './authlib-injector';

// 安装任务通用处理器类型
export type InstallTaskHandler = {
    onUpdate: (task: { progress: number; total: number }) => void;
    onFailed: () => void;
};

// 安装任务通用处理器
export const createTaskHandler = (
    event: IpcMainEvent,
    name: string,
    id: string,
    version: string
): InstallTaskHandler => ({
    onUpdate: (task) => {
        event.sender.send('on-progress', {
            id,
            version,
            name,
            progress: (task.progress / task.total) * 100,
        });
    },
    onFailed: () => {
        event.sender.send('on-failed', {
            id,
            version,
            name,
        });
    },
});

// 安装基础版本任务
export const installVersionTask = async (
    folder: MinecraftFolder,
    version: MinecraftVersion,
    jsonTask: InstallTaskHandler,
    jarTask: InstallTaskHandler,
    depsTask: InstallTaskHandler,
) => {
    // 安装JSON
    await new InstallJsonTask(version, folder, {})
        .startAndWait(jsonTask);

    // 解析版本
    const parsedVersion = await Version.parse(folder, version.id);
    parsedVersion.id = version.id;

    // 安装JAR
    await new InstallJarTask(parsedVersion, folder, {})
        .startAndWait(jarTask);

    // 写入版本文件
    await writeFile(
        folder.getVersionJson(version.id),
        JSON.stringify(parsedVersion, null, 4)
    );

    // 安装依赖
    await installDependenciesTask(await Version.parse(folder, version.id))
        .startAndWait(depsTask);
};

// 获取启动配置
export const getLaunchOptions = async (location: MinecraftLocation, version: string) => {
    const folder = MinecraftFolder.from(location);
    const authentication = CONFIG.get('authentication');
    const mode = authentication.mode;
    const launchOptions = CONFIG.get('launch');

    // 处理Yggdrasil认证
    if (mode === 'yggdrasil') {
        const response = await axios.get<{ token: string }>(authentication.yggdrasilAgent.server);
        authentication.yggdrasilAgent.prefetched = Buffer.from(JSON.stringify(response.data)).toString('base64');
    }

    // 获取游戏配置
    return {
        resourcePath: folder.root,
        gamePath: folder.getVersionRoot(version),
        version,
        javaPath: launchOptions.runtime.executable,
        gameProfile: getGameProfile(mode),
        memoryOptions: {
            min: launchOptions.runtime.allocatedMemory * 0.5,
            max: launchOptions.runtime.allocatedMemory
        },
        authOptions: {
            userType: mode === 'offline' ? 'legacy' : 'mojang',
            accessToken: getUserAccount().accessToken,
            yggdrasilAgent: mode === 'yggdrasil' ? {
                jar: resolveJarLocation(authentication.yggdrasilAgent.jar),
                server: authentication.yggdrasilAgent.server,
                prefetched: authentication.yggdrasilAgent.prefetched
            } : undefined
        }
    };
};

// 版本处理工具
export const VersionUtils = {
    // 生成继承版本ID
    createInheritVersionId: (baseVersion: string) =>
        `.${Buffer.from(baseVersion).toString('base64')}`,

    // 解析版本ID
    parseVersionId: (id: string) => {
        if (id.startsWith('.')) {
            const rawBase64 = id.slice(1);
            return Buffer.from(rawBase64, 'base64').toString('utf-8');
        }
        return id;
    },

    // 获取所有版本
    listVersions: async (folder: MinecraftFolder): Promise<ResolvedVersion[]> => {
        const versions = await readdir(folder.versions);
        return Promise.all(
            versions.map(async id => {
                if (id.startsWith('.')) return;
                try {
                    const version = await Version.parse(folder, id);
                    return {
                        ...version,
                        minecraftVersion: VersionUtils.parseVersionId(version.minecraftVersion)
                    };
                } catch {
                    return null;
                }
            })
        ).then(list => list.filter(Boolean));
    }
};

// 配置文件操作
export const ConfigUtils = {
    getMinecraftFolder: () => new MinecraftFolder(CONFIG.get('launch.minecraftFolder')),
    getLaunchConfig: () => CONFIG.get('launch')
};
