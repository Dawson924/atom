import { findStoreDir, getDefaultPath } from '../../utils';
import Store from 'electron-store';

const store = new Store({
    defaults: {
        launcher: {
            path: getDefaultPath(),
            launchVersion: null,
            javaPath: null,
            windowTitle: 'Atom Launcher'
        },
        appearance: {
            theme: 'light',
        }
    },
    cwd: findStoreDir()
});

export { store };
