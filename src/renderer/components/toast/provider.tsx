import { createContext, useContext, useState } from 'react';
import { SuccessToast, ErrorToast } from './toasts';

type ToastType = 'success' | 'warn' | 'error' | 'none';
type ToastData = { id: number; type: ToastType; message: string; duration: number; isShow: boolean; close: () => void };
type ToastContext = {
    addToast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContext>({
    addToast() {
        throw new Error("'addToast' is not defined.");
    },
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const addToast = (message: string, type: ToastType = 'success', duration = 3000) => {
        const id = Date.now();
        const closeToast = () => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        };
        setToasts((prev) => [...prev, { id, type, message, duration, isShow: true, close: closeToast }]);
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {toasts.length > 0 ? (
                <div className="fixed left-1/2 -translate-x-1/2 top-3 w-fit">
                    <div className="flex flex-col space-y-4 justify-start items-center">
                        {toasts.map((toast) => {
                            if (toast.type === 'success')
                                return (
                                    <SuccessToast
                                        key={toast.id}
                                        message={toast.message}
                                        duration={toast.duration}
                                        isShow={toast.isShow}
                                        close={toast.close}
                                    />
                                );
                            else if (toast.type === 'error')
                                return (
                                    <ErrorToast
                                        key={toast.id}
                                        message={toast.message}
                                        duration={toast.duration}
                                        isShow={toast.isShow}
                                        close={toast.close}
                                    />
                                );
                        })}
                    </div>
                </div>
            ) : null}
        </ToastContext.Provider>
    );
}
