import { launch, MinecraftFolder, Version } from '@xmcl/core';
import { BaseService, IPCService } from '../core';
import fs from 'fs/promises';
import { FabricArtifactVersion, getFabricLoaderArtifact, getFabricLoaders, getVersionList, installDependenciesTask, installFabricByLoaderArtifact, InstallJarTask, InstallJsonTask, MinecraftVersionList } from '@xmcl/installer';
import { IpcMainEvent } from 'electron';
import { CONFIG, PROFILES } from '../storage';
import axios from 'axios';
import { resolveJarLocation } from '../../utils/auth/authlib-injector';
import type { AccountProfile, AuthenticatedAccount } from '../../types/auth';
import { FileSystem, openFileSystem } from '@xmcl/system';

export class LauncherService extends BaseService {
    protected override readonly namespace = 'launcher';
    protected override readonly ipc;
    protected fs: FileSystem;
    protected minecraftPath: string;
    protected minecraftFolder: MinecraftFolder;
    protected versions: string[] = [];
    protected versionManifest: MinecraftVersionList;
    protected fabricArtifacts: FabricArtifactVersion[];

    protected override async registerHandlers() {
        this.fs = await openFileSystem(CONFIG.get('launch.minecraftFolder'));
        this.minecraftPath = CONFIG.get('launch.minecraftFolder');
        this.minecraftFolder = new MinecraftFolder(this.minecraftPath);
        this.versionManifest = await getVersionList();

        await this.findAllVersions();

        this.handle('folder', () => {
            return MinecraftFolder.from(this.minecraftPath);
        });

        this.handle('get-versions', async () => {
            await this.findAllVersions();
            const resolvedVersions = await Promise.all(
                this.versions.map(async (item) => {
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
        });

        this.handle('get-version-manifest', async () => {
            if (!this.versionManifest)
                this.versionManifest = await getVersionList();

            return this.versionManifest;
        });

        this.handle('get-fabric-artifacts', async () => {
            if (!this.fabricArtifacts)
                this.fabricArtifacts = await getFabricLoaders();

            return this.fabricArtifacts;
        });

        this.handle('find-java', async () => {
            return 'asd';
        });

        this.handle('install', async (_, id: string, version: string) => {
            const minecraftVersion = await this.resolveVersion(version);
            if (minecraftVersion) {
                minecraftVersion.id = id;
                await new InstallJsonTask(minecraftVersion, this.minecraftFolder, {}).startAndWait();
                const parsedVersion = await Version.parse(this.minecraftFolder, id);
                parsedVersion.id = id;
                await new InstallJarTask(parsedVersion, this.minecraftFolder, {}).startAndWait();
                await fs.writeFile(this.minecraftFolder.getVersionJson(id), JSON.stringify(parsedVersion, null, 4));
                await installDependenciesTask(await Version.parse(this.minecraftFolder, id)).startAndWait();
            }
            else {
                throw new Error('[ATOM] failed: Cannot install requested version.\nVersion not found in manifest.');
            }
        });

        this.on('install-task', async (event: IpcMainEvent, id: string, version: string) => {
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
            await fs.writeFile(this.minecraftFolder.getVersionJson(id), JSON.stringify(parsedVersion, null, 4));
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
        });

        this.handle('install-fabric', async (event: IpcMainEvent, id: string, version: string, loaderVersion: string) => {
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
            await fs.writeFile(this.minecraftFolder.getVersionJson(inheritor), JSON.stringify(resolvedVersion, null, 4));
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
        });

        this.handle('launch', async (_,
            version: string,
            javaPath: string
        ) => {
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
                javaPath: javaPath,
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
        });
    }

    private async findAllVersions() {
        const versionFolder = this.minecraftFolder.versions;
        const versions = await fs.readdir(versionFolder);
        this.versions = versions;
        return versions;
    }

    private async resolveVersion(id: string) {
        return (await getVersionList()).versions.find(item => item.id === id);
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}