import type { MinecraftFolder, ResolvedVersion } from '@xmcl/core';
import type { MinecraftVersionList } from '@xmcl/installer';
import { GameProfileWithProperties } from '@xmcl/user';
import { AccountSession } from '../libs/auth';

export interface ContextWindow {
    app: {
        close: () => void,
        openDevTools: (mode: 'left' | 'right' | 'bottom' | 'undocked' | 'detach' = 'right') => void
    },
    auth: {
        login: ({ username, password }: {
            username: string;
            password: string;
        }) => Promise<void>,
        lookup: (uuid: string) => Promise<GameProfileWithProperties>,
        session: () => Promise<AccountSession>,
        invalidate: () => Promise<void>
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
