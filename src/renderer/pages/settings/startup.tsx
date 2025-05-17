import { ChangeEvent, useEffect, useState } from 'react';
import { Card, Container, Form, FormInput, FormSelect } from '../../components/commons';

export default function StartupPage() {
    const [windowTitle, setWindowTitle] = useState<string>('');
    const [windowSizeMode, setWindowSizeMode] = useState<'default' | 'fullscreen' | 'customized'>();
    const [windowSize, setWindowSize] = useState<{ width: number; height: number; } | null>();
    const [javaPath, setJavaPath] = useState<string>('');
    const [jvmArgs, setJvmArgs] = useState<string>('');
    const [mcArgs, setMcArgs] = useState<string>('');

    useEffect(() => {
        window.config.get('launch.windowTitle').then(setWindowTitle);
        window.config.get('launch.windowSize').then(setWindowSize);
        window.config.get('launch.javaPath').then(setJavaPath);
        window.config.get('launch.extraArguments.jvm').then(setJvmArgs);
        window.config.get('launch.extraArguments.mc').then(setMcArgs);
    }, []);

    useEffect(() => {
        const determineMode = (size: typeof windowSize) => {
            if (!size) return 'default';
            return size.width < 0 && size.height < 0 ? 'fullscreen' : 'customized';
        };
        setWindowSizeMode(determineMode(windowSize));
        if (windowSize)
            window.config.set('launch.windowSize', windowSize);
    }, [windowSize]);

    useEffect(() => {
        if (windowSizeMode === 'default')
            window.config.delete('launch.windowSize');
    }, [windowSizeMode]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        window.config.set(`launch.${e.target.name}`, value);
    };

    const handleWindowSizeChange = (value: string) => {
        if (value === 'default') {
            setWindowSize(null);
        } else if (value === 'fullscreen') {
            setWindowSize({ width: -1, height: -1 });
        } else {
            // 保留用户之前有效的自定义尺寸
            setWindowSize(prev => {
                const isValid = prev?.width > 0 && prev?.height > 0;
                return isValid ? prev : { width: 854, height: 480 };
            });
        }
    };

    return (
        <Container>
            <Card title="Launch">
                <Form>
                    <FormInput
                        title="Window Title"
                        name="windowTitle"
                        value={windowTitle}
                        onChange={handleChange}
                    />
                    <div className="p-0 md:pr-2 min-w-80 grid grid-cols-7">
                        <div className={`max-md:col-span-7 ${windowSizeMode==='customized' ? 'md:col-span-5' : 'md:col-span-7'}`}>
                            <FormSelect
                                title="Window Size"
                                name="windowSize"
                                value={windowSizeMode}
                                onChange={({ target: { value } }) => handleWindowSizeChange(value)}
                                options={[
                                    { value: 'default', label: 'Default' },
                                    { value: 'fullscreen', label: 'Fullscreen' },
                                    { value: 'customized', label: 'Customized' },
                                ]}
                            />
                        </div>
                        {windowSizeMode === 'customized' && <div className="md:col-span-2 max-md:hidden">
                            <div className="w-full space-x-2 flex flex-row justify-end items-center">
                                <input
                                    className="w-1/3 h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow"
                                    defaultValue={windowSize?.width || ''}
                                    onChange={(e) => setWindowSize(pre => ({ ...pre, width: parseInt(e.target.value) }))}
                                />
                                <h3>x</h3>
                                <input
                                    className="w-1/3 h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow"
                                    defaultValue={windowSize?.height || ''}
                                    onChange={(e) => setWindowSize(pre => ({ ...pre, height: parseInt(e.target.value) }))}
                                />
                            </div>
                        </div>}
                    </div>
                    <FormInput
                        title="Java Path"
                        name="javaPath"
                        value={javaPath}
                        onChange={handleChange}
                    />
                    <FormInput
                        title="JVM Arguments"
                        name="extraArguments.jvm"
                        value={jvmArgs}
                        onChange={handleChange}
                    />
                    <FormInput
                        title="MC Arguments"
                        name="extraArguments.mc"
                        value={mcArgs}
                        onChange={handleChange}
                    />
                </Form>
            </Card>
        </Container>
    );
}
