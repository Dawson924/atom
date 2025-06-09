import { launch, LaunchOption, MinecraftFolder, Version } from '@xmcl/core';
import { getFabricLoaderArtifact, getFabricLoaders, getVersionList, installDependenciesTask, installFabricByLoaderArtifact, type FabricArtifactVersion, type MinecraftVersionList } from '@xmcl/installer';
import { CONFIG } from '../store';
import { IpcMainEvent } from 'electron';
import { createTaskHandler, getLaunchOptions, installVersionTask, VersionUtils } from '../utils/client.util';
import { data, error, ERROR_CODES } from '../libs/response';
import { findJava } from '../utils/java';
import { ModVersionFile } from '@xmcl/modrinth';
import { downloadFile } from '@main/utils/download.mjs';
import path, { isAbsolute } from 'node:path';
import { setupMinecraftDirectory } from '@main/utils/folder';

export class ClientService {
    private minecraftFolder: MinecraftFolder;
    private versionManifest: MinecraftVersionList;
    private fabricArtifacts: FabricArtifactVersion[];

    async getFolder() {
        const folder = await setupMinecraftDirectory(this.minecraftFolder.root);
        return data(folder);
    }

    async getPath(_: IpcMainEvent, id: string, subpath?: string) {
        const versionFolder = this.minecraftFolder.getVersionRoot(id);
        if (subpath)
            return data(path.join(versionFolder, subpath));
        else
            return data(versionFolder);
    }

    async getVersions() {
        return data(await VersionUtils.listVersions(this.minecraftFolder));
    }

    async hasVersion(_: IpcMainEvent, id: string) {
        return data(await VersionUtils.exists(this.minecraftFolder, id));
    }

    async getVersionManifest() {
        if (!this.versionManifest)
            this.versionManifest = await getVersionList();

        return data(this.versionManifest);
    }

    async getFabricArtifact() {
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
        const jsonTask = createTaskHandler(event, 'task:json', id, version);
        const jarTask = createTaskHandler(event, 'task:jar', id, version);
        const depsTask = createTaskHandler(event, 'task:dependencies', id, version);

        const versionInfo = await this.resolveVersion(version);
        versionInfo.id = id;

        await installVersionTask(
            this.minecraftFolder,
            versionInfo,
            jsonTask,
            jarTask,
            depsTask
        );

        event.sender.send('on-complete');

        return data();
    }

    async installFabric(event: IpcMainEvent, id: string, version: string, loaderVersion: string) {
        const jsonTask = createTaskHandler(event, 'task:version', id, version);
        const jarTask = createTaskHandler(event, 'task:version', id, version);
        const depsTask = createTaskHandler(event, 'task:dependencies', id, version);

        // 安装基础版本
        const inheritor = VersionUtils.createInheritVersionId(version);
        const mcInfo = await this.resolveVersion(version);
        mcInfo.id = inheritor;
        await installVersionTask(
            this.minecraftFolder,
            mcInfo,
            jsonTask,
            jarTask,
            depsTask
        );

        // 安装Fabric
        const fabricVersionName = await installFabricByLoaderArtifact(
            await getFabricLoaderArtifact(version, loaderVersion),
            this.minecraftFolder,
            { versionId: id, inheritsFrom: inheritor }
        );

        // 安装依赖
        await installDependenciesTask(await Version.parse(this.minecraftFolder, fabricVersionName))
            .startAndWait(depsTask);

        event.sender.send('on-complete');

        return data();
    }

    async downloadFile(_: IpcMainEvent, file: ModVersionFile, path: string) {
        if (!isAbsolute(path)) {
            return error(ERROR_CODES.INVALID_ARGUMENT);
        }
        await downloadFile(file.url, path);
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
        this.minecraftFolder = await setupMinecraftDirectory(CONFIG.get('launch.minecraftFolder'));
        this.versionManifest = await getVersionList();
        this.fabricArtifacts = await getFabricLoaders();
    }

    private async resolveVersion(id: string) {
        return (await getVersionList()).versions.find(item => item.id === id);
    }
}
