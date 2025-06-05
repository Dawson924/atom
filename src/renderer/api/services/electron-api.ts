import { OpenDialogOptions, SaveDialogOptions } from 'electron';
import { invokeHandler } from '../invoke';

export const ElectronAPI = {
    showOpenDialog: (options: OpenDialogOptions) => invokeHandler<string>('electron:open-dialog', options),
    showSaveDialog: (options: SaveDialogOptions) => invokeHandler<string>('electron:save-dialog', options),
    openURL: (url: string) => invokeHandler<void>('electron:open-url', url),
};
