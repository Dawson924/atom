import { YggdrasilThirdPartyClient } from '@xmcl/user';
import { IPCServiceController, IPCService } from '../core';
import { CONFIG, PROFILES } from '../storage';
import { getCurrentAccount, hasAccount, updateAccount } from '../../../utils/auth';
import { AuthenticateService } from '../auth';

export class AuthServiceController extends IPCServiceController {
    protected override readonly namespace = 'auth';
    protected override ipc: IPCService;
    protected authenticateService: AuthenticateService;
    protected signedIn: boolean;
    protected clientToken: string;
    protected client: YggdrasilThirdPartyClient;

    protected override async registerHandlers() {
        await this.initialize();

        this.handle('login', this.authenticateService.login.bind(this.authenticateService));
        this.handle('lookup', this.authenticateService.lookup.bind(this.authenticateService));
        this.handle('session', this.authenticateService.session.bind(this.authenticateService));
        this.handle('invalidate', this.authenticateService.invalidate.bind(this.authenticateService));
        this.handle('set-texture', this.authenticateService.setTexture.bind(this.authenticateService));
    }

    protected async initialize() {
        this.authenticateService = new AuthenticateService();
        this.clientToken = PROFILES.get('clientToken');
        this.client = new YggdrasilThirdPartyClient(CONFIG.get('authentication.yggdrasilAgent.server'));
        this.signedIn = await this.validateAccount();
    }

    protected async validateAccount() {
        return new Promise<boolean>((ok) => {
            if (!hasAccount()) {
                ok(false);
            }
            this.client.validate(getCurrentAccount().accessToken, this.clientToken)
                .then(valid => {
                    if (valid) ok(true);
                    else {
                        this.client.refresh({
                            accessToken: getCurrentAccount().accessToken,
                            clientToken: this.clientToken,
                            requestUser: true
                        }).then(result => {
                            updateAccount(result);
                            ok(true);
                        }).catch(() => {
                            ok(false);
                        });
                    }
                })
                .catch(() => {
                    ok(false);
                });
        });
    }

    constructor(ipc: IPCService) {
        super();
        this.ipc = ipc;
        this.registerHandlers();
    }
}
