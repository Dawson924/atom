import clsx from 'clsx';
import React, { HTMLAttributes, ImgHTMLAttributes } from 'react';

export const List: React.FC<HTMLAttributes<HTMLDivElement>> = (props) => {
    const { children, className } = props;
    return (
        <div className={clsx(
            'flex flex-col px-4',
            className
        )}>
            {children}
        </div>
    );
};

export const Old_ListItem: React.FC<
    HTMLAttributes<HTMLDivElement> &
    ImgHTMLAttributes<HTMLImageElement> &
    { title: string; description: string }
> = (props) => {
    const { title, description, className, src, alt, ...rest } = props;
    return (
        <div
            {...rest}
            key={title}
            className={clsx(
                'px-3 w-full h-12 flex flex-row space-x-3 items-center cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-neutral-700 transition-colors will-change-transform',
                className
            )}
        >
            <div className="w-8 h-8 flex-shrink-0">
                <img
                    src={src}
                    alt={alt || title}
                    className="size-full"
                />
            </div>
            <div className="w-full h-full flex flex-col items-start justify-center">
                <p className="text-sm font-light text-gray-900 dark:text-gray-50">{title}</p>
                <p className="text-xs text-gray-400">{description}</p>
            </div>
        </div>
    );
};

export const ListItem: React.FC<
    HTMLAttributes<HTMLDivElement> &
    ImgHTMLAttributes<HTMLImageElement> &
    {
        title: string;
        description: string;
        variant?: string;
    }
> = (props) => {
    const {
        title,
        description,
        className,
        src,
        alt,
        variant = 'compact',
        onClick,
        ...rest
    } = props;

    const renderVariant = () => {
        switch (variant) {
        case 'standard':
            return (
                <div className="px-2 w-full h-16 flex flex-row space-x-2 items-center cursor-pointer rounded-lg hover:bg-blue-100 dark:hover:bg-neutral-700 transition-all">
                    <div className="w-12 h-12 flex-shrink-0">
                        <img
                            src={src}
                            alt={alt || title}
                            className="w-full h-full rounded-md object-cover"
                        />
                    </div>
                    <div className="w-full h-full flex flex-col items-start justify-center pl-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                            {title}
                        </p>
                        <p className="text-xs text-gray-500 w-xl lg:w-3xl xl:5xl whitespace-nowrap overflow-ellipsis overflow-hidden">
                            {description}
                        </p>
                    </div>
                </div>
            );

        case 'compact':
        default:
            return (
                <div className="px-3 w-full h-12 flex flex-row space-x-3 items-center cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-neutral-700 transition-colors">
                    <div className="w-8 h-8 flex-shrink-0">
                        <img
                            src={src}
                            alt={alt || title}
                            className="w-full h-full rounded object-cover"
                        />
                    </div>
                    <div className="w-full h-full flex flex-col items-start justify-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{title}</p>
                        <p className="text-xs text-gray-500 max-w-xl whitespace-nowrap overflow-ellipsis overflow-hidden">{description}</p>
                    </div>
                </div>
            );
        }
    };

    return (
        <div
            {...rest}
            onClick={onClick}
            className={clsx(
                'w-full will-change-transform',
                className
            )}
        >
            {renderVariant()}
        </div>
    );
};
