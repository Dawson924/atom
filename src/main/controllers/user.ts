import { IPCServiceController, IPCService } from '../core';
import { UserService } from '../services/user';

export class UserServiceController extends IPCServiceController {
    protected override readonly namespace = 'user';
    protected override readonly ipc: IPCService;

    protected override async registerHandlers() {
        const userService = new UserService();

        // Offline
        this.handle('add-profile', userService.addProfile.bind(userService));
        this.handle('get-current-profile', userService.getCurrentProfile.bind(userService));
        this.handle('get-profile', userService.getProfile.bind(userService));
        this.handle('get-profiles', userService.getProfiles.bind(userService));
        this.handle('get-selected-profile', userService.getSelectedProfile.bind(userService));
        this.handle('set-selected-profile', userService.setSelectedProfile.bind(userService));
        this.handle('del-profile', userService.deleteProfile.bind(userService));
        // Authenticated
        this.handle('login', userService.login.bind(userService));
        this.handle('lookup', userService.lookup.bind(userService));
        this.handle('session', userService.session.bind(userService));
        this.handle('invalidate', userService.invalidate.bind(userService));
        this.handle('set-user', userService.setUser.bind(userService));
        this.handle('set-texture', userService.setTexture.bind(userService));
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}
