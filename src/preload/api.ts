import { contextBridge, ipcRenderer } from 'electron';

const createApisHost = () => {
    return {
        invoke(channel: string, ...args: string[]) {
            return ipcRenderer.invoke(channel, ...args);
        }
    };
};

contextBridge.exposeInMainWorld('api', createApisHost());
