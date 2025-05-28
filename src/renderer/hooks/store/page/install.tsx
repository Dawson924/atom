import { create } from 'zustand';
import { ClientService } from '@renderer/api';
import { JSX } from 'react';

// 定义下载任务类型
type DownloadTask = {
    id: string;
    version: string;
    loader?: 'forge' | 'fabric' | 'neoForge';
    loaderVersion?: string;
    onProgress?: (percentage: number) => void;
    onComplete?: () => void;
    onError?: (error: Error) => void;
};

type TaskState = {
    id: string;
    version: string;
    task: `task:${string}`;
    taskName: string;
    progress: number;
};

// 定义状态类型
interface AppState {
    // 导航状态
    currentPage: string | JSX.Element | null;
    goTo: (target: string | JSX.Element) => void;

    // 任务状态
    currentTask: DownloadTask | null;
    taskState: TaskState | null;
    isProcessing: boolean;
    executeTask: (taskParams: DownloadTask) => Promise<void>;
}

// 创建 Store
export const usePageStore = create<AppState>((set, get) => ({
    // 导航状态初始化
    currentPage: 'client',
    goTo: (target) => set({ currentPage: target }),

    // 任务状态初始化
    currentTask: null,
    taskState: null,
    isProcessing: false,

    // 任务执行方法
    executeTask: async (taskParams) => {
        const { isProcessing } = get();
        if (isProcessing) {
            console.warn('A task is already in progress');
            return;
        }

        const task = taskParams;
        window.api.removeListeners('on-progress');
        window.api.removeListeners('on-complete');
        window.api.removeListeners('on-failed');

        set({ currentTask: task, isProcessing: true, taskState: null });

        try {
            // 绑定事件监听
            window.api.onProcess((_, state: TaskState) => {
                set({ taskState: state });
                task.onProgress?.(state.progress); // 传递进度
            });

            window.api.onComplete(() => {
                set({ taskState: null, isProcessing: false, currentTask: null });
                task.onComplete?.();
            });

            window.api.onFailed(() => {
                set({ taskState: null, isProcessing: false, currentTask: null });
                task.onError?.(new Error('Task failed'));
            });

            // 执行安装逻辑
            if (!task.loader) {
                await ClientService.install(task.id, task.version);
            } else if (task.loader === 'fabric' && task.loaderVersion) {
                await ClientService.installFabric(task.id, task.version, task.loaderVersion);
            } else {
                throw new Error('Unsupported Mod Loader');
            }
        } catch (error) {
            console.error('Task failed:', error);
            task.onError?.(error as Error);
        }
    },
}));
