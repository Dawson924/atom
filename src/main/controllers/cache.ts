import { IPCService, IPCServiceController } from '../core';
import { CACHE } from '../store/cache';

export class CacheServiceController extends IPCServiceController {
    protected override readonly namespace = 'cache';
    protected override readonly ipc: IPCService;

    protected override async registerHandlers() {
        this.handle('get', (_, key: string) => CACHE.get(key));
        this.handle('set', (_, key: string, value: string) => CACHE.set(key, value));
        this.handle('delete', (_, key: string) => CACHE.delete(key));
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}
