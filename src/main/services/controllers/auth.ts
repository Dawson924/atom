import { IPCServiceController, IPCService } from '../core';
import { AuthenticateService } from '../auth';

export class AuthServiceController extends IPCServiceController {
    protected override readonly namespace = 'auth';
    protected override ipc: IPCService;
    protected authenticateService: AuthenticateService;

    protected override async registerHandlers() {
        this.authenticateService = new AuthenticateService();

        this.handle('login', this.authenticateService.login.bind(this.authenticateService));
        this.handle('lookup', this.authenticateService.lookup.bind(this.authenticateService));
        this.handle('session', this.authenticateService.session.bind(this.authenticateService));
        this.handle('invalidate', this.authenticateService.invalidate.bind(this.authenticateService));
        this.handle('set-texture', this.authenticateService.setTexture.bind(this.authenticateService));
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}
