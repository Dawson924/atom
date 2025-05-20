import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('cache', {
    get: (key: string) => ipcRenderer.invoke('cache:get', key),
    set: (key: string, value: string) => ipcRenderer.invoke('cache:set', key, value),
    delete: (key: string) => ipcRenderer.invoke('cache:delete', key)
});
