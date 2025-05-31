import { Input } from '@renderer/components/commons';
import { useState } from 'react';

function InputModal({
    open,
    onClose,
    title,
    name,
    onConfirm
}:
    Tentative
) {
    if (!open) return null;

    const [value, setValue] = useState<string>();

    const handleConfirm = async () => {
        await onConfirm(value);
        onClose();
    };

    return (
        <>
            <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-40 flex justify-center items-center w-full md:inset-0 md:h-full">
                <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
                <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                    {/* Modal content */}
                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-neutral-800 sm:p-5">
                        {/* Modal header */}
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-neutral-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={onClose}
                            >
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {/* Modal body */}
                        <form>
                            <div className="grid gap-4 mb-7.5 sm:grid-cols-2">
                                <div className="col-span-2">
                                    <label
                                        htmlFor="name"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        {name || 'Value'}
                                    </label>
                                    <Input
                                        type="text"
                                        id="name"
                                        className="h-10!"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-neutral-300 disabled:dark:bg-neutral-600 hover:cursor-pointer disabled:cursor-default"
                                    onClick={handleConfirm}
                                    disabled={!value}
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export { InputModal };
