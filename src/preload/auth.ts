import { SetTextureOption } from '@xmcl/user';
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('auth', {
    offline: (username: string) => ipcRenderer.invoke('auth:offline', username),
    login: ({ username, password }: {
        username: string;
        password: string;
    }) => ipcRenderer.invoke('auth:login', { username, password }),
    lookup: (uuid: string) => ipcRenderer.invoke('auth:lookup', uuid),
    session: () => ipcRenderer.invoke('auth:session'),
    invalidate: () => ipcRenderer.invoke('auth:invalidate'),
    setTexture: (option: SetTextureOption) => ipcRenderer.invoke('auth:set-texture', option),
});
