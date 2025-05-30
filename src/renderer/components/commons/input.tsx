import clsx from 'clsx';
import React, { InputHTMLAttributes } from 'react';

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
    return (
        <input
            {...props}
            className={clsx(
                'w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow',
                props.className
            )}
            spellCheck={false}
            autoCapitalize="off"
        />
    );
};

export const RangeSlider: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
    const { ...rest } = props;
    return (
        <input
            { ...rest }
            type="range"
            className="transparent h-1 w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600"
        />
    );
};
