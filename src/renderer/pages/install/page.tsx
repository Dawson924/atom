import type { MinecraftVersionList } from '@xmcl/installer';
import { createContext, JSX, useCallback, useEffect, useMemo, useState } from 'react';
import ClientPage from './client';
import { Fab } from '@mui/material';
import ServerPage from './server';

// 定义下载任务类型
type DownloadTask = {
    id: string;
    version: string;
    onProgress?: (percentage: number) => void;
    onComplete?: () => void;
    onError?: (error: Error) => void;
};

export const Context = createContext<{
    goTo: (target: JSX.Element | string) => void;
    versionManifest: MinecraftVersionList;
    executeTask: (task: DownloadTask) => Promise<void>;
    currentTask: DownloadTask | null;
    processPercentage: number;
        }>({
            goTo: null,
            versionManifest: null,
            executeTask: null,
            currentTask: null,
            processPercentage: 0,
        });

export default function InstallerPage() {
    const [selectedPage, setSelectedPage] = useState<string>('client');
    const [versionManifest, setVersionManifest] = useState<MinecraftVersionList>();
    const [currentTask, setCurrentTask] = useState<DownloadTask | null>(null);
    const [processState, setProcessState] = useState<Tentative | null>();
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

        setCurrentTask(task);
        setIsProcessing(true);
        setProcessState(null);

        try {
            // 执行实际安装任务
            window.launcher.onProcess((_, state: any) => {
                setProcessState(state);
                task.onProgress?.(state);
            });
            window.launcher.onComplete(() => {
                setProcessState(0);
                setIsProcessing(false);
                setCurrentTask(null);
                taskParams.onComplete?.();
            });
            window.launcher.onFailed(() => {
                setProcessState(0);
                setIsProcessing(false);
                setCurrentTask(null);
            });
            await window.launcher.installTask(task.id, task.version);
        } catch (error) {
            console.error('Task failed:', error);
            taskParams.onError?.(error as Error);
        }
    }, [isProcessing]);

    useEffect(() => {
        window.launcher.getVersionManifest().then(res => setVersionManifest(res));
    }, []);

    const contextValue = useMemo(() => ({
        goTo,
        versionManifest,
        executeTask,
        currentTask,
        processPercentage: processState,
    }), [goTo, versionManifest, executeTask, currentTask, processState]);

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

                    <Fab
                        className="z-10 fixed right-4 bottom-4"
                        onClick={() => setSelectedPage('task')}
                        color="primary"
                        size="medium"
                    >
                        <svg
                            className="size-5 text-white dark:text-gray-950"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="currentColor"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                            <g id="SVGRepo_iconCarrier">
                                <title />
                                <g id="Complete">
                                    <g id="download">
                                        <g>
                                            <path
                                                d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                            />
                                            <g>
                                                <polyline
                                                    data-name="Right"
                                                    fill="none"
                                                    id="Right-2"
                                                    points="7.9 12.3 12 16.3 16.1 12.3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                />
                                                <line
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    x1={12}
                                                    x2={12}
                                                    y1="2.7"
                                                    y2="14.2"
                                                />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </Fab>

                    {processState && <div
                        style={{ width: `${processState.progress}%` }}
                        className="z-20 fixed inset-x-0 bottom-0 rounded-lg border-2 border-blue-600 transition-all"
                    >
                        <div className="relative">
                            <label className="absolute left-4 bottom-2">{processState.taskName}</label>
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
