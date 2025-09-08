import StartupPage from './startup';
import AppearancePage from './appearance';
import AccountPage from './account';
import { useEffect } from 'react';
import { useSettingsPage } from '@renderer/hooks/store';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '@renderer/components/commons/menu';

export default function SettingsPage({ page }: { page?: string }) {
    const { currentPage, goTo } = useSettingsPage();
    const { t } = useTranslation();

    useEffect(() => {
        if (page)
            goTo(page);
    }, [page]);

    return (
        <div className="h-main bg-blue-100 dark:bg-neutral-700">
            <div className="flex flex-row">

                <div className="z-10 w-40 h-main flex flex-shrink-0 flex-col shadow-lg border-r border-gray-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                    <div className="w-full h-full">
                        <nav aria-label="Main" className="flex flex-col h-full">
                            {/* Links */}
                            <div className="text-sm font-semibold overflow-hidden hover:overflow-auto">
                                <MenuItem
                                    selected={currentPage === 'account'}
                                    label={t('category.account')}
                                    onSelect={() => goTo('account')}
                                    icon={(
                                        <svg
                                            className="size-full"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                            <g id="SVGRepo_iconCarrier">
                                                <path
                                                    d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </g>
                                        </svg>
                                    )}
                                />
                                <MenuItem
                                    selected={currentPage === 'appearance'}
                                    label={t('category.appearance')}
                                    onSelect={() => goTo('appearance')}
                                    icon={(
                                        <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7h.01m3.486 1.513h.01m-6.978 0h.01M6.99 12H7m9 4h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 3.043 12.89 9.1 9.1 0 0 0 8.2 20.1a8.62 8.62 0 0 0 3.769.9 2.013 2.013 0 0 0 2.03-2v-.857A2.036 2.036 0 0 1 16 16Z" />
                                        </svg>
                                    )}
                                />
                                <MenuItem
                                    selected={currentPage === 'startup'}
                                    label={t('category.startup')}
                                    onSelect={() => goTo('startup')}
                                    icon={(
                                        <svg
                                            className="size-full"
                                            viewBox="0 0 16 16"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                        >
                                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                            <g id="SVGRepo_iconCarrier">
                                                <path d="M2.67 10.73a3.52 3.52 0 0 0-.94 1.93 5 5 0 0 0-.07 1.1v.58h.8a5.05 5.05 0 0 0 .88-.08 3.46 3.46 0 0 0 1.93-.94 1.76 1.76 0 0 0-.14-2.48 1.76 1.76 0 0 0-2.46-.11zm1.74 1.73a2.26 2.26 0 0 1-1.26.6h-.22v-.22a2.26 2.26 0 0 1 .6-1.26.36.36 0 0 1 .24-.08.67.67 0 0 1 .47.22.54.54 0 0 1 .17.74zM14.65 2.24a.91.91 0 0 0-.89-.89A8.75 8.75 0 0 0 7.27 3.5L5.64 5.4l-2.4-.5a1 1 0 0 0-.92.27l-.68.68a1 1 0 0 0-.28.81 1 1 0 0 0 .45.74l2.06 1.32.13.08 3.2 3.25.08.08 1.32 2.06a1 1 0 0 0 .74.45h.11a1 1 0 0 0 .7-.29l.68-.68a1 1 0 0 0 .27-.92l-.5-2.39 1.84-1.58a8.79 8.79 0 0 0 2.21-6.54zM3.11 6.15l1.32.28-.64.75-1-.67zm6.38 7.1-.67-1 .75-.64.28 1.32zm2.39-5.11.18.17zm-.28-.28L7.92 11 5 8.08 8.14 4.4a7.44 7.44 0 0 1 5.26-1.8 7.48 7.48 0 0 1-1.8 5.26z" />
                                                <path d="M11.13 6.63a1.19 1.19 0 0 0-.06-1.7 1.16 1.16 0 1 0-1.64 1.63 1.2 1.2 0 0 0 1.7.07z" />
                                            </g>
                                        </svg>
                                    )}
                                />
                            </div>
                        </nav>
                    </div>
                </div>

                {
                    currentPage === 'account' ? (
                        <AccountPage />
                    ) : currentPage === 'startup' ? (
                        <StartupPage />
                    ) : currentPage === 'appearance' ? (
                        <AppearancePage />
                    ) : null
                }

            </div>
        </div>
    );
}
