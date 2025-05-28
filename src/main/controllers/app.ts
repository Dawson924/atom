import { IPCServiceController, IPCService } from '../core';

export class AppServiceController extends IPCServiceController {
    protected override readonly namespace = 'app';
    protected override readonly ipc;
    protected app: Electron.App;

    protected override registerHandlers() {
        this.handle('close', () => {
            if (process.platform !== 'darwin') {
                this.app.quit();
            }
        });

        this.handle('minimize', () => {
            this.ipc.mainWindow.minimize();
        });

        this.handle('maximize', () => {
            if (this.ipc.mainWindow.isMaximized()) {
                this.ipc.mainWindow.restore();
            }
            else {
                this.ipc.mainWindow.maximize();
            }
        });

        this.handle('open-devtools', (_,
            mode: 'left' | 'right' | 'bottom' | 'undocked' | 'detach' = 'right'
        ) => {
            this.ipc.mainWindow.webContents.openDevTools({
                mode,
                title: 'Atom Launcher Debug'
            });
        });
    }

    constructor(
        ipc: IPCService,
        app: Electron.App
    ) {
        super();
        this.ipc = ipc;
        this.app = app;
        this.registerHandlers();
    }
}
