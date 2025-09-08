import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('app', {
    isPackaged: () => ipcRenderer.invoke('app:packaged'),
    close: () => ipcRenderer.invoke('app:close'),
    minimize: () => ipcRenderer.invoke('app:minimize'),
    maximize: () => ipcRenderer.invoke('app:maximize'),
    openDevTools: () => ipcRenderer.invoke('app:open-devtools')
});
