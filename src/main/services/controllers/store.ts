import { ensureDir } from 'fs-extra';
import { IPCServiceController, IPCService } from '../core';
import { findStoreDir } from '../../../utils';
import { CONFIG } from '../storage';

export class StoreServiceController extends IPCServiceController {
    protected override namespace = 'store';
    protected override ipc;

    protected override async registerHandlers() {
        await ensureDir(findStoreDir());

        this.handle('get', (_, key: string) => {
            return CONFIG.get(key);
        });

        this.handle('set', (_, key: string, value: string) => {
            CONFIG.set(key, value);
        });

        this.handle('delete', (_, key: string) => {
            CONFIG.delete(key);
        });
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}
