import { data } from '../libs/response';
import { IPCServiceController, IPCService } from '../core';
import { CONFIG } from '../services/store';

export class ConfigServiceController extends IPCServiceController {
    protected override namespace = 'config';
    protected override ipc;

    protected override async registerHandlers() {
        this.handle('get', (_, key: string) => data(CONFIG.get(key)));
        this.handle('set', (_, key: string, value: string) => data(CONFIG.set(key, value)));
        this.handle('delete', (_, key: string) => data(CONFIG.delete(key)));
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}
