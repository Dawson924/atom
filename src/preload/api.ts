import { contextBridge, ipcRenderer } from 'electron';

const createApisHost = () => {
    return {
        invoke(channel: string, ...args: string[]) {
            return ipcRenderer.invoke(channel, ...args);
        },
        onProcess: (listener: (...args: any) => void) => ipcRenderer.on('on-progress', (event, percentage) => listener(event, percentage)),
        onComplete: (listener: () => void) => ipcRenderer.on('on-complete', listener),
        onFailed: (listener: () => void) => ipcRenderer.on('on-failed', listener),
        removeListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
    };
};

contextBridge.exposeInMainWorld('api', createApisHost());
