import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from '../../App';
import { Accordion, Card, Container, FormCheckbox, FormInput, FormSelect, Input, List } from '@renderer/components/commons';
import { useAppearanceConfig } from '@renderer/hooks/config';
import { useTranslation } from 'react-i18next';
import { Motion } from '@renderer/components/animation';
import { useSettingsPage } from '@renderer/hooks/store';

export default function AppearancePage() {
    const { updateTheme } = useContext(ThemeContext);
    const { config, loading, error, updateConfig } = useAppearanceConfig();
    const { cacheMap } = useSettingsPage();
    const { t, i18n } = useTranslation();

    const [expanded, setExpanded] = useState<string>(cacheMap.get('expanded'));

    // 窗口大小模式计算
    const windowMode = useMemo(() => {
        if (!config?.window.size) return 'default';
        const { width, height } = config.window.size;
        if (width === 0 && height === 0) return 'default';
        if (width < 0 && height < 0) return 'fullscreen';
        return 'customized';
    }, [config?.window.size]);

    const changeWindowSizeMode = useCallback((value: string) => {
        if (value === 'default') {
            updateConfig('window.size', { width: 0, height: 0 });
        } else if (value === 'fullscreen') {
            updateConfig('window.size', { width: -1, height: -1 });
        } else {
            updateConfig('window.size', { width: 890, height: 540 });
        }
    }, [updateConfig]);

    useEffect(() => {
        if (expanded)
            cacheMap.set('expanded', expanded);
    }, [expanded]);

    if (loading) return null;
    if (error) return <div>Error: {error}</div>;
    if (!config) return null;

    return (
        <Container>
            <Motion animation="animate-[slide-down_0.2s_ease-in]">
                <Card
                    title={t('setting.appearance')}
                    className="mb-6"
                >
                    <List className="space-y-2">
                        <FormSelect
                            title={t('config.theme')}
                            value={config.theme}
                            onChange={(e) => {
                                updateConfig('theme', e.target.value);
                                updateTheme(e.target.value);
                            }}
                            options={[
                                { value: 'light', label: t('config.theme.light') },
                                { value: 'dark', label: t('config.theme.dark') }
                            ]}
                        />
                        <FormSelect
                            title={t('config.language')}
                            value={i18n.language}
                            onChange={(e) => {
                                i18n.changeLanguage(e.target.value);
                                updateConfig('language', e.target.value);
                            }}
                            options={[
                                { value: 'en', label: 'English' },
                                { value: 'zh-CN', label: '中文 (中国大陆)' },
                                { value: 'zh-TW', label: '中文 (台灣)' }
                            ]}
                        />
                        <FormInput
                            title={t('window.title')}
                            value={config.window.title}
                            onChange={(e) => updateConfig('window.title', e.target.value)}
                        />
                        <div className="p-0 min-w-80 grid grid-cols-7">
                            <div className={`max-md:col-span-7 ${windowMode === 'customized' ? 'md:col-span-5' : 'md:col-span-7'}`}>
                                <FormSelect
                                    title={t('window.size')}
                                    name="windowSize"
                                    value={windowMode}
                                    onChange={({ target: { value } }) => changeWindowSizeMode(value)}
                                    options={[
                                        { value: 'default', label: t('window.size.default') },
                                        { value: 'fullscreen', label: t('window.size.fullscreen') },
                                        { value: 'customized', label: t('window.size.customized') },
                                    ]}
                                />
                            </div>
                            {windowMode === 'customized' && (
                                <div className="md:col-span-2 max-md:hidden">
                                    <div className="pr-2 w-full space-x-2 flex flex-row justify-end items-center">
                                        <Input
                                            className="w-1/3!"
                                            defaultValue={config.window.size.width}
                                            onChange={(e) =>
                                                updateConfig('window.size', {
                                                    ...config.window.size,
                                                    width: parseInt(e.target.value)
                                                })
                                            }
                                        />
                                        <h3 className="text-black dark:text-gray-100">x</h3>
                                        <Input
                                            className="w-1/3!"
                                            defaultValue={config.window.size.height}
                                            onChange={(e) =>
                                                updateConfig('window.size', {
                                                    ...config.window.size,
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
            </Motion>
            <Motion animation="animate-[slide-down_0.4s_ease-in]">
                <Accordion
                    title={t('setting.animation')}
                    open={expanded === 'animation'}
                    onClick={() => setExpanded(prev => prev !== 'animation' ? 'animation' : null)}
                >
                    <FormCheckbox
                        title={t('option.animation_effect')}
                        checked={config.animation.effect}
                        onClick={() => updateConfig('animation.effect', !config.animation.effect)}
                    />
                </Accordion>
            </Motion>
        </Container>
    );
}
