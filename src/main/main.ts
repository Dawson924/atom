import { app, BrowserWindow } from 'electron';
import isReady from 'electron-squirrel-startup';
import { BaseService, IPCService } from '../services/core';
import { AppService, AuthService, LauncherService, StoreService } from '../services/ipc';
import path from 'node:path';
import { setupMinecraftDirectory } from '../utils';
import { CONFIG } from '../services/storage';
import { UtilityService } from '../services/ipc/util';
import { DefaultWindowOptions } from '../libs/window';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (isReady) {
    app.quit();
}

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

let mainWindow: BrowserWindow;
const services: BaseService[] = [];

const createWindow = (): void => {
    // Create the browser window.
    const windowSize = CONFIG.get<Tentative>('appearance.windowSize');
    const windowSizeMode =
        (windowSize.width === 0 && windowSize.height === 0) ? 'default' :
            (windowSize.width < 0 && windowSize.height < 0) ? 'fullscreen' :
                'customized';

    mainWindow = new BrowserWindow({
        title: CONFIG.get('appearance.windowTitle') || 'Atom Launcher',
        width: windowSizeMode === 'customized' ? windowSize.width : DefaultWindowOptions.width,
        height: windowSizeMode === 'customized' ? windowSize.height : DefaultWindowOptions.height,
        icon: path.join(__dirname, './icons/icon.png'),
        resizable: true,
        center: true,
        frame: false,
        transparent: true,
        titleBarStyle: 'hidden',
        autoHideMenuBar: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            webSecurity: false,
        },
    });

    initializeServices(new IPCService(mainWindow));

    // and load the index.html of the app.
    if (!app.isPackaged) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    mainWindow.webContents.on('before-input-event', (_, input: Electron.Input) => {
        if (input.key === 'F12') {
            mainWindow.webContents.openDevTools({ mode: 'right', title: 'Atom Launcher Debug' });
        }
    });

    if (windowSizeMode === 'fullscreen') {
        mainWindow.maximize();
    }
    mainWindow.setMinimumSize(DefaultWindowOptions.width, DefaultWindowOptions.height);
};

const initializeServices = (ipc: IPCService) => {
    setupMinecraftDirectory(CONFIG.get('launch.minecraftFolder'));
    services.push(
        new AppService(ipc, app),
        new LauncherService(ipc),
        new StoreService(ipc),
        new AuthService(ipc),
        new UtilityService(ipc),
    );
};

app.on('ready', createWindow);

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
