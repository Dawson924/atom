import path from 'node:path';
import { CONFIG } from '../../services/storage';
import fs from 'node:fs';
import axios from 'axios';

const DEFAULT_ARTIFACT_URL = 'https://authlib-injector.yushi.moe/artifact/latest.json';
const DEFAULT_FILE_NAME = 'authlib-injector.jar';

const resolveJarLocation = (jar?: string) => {
    if (jar && path.isAbsolute(jar))
        return jar;
    if (!jar) {
        return path.join(CONFIG.get('launch.minecraftFolder'), DEFAULT_FILE_NAME);
    }
    return path.join(CONFIG.get('launch.minecraftFolder'), jar);
};

const downloadJar = async (jar: string): Promise<void> => {
    if (!path.isAbsolute(jar))
        throw new Error('Must be absolute path');

    if (fs.existsSync(jar))
        return;

    try {
        const latestArtifact = (await axios.get<Tentative>(DEFAULT_ARTIFACT_URL)).data;
        const response = await axios<Tentative>({
            method: 'get',
            url: latestArtifact.download_url,
            responseType: 'stream'
        });
        const writer = fs.createWriteStream(jar);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`file downloaded: ${jar}`);
                resolve();
            });
            writer.on('error', reject);
        });
    } catch (err: any) {
        console.error(err.message);
    }
};

export { resolveJarLocation, downloadJar };
export { DEFAULT_FILE_NAME };
