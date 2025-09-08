import { createContext, useEffect, useState, useMemo } from 'react';
import { createTheme, Theme, ThemeProvider, CssBaseline } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Page from './pages/page';
import { ModalProvider } from './components/modal';
import { ToastProvider } from './components/toast';
import { ConfigService } from './api';

export const ThemeContext = createContext<Tentative>({
    theme: null,
    themeMode: 'light',
    updateTheme: () => { },
    isLoading: true,
});

const DEFAULT_THEME_MODE: 'light' | 'dark' = 'light';

export default function App(): React.JSX.Element {
    const { i18n } = useTranslation();
    const [theme, setTheme] = useState<Theme | null>(null);
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>(DEFAULT_THEME_MODE);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 初始化配置
    useEffect(() => {
        fetchConfig();
    }, []);

    // 根据主题变化切换暗黑类
    useEffect(() => {
        const htmlEl = document.documentElement;
        if (themeMode === 'dark') {
            htmlEl.classList.add('dark');
        } else {
            htmlEl.classList.remove('dark');
        }
    }, [themeMode]);

    // 异步获取配置
    const fetchConfig = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            // 并行获取配置
            const [language, theme] = await Promise.all([
                ConfigService.get<string>('appearance.language'),
                ConfigService.get<'light' | 'dark'>('appearance.theme'),
            ]);

            // 应用语言设置
            if (language) {
                await i18n.changeLanguage(language);
            }

            // 应用主题设置
            if (theme) {
                updateTheme(theme);
            } else {
                updateTheme(DEFAULT_THEME_MODE);
            }
        } catch (err) {
            console.error('Failed to load configuration:', err);
            setError('Failed to load application configuration');
            // 加载失败时使用默认主题
            updateTheme(DEFAULT_THEME_MODE);
        } finally {
            setIsLoading(false);
        }
    };

    // 更新主题
    const updateTheme = (mode: 'light' | 'dark') => {
        const newTheme = createTheme({
            palette: {
                mode,
                background: {
                    default: mode === 'light' ? '#f5f5f5' : '#121212',
                    paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
                },
                primary: {
                    main: mode === 'light' ? '#1976d2' : '#90caf9',
                },
                secondary: {
                    main: mode === 'light' ? '#c2185b' : '#f48fb1',
                },
                text: {
                    primary: mode === 'light' ? '#212121' : '#ffffff',
                    secondary: mode === 'light' ? '#757575' : '#cccccc',
                },
            },
            typography: {
                fontFamily: [
                    'Inter',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                ].join(','),
            },
            components: {
                MuiButton: {
                    styleOverrides: {
                        root: {
                            textTransform: 'none',
                        },
                    },
                },
            },
        });

        setTheme(newTheme);
        setThemeMode(mode);
    };

    // 主题上下文值
    const contextValue: Tentative = useMemo(() => ({
        theme,
        themeMode,
        updateTheme,
        isLoading,
        error,
    }), [theme, themeMode, isLoading, error]);

    // 加载状态处理
    if (isLoading) return null;

    // 错误处理
    if (error) return null;

    // 渲染主应用
    return (
        <ThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={theme as Theme}>
                <CssBaseline />
                <ModalProvider>
                    <ToastProvider>
                        <Page />
                    </ToastProvider>
                </ModalProvider>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}
