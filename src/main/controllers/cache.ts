import { StoreService } from '@main/services/store';
import { IPCService, IPCServiceController } from '../core';
import { CACHE } from '../store/cache';

export class CacheServiceController extends IPCServiceController {
    protected override readonly namespace = 'cache';
    protected override readonly ipc: IPCService;

    protected override async registerHandlers() {
        const service = new StoreService(CACHE);

        this.handle('has', service.has.bind(service));
        this.handle('get', service.get.bind(service));
        this.handle('set', service.set.bind(service));
        this.handle('reset', service.reset.bind(service));
        this.handle('delete', service.delete.bind(service));
        this.handle('clear', service.clear.bind(service));
        this.handle('getPath', service.getPath.bind(service));
        this.handle('getSize', service.getSize.bind(service));
        this.handle('openInEditor', service.openInEditor.bind(service));
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}
