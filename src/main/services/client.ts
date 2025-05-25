import { launch, LaunchOption, MinecraftFolder, Version } from '@xmcl/core';
import { getFabricLoaderArtifact, getFabricLoaders, getVersionList, installDependenciesTask, installFabricByLoaderArtifact, type FabricArtifactVersion, type MinecraftVersionList } from '@xmcl/installer';
import { CONFIG } from './store';
import { IpcMainEvent } from 'electron';
import { createTaskHandler, getLaunchOptions, installVersionTask, VersionUtils } from '../utils/client.util';
import { data, error, ERROR_CODES } from '../libs/response';
import { findJava } from '../utils/java';

export class ClientService {
    private minecraftFolder: MinecraftFolder;
    private versionManifest: MinecraftVersionList;
    private fabricArtifacts: FabricArtifactVersion[];

    async getFolder() {
        return data(this.minecraftFolder);
    }

    async findVersions() {
        return data(await VersionUtils.listVersions(this.minecraftFolder));
    }

    async fetchVersionManifest() {
        if (!this.versionManifest)
            this.versionManifest = await getVersionList();

        return data(this.versionManifest);
    }

    async fetchFabricArtifact() {
        if (!this.fabricArtifacts)
            this.fabricArtifacts = await getFabricLoaders();

        return data(this.fabricArtifacts);
    }

    async findJava() {
        return new Promise((ok, no) => {
            findJava((err, res) => {
                if (err) no(error(ERROR_CODES.INTERNAL_ERROR));
                ok(data(res));
            });
        });
    }

    async install(event: IpcMainEvent, id: string, version: string) {
        const handler = createTaskHandler(event, 'install', 'Install', id, version);
        const versionInfo = await this.resolveVersion(version);
        versionInfo.id = id;

        await installVersionTask(
            this.minecraftFolder,
            versionInfo,
            handler
        );

        event.sender.send('on-complete');

        return data();
    }

    async installFabric(event: IpcMainEvent, id: string, version: string, loaderVersion: string) {
        const baseHandler = createTaskHandler(event, 'install', 'Downloading Minecraft', id, version);
        const fabricHandler = createTaskHandler(event, 'install-fabric', 'Downloading Fabric-Loader', id, version);

        // 安装基础版本
        const inheritor = VersionUtils.createInheritVersionId(version);
        const mcInfo = await this.resolveVersion(version);
        mcInfo.id = inheritor;
        await installVersionTask(this.minecraftFolder, mcInfo, baseHandler);

        // 安装Fabric
        const fabricVersionName = await installFabricByLoaderArtifact(
            await getFabricLoaderArtifact(version, loaderVersion),
            this.minecraftFolder,
            { versionId: id, inheritsFrom: inheritor }
        );

        // 安装依赖
        await installDependenciesTask(await Version.parse(this.minecraftFolder, fabricVersionName))
            .startAndWait(fabricHandler);

        event.sender.send('on-complete');

        return data();
    }

    async launch(_: IpcMainEvent, id: string) {
        const options = await getLaunchOptions(this.minecraftFolder, id);
        await launch({
            ...options,
            minMemory: options.memoryOptions.min,
            maxMemory: options.memoryOptions.max,
            ...options.authOptions,
            extraExecOption: {
                detached: true
            }
        } as LaunchOption);
        return data();
    }

    constructor() {
        this.initialize();
    }

    private async initialize() {
        this.minecraftFolder = new MinecraftFolder(CONFIG.get('launch.minecraftFolder'));
        this.versionManifest = await getVersionList();
        this.fabricArtifacts = await getFabricLoaders();
    }

    private async resolveVersion(id: string) {
        return (await getVersionList()).versions.find(item => item.id === id);
    }
}
