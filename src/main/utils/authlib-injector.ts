import path from 'node:path';
import { CONFIG } from '../store';
import fs from 'node:fs';
import { request } from 'undici';

const DEFAULT_ARTIFACT_URL = 'https://authlib-injector.yushi.moe/artifact/latest.json';
const DEFAULT_FILE_NAME = 'authlib-injector.jar';

const resolveJarLocation = (jar?: string) => {
    if (jar && path.isAbsolute(jar))
        return jar;
    if (!jar) {
        return path.join(CONFIG.get('launch.folder'), DEFAULT_FILE_NAME);
    }
    return path.join(CONFIG.get('launch.folder'), jar);
};

const downloadJar = async (jar: string): Promise<void> => {
    if (!path.isAbsolute(jar))
        throw new Error('Must be absolute path');

    if (fs.existsSync(jar))
        return;

    try {
        // 获取最新版本信息
        const artifactResponse = await request(DEFAULT_ARTIFACT_URL);
        if (artifactResponse.statusCode !== 200) {
            throw new Error(`Unable to request: ${artifactResponse.statusCode}`);
        }
        const latestArtifact = await artifactResponse.body.json() as Tentative;

        // 下载JAR文件
        const downloadResponse = await request(latestArtifact.download_url);
        if (downloadResponse.statusCode !== 200) {
            throw new Error(`Unable to request: ${downloadResponse.statusCode}`);
        }

        const writer = fs.createWriteStream(jar);
        downloadResponse.body.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`file downloaded at: ${jar}`);
                resolve(null);
            });
            writer.on('error', reject);
        });
    } catch (err: any) {
        console.error('[ERROR]:', err.message);
        throw err;
    }
};

export { resolveJarLocation, downloadJar };
export { DEFAULT_FILE_NAME };