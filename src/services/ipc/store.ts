import { ensureDir } from 'fs-extra';
import { BaseService, IPCService, store } from '../core';
import { findStoreDir } from '../../utils';

export class StoreService extends BaseService {
    protected override namespace = 'store';
    protected override ipc;

    protected override async registerHandlers() {
        await ensureDir(findStoreDir());

        this.handle('get', (_, key: string) => {
            return store.get(key);
        });

        this.handle('set', (_, key: string, value: string) => {
            store.set(key, value);
        });

        this.handle('delete', (_, key: string) => {
            store.delete(key);
        });
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}
