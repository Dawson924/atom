import { data, IPCResponse } from '@main/libs/response';
import { IpcMainEvent } from 'electron';
import ElectronStore from 'electron-store';

export class StoreService {
    private readonly store: ElectronStore;

    has<T extends string>(_: IpcMainEvent, key: string) {
        return data(this.store.has<T>(key));
    }

    get<T = any>(_: IpcMainEvent, key: string): IPCResponse<T> {
        return data(this.store.get(key) as T);
    }

    set<T>(_: IpcMainEvent, key: string, value?: T) {
        this.store.set(key, value);
        return data();
    }

    reset(_: IpcMainEvent, ...keys: string[]) {
        this.store.reset(...keys);
        return data();
    }

    delete(_: IpcMainEvent, key: string) {
        this.store.delete(key);
        return data();
    }

    clear() {
        this.store.clear();
        return data();
    }

    getPath() {
        return data(this.store.path);
    }

    getSize() {
        return data(this.store.size);
    }

    async openInEditor() {
        this.store.openInEditor();
        return data();
    }

    constructor(store: ElectronStore<any>) {
        this.store = store;
    }
}
