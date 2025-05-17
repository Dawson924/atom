import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('config', {
    get: (key: string) => ipcRenderer.invoke('store:get', key),
    set: (key: string, value: string) => ipcRenderer.invoke('store:set', key, value),
    delete: (key: string) => ipcRenderer.invoke('store:delete', key)
});
