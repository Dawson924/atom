import { dialog, OpenDialogOptions, SaveDialogOptions, shell } from 'electron';
import { IPCServiceController, IPCService } from '../core';
import { data, error, ERROR_CODES } from '../libs/response';
import { isAbsolute } from 'node:path';

const isHttpUrl = (str: string) => {
    try {
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (err) {
        // 不是有效的 URL，可能是本地路径
        return false;
    }
};

const isLocalPath = (str: string) => {
    try {
        const url = new URL(str);
        return url.protocol === 'file:';
    } catch (err) {
        // 不是有效的 URL，检查是否是绝对路径或相对路径
        return isAbsolute(str) || /^\./.test(str);
    }
};

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

        this.handle('open-url', async (_, url: string) => {
            if (isLocalPath(url)) {
                await shell.openPath(url);
            }
            else if (isHttpUrl(url)) {
                await shell.openExternal(url);
            }
            else {
                return error(ERROR_CODES.INVALID_ARGUMENT, 'Provided URL is neither a valid path nor hyperlink', url);
            }
            return data();
        });
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}
