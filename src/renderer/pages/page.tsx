import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../App';
import { RouteProvider } from '../router';
import { AppBar, Box, Tab, Tabs } from '@mui/material';
import HomePage from './home/page';
import SettingsPage from './settings/page';
import InstallerPage from './install/page';
import VersionsPage from './home/versions/page';
import ManagePage from './home/manage/page';
import TaskPage from './task/page';
import { useTranslation } from 'react-i18next';
import { DownloadRounded, HomeRounded, SettingsRounded } from '@mui/icons-material';

const createRoutes = (t: (...args: any[]) => any) => {
    return [
        {
            path: 'home',
            label: t('tab.launch'),
            icon: (<HomeRounded className="size-4" />),
            element: <HomePage />,
            children: [
                {
                    path: 'versions',
                    element: <VersionsPage />
                },
                {
                    path: 'manage',
                    element: <ManagePage />
                }
            ]
        },
        {
            path: 'install',
            label: t('tab.install'),
            icon: (<DownloadRounded className="size-4" />),
            element: <InstallerPage />
        },
        {
            path: 'settings',
            label: t('tab.settings'),
            icon: (<SettingsRounded className="size-4" />),
            element: <SettingsPage />
        },
        {
            path: 'task',
            element: <TaskPage />
        }
    ];
};

export default function Page(): React.JSX.Element {
    const context = useContext(ThemeContext);
    const { t } = useTranslation();

    const [path, setPath] = useState<string>('home');
    const [location, setLocation] = useState<string>();
    const [theme, setTheme] = useState<string>();

    const handleChange = (_event: React.SyntheticEvent, value: string) => setPath(value);

    useEffect(() => {
        if (context) {
            const themeMode = context.theme.palette.mode;
            setTheme(themeMode);
        }
    }, [context]);

    useEffect(() => path && setLocation(path.split('/').filter(Boolean).at(0)), [path]);

    const routes = createRoutes(t);

    if (!location) return null;

    return (
        <div
            id="window"
            className="antialiased font-[Inter] select-none border border-neutral-200 dark:border-neutral-900"
            style={{ backgroundColor: (theme === 'light') ? '#ffffff' : '#121212' }}
        >
            <div className="title-bar h-[80px]">
                <header className="header" style={{ backgroundColor: (theme === 'light') ? '#e1e1e1' : '#252423' }}>
                    <div className="header-left">
                    </div>
                    <div className="header-right">
                        <div className="traffic-light inline-flex justify-end items-center gap-2 mr-3">
                            <div className="size-3 hover:cursor-pointer" onClick={() => window.app.maximize()}>
                                <svg
                                    className="w-full h-full"
                                    enableBackground="new 0 0 85.4 85.4"
                                    viewBox="0 0 85.4 85.4"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipRule="evenodd" fillRule="evenodd">
                                        <path
                                            d="m42.7 85.4c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7-42.7 19.1-42.7 42.7 19.1 42.7 42.7 42.7z"
                                            fill="#2dac2f"
                                        />
                                        <path
                                            d="m42.7 81.8c21.6 0 39.1-17.5 39.1-39.1s-17.5-39.1-39.1-39.1-39.1 17.5-39.1 39.1 17.5 39.1 39.1 39.1z"
                                            fill="#61c555"
                                        />
                                    </g>
                                </svg>
                            </div>
                            <div className="size-3 hover:cursor-pointer" onClick={() => window.app.minimize()}>
                                <svg
                                    className="w-full h-full"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 85.4 85.4"
                                >
                                    <g fillRule="evenodd" clipRule="evenodd">
                                        <path
                                            fill="#e1a73e"
                                            d="M42.7 85.4c23.6 0 42.7-19.1 42.7-42.7S66.3 0 42.7 0 0 19.1 0 42.7s19.1 42.7 42.7 42.7"
                                        ></path>
                                        <path
                                            fill="#f6be50"
                                            d="M42.7 81.8c21.6 0 39.1-17.5 39.1-39.1S64.3 3.6 42.7 3.6 3.6 21.1 3.6 42.7s17.5 39.1 39.1 39.1"
                                        ></path>
                                    </g>
                                </svg>
                            </div>
                            <div className="size-3 hover:cursor-pointer" onClick={() => window.app.close()}>
                                <svg
                                    className="w-full h-full"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 85.4 85.4"
                                >
                                    <g fillRule="evenodd" clipRule="evenodd">
                                        <path
                                            fill="#e24b41"
                                            d="M42.7 85.4c23.6 0 42.7-19.1 42.7-42.7S66.3 0 42.7 0 0 19.1 0 42.7s19.1 42.7 42.7 42.7"
                                        ></path>
                                        <path
                                            fill="#ed6a5f"
                                            d="M42.7 81.8c21.6 0 39.1-17.5 39.1-39.1S64.3 3.6 42.7 3.6 3.6 21.1 3.6 42.7s17.5 39.1 39.1 39.1"
                                        ></path>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                </header>
                <Box sx={{ width: '100%', height: '48px' }}>
                    <AppBar
                        sx={{ display: 'flex', flexDirection: 'row' }}
                        position="relative"
                        color="default"
                        elevation={0}
                    >
                        {
                            path.split('/').filter(Boolean).length > 1 && (
                                <div
                                    className="pl-4 min-w-7 space-x-1.5 flex flex-row justify-start items-center cursor-pointer animate-slide-in"
                                    onClick={() => {
                                        const segments = path.split('/').filter(Boolean);
                                        setPath(segments.at(0));
                                    }}
                                >
                                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-50" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                        <g id="SVGRepo_iconCarrier">
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M6.3508 12.7499L11.2096 17.4615L10.1654 18.5383L3.42264 11.9999L10.1654 5.46148L11.2096 6.53833L6.3508 11.2499L21 11.2499L21 12.7499L6.3508 12.7499Z"
                                            />
                                        </g>
                                    </svg>
                                    <h4 className="text-sm uppercase">{
                                        routes.find(route => route.path === location).label
                                    }</h4>
                                </div>
                            )
                        }
                        <Tabs
                            sx={{
                                marginLeft: 'auto',
                                height: '48px',
                                '& .MuiTab-root': {  // 关键选择器
                                    minHeight: '48px',  // 覆盖默认 72px
                                    padding: '6px 12px',  // 控制整体间距
                                    flexDirection: 'row',  // 改为横向布局
                                    alignItems: 'center',  // 垂直居中
                                    justifyContent: 'center',  // 水平居中
                                }
                            }}
                            value={location}
                            onChange={handleChange}
                            textColor="inherit"
                            indicatorColor="primary"
                        >
                            {path.split('/').filter(Boolean).length === 1 && routes.map(route => {
                                if (!route?.label)
                                    return;

                                return (
                                    <Tab
                                        key={route.path}
                                        value={route.path}
                                        icon={route.icon}
                                        iconPosition="start"
                                        label={route.label}
                                        sx={{
                                            maxWidth: '110px',
                                            minWidth: '100px'
                                        }}
                                    />
                                );
                            })}
                        </Tabs>
                    </AppBar>
                </Box>
            </div>

            <main className="h-main overflow-hidden">
                <RouteProvider routes={routes} path={path} setPath={setPath} />
            </main>
        </div>
    );
}
