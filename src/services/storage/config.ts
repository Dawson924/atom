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
    launch: {
        minecraftFolder: string,
        launchVersion: string,
        javaPath: string,
        windowTitle: string,
        windowSize?: {
            width: number,
            height: number
        },
        extraArguments?: {
            jvm?: string,
            mc?: string
        }
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
        launch: {
            minecraftFolder: getDefaultPath(),
            launchVersion: null,
            javaPath: null,
            windowTitle: 'Atom Launcher',
            windowSize: {
                width: 854,
                height: 480
            },
            extraArguments: {},
        }
    },
    cwd: findStoreDir()
});

export { store as CONFIG };
