import { useEffect, useState } from 'react';

export function ErrorToast({
    message,
    duration = 3000,
    isShow,
    close,
}: {
    message: string;
    duration?: number;
    isShow: boolean;
    close: () => void;
}) {
    const [isExiting, setIsExiting] = useState(false);
    const animationDuration = 300;

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            close();
        }, animationDuration);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isShow) {
            setIsExiting(false);
        }
    }, [isShow]);

    if (!isShow && !isExiting) {
        return null;
    }

    return (
        <div
            id="toast-danger"
            className={`z-50 flex items-center w-fit p-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-neutral-800 ${isExiting ? 'animate-slide-out' : 'animate-slide-in'}`}
            role="alert"
        >
            <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                </svg>
                <span className="sr-only">Error icon</span>
            </div>
            <div className="ms-3 me-5 text-sm font-normal">{message}</div>
            <button
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg p-1.5 hover:bg-neutral-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-neutral-800 dark:hover:bg-neutral-700"
                onClick={handleClose}
            >
                <span className="sr-only">Close</span>
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
            </button>
        </div>
    );
}
