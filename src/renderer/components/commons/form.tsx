import clsx from 'clsx';
import { FormHTMLAttributes, InputHTMLAttributes } from 'react';
import { Input, Select } from './input';

type FormItemProps = {
    title?: string;
    name?: string;
};

const Form: React.FC<FormHTMLAttributes<HTMLFormElement>> = ({ children, onSubmit, ...rest }) => {
    return (
        <form {...rest} onSubmit={onSubmit}>
            {children}
        </form>
    );
};

const FormInput: React.FC<FormItemProps & InputHTMLAttributes<HTMLInputElement>> = ({ title, name, value, onChange }) => {
    return (
        <div className="px-2 w-full h-9.5 flex flex-row space-x-3 items-center">
            <div style={{ display: title ? 'block' : 'none' }} className="w-32 shrink-0">
                <h3 className="text-sm text-gray-900 dark:text-gray-50 dark:bg-neutral-800 group">{title}</h3>
            </div>
            <div className="w-full min-w-80">
                <Input
                    name={name}
                    defaultValue={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

const FormSelect: React.FC<FormItemProps & {
    options: { value: string, label: string }[];
    placeholder?: string;
} & InputHTMLAttributes<HTMLSelectElement>> = ({ title, name, value, onChange, placeholder, options }) => {
    return (
        <div className="px-2 w-full h-9.5 flex flex-row space-x-3 items-center">
            <div className="w-32 shrink-0">
                <h3 className="text-sm text-gray-900 dark:text-gray-50">{title}</h3>
            </div>
            <div className="w-full min-w-80">
                <div className="relative items-center">
                    <Select
                        name={name}
                        defaultValue={value}
                        onChange={onChange}
                        options={options}
                        placeholder={placeholder}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="size-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

const FormRangeInput: React.FC<FormItemProps & InputHTMLAttributes<HTMLInputElement>> = ({
    title,
    name,
    style,
    className,
    min,
    max,
    value,
    onChange,
}) => {
    return (
        <div className="px-2 w-full h-9.5 flex flex-row space-x-3 items-center">
            <div style={{ display: title ? 'block' : 'none' }} className="w-32 shrink-0">
                <h3 className="text-sm text-gray-900 dark:text-gray-50 dark:bg-neutral-800 group">{title}</h3>
            </div>
            <div className="flex flex-row w-full min-w-80">
                <input
                    type="range"
                    name={name}
                    style={style}
                    className={clsx('transparent h-1 w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600', className)}
                    min={min}
                    max={max}
                    defaultValue={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

const FormCheckbox: React.FC<FormItemProps & InputHTMLAttributes<HTMLInputElement>> = ({ title, name, checked, onClick }) => {
    return (
        <div className="px-2 w-full h-9.5 flex flex-row space-x-3 items-center">
            <div style={{ display: title ? 'block' : 'none' }} className="shrink-0">
                <h3 className="text-sm text-gray-900 dark:text-gray-50 dark:bg-neutral-800 group">{title}</h3>
            </div>
            <div className="w-full min-w-80">
                <div
                    className={`relative rounded-full ml-auto w-12 h-6 transition duration-200 ease-linear ${checked ? 'bg-blue-500 dark:bg-blue-400' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                >
                    <label
                        htmlFor={title}
                        className={`absolute left-0 bg-white dark:bg-neutral-800 border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer ${checked ? 'translate-x-full border-blue-500 dark:border-blue-400' : 'translate-x-0 border-neutral-300 dark:border-neutral-700'}`}
                    />
                    <input
                        type="checkbox"
                        id={title}
                        name={name}
                        className="appearance-none w-full h-full cursor-pointer active:outline-none focus:outline-none"
                        onClick={onClick}
                    />
                </div>
            </div>
        </div>
    );
};

export { Form, FormInput, FormSelect, FormRangeInput, FormCheckbox };
