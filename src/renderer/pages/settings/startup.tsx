import { ChangeEvent, useEffect, useState } from 'react';

export default function StartupPage() {
    const [windowTitle, setWindowTitle] = useState<string>('');
    const [javaPath, setJavaPath] = useState<string>('');

    useEffect(() => {
        window.store.get('launcher.windowTitle').then(setWindowTitle);
        window.store.get('launcher.javaPath').then(setJavaPath);
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        window.store.set(`launcher.${e.target.name}`, value);
    };

    return (
        <div className="px-4 py-6 w-full h-main flex flex-col overflow-y-auto">
            <div className="pb-2 mb-6 shadow-md rounded-lg bg-neutral-50 dark:bg-neutral-800 group">
                <div className="px-5 pt-3 mb-2">
                    <h2 className="text-xs font-bold font-[Inter] uppercase text-gray-900 dark:text-gray-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
                        Launch
                    </h2>
                </div>
                <div className="flex flex-col px-5">
                    {/* Settings */}
                    <div className="px-2 mb-2 w-full h-9.5 flex flex-row space-x-3 items-center cursor-pointer rounded-lg">
                        <div>
                            <h4 className="text-sm text-gray-900 dark:text-gray-50">Window Title</h4>
                        </div>
                        <div className="ml-auto w-full max-w-lg min-w-[200px]">
                            <input
                                name="windowTitle"
                                className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow"
                                defaultValue={windowTitle}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="px-2 mb-2 w-full h-9.5 flex flex-row space-x-3 items-center cursor-pointer rounded-lg">
                        <div>
                            <h4 className="text-sm text-gray-900 dark:text-gray-50">Java Path</h4>
                        </div>
                        <div className="ml-auto w-full max-w-lg min-w-[200px]">
                            <input
                                name="javaPath"
                                className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow"
                                defaultValue={javaPath}
                                onChange={handleChange}
                            />
                        </div>
                        {/* <div className="ml-auto w-full max-w-lg min-w-[200px]">
                            <div className="relative lex items-center">
                                <select className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-300 text-sm border border-slate-200 rounded-md pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow appearance-none cursor-pointer">
                                    
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="size-5 ml-1 absolute top-2.5 right-2.5 text-gray-300">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                </svg>
                            </div>
                        </div> */}
                    </div>
                    <div className="px-2 mb-2 w-full h-9.5 flex flex-row space-x-3 items-center cursor-pointer rounded-lg">
                        <div>
                            <h4 className="text-sm text-gray-900 dark:text-gray-50">JVM Arguments</h4>
                        </div>
                        <div className="ml-auto w-full max-w-lg min-w-[200px]">
                            <input className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow" />
                        </div>
                    </div>
                    <div className="px-2 mb-2 w-full h-9.5 flex flex-row space-x-3 items-center cursor-pointer rounded-lg">
                        <div>
                            <h4 className="text-sm text-gray-900 dark:text-gray-50">MC Arguments</h4>
                        </div>
                        <div className="ml-auto w-full max-w-lg min-w-[200px]">
                            <input className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
