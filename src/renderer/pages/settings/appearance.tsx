import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../App';

export default function AppearancePage() {
    const { setThemeMode, fetch } = useContext(AppContext);

    const [theme, setTheme] = useState<string>();

    useEffect(() => {
        window.store.get('appearance.theme').then(setTheme);
    }, []);

    if (!theme && !setThemeMode && !fetch) return null;

    return (
        <div className="px-4 py-6 w-full h-main flex flex-col overflow-y-auto">
            <div className="pb-2 mb-6 shadow-md rounded-lg bg-neutral-50 dark:bg-neutral-800 group">
                <div className="px-5 pt-3 mb-2">
                    <h2 className="text-xs font-bold font-[Inter] uppercase text-gray-900 dark:text-gray-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
                        Appearance
                    </h2>
                </div>
                <div className="flex flex-col px-5">
                    {/* Settings */}
                    <div className="px-2 mb-2 w-full h-9.5 flex flex-row space-x-3 items-center cursor-pointer rounded-lg">
                        <div>
                            <h4 className="text-sm text-gray-900 dark:text-gray-50">Theme</h4>
                        </div>
                        <div className="ml-auto w-full max-w-lg min-w-[200px]">
                            <div className="ml-auto w-full max-w-lg min-w-[200px]">
                                <div className="relative lex items-center">
                                    <select
                                        className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow appearance-none cursor-pointer"
                                        value={theme}
                                        onChange={(e) => {
                                            window.store.set('appearance.theme', e.target.value);
                                            setTheme(e.target.value);
                                            setThemeMode(e.target.value);
                                            fetch();
                                        }}
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="size-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
