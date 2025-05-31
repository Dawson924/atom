import { MinecraftFolder, ResolvedVersion } from '@xmcl/core';
import { invokeHandler } from '../invoke';
import { FabricArtifactVersion, MinecraftVersionList } from '@xmcl/installer';
import { ModVersionFile } from '@xmcl/modrinth';

export const ClientService = {
    getFolder: () => invokeHandler<MinecraftFolder>('client:folder'),
    getPath: (id: string, subpath?: string) => invokeHandler<string>('client:get-path', id, subpath),
    getVersions: () => invokeHandler<ResolvedVersion[]>('client:get-versions'),
    getVersionManifest: () => invokeHandler<MinecraftVersionList>('client:get-version-manifest'),
    getFabricArtifacts: () => invokeHandler<FabricArtifactVersion[]>('client:get-fabric-artifacts'),
    install: (id: string, version: string) => invokeHandler('client:install', id, version),
    installFabric: (id: string, version: string, loaderVersion: string) => invokeHandler('client:install-fabric', id, version, loaderVersion),
    downloadFile: (file: ModVersionFile, path: string) => invokeHandler('client:download-file', file, path),
    launch: (id: string) => invokeHandler('client:launch', id),
};
