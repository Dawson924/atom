import { launch, LaunchOption, Version } from '@xmcl/core';
import { getFabricLoaderArtifact, getFabricLoaders, getVersionList, installDependenciesTask, installFabricByLoaderArtifact, type FabricArtifactVersion, type MinecraftVersionList } from '@xmcl/installer';
import { IpcMainEvent } from 'electron';
import { createTaskHandler, getLaunchOptions, getMinecraftFolder, installVersionTask, VersionHelper } from '../utils/client.util';
import { data, error, ERROR_CODES } from '../libs/response';
import { findJava } from '../utils/java';
import { ModVersionFile } from '@xmcl/modrinth';
import { downloadFile } from '@main/utils/download.mjs';
import path, { isAbsolute } from 'node:path';

export class ClientService {
    private versionManifest: MinecraftVersionList;
    private fabricArtifacts: FabricArtifactVersion[];

    async getFolder() {
        return data(await getMinecraftFolder());
    }

    async getPath(_: IpcMainEvent, id: string, subpath?: string) {
        const versionFolder = (await getMinecraftFolder()).getVersionRoot(id);
        if (subpath)
            return data(path.join(versionFolder, subpath));
        else
            return data(versionFolder);
    }

    async getVersions() {
        return data(await VersionHelper.listAll(await getMinecraftFolder()));
    }

    async hasVersion(_: IpcMainEvent, id: string) {
        return data(await VersionHelper.exists(await getMinecraftFolder(), id));
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
            await getMinecraftFolder(),
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
        const inheritor = VersionHelper.createInheritVersionId(version);
        const mcInfo = await this.resolveVersion(version);
        mcInfo.id = inheritor;
        await installVersionTask(
            await getMinecraftFolder(),
            mcInfo,
            jsonTask,
            jarTask,
            depsTask
        );

        // 安装Fabric
        const fabricVersionName = await installFabricByLoaderArtifact(
            await getFabricLoaderArtifact(version, loaderVersion),
            await getMinecraftFolder(),
            { versionId: id, inheritsFrom: inheritor }
        );

        // 安装依赖
        await installDependenciesTask(await Version.parse(await getMinecraftFolder(), fabricVersionName))
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
        const options = await getLaunchOptions(await getMinecraftFolder(), id);
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
        this.versionManifest = await getVersionList();
        this.fabricArtifacts = await getFabricLoaders();
    }

    private async resolveVersion(id: string) {
        return (await getVersionList()).versions.find(item => item.id === id);
    }
}
