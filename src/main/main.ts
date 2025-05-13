import { app, BrowserWindow } from 'electron';
import isReady from 'electron-squirrel-startup';
import { BaseService, IPCService, store } from '../services/core';
import { AppService, LauncherService, StoreService } from '../services/ipc';
import path from 'node:path';

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
    mainWindow = new BrowserWindow({
        title: store.get('launcher.windowTitle') || 'Atom Launcher',
        width: 890,
        height: 540,
        resizable: true,
        center: true,
        frame: false,
        transparent: true,
        titleBarStyle: 'hidden',
        autoHideMenuBar: false,
        webPreferences: {
            // preload: path.join(__dirname, '../../.vite/build/preload.js'),
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            webSecurity: false
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

    mainWindow.setMinimumSize(890, 540);
};

const initializeServices = (ipc: IPCService) => {
    services.push(
        new AppService(ipc, app),
        new LauncherService(ipc),
        new StoreService(ipc),
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
