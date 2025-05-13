import type { HandlerFunction, IPCService } from './ipc';

export abstract class BaseService {
    /**
     * 服务命名空间（自动添加至通道名前）
     */
    protected abstract readonly namespace: string;
    protected abstract readonly ipc: IPCService;

    /**
     * 初始化时自动调用的注册方法
     */
    protected abstract registerHandlers(): void | Promise<void>;

    // constructor(
    //     protected readonly ipc: IPCService
    // ) {
    //     this.registerHandlers();
    // }

    // 暴露给派生类的注册方法 ==============================

    /**
     * 注册普通事件监听（对应 ipcMain.on）
     * @param channel 通道名称（自动添加命名空间）
     * @param handler 处理函数
     * @example
     * this.on('refresh', (event) => {
     *   // 处理刷新逻辑
     * })
     */
    protected on<T = any>(
        channel: string,
        handler: HandlerFunction<T>
    ) {
        this.ipc.on<T>(`${this.namespace}:${channel}`, handler);
    }

    /**
     * 注册异步处理函数（对应 ipcMain.handle）
     * @param channel 通道名称（自动添加命名空间）
     * @param handler 处理函数
     * @example
     * this.handler('get-data', async (event) => {
     *   return await fetchData()
     * })
     */
    protected handle<T = any>(
        channel: string,
        handler: HandlerFunction<T>
    ) {
        this.ipc.handle<T>(`${this.namespace}:${channel}`, handler);
    }

    // 辅助方法 ===========================================

    /**
     * 发送消息到渲染进程（自动添加命名空间）
     */
    protected send(channel: string, ...args: any[]): void {
        this.ipc.send(`${this.namespace}:${channel}`, ...args);
    }

    /**
     * 设置窗口关闭时的清理操作
     */
    protected setupWindowCleanup() {
        this.ipc.on('window-closed', () => {
            this.cleanup?.();
        });
    }

    /**
     * 可选的清理逻辑（派生类可重写）
     */
    protected cleanup(): void {
    // 默认无清理操作
    }
}
