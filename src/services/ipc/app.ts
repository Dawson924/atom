import { BaseService, IPCService } from '../core';

export class AppService extends BaseService {
    protected override namespace = 'app';
    protected override ipc;
    protected app: Electron.App;

    protected override registerHandlers() {
        this.handle('close', () => {
            if (process.platform !== 'darwin') {
                this.app.quit();
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
