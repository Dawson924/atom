import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('app', {
    close: () => ipcRenderer.invoke('app:close'),
    openDevTools: () => ipcRenderer.invoke('app:open-devtools')
});
