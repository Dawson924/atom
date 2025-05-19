import { SetTextureOption, YggdrasilThirdPartyClient } from '@xmcl/user';
import { BaseService, IPCService } from '../core';
import { CONFIG, PROFILES } from '../storage';
import { deleteAccount, getCurrentAccount, getCurrentProfile, hasAccount, updateAccount } from '../../utils/auth';

export class AuthService extends BaseService {
    protected override readonly namespace = 'auth';
    protected override ipc: IPCService;

    protected signedIn: boolean;
    protected clientToken: string;
    protected client: YggdrasilThirdPartyClient;

    protected override async registerHandlers() {
        await this.initialize();

        this.handle('login', async (_, { username, password }: {
            username: string;
            password: string;
        }) => {
            const result = await this.client.login({
                username,
                password,
                clientToken: this.clientToken,
                requestUser: true
            });
            await this.validateAccount();
            updateAccount(result);
        });

        this.handle('lookup', async (_, uuid: string) => {
            const gameProfile = await this.client.lookup(uuid);
            return gameProfile;
        });

        this.handle('session', async () => {
            this.signedIn = hasAccount() ? await this.validateAccount() : false;
            return {
                signedIn: this.signedIn,
                clientToken: this.clientToken,
                account: this.signedIn ? getCurrentAccount() : null,
                profile: this.signedIn ? getCurrentProfile() : null,
            };
        });

        this.handle('invalidate', async () => {
            await this.client.invalidate(getCurrentAccount().accessToken, this.clientToken);
            deleteAccount();
        });

        this.handle('signout', async () => {
            throw new Error('Method not implemented');
        });

        this.handle('set-texture', async (_, option: SetTextureOption) => {
            // 默认调用此方法前界面已拿到 session 数据
            try {
                await this.client.setTexture({
                    accessToken: option.accessToken,
                    uuid: option.uuid,
                    type: option.type,
                    texture: option.texture
                });
                return { success: true };
            } catch (err) {
                return {
                    success: false,
                    error: err.error,
                    errorMessage: err.errorMessage
                };
            }
        });
    }

    protected async initialize() {
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
