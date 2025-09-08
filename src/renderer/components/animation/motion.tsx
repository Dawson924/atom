import { useAppearanceConfig } from '@renderer/hooks/config';
import React, { HTMLAttributes } from 'react';

export const Motion: React.FC<HTMLAttributes<HTMLElement> & {
    animation: string;
}> = ({
    children,
    animation,
}) => {
    const { config, loading } = useAppearanceConfig();
    if (loading) return null;

    return (
        <div
            className={config.animation.effect ? animation : ''}
        >
            {children}
        </div>
    );
};
