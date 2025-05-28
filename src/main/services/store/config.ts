import { findStoreDir } from '@common/utils';
import Store from 'electron-store';
import { getDefaultPath } from '../../utils/folder';

const store = new Store<{
    appearance: {
        theme: 'light' | 'dark',
        windowTitle: string,
        windowSize: {
            width: number,
            height: number
        },
    },
    authentication: {
        mode: 'yggdrasil' | 'xbox' | 'offline',
        yggdrasilAgent: {
            jar: string,
            server?: string,
            prefetched?: string
        }
    },
    launch: {
        minecraftFolder: string,
        launchVersion: string,
        runtime: {
            executable: string,
            allocatedMemory: number
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
            windowTitle: 'Atom Launcher',
            windowSize: {
                width: 0,
                height: 0
            },
        },
        authentication: {
            mode: 'offline',
            yggdrasilAgent: {
                jar: './authlib-injector.jar',
                server: null
            }
        },
        launch: {
            minecraftFolder: getDefaultPath(),
            launchVersion: null,
            runtime: {
                executable: null,
                allocatedMemory: 4096
            },
            extraArguments: {},
        }
    },
    cwd: findStoreDir()
});

export { store as CONFIG };
