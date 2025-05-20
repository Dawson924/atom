import { IPCServiceController, IPCService } from '../core';
import { CONFIG } from '../storage';

export class StoreServiceController extends IPCServiceController {
    protected override namespace = 'config';
    protected override ipc;

    protected override async registerHandlers() {
        this.handle('get', (_, key: string) => CONFIG.get(key));
        this.handle('set', (_, key: string, value: string) => CONFIG.set(key, value));
        this.handle('delete', (_, key: string) => CONFIG.delete(key));
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}
