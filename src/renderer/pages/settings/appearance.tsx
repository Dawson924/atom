import { useCallback, useContext, useMemo } from 'react';
import { ThemeContext } from '../../App';
import { Card, CircleSpinner, Container, FormInput, FormSelect, Input, List } from '@renderer/components/commons';
import { useAppearance } from '@renderer/hooks/config';

export default function AppearancePage() {
    const { setThemeMode, fetch } = useContext(ThemeContext);
    const { config, loading, error, updateConfig } = useAppearance();

    // 窗口大小模式计算
    const windowSizeMode = useMemo(() => {
        if (!config?.windowSize) return 'default';
        const { width, height } = config.windowSize;
        if (width === 0 && height === 0) return 'default';
        if (width < 0 && height < 0) return 'fullscreen';
        return 'customized';
    }, [config?.windowSize]);

    const changeWindowSizeMode = useCallback((value: string) => {
        if (value === 'default') {
            updateConfig('windowSize', { width: 0, height: 0 });
        } else if (value === 'fullscreen') {
            updateConfig('windowSize', { width: -1, height: -1 });
        } else {
            updateConfig('windowSize', { width: 890, height: 540 });
        }
    }, [updateConfig]);

    if (loading) return <CircleSpinner text="Loading..." />;
    if (error) return <div>Error: {error}</div>;
    if (!config) return null;

    return (
        <Container>
            <Card title="appearance" className="mb-6">
                <List className="space-y-2">
                    <FormSelect
                        title="Theme"
                        value={config.theme}
                        onChange={(e) => {
                            updateConfig('theme', e.target.value);
                            setThemeMode(e.target.value);
                            fetch();
                        }}
                        options={[
                            { value: 'light', label: 'Light' },
                            { value: 'dark', label: 'Dark' }
                        ]}
                    />
                    <FormInput
                        title="Window Title"
                        name="windowTitle"
                        value={config.windowTitle}
                        onChange={(e) => updateConfig('windowTitle', e.target.value)}
                    />
                    <div className="p-0 min-w-80 grid grid-cols-7">
                        <div className={`max-md:col-span-7 ${windowSizeMode === 'customized' ? 'md:col-span-5' : 'md:col-span-7'}`}>
                            <FormSelect
                                title="Window Size"
                                name="windowSize"
                                value={windowSizeMode}
                                onChange={({ target: { value } }) => changeWindowSizeMode(value)}
                                options={[
                                    { value: 'default', label: 'Default' },
                                    { value: 'fullscreen', label: 'Fullscreen' },
                                    { value: 'customized', label: 'Customized' },
                                ]}
                            />
                        </div>
                        {windowSizeMode === 'customized' && (
                            <div className="md:col-span-2 max-md:hidden">
                                <div className="pr-2 w-full space-x-2 flex flex-row justify-end items-center">
                                    <Input
                                        className="w-1/3!"
                                        defaultValue={config.windowSize.width}
                                        onChange={(e) =>
                                            updateConfig('windowSize', {
                                                ...config.windowSize,
                                                width: parseInt(e.target.value)
                                            })
                                        }
                                    />
                                    <h3 className="text-black dark:text-gray-100">x</h3>
                                    <Input
                                        className="w-1/3!"
                                        defaultValue={config.windowSize.height}
                                        onChange={(e) =>
                                            updateConfig('windowSize', {
                                                ...config.windowSize,
                                                height: parseInt(e.target.value)
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </List>
            </Card>
        </Container>
    );
}
