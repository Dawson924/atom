import { ReactElement, SVGProps } from 'react';

type SelectItem = {
    label: string;
    onSelect: () => void;
    icon: ReactElement<SVGProps<SVGElement>>;
};

function SelectPromptModal({
    open,
    onClose,
    title = 'Select',
    items,
    message,
    tip,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    items: SelectItem[];
    message?: string;
    tip?: { text: string; url: string };
}) {
    if (!open) return null;

    const handleSelect = (onSelect: () => void) => {
        onClose();
        onSelect();
    };

    return (
        <>
            <div className="overflow-y-auto overflow-x-hidden fixed top-0 left-0 right-0 bottom-0 z-40 flex justify-center items-center w-full md:inset-0 md:h-full">
                <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
                <div className="relative p-4 w-full max-w-md max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={onClose}
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {/* Modal body */}
                        <div className="p-4 md:p-5">
                            {message && (
                                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">{message}</p>
                            )}
                            <ul className="my-4 space-y-3">
                                {items.map((item) => {
                                    return (
                                        <li className="cursor-pointer">
                                            <button
                                                className="flex items-center p-3 w-full text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white cursor-pointer"
                                                onClick={() => handleSelect(item.onSelect)}
                                            >
                                                {item.icon ? item.icon : null}
                                                <span className="flex-1 ms-4 whitespace-nowrap text-left">
                                                    {item.label}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                            {tip && (
                                <div>
                                    <a
                                        href={tip.url}
                                        className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
                                    >
                                        <svg
                                            className="w-3 h-3 me-2"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                            />
                                        </svg>
                                        {tip.text}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export { SelectPromptModal };
