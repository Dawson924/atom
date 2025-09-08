import { findStoreDir } from '../utils/path';
import Store from 'electron-store';
import { getDefaultPath } from '../utils/folder';

const store = new Store<{
    appearance: {
        language: 'en' | 'zh',
        theme: 'light' | 'dark',
        window: {
            title: string,
            size: {
                width: number,
                height: number
            }
        },
        animation: {
            effect: boolean;
        }
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
        folder: string,
        version: string,
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
            language: 'en',
            theme: 'light',
            window: {
                title: 'Atom Launcher',
                size: {
                    width: 0,
                    height: 0
                }
            },
            animation: {
                effect: true
            }
        },
        authentication: {
            mode: 'offline',
            yggdrasilAgent: {
                jar: './authlib-injector.jar',
                server: null
            }
        },
        launch: {
            folder: getDefaultPath(),
            version: null,
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
