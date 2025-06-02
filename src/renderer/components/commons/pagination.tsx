import clsx from 'clsx';
import React, { HTMLAttributes } from 'react';
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight } from 'react-icons/fa';

type PaginationProps = {
    currentPage: number;
    onPageChange: (page: number) => void;
};

const Pagination: React.FC<HTMLAttributes<HTMLDivElement> & PaginationProps> = ({
    currentPage,
    onPageChange,
    ...props
}) => {
    const {
        className
    } = props;
    return (
        <div className={clsx('flex justify-center', className)}>
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md flex items-center justify-between transition-colors duration-300">
                {/* 首页按钮 */}
                <button
                    className={`flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200 text-neutral-600 dark:text-neutral-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-neutral-600 dark:hover:text-neutral-300' : ''}`}
                    onClick={() => currentPage > 0 && onPageChange(1)}
                    disabled={currentPage === 1}
                >
                    <FaAngleDoubleLeft />
                </button>

                <div className="mr-5 w-24 flex justify-between items-center">
                    {/* 上一页按钮 */}
                    <button
                        className={`flex items-center justify-center h-10 rounded-lg transition-all duration-200 text-neutral-600 dark:text-neutral-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-neutral-600 dark:hover:text-neutral-300' : ''}`}
                        onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <FaAngleLeft />
                    </button>

                    {/* 页码显示 */}
                    <div className="w-10 flex justify-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                            <span> {currentPage} </span>
                        </span>
                    </div>

                    {/* 下一页按钮 */}
                    <button
                        className="flex items-center justify-center h-10 rounded-lg transition-all duration-200 text-neutral-600 dark:text-neutral-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
                        onClick={() => currentPage > 0 && onPageChange(currentPage + 1)}
                    >
                        <FaAngleRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export { Pagination };
