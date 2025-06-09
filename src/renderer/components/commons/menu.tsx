import clsx from 'clsx';

const MenuItem = ({
    selected,
    uppercase,
    label,
    icon,
    className,
    onSelect
}: {
    selected: boolean;
    uppercase?: boolean;
    label: string;
    icon?: any;
    className?: string;
    onSelect?: () => void
}) => {
    // 根据选中状态和主题设置基础类
    const baseClasses = selected
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-600 dark:text-gray-400';

    // 处理标签是否需要大写
    const valuetext = uppercase ? label.toUpperCase() : label;

    return (
        <div
            className={clsx(
                `relative px-4 py-2 w-full space-x-2 flex justify-start items-center cursor-pointer ${baseClasses} hover:bg-blue-50 dark:hover:bg-neutral-700`,
                className
            )}
            onClick={onSelect}
        >
            {selected && (
                <div className="absolute left-0.5 top-1/4 h-1/2 rounded-sm border-l-3 border-blue-600 dark:border-blue-400"></div>
            )}
            {icon && <div className="size-5 flex items-center">{icon}</div>}
            <h4 className={`flex items-center ${uppercase ? 'text-xs tracking-tighter' : 'text-[13px]'} font-bold font-[Inter]`}>
                {valuetext}
            </h4>
        </div>
    );
};

export { MenuItem };