import { HTMLAttributes, useEffect, useRef, useState } from 'react';

export const Container: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, ...rest }) => {
    return (
        <div
            {...rest}
            className="px-4 py-6 w-full h-main relative flex flex-col overflow-y-scroll scroll-container"
        >
            {children}
        </div>
    );
};

export const ScrollMemoryContainer: React.FC<HTMLAttributes<HTMLDivElement> & {
    defaultPosition?: number;
    contentLoaded?: boolean; // 新增属性：内容加载状态
}> = ({ children, defaultPosition, contentLoaded = true, ...props }) => {
    const ref = useRef(null);
    const [scrollRestored, setScrollRestored] = useState(false);

    // 监听内容加载状态变化
    useEffect(() => {
        if (ref.current && defaultPosition && contentLoaded && !scrollRestored) {
            // 延迟执行确保DOM已完全渲染
            const timer = setTimeout(() => {
                ref.current.scrollTop = defaultPosition; // 使用直接赋值而非平滑滚动
                setScrollRestored(true);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [contentLoaded, defaultPosition, scrollRestored]);

    // 当滚动位置变化时保存状态
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        props.onScroll?.(e); // 传递原始事件
    };

    if (!contentLoaded) return null;

    return (
        <div
            {...props}
            ref={ref}
            onScroll={handleScroll}
            style={{ visibility: (defaultPosition && !scrollRestored) ? 'collapse' : 'visible' }}
            className="px-4 py-6 w-full h-main relative flex flex-col overflow-y-scroll scroll-container"
        >
            {children}
        </div>
    );
};
