import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

/**
 * 获取系统对应的.minecraft路径
 */
function getDefaultPath() {
    const platform = os.platform();
    switch (platform) {
    case 'win32':
        return path.join(process.env.APPDATA, '.minecraft');
    case 'darwin':
        return path.join(os.homedir(), 'Library', 'Application Support', 'minecraft');
    default:
        return path.join(os.homedir(), '.minecraft');
    }
}

/**
 * 确保目录存在
 * @param {string} dirPath 目录路径
 */
function ensureDirectory(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true, mode: 0o755 });
    }
}

/**
 * 确保文件存在，可选初始化内容
 * @param {string} filePath 文件路径
 * @param {string} [content=''] 文件内容
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ensureFile(filePath: string, content = '') {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content, { mode: 0o644 });
    }
}

/**
 * 确保.minecraft目录及子结构存在
 */
function setupMinecraftDirectory(minecraftPath: string) {
    // 创建主目录
    ensureDirectory(minecraftPath);

    // 创建子目录
    const requiredDirectories = [
        'versions'
    ];
    requiredDirectories.forEach(dir => {
        ensureDirectory(path.join(minecraftPath, dir));
    });

    // 初始化关键文件
    // ensureFile(
    //     path.join(minecraftPath, 'launcher_profiles.json'),
    //     JSON.stringify({ profiles: {} }, null, 2)
    // );
}

export { setupMinecraftDirectory, getDefaultPath };
