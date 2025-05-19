import { createContext, useEffect, useState } from 'react';
import Page from './pages/page';
import { createTheme, Theme, ThemeProvider } from '@mui/material';
import { ModalProvider } from './hoc/modal';
import { ToastProvider } from './hoc/toast';

export const ThemeContext = createContext({
    theme: null,
    setThemeMode: null,
    fetch: null
});

export default function App(): React.JSX.Element {
    const [theme, setTheme] = useState<Theme>();

    useEffect(() => {
        fetch();
    }, []);

    // 新增：根据主题变化切换暗黑类
    useEffect(() => {
        if (!theme) return;
        setThemeMode(theme.palette.mode);
    }, [theme]);

    const fetch = async () => {
        const theme = await window.config.get('appearance.theme');
        if (theme) {
            setTheme(
                createTheme({
                    palette: {
                        mode: theme,
                        background: {
                            default: (theme === 'light') ? '#eeeeee' : '#121212',
                            paper: (theme === 'light') ? '#ffffff' : '#121212'
                        }
                    }
                })
            );
        }
    };

    const setThemeMode = (mode: string) => {
        const htmlEl = document.documentElement;
        if (mode === 'dark') {
            htmlEl.classList.add('dark');
        } else {
            htmlEl.classList.remove('dark');
        }
    };

    if (!theme) return null;

    return (
        <>
            <ThemeContext.Provider value={{ theme, fetch, setThemeMode }}>
                <ThemeProvider theme={theme}>
                    <ModalProvider>
                        <ToastProvider>
                            <Page />
                        </ToastProvider>
                    </ModalProvider>
                </ThemeProvider>
            </ThemeContext.Provider>
        </>
    );
}
