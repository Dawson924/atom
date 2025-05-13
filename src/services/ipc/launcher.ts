import { launch, MinecraftFolder, Version } from '@xmcl/core';
import { BaseService, IPCService, store } from '../core';
import fs from 'fs/promises';
import { getVersionList, install, installTask, MinecraftVersionList } from '@xmcl/installer';
import { IpcMainEvent } from 'electron';

export class LauncherService extends BaseService {
    protected override namespace = 'launcher';
    protected override ipc;

    protected path: string;
    protected minecraftFolder: MinecraftFolder;
    protected versions: string[] = [];
    protected versionManifest: MinecraftVersionList;

    protected override async registerHandlers() {
        this.path = store.get('launcher.path');
        this.minecraftFolder = new MinecraftFolder(this.path);
        this.versionManifest = await getVersionList();

        await this.findAllVersions();

        this.handle('folder', () => {
            return MinecraftFolder.from(this.path);
        });

        this.handle('get-versions', async () => {
            await this.findAllVersions();
            const resolvedVersions = await Promise.all(
                this.versions.map(async (item) => {
                    const parsed = await Version.parse(this.minecraftFolder, item);
                    return parsed;
                })
            );
            return resolvedVersions;
        });

        this.handle('get-version-manifest', async () => {
            if (!this.versionManifest)
                this.versionManifest = await getVersionList();

            return this.versionManifest;
        });

        this.handle('find-java', async () => {
            return 'asd';
        });

        this.handle('install', async (_, version: string) => {
            const minecraftVersion = await this.resolveVersion(version);
            if (minecraftVersion) {
                await install(minecraftVersion, this.minecraftFolder);
            }
            else {
                throw new Error('[ATOM] failed: Cannot install requested version.\nVersion not found in manifest.');
            }
        });

        this.on('install-task', async (event: IpcMainEvent, version: string) => {
            const minecraftVersion = await this.resolveVersion(version);
            const task = installTask(minecraftVersion, this.minecraftFolder);
            await task.startAndWait({
                onUpdate(task) {
                    event.sender.send('on-progress', task.progress / task.total * 100);
                },
                onSucceed: () => event.sender.send('on-complete'),
                onFailed: () => event.sender.send('on-failed')
            });
        });

        this.handle('launch', async (_,
            version: string,
            javaPath: string,
            profile: Tentative = {
                name: 'AtomPlayer',
                id: 'atom-cli'
            }
        ) => {
            await launch({
                resourcePath: this.minecraftFolder.root,
                gamePath: this.minecraftFolder.getVersionRoot(version),
                version: version,
                javaPath: javaPath,
                gameProfile: profile,
                versionName: 'Atom Launcher'
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