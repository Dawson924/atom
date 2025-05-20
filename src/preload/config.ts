import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('config', {
    get: (key: string) => ipcRenderer.invoke('config:get', key),
    set: (key: string, value: string) => ipcRenderer.invoke('config:set', key, value),
    delete: (key: string) => ipcRenderer.invoke('config:delete', key)
});
