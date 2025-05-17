import { dialog } from 'electron';
import { BaseService, IPCService } from '../core';

type DialogProperties = ('openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent')[];

export class ElectronAPIService extends BaseService {
    protected override namespace: string;
    protected override ipc: IPCService;

    protected override registerHandlers() {
        this.handle('open-dialog', async (_, properties: DialogProperties = ['openFile', 'openDirectory']) => {
            const result = await dialog.showOpenDialog({ properties });
            return result;
        });
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}
