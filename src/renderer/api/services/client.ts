import { MinecraftFolder, ResolvedVersion } from '@xmcl/core';
import { invokeHandler } from '../invoke';
import { FabricArtifactVersion, MinecraftVersionList } from '@xmcl/installer';
import { ModVersionFile } from '@xmcl/modrinth';

export const ClientService = {
    getFolder: () => invokeHandler<MinecraftFolder>('client:folder'),
    getVersions: () => invokeHandler<ResolvedVersion[]>('client:get-versions'),
    getVersionManifest: () => invokeHandler<MinecraftVersionList>('client:get-version-manifest'),
    getFabricArtifacts: () => invokeHandler<FabricArtifactVersion[]>('client:get-fabric-artifacts'),
    install: (id: string, version: string) => invokeHandler('client:install', id, version),
    installFabric: (id: string, version: string, loaderVersion: string) => invokeHandler('client:install-fabric', id, version, loaderVersion),
    installMod: (id: string, file: ModVersionFile) => invokeHandler('client:install-mod', id, file),
    launch: (id: string) => invokeHandler('client:launch', id),
};
