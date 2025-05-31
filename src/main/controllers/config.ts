import { IPCServiceController, IPCService } from '../core';
import { CONFIG } from '../store';
import { StoreService } from '@main/services/store';

export class ConfigServiceController extends IPCServiceController {
    protected override readonly namespace = 'config';
    protected override readonly ipc;

    protected override async registerHandlers() {
        const service = new StoreService(CONFIG);

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
