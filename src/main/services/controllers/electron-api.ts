import { dialog } from 'electron';
import { IPCServiceController, IPCService } from '../core';

type DialogProperties = ('openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent')[];

export class ElectronAPIController extends IPCServiceController {
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
