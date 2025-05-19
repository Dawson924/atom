import { getFaceSkinFromBase64 } from '../../../utils';
import { IPCServiceController, IPCService } from '../core';

export class UtilityController extends IPCServiceController {
    protected override namespace = 'util';
    protected override ipc: IPCService;

    protected override registerHandlers() {
        this.handle('get-face-skin', async (_, raw: string) => {
            return await getFaceSkinFromBase64(raw);
        });
    }

    constructor(
        ipc: IPCService
    ) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}
