import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('client', {
    folder: () => ipcRenderer.invoke('client:folder'),
    getVersions: () => ipcRenderer.invoke('client:get-versions'),
    getVersionManifest: () => ipcRenderer.invoke('client:get-version-manifest'),
    getFabricArtifacts: () => ipcRenderer.invoke('client:get-fabric-artifacts'),
    findJava: () => ipcRenderer.invoke('client:find-java'),
    install: (id: string, version: string) => ipcRenderer.invoke('client:install', id, version),
    installTask: (id: string, version: string) => ipcRenderer.send('client:install-task', id, version),
    installFabric: (id: string, version: string, loaderVersion: string) => ipcRenderer.invoke('client:install-fabric', id, version, loaderVersion),
    onProcess: (listener: (...args: any) => void) => ipcRenderer.on('on-progress', (event, percentage) => listener(event, percentage)),
    onComplete: (listener: () => void) => ipcRenderer.on('on-complete', listener),
    onFailed: (listener: () => void) => ipcRenderer.on('on-failed', listener),
    removeListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
    launch: (version: string, javaPath: string) => ipcRenderer.invoke('client:launch', version, javaPath),
});
