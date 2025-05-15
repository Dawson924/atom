import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('util', {
    getFaceSkin: (raw: string) => ipcRenderer.invoke('util:get-face-skin', raw)
});
