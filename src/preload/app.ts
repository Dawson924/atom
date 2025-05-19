import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('app', {
    close: () => ipcRenderer.invoke('app:close'),
    minimize: () => ipcRenderer.invoke('app:minimize'),
    maximize: () => ipcRenderer.invoke('app:maximize'),
    openDevTools: () => ipcRenderer.invoke('app:open-devtools')
});
