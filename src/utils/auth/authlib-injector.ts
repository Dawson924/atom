import path from 'node:path';
import { CONFIG } from '../../services/storage';

const DEFAULT_FILE_NAME = 'authlib-injector.jar';

const resolveJarLocation = (jar?: string) => {
    if (jar && path.isAbsolute(jar))
        return jar;
    if (!jar) {
        return path.join(CONFIG.get('launcher.minecraftFolder'), DEFAULT_FILE_NAME);
    }
    return path.join(CONFIG.get('launcher.minecraftFolder'), jar);
};

export { resolveJarLocation };
export { DEFAULT_FILE_NAME };
