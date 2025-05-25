import { ipcMain, IpcMainEvent } from 'electron';
import type { BrowserWindow } from 'electron';

export type HandlerType = 'on' | 'handle';
export type HandlerFunction<T = any> = (event: IpcMainEvent, ...args: any[]) => Promise<T> | T;

export class IPCService {
    private registeredChannels = new Set<string>();
    public mainWindow: BrowserWindow;

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    /**
     * 统一注册方法
     * @param type 处理器类型
     * @param channel 通道名称，自动添加命名空间
     * @param handler 处理函数
     * @param options 配置项
     */
    register<T = any>(
        type: HandlerType,
        channel: string,
        handler: HandlerFunction<T>,
        options?: {
            errorHandling?: boolean;
        }
    ) {
        if (this.registeredChannels.has(channel)) {
            throw new Error(`IPC channel '${channel}' already registered`);
        }

        const wrappedHandler = this.createWrappedHandler(handler, options?.errorHandling ?? false);

        ipcMain[type](channel, wrappedHandler);
        this.registeredChannels.add(channel);

        return this;
    }

    on<T = any>(channel: string, handler: HandlerFunction<T>) {
        return this.register('on', channel, handler);
    }

    handle<T = any>(channel: string, handler: HandlerFunction<T>) {
        return this.register('handle', channel, handler, { errorHandling: true });
    }

    /**
     * 创建带有错误处理的包装函数
     */
    private createWrappedHandler<T>(
        handler: HandlerFunction<T>,
        errorHandling: boolean
    ) {
        return async (event: IpcMainEvent, ...args: any[]) => {
            try {
                const result = await handler(event, ...args);
                return result;
            } catch (error) {
                if (!errorHandling) throw error;
            }
        };
    }

    /**
     * 向渲染进程发送消息
     */
    send(channel: string, ...args: any[]) {
        if (this.mainWindow?.webContents) {
            this.mainWindow.webContents.send(channel, ...args);
        }
    }
}
