import React, { useState } from 'react';

type Props = {
    title: string;
    children: React.ReactNode;
};

const Card: React.FC<Props> = ({ title, children }) => {
    return (
        <>
            <div className="pb-2 mb-6 shadow-sm rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:shadow-sm hover:shadow-blue-400 dark:hover:shadow-neutral-800 transition-all group">
                <div className="px-5 pt-3 mb-2">
                    <h2 className="text-xs font-bold font-[Inter] uppercase text-gray-900 dark:text-gray-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
                        {title}
                    </h2>
                </div>
                {
                    children
                }
            </div>
        </>
    );
};

const Accortion: React.FC<Props & any> = ({ title, children, defaultChecked }) => {
    const [open, setOpen] = useState<boolean>(defaultChecked);

    return (
        <div
            className="relative pb-2 mb-6 shadow-md rounded-lg bg-neutral-50 dark:bg-neutral-800 group"
            onClick={() => setOpen(pre => !pre)}
        >
            <div className="px-5 pt-3 mb-2">
                <h2 className="text-xs font-bold font-[Inter] uppercase text-gray-900 dark:text-gray-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
                    {title}
                </h2>
            </div>
            {
                open
                ??
                <div className="flex flex-col px-5">
                    {
                        children
                    }
                </div>
            }
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="size-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
            </svg>
        </div>
    );
};

export { Card, Accortion };
