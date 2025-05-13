import type { MinecraftFolder, ResolvedVersion } from '@xmcl/core';
import type { MinecraftVersionList } from '@xmcl/installer';

export interface ContextWindow {
    app: {
        close: () => void,
        openDevTools: (mode: 'left' | 'right' | 'bottom' | 'undocked' | 'detach' = 'right') => void
    },
    store: {
        get: (key: string) => Promise<any>,
        set: (key: string, value: any) => Promise<void>,
        delete: (key: string) => Promise<any>,
    },
    launcher: {
        folder: () => Promise<MinecraftFolder>,
        getVersions: () => Promise<ResolvedVersion[]>,
        getVersionManifest: () => Promise<MinecraftVersionList>,
        findJava: () => Promise<T['Any']>,
        install: (version: string) => Promise<void>,
        installTask: (version: string) => Promise<void>,
        onProcess: (listener: (...args) => void) => void,
        onComplete: (listener: () => void) => void,
        onFailed: (listener: () => void) => void,
        launch: (version: string, javaPath: string) => Promise<void>,
    },
    [context: string]: { [method: string]: (...args) => Promise<any> }
}
