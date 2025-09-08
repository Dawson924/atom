import React, { ButtonHTMLAttributes, HTMLAttributes, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
}> = ({ title, children, className }) => {
    return (
        <>
            <div
                className={clsx(
                    'pb-3 pt-3 shadow-sm rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:shadow-sm hover:shadow-blue-300 dark:hover:shadow-neutral-800 transition-all group',
                    className
                )}
            >
                {title && <div className="px-4 mb-2">
                    <h2 className="text-xs font-bold font-[Inter] uppercase text-gray-900 dark:text-gray-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
                        {title}
                    </h2>
                </div>}
                {children}
            </div>
        </>
    );
};

const Accordion: React.FC<
    HTMLAttributes<HTMLDivElement> &
    ButtonHTMLAttributes<HTMLButtonElement> & {
        open: boolean;
        title: string;
        description?: string;
    }> = (props) => {
        const { title, description, open, className, children, onClick } = props;

        const contentRef = useRef(null);
        const [contentHeight, setContentHeight] = useState<number>();
        const isMounted = useRef(true); // 新增引用，跟踪组件是否挂载

        useEffect(() => {
            // 组件卸载时设置标记
            return () => {
                isMounted.current = false;
            };
        }, []);

        useEffect(() => {
            if (contentRef.current) {
                const calculateHeight = () => {
                    if (isMounted.current && contentRef.current) {
                        const height = contentRef.current.scrollHeight;
                        setContentHeight(height);
                    }
                };

                // 初始计算
                calculateHeight();

                // 监听内容变化
                const observer = new ResizeObserver(calculateHeight);
                observer.observe(contentRef.current);

                return () => observer.disconnect();
            }
        }, [open]); // 依赖项根据实际数据变化调整

        return (
            <div
                className={clsx(
                    'px-4 shadow-md rounded-lg bg-neutral-50 dark:bg-neutral-800 transition-transform cursor-pointer',
                    open && 'pb-3',
                    className
                )}>
                <div
                    className="transition-all duration-400 ease-in-out cursor-pointer"
                >
                    <button
                        type="button"
                        className="py-3 w-full flex items-center justify-between cursor-pointer"
                        onClick={onClick}
                    >
                        <div className="space-x-6 flex flex-row justify-start items-center">
                            <h2 className="uppercase text-xs font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
                            <span className="text-xs text-gray-500">{description}</span>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="size-5 text-gray-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                    <div
                        style={{
                            maxHeight: open ? `${contentHeight}px` : '0',
                            opacity: open ? 1 : 0
                        }}
                        className="overflow-hidden transition-all duration-400 ease-in-out"
                    >
                        <div ref={contentRef} className="flex flex-col">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

export { Card, Accordion };
