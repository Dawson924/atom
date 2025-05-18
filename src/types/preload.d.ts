import type { MinecraftFolder, ResolvedVersion } from '@xmcl/core';
import type { FabricArtifactVersion, MinecraftVersionList } from '@xmcl/installer';
import type { GameProfileWithProperties, SetTextureOption } from '@xmcl/user';
import type { AccountSession } from '../libs/auth';

export interface ContextWindow {
    api: {
        invoke: (channel: string, ...args: string[]) => Promise<any>,
    },
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
        invalidate: () => Promise<void>,
        setTexture: (option: SetTextureOption) => Promise<void>,
    },
    config: {
        get: (key: string) => Promise<any>,
        set: (key: string, value: any) => Promise<void>,
        delete: (key: string) => Promise<any>,
    },
    launcher: {
        folder: () => Promise<MinecraftFolder>,
        getVersions: () => Promise<ResolvedVersion[]>,
        getVersionManifest: () => Promise<MinecraftVersionList>,
        getFabricArtifacts: () => Promise<FabricArtifactVersion[]>,
        findJava: () => Promise<T['Any']>,
        install: (id: string, version: string) => Promise<void>,
        installTask: (id: string, version: string) => Promise<void>,
        onProcess: (listener: (...args) => void) => void,
        onComplete: (listener: () => void) => void,
        onFailed: (listener: () => void) => void,
        launch: (version: string, javaPath: string) => Promise<void>,
    },
    [context: string]: { [method: string]: (...args) => Promise<any> }
}
