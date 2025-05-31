import { dialog, OpenDialogOptions, SaveDialogOptions } from 'electron';
import { IPCServiceController, IPCService } from '../core';
import { data, error, ERROR_CODES } from '../libs/response';

export class ElectronAPIController extends IPCServiceController {
    protected override readonly namespace = 'electron';
    protected override readonly ipc: IPCService;

    protected override registerHandlers() {
        this.handle('open-dialog', async (_, options: OpenDialogOptions) => {
            const { canceled, filePaths } = await dialog.showOpenDialog(this.ipc.mainWindow, options);
            if (!canceled) {
                return data(filePaths);
            }
            return data([]);
        });

        this.handle('save-dialog', async (_, options: SaveDialogOptions) => {
            const { canceled, filePath } = await dialog.showSaveDialog(this.ipc.mainWindow, options);
            if (!canceled) {
                return data(filePath);
            }
            return error(ERROR_CODES.INTERNAL_ERROR);
        });
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}
