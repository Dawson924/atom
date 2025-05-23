import React, { ChangeEventHandler } from 'react';

type FormItemProps = {
    title?: string;
    name?: string;
    value: any;
    onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>
};

const Form: React.FC<React.AnchorHTMLAttributes<HTMLFormElement>> = ({ children, onSubmit }) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col px-5">
                {children}
            </div>
        </form>
    );
};

const FormInput: React.FC<FormItemProps> = ({ title, name, value, onChange }) => {
    return (
        <div className="px-2 mb-2 w-full h-9.5 flex flex-row space-x-3 items-center rounded-lg">
            <div style={{ display: title ? 'block' : 'none' }} className="w-32 shrink-0">
                <h3 className="text-sm text-gray-900 dark:text-gray-50 dark:bg-neutral-800 group">{title}</h3>
            </div>
            <div className="w-full min-w-80">
                <input
                    name={name}
                    className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow"
                    defaultValue={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

const FormSelect: React.FC<FormItemProps & {
    options: { value: string, label: string }[];
}> = ({ title: name, value, onChange, options }) => {
    return (
        <div className="px-2 mb-2 w-full h-9.5 flex flex-row space-x-3 items-center rounded-lg">
            <div className="w-32 shrink-0">
                <h3 className="text-sm text-gray-900 dark:text-gray-50">{name}</h3>
            </div>
            <div className="w-full min-w-80">
                <div className="relative items-center">
                    <select
                        className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow appearance-none cursor-pointer"
                        value={value}
                        onChange={onChange}
                    >
                        {options.map((opt) => {
                            return <option key={opt.value} value={opt.value}>{opt.label}</option>;
                        })}
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="size-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export { Form, FormInput, FormSelect };
