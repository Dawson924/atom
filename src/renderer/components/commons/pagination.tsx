import clsx from 'clsx';
import React, { HTMLAttributes } from 'react';
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const Pagination: React.FC<HTMLAttributes<HTMLDivElement> & PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    ...props
}) => {
    const {
        className
    } = props;
    return (
        <div className={clsx('flex justify-center', className)}>
            <div className="w-[300px] bg-white dark:bg-neutral-800 rounded-xl shadow-md flex items-center justify-between transition-colors duration-300">
                {/* 首页按钮 */}
                <button
                    className={`flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200 text-neutral-600 dark:text-neutral-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-neutral-600 dark:hover:text-neutral-300' : ''}`}
                    onClick={() => currentPage > 0 && onPageChange(1)}
                    disabled={currentPage === 1}
                >
                    <FaAngleDoubleLeft />
                </button>

                {/* 上一页按钮 */}
                <button
                    className={`flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200 text-neutral-600 dark:text-neutral-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-neutral-600 dark:hover:text-neutral-300' : ''}`}
                    onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <FaAngleLeft />
                </button>

                {/* 页码显示 */}
                <div className="flex-1 flex justify-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        Page <span> {currentPage} </span> of <span> {totalPages} </span>
                    </span>
                </div>

                {/* 下一页按钮 */}
                <button
                    className={`flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200 text-neutral-600 dark:text-neutral-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 ${!totalPages || currentPage === totalPages ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-neutral-600 dark:hover:text-neutral-300' : ''}`}
                    onClick={() => currentPage > 0 && onPageChange(currentPage + 1)}
                    disabled={!totalPages || currentPage === totalPages}
                >
                    <FaAngleRight />
                </button>

                {/* 尾页按钮 */}
                <button
                    className={`flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200 text-neutral-600 dark:text-neutral-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 ${!totalPages || currentPage === totalPages ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-neutral-600 dark:hover:text-neutral-300' : ''}`}
                    onClick={() => currentPage > 0 && onPageChange(totalPages)}
                    disabled={!totalPages || currentPage === totalPages}
                >
                    <FaAngleDoubleRight />
                </button>
            </div>
        </div>
    );
};

export { Pagination };
