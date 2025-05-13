import { homedir } from 'node:os';

const findStoreDir = () => {
    return `${homedir()}/.config/AtomLauncher`;
};

const findWallpaperPath = (filename: string) => `${findStoreDir}/${filename}`;

export { findStoreDir, findWallpaperPath };
