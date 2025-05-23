import type { MinecraftVersionList } from '@xmcl/installer';
import { createContext, JSX, useCallback, useEffect, useMemo, useState } from 'react';
import ClientPage from './client';
import ServerPage from './server';

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

export const Context = createContext<{
    goTo: (target: JSX.Element | string) => void;
    versionManifest: MinecraftVersionList;
    executeTask: (task: DownloadTask) => Promise<void>;
    currentTask?: DownloadTask;
    taskState?: TaskState;
        }>({
            goTo: null,
            versionManifest: null,
            executeTask: null,
            currentTask: null,
            taskState: null,
        });

export default function InstallerPage() {
    const [selectedPage, setSelectedPage] = useState<string>('client');
    const [versionManifest, setVersionManifest] = useState<MinecraftVersionList>();
    const [currentTask, setCurrentTask] = useState<DownloadTask | null>(null);
    const [taskState, setTaskState] = useState<TaskState | null>();
    const [isProcessing, setIsProcessing] = useState(false);
    const [SubPage, setSubPage] = useState<JSX.Element | null>();

    const goTo = (target: JSX.Element | string) => {
        if (typeof target === 'string') {
            setSubPage(null);
            setSelectedPage(target);
        }
        else
            setSubPage(target);
    };

    const executeTask = useCallback(async (taskParams: DownloadTask) => {
        if (isProcessing) {
            console.warn('A task is already in progress');
            return;
        }

        const task = taskParams;

        window.client.removeListeners('on-progress');
        window.client.removeListeners('on-complete');
        window.client.removeListeners('on-failed');

        setCurrentTask(task);
        setIsProcessing(true);
        setTaskState(null);

        try {
            // 执行实际安装任务
            window.client.onProcess((_, state: any) => {
                setTaskState(state);
                task.onProgress?.(state);
            });
            window.client.onComplete(() => {
                setTaskState(null);
                setIsProcessing(false);
                setCurrentTask(null);
                taskParams.onComplete?.();
            });
            window.client.onFailed(() => {
                setTaskState(null);
                setIsProcessing(false);
                setCurrentTask(null);
            });
            if (!task.loader)
                await window.client.installTask(task.id, task.version);
            else if (task.loader === 'fabric' && task.loaderVersion)
                await window.client.installFabric(task.id, task.version, task.loaderVersion);
            else
                throw new Error('Unsupported Mod Loader');
        } catch (error) {
            console.error('Task failed:', error);
            taskParams.onError?.(error as Error);
        }
    }, [isProcessing]);

    useEffect(() => {
        window.client.getVersionManifest().then(res => setVersionManifest(res));
    }, []);

    const contextValue = useMemo(() => ({
        goTo,
        versionManifest,
        executeTask,
        currentTask,
        taskState,
    }), [goTo, versionManifest, executeTask, currentTask, taskState]);

    return (
        <>
            <div className="relative h-main bg-blue-100 dark:bg-neutral-700">
                <div className="flex flex-row">

                    <div className="z-10 w-32 h-main flex flex-shrink-0 flex-col shadow-lg border-r border-gray-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                        <div className="w-full h-full shadow-md">
                            <div className="px-5 pt-3 mb-1">
                                <h2 className="text-xs font-semibold font-[Inter] tracking-tighter uppercase text-neutral-400">
                                    Minecraft
                                </h2>
                            </div>
                            <nav aria-label="Main" className="flex flex-col justify-start items-start h-full">
                                {/* Minecraft Links */}
                                {
                                    ['client', 'server'].map(item => {
                                        return (
                                            item === selectedPage ?
                                                <SelectedItem key={item} value={item} />
                                                :
                                                <UnselectedItem key={item} value={item} onClick={() => setSelectedPage(item)} />
                                        );
                                    })
                                }
                            </nav>
                        </div>
                    </div>

                    <Context.Provider value={contextValue}>
                        {
                            SubPage ?
                                SubPage
                                :
                                selectedPage === 'client' ?
                                    <ClientPage />
                                    :
                                    selectedPage === 'server' ?
                                        <ServerPage />
                                        :
                                        <></>
                        }
                    </Context.Provider>

                    {taskState && <div
                        style={{ width: `${taskState.progress}%` }}
                        className="z-20 fixed inset-x-0 bottom-0 rounded-lg border-2 border-blue-600 transition-all"
                    >
                        <div className="relative">
                            <label className="absolute left-4 bottom-2">{taskState.taskName}</label>
                        </div>
                    </div>}

                </div>
            </div>
        </>
    );
}

const SelectedItem = ({ value }: { value: string }) => (
    <div className="w-full text-sm font-semibold overflow-hidden hover:overflow-auto">
        <div
            className="relative flex justify-start items-center px-5 py-2 w-full cursor-pointer text-blue-600 dark:text-blue-400 hover:bg-blue-50 hover:dark:bg-neutral-700"
        >
            <div className="absolute left-0.5 top-1/4 h-1/2 rounded-sm border-l-3 border-blue-600 dark:border-blue-400"></div>
            <h4 className="text-xs font-bold font-[Inter] uppercase">
                {value}
            </h4>
        </div>
    </div>
);

const UnselectedItem = ({ value, onClick }: { value: string, onClick: () => void }) => (
    <div className="w-full text-sm font-semibold overflow-hidden hover:overflow-auto" onClick={onClick}>
        <div
            className="relative flex justify-start items-center px-5 py-2 w-full cursor-pointer text-gray-500 hover:bg-blue-50 dark:hover:bg-neutral-700"
        >
            <h4 className="text-xs font-bold font-[Inter] uppercase">
                {value}
            </h4>
        </div>
    </div>
);
