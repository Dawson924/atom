import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../App';
import { Card, Container, FormInput, FormSelect, Input, List } from '@renderer/components/commons';
import { ConfigService } from '@renderer/api';

export default function AppearancePage() {
    const { setThemeMode, fetch } = useContext(ThemeContext);
    const [windowTitle, setWindowTitle] = useState<string>('');
    const [windowSizeMode, setWindowSizeMode] = useState<'default' | 'fullscreen' | 'customized'>('default');
    const [windowSize, setWindowSize] = useState<{ width: number; height: number; }>();

    const [theme, setTheme] = useState<string>();

    useEffect(() => {
        ConfigService.get('appearance.theme').then(setTheme);
        ConfigService.get('appearance.windowTitle').then(setWindowTitle);
        ConfigService.get('appearance.windowSize').then(setWindowSize);
    }, []);

    useEffect(() => {
        if (!windowSize) return;
        const determineMode = (size: typeof windowSize) => {
            if (size.width === 0 && size.height === 0) return 'default';
            else if (size.width < 0 && size.height < 0) return 'fullscreen';
            else return 'customized';
        };
        setWindowSizeMode(determineMode(windowSize));
        ConfigService.set('appearance.windowSize', windowSize);
    }, [windowSize]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        ConfigService.set(`appearance.${e.target.name}`, value);
    };

    const changeWindowSizeMode = (value: string) => {
        if (value === 'default') {
            setWindowSize({ width: 0, height: 0 });
        } else if (value === 'fullscreen') {
            setWindowSize({ width: -1, height: -1 });
        } else {
            setWindowSize(prev => {
                const isValid = prev?.width >= 890 && prev?.height >= 540;
                return isValid ? prev : { width: 890, height: 540 };
            });
        }
    };

    if (!theme || !setThemeMode || !fetch || !windowSizeMode) return null;

    return (
        <Container>
            <Card
                title="appearance"
                className="mb-6"
            >
                <List className="space-y-2">
                    <FormSelect
                        title="Theme"
                        value={theme}
                        onChange={(e) => {
                            ConfigService.set('appearance.theme', e.target.value);
                            setTheme(e.target.value);
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
                        value={windowTitle}
                        onChange={handleChange}
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
                        {windowSizeMode === 'customized' && <div className="md:col-span-2 max-md:hidden">
                            <div className="pr-2 w-full space-x-2 flex flex-row justify-end items-center">
                                <Input
                                    className="w-1/3!"
                                    defaultValue={windowSize?.width || ''}
                                    onChange={(e) => setWindowSize(pre => ({ ...pre, width: parseInt(e.target.value) }))}
                                />
                                <h3 className="text-black dark:text-gray-100">x</h3>
                                <Input
                                    className="w-1/3!"
                                    defaultValue={windowSize?.height || ''}
                                    onChange={(e) => setWindowSize(pre => ({ ...pre, height: parseInt(e.target.value) }))}
                                />
                            </div>
                        </div>}
                    </div>
                </List>
            </Card>
        </Container>
    );
}
