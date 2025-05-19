import { launch, MinecraftFolder, Version } from '@xmcl/core';
import { getFabricLoaderArtifact, getFabricLoaders, getVersionList, installDependenciesTask, installFabricByLoaderArtifact, InstallJarTask, InstallJsonTask, type FabricArtifactVersion, type MinecraftVersionList } from '@xmcl/installer';
import { CONFIG, PROFILES } from './storage';
import { readdir, writeFile } from 'node:fs/promises';
import type { AccountProfile, AuthenticatedAccount } from '../../types/auth';
import { resolveJarLocation } from '../../utils/auth';
import { IpcMainEvent } from 'electron';

export class ClientService {
    private minecraftFolder: MinecraftFolder;
    private versionManifest: MinecraftVersionList;
    private fabricArtifacts: FabricArtifactVersion[];

    async getFolder() {
        return this.minecraftFolder;
    }

    async findVersions() {
        const resolvedVersions = await Promise.all(
            (await this.findAllVersions()).map(async (item) => {
                const resolved = await Version.parse(this.minecraftFolder, item);
                if (resolved.id.startsWith('.'))
                    return;
                if (resolved.minecraftVersion.startsWith('.')) {
                    const rawBase64 = resolved.minecraftVersion.slice(1);
                    return { ...resolved, minecraftVersion: Buffer.from(rawBase64, 'base64').toString('utf-8') };
                }
                return resolved;
            })
        );
        return resolvedVersions.filter(Boolean);
    }

    async fetchVersionManifest() {
        if (!this.versionManifest)
            this.versionManifest = await getVersionList();

        return this.versionManifest;
    }

    async fetchFabricArtifact() {
        if (!this.fabricArtifacts)
            this.fabricArtifacts = await getFabricLoaders();

        return this.fabricArtifacts;
    }

    async install(event: IpcMainEvent, id: string, version: string) {
        const minecraftVersion = await this.resolveVersion(version);
        minecraftVersion.id = id;
        await new InstallJsonTask(minecraftVersion, this.minecraftFolder, {}).startAndWait({
            onUpdate(task) {
                event.sender.send('on-progress', {
                    id: id,
                    version: version,
                    task: 'task:install-json',
                    taskName: 'Minecraft Json',
                    progress: task.progress / task.total * 100
                });
            },
            onFailed: () => event.sender.send('on-failed', {
                id: id,
                version: version,
                task: 'task:install-jar',
            })
        });
        const parsedVersion = await Version.parse(this.minecraftFolder, id);
        parsedVersion.id = id;
        await new InstallJarTask(parsedVersion, this.minecraftFolder, {}).startAndWait({
            onUpdate(task) {
                event.sender.send('on-progress', {
                    id: id,
                    version: version,
                    task: 'task:install-jar',
                    taskName: 'Minecraft Jar',
                    progress: task.progress / task.total * 100,
                });
            },
            onFailed: () => event.sender.send('on-failed', {
                id: id,
                version: version,
                task: 'task:install-jar',
            })
        });
        await writeFile(this.minecraftFolder.getVersionJson(id), JSON.stringify(parsedVersion, null, 4));
        await installDependenciesTask(await Version.parse(this.minecraftFolder, id)).startAndWait({
            onUpdate(task) {
                event.sender.send('on-progress', {
                    id: id,
                    version: version,
                    task: 'task:install-deps',
                    taskName: 'Assets & Libraries',
                    progress: task.progress / task.total * 100
                });
            },
            onFailed: () => event.sender.send('on-failed', {
                id: id,
                version: version,
                task: 'task:install-deps',
            })
        });
        event.sender.send('on-complete');
    }

    async installFabric(event: IpcMainEvent, id: string, version: string, loaderVersion: string) {
        const inheritor = `.${Buffer.from(version).toString('base64')}`;
        const mcInfo = await this.resolveVersion(version);
        await new InstallJsonTask({ ...mcInfo, id: inheritor }, this.minecraftFolder, {}).startAndWait({
            onUpdate(task) {
                event.sender.send('on-progress', {
                    id: id,
                    version: version,
                    task: 'task:install-json',
                    taskName: 'Minecraft Json',
                    progress: task.progress / task.total * 100
                });
            },
            onFailed: () => event.sender.send('on-failed', {
                id: id,
                version: version,
                task: 'task:install-jar',
            })
        });
        const resolvedVersion = await Version.parse(this.minecraftFolder, inheritor);
        resolvedVersion.id = inheritor;
        await new InstallJarTask(resolvedVersion, this.minecraftFolder, {}).startAndWait({
            onUpdate(task) {
                event.sender.send('on-progress', {
                    id: id,
                    version: version,
                    task: 'task:install-jar',
                    taskName: 'Minecraft Jar',
                    progress: task.progress / task.total * 100,
                });
            },
            onFailed: () => event.sender.send('on-failed', {
                id: id,
                version: version,
                task: 'task:install-jar',
            })
        });
        await writeFile(this.minecraftFolder.getVersionJson(inheritor), JSON.stringify(resolvedVersion, null, 4));
        const fabricVersionName = await installFabricByLoaderArtifact(
            await getFabricLoaderArtifact(version, loaderVersion),
            this.minecraftFolder,
            { versionId: id, inheritsFrom: inheritor }
        );
        await installDependenciesTask(await Version.parse(this.minecraftFolder, fabricVersionName)).startAndWait({
            onUpdate(task) {
                event.sender.send('on-progress', {
                    id: id,
                    version: version,
                    task: 'task:install-deps',
                    taskName: 'Assets & Libraries',
                    progress: task.progress / task.total * 100
                });
            },
            onFailed: () => event.sender.send('on-failed', {
                id: id,
                version: version,
                task: 'task:install-deps',
            })
        });
        event.sender.send('on-complete');
    }

    async launch(_: IpcMainEvent, version: string) {
        const authentication = CONFIG.get('authentication');
        authentication.yggdrasilAgent.prefetched = Buffer.from(
            JSON.stringify((await axios.get<Tentative>('http://localhost:5400/yggdrasil')).data)
        ).toString('base64');

        const YggdrasilUser = PROFILES.get(`authenticationDatabase.${PROFILES.get('selectedUser.account')}`) as AuthenticatedAccount;
        const gameProfile = YggdrasilUser.profiles[PROFILES.get('selectedUser.profile') as string] as AccountProfile;

        await launch({
            resourcePath: this.minecraftFolder.root,
            gamePath: this.minecraftFolder.getVersionRoot(version),
            version: version,
            javaPath: CONFIG.get('launch.javaPath'),
            gameProfile: {
                id: gameProfile.id,
                name: gameProfile.name
            },
            userType: 'mojang',
            yggdrasilAgent: {
                jar: resolveJarLocation(authentication.yggdrasilAgent.jar),
                server: authentication.yggdrasilAgent.server,
                prefetched: authentication.yggdrasilAgent.prefetched
            },
            accessToken: YggdrasilUser.accessToken
        });
    }

    constructor() {
        this.initialize();
    }

    private async initialize() {
        this.minecraftFolder = new MinecraftFolder(CONFIG.get('launch.minecraftFolder'));
        this.versionManifest = await getVersionList();
        this.fabricArtifacts = await getFabricLoaders();
    }

    private async findAllVersions() {
        const versionFolder = this.minecraftFolder.versions;
        return await readdir(versionFolder);
    }

    private async resolveVersion(id: string) {
        return (await getVersionList()).versions.find(item => item.id === id);
    }
}
