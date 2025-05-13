import { useState } from 'react';
import StartupPage from './startup';
import AppearancePage from './appearance';

export default function SettingsPage() {
    const [selectedPage, setSelectedPage] = useState<string>('startup');

    const MenuItem = ({ value, icon }: {
        value: string;
        icon: Tentative;
    }) => {
        return (
            value === selectedPage ?
                <SelectedItem value={value} icon={icon} /> :
                <UnselectedItem value={value} icon={icon} onClick={() => setSelectedPage(value)} />
        );
    };

    return (
        <div className="h-main bg-blue-100 dark:bg-neutral-700">
            <div className="flex flex-row">

                <div className="z-10 w-40 h-main flex flex-shrink-0 flex-col shadow-lg border-r border-gray-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                    <div className="w-full h-full shadow-md">
                        <nav aria-label="Main" className="flex flex-col h-full">
                            {/* Links */}
                            <div className="text-sm font-semibold overflow-hidden hover:overflow-auto">
                                <MenuItem value="startup" icon={(
                                    <svg
                                        className="size-5"
                                        viewBox="0 0 16 16"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                    >
                                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                        <g id="SVGRepo_iconCarrier">
                                            <path d="M2.67 10.73a3.52 3.52 0 0 0-.94 1.93 5 5 0 0 0-.07 1.1v.58h.8a5.05 5.05 0 0 0 .88-.08 3.46 3.46 0 0 0 1.93-.94 1.76 1.76 0 0 0-.14-2.48 1.76 1.76 0 0 0-2.46-.11zm1.74 1.73a2.26 2.26 0 0 1-1.26.6h-.22v-.22a2.26 2.26 0 0 1 .6-1.26.36.36 0 0 1 .24-.08.67.67 0 0 1 .47.22.54.54 0 0 1 .17.74zM14.65 2.24a.91.91 0 0 0-.89-.89A8.75 8.75 0 0 0 7.27 3.5L5.64 5.4l-2.4-.5a1 1 0 0 0-.92.27l-.68.68a1 1 0 0 0-.28.81 1 1 0 0 0 .45.74l2.06 1.32.13.08 3.2 3.25.08.08 1.32 2.06a1 1 0 0 0 .74.45h.11a1 1 0 0 0 .7-.29l.68-.68a1 1 0 0 0 .27-.92l-.5-2.39 1.84-1.58a8.79 8.79 0 0 0 2.21-6.54zM3.11 6.15l1.32.28-.64.75-1-.67zm6.38 7.1-.67-1 .75-.64.28 1.32zm2.39-5.11.18.17zm-.28-.28L7.92 11 5 8.08 8.14 4.4a7.44 7.44 0 0 1 5.26-1.8 7.48 7.48 0 0 1-1.8 5.26z" />
                                            <path d="M11.13 6.63a1.19 1.19 0 0 0-.06-1.7 1.16 1.16 0 1 0-1.64 1.63 1.2 1.2 0 0 0 1.7.07z" />
                                        </g>
                                    </svg>

                                )} />
                                <MenuItem value="appearance" icon={(
                                    <svg
                                        className="size-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                        <g id="SVGRepo_iconCarrier">
                                            <path
                                                d="M8,0 C12.4183,0 16,3.58172 16,8 C16,8.15958 15.9953,8.31807 15.9861,8.47533 C15.9328,9.38596 15.1095,10.0039 14.1974,10.0039 L11.0106,10.0039 C9.22875,10.0039 8.33642,12.1582 9.59635,13.4181 C10.4823,14.304 10.198,15.7959 8.95388,15.9437 C8.6411,15.9809 8.32278,16 8,16 C3.58172,16 0,12.4183 0,8 C0,3.58172 3.58172,0 8,0 Z M8,2 C4.68629,2 2,4.68629 2,8 C2,11.1538 4.4333,13.7393 7.52492,13.9815 C6.059,11.4506 7.82321,8.00391 11.0106,8.00391 L14,8.00391 C14,4.68629 11.3137,2 8,2 Z M5,8 C5.55228,8 6,8.44771 6,9 C6,9.55228 5.55228,10 5,10 C4.44772,10 4,9.55228 4,9 C4,8.44771 4.44772,8 5,8 Z M6,5 C6.55228,5 7,5.44772 7,6 C7,6.55228 6.55228,7 6,7 C5.44772,7 5,6.55228 5,6 C5,5.44772 5.44772,5 6,5 Z M9,4 C9.55228,4 10,4.44772 10,5 C10,5.55228 9.55228,6 9,6 C8.44771,6 8,5.55228 8,5 C8,4.44772 8.44771,4 9,4 Z"
                                            />
                                        </g>
                                    </svg>
                                )} />
                            </div>
                        </nav>
                    </div>
                </div>

                {
                    selectedPage === 'startup' ?
                        <StartupPage /> :
                        selectedPage === 'appearance' ?
                            <AppearancePage /> :
                            <></>
                }

            </div>
        </div>
    );
}

const SelectedItem = ({ value, icon }: { value: string; icon: Tentative }) => (
    <div
        className="relative px-4 py-2 w-full space-x-1 flex justify-start items-center cursor-pointer text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-neutral-700"
    >
        <div className="absolute left-0.5 top-1/4 h-1/2 rounded-sm border-l-3 border-blue-600 dark:border-blue-400"></div>
        {icon}
        <h4 className="text-xs font-bold font-[Inter] tracking-tighter uppercase">
            {value}
        </h4>
    </div>
);

const UnselectedItem = ({ value, icon, onClick }: { value: string; icon: Tentative; onClick: () => void }) => (
    <div
        className="relative px-4 py-2 w-full space-x-1 flex justify-start items-center cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-neutral-700"
        onClick={onClick}
    >
        {icon}
        <h4 className="text-xs font-bold font-[Inter] tracking-tighter uppercase">
            {value}
        </h4>
    </div>
);
