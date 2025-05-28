import type { MinecraftFolder, ResolvedVersion } from '@xmcl/core';
import type { FabricArtifactVersion, MinecraftVersionList } from '@xmcl/installer';
import type { GameProfileWithProperties, SetTextureOption } from '@xmcl/user';
import type { UserSession } from './auth';
import type { IPCResponse } from '../libs/response';

export interface ContextWindow {
    api: {
        invoke: <T = any>(channel: string, ...args: any[]) => Promise<IPCResponse<T> | T>,
        onProcess: (listener: (...args) => void) => void,
        onComplete: (listener: () => void) => void,
        onFailed: (listener: () => void) => void,
        removeListeners: (channel: string) => void,
    },
    app: {
        close: () => void,
        minimize: () => void,
        maximize: () => void,
        openDevTools: (mode: 'left' | 'right' | 'bottom' | 'undocked' | 'detach' = 'right') => void
    },
    auth: {
        login: ({ username, password }: {
            username: string;
            password: string;
        }) => Promise<void>,
        lookup: (uuid: string) => Promise<GameProfileWithProperties>,
        session: () => Promise<UserSession>,
        invalidate: () => Promise<void>,
        setTexture: (option: SetTextureOption) => Promise<void>,
    },
    cache: {
        get: (key: string) => Promise<any>,
        set: (key: string, value: any) => Promise<void>,
        delete: (key: string) => Promise<any>,
    },
    client: {
        folder: () => Promise<MinecraftFolder>,
        getVersions: () => Promise<ResolvedVersion[]>,
        getVersionManifest: () => Promise<MinecraftVersionList>,
        getFabricArtifacts: () => Promise<FabricArtifactVersion[]>,
        findJava: () => Promise<T['Any']>,
        install: (id: string, version: string) => Promise<void>,
        installTask: (id: string, version: string) => Promise<void>,
        installFabric: (id: string, version: string, loaderVersion: string) => Promise<string>,
        onProcess: (listener: (...args) => void) => void,
        onComplete: (listener: () => void) => void,
        onFailed: (listener: () => void) => void,
        removeListeners: (channel: string) => void,
        launch: (version: string, javaPath: string) => Promise<void>,
    },
    config: {
        get: (key: string) => Promise<any>,
        set: (key: string, value: any) => Promise<void>,
        delete: (key: string) => Promise<any>,
    },
    [context: string]: { [method: string]: (...args) => Promise<any> }
}
