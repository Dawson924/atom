import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('launcher', {
    folder: () => ipcRenderer.invoke('launcher:folder'),
    getVersions: () => ipcRenderer.invoke('launcher:get-versions'),
    getVersionManifest: () => ipcRenderer.invoke('launcher:get-version-manifest'),
    getFabricArtifacts: () => ipcRenderer.invoke('launcher:get-fabric-artifacts'),
    findJava: () => ipcRenderer.invoke('launcher:find-java'),
    install: (id: string, version: string) => ipcRenderer.invoke('launcher:install', id, version),
    installTask: (id: string, version: string) => ipcRenderer.send('launcher:install-task', id, version),
    installFabric: (version: string) => ipcRenderer.invoke('launcher:install-fabric', version),
    onProcess: (listener: (...args: any) => void) => ipcRenderer.on('on-progress', (event, percentage) => listener(event, percentage)),
    onComplete: (listener: () => void) => ipcRenderer.on('on-complete', listener),
    onFailed: (listener: () => void) => ipcRenderer.on('on-failed', listener),
    launch: (version: string, javaPath: string) => ipcRenderer.invoke('launcher:launch', version, javaPath),
});
