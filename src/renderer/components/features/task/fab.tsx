import { useTask } from '@renderer/hooks/store';
import { useState } from 'react';
import { FaDownload } from 'react-icons/fa';

export const TaskFloatingButton = () => {
    const { taskStates, isProcessing } = useTask();
    const [menuOpened, setMenuOpened] = useState(false);

    const totalProgress = taskStates.reduce((sum, task) =>
        sum + task.progress, 0) / Math.max(1, taskStates.length);

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
                    <FaDownload />
                    {/* 进度环 */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 56 56">
                        <circle
                            cx={28}
                            cy={28}
                            r={24}
                            fill="none"
                            stroke="#165DFF20"
                            strokeWidth={3}
                        />
                        <circle
                            id="progress-circle"
                            className="progress-ring-circle"
                            cx={28}
                            cy={28}
                            r={24}
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth={3}
                            strokeDasharray="150.8"
                            strokeDashoffset={`${150.8 * (1 - totalProgress / 100)}`}
                        />
                    </svg>
                </button>
                {/* 任务菜单 (默认隐藏) */}
                <div
                    style={{ display: menuOpened ? 'block' : 'none' }}
                    className="bg-white rounded-lg shadow-xl absolute bottom-20 right-0 w-72 border border-gray-100 animate-fade-in"
                >
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">后台任务</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {/* 显示所有任务 */}
                        {taskStates.filter(t => t.name === 'task:json').map(task => (
                            <div key={task.name} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-800">Downloading version metadata</span>
                                    <span className={`text-xs font-medium ${task.progress === 100 ? 'text-green-500' : 'text-blue-500'}`}>
                                        {Number(task.progress.toFixed(0))}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
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
                            <div key={task.name} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-800">Downloading version jar</span>
                                    <span className={`text-xs font-medium ${task.progress === 100 ? 'text-green-500' : 'text-blue-500'}`}>
                                        {Number(task.progress.toFixed(0))}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
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
                            <div key={task.name} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-gray-800">Downloading dependencies</span>
                                    <span className={`text-xs font-medium ${task.progress === 100 ? 'text-green-500' : 'text-blue-500'}`}>
                                        {Number(task.progress.toFixed(0))}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
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
                        className="p-4 border-t border-gray-100 flex justify-between items-center"
                        onClick={() => null}
                    >
                        <span className="text-sm text-gray-500">查看全部任务</span>
                    </div>
                </div>
            </div>
        </>
    );
};
