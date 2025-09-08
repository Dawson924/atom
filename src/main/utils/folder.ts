import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { DEFAULT_FILE_NAME, downloadJar } from './authlib-injector';
import { MinecraftFolder } from '@xmcl/core';
import { findStoreDir } from './path';

/**
 * 获取系统对应的.minecraft路径
 */
function getDefaultPath() {
    const platform = os.platform();
    switch (platform) {
    case 'win32':
        return path.join(process.env.APPDATA || '', '.minecraft');
    case 'darwin':
        return path.join(os.homedir(), 'Library', 'Application Support', 'minecraft');
    default:
        return path.join(os.homedir(), '.minecraft');
    }
}

/**
 * 异步确保目录存在
 */
async function ensureDirectory(dirPath: string) {
    try {
        await fs.access(dirPath);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await fs.mkdir(dirPath, {
                recursive: true,
                mode: 0o755 // 注意：Windows 会忽略 mode
            });
        } else {
            throw error;
        }
    }
}

/**
 * 异步确保.minecraft目录及子结构存在
 */
async function setupMinecraftDirectory(dir?: string) {
    const minecraftPath = dir ?? getDefaultPath();

    // 创建主目录
    await ensureDirectory(minecraftPath);

    // 创建子目录
    const requiredDirectories = ['versions'];
    for (const dir of requiredDirectories) {
        await ensureDirectory(path.join(minecraftPath, dir));
    }

    await downloadJar(path.join(findStoreDir(), DEFAULT_FILE_NAME));

    return MinecraftFolder.from(minecraftPath);
}

export { setupMinecraftDirectory, getDefaultPath };
