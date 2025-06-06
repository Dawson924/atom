import { useTask } from '@renderer/hooks/store';
import { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { useNavigate } from '@renderer/router';

export const TaskFloatingButton = () => {
    const { taskStates, isProcessing } = useTask();
    const navigate = useNavigate();

    const [menuOpened, setMenuOpened] = useState(false);

    if (!isProcessing || taskStates.length === 0) return null;

    return (
        <>
            {menuOpened && <div className="fixed inset-0 z-10" onClick={() => setMenuOpened(false)}></div>}
            <div className="fixed bottom-6 right-6 z-20">
                {/* FAB 按钮 */}
                <button
                    className="relative bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow hover:bg-blue-600/90 animate-bounce-in cursor-pointer"
                    onClick={() => setMenuOpened(prev => !prev)}
                >
                    <FaDownload className="animate-pulse" />
                    {/* 进度环 */}
                    <svg className="absolute inset-0 w-full h-full animate-[spin_1.5s_linear_infinite]" viewBox="0 0 56 56">
                        <circle
                            className="stroke-blue-600"
                            cx={28}
                            cy={28}
                            r={24}
                            fill="none"
                            strokeWidth={3}
                        />
                        <circle
                            className="stroke-blue-200"
                            cx={28}
                            cy={28}
                            r={24}
                            fill="none"
                            strokeWidth={3}
                            strokeDasharray="150.8"
                            strokeDashoffset="120"
                        />
                    </svg>
                </button>
                {/* 任务菜单 (默认隐藏) */}
                <div
                    style={{ display: menuOpened ? 'block' : 'none' }}
                    className="bg-neutral-50 dark:bg-neutral-700 rounded-lg shadow-xl absolute bottom-20 right-0 w-72 border border-neutral-100 dark:border-neutral-800 animate-fade-in"
                >
                    <div className="p-4 border-b border-neutral-100 dark:border-neutral-600">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Backend Tasks</h3>
                    </div>
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-600">
                        {/* 显示所有任务 */}
                        {taskStates.filter(t => t.name === 'task:json').map(task => (
                            <div key={task.name} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-800 dark:text-gray-200">Installing metadata...</span>
                                    <span className={`text-xs font-medium ${task.progress === 100 ? 'text-green-500' : 'text-blue-500'}`}>
                                        {Number(task.progress.toFixed(0))}%
                                    </span>
                                </div>
                                <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5">
                                    <div
                                        className={`${task.progress === 100 ? 'bg-green-500' : 'bg-blue-500'} h-1.5 rounded-full transition-all duration-300`}
                                        style={{ width: `${task.progress}%` }}
                                    />
                                </div>
                                {/* 任务完成状态图标 */}
                                {Number(task.progress.toFixed(0)) === 100 && (
                                    <div className="mt-1 flex items-center text-green-500 text-xs">
                                        <i className="fa fa-check-circle mr-1" />
                                        <span>Done</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {taskStates.filter(t => t.name === 'task:jar').map(task => (
                            <div key={task.name} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-800 dark:text-gray-200">Installing executable...</span>
                                    <span className={`text-xs font-medium ${task.progress === 100 ? 'text-green-500' : 'text-blue-500'}`}>
                                        {Number(task.progress.toFixed(0))}%
                                    </span>
                                </div>
                                <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5">
                                    <div
                                        className={`${task.progress === 100 ? 'bg-green-500' : 'bg-blue-500'} h-1.5 rounded-full transition-all duration-300`}
                                        style={{ width: `${task.progress}%` }}
                                    />
                                </div>
                                {/* 任务完成状态图标 */}
                                {Number(task.progress.toFixed(0)) === 100 && (
                                    <div className="mt-1 flex items-center text-green-500 text-xs">
                                        <i className="fa fa-check-circle mr-1" />
                                        <span>Done</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {taskStates.filter(t => t.name === 'task:dependencies').map(task => (
                            <div key={task.name} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-800 dark:text-gray-200">Dependencies</span>
                                    <span className={`text-xs font-medium ${task.progress === 100 ? 'text-green-500' : 'text-blue-500'}`}>
                                        {Number(task.progress.toFixed(0))}%
                                    </span>
                                </div>
                                <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5">
                                    <div
                                        className={`${task.progress === 100 ? 'bg-green-500' : 'bg-blue-500'} h-1.5 rounded-full transition-all duration-300`}
                                        style={{ width: `${task.progress}%` }}
                                    />
                                </div>
                                {/* 任务完成状态图标 */}
                                {Number(task.progress.toFixed(0)) === 100 && (
                                    <div className="mt-1 flex items-center text-green-500 text-xs">
                                        <i className="fa fa-check-circle mr-1" />
                                        <span>Done</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div
                        className="p-4 border-t border-neutral-100 dark:border-neutral-600 flex justify-between items-center cursor-pointer"
                        onClick={() => navigate('tasks')}
                    >
                        <span className="text-sm text-gray-500">View all tasks</span>
                    </div>
                </div>
            </div>
        </>
    );
};
