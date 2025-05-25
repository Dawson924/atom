import { freemem, totalmem } from 'node:os';
import { IPCServiceController, IPCService } from '../core';

export class UtilityController extends IPCServiceController {
    protected override namespace = 'util';
    protected override ipc: IPCService;

    protected override registerHandlers() {
        this.handle('get-total-memory', totalmem);
        this.handle('get-memory-usage', () => totalmem() - freemem());
    }

    constructor(
        ipc: IPCService
    ) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}
