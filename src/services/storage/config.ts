import { findStoreDir, getDefaultPath } from '../../utils';
import Store from 'electron-store';

const store = new Store<{
    appearance: {
        theme: 'light' | 'dark'
    },
    authentication: {
        mode: 'yggdrasil' | 'xbox' | 'offline',
        yggdrasilAgent: {
            jar: string,
            server: string,
            prefetched?: string
        }
    },
    launcher: {
        minecraftFolder: string,
        launchVersion: string,
        javaPath: string,
        windowTitle: 'Atom Launcher'
    }
}>({
    defaults: {
        appearance: {
            theme: 'light',
        },
        authentication: {
            mode: 'offline',
            yggdrasilAgent: {
                jar: './authlib-injector.jar',
                server: 'http://localhost:5400/yggdrasil'
            }
        },
        launcher: {
            minecraftFolder: getDefaultPath(),
            launchVersion: null,
            javaPath: null,
            windowTitle: 'Atom Launcher'
        }
    },
    cwd: findStoreDir()
});

export { store as CONFIG };
