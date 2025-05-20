import { SetTextureOption, YggdrasilThirdPartyClient } from '@xmcl/user';
import { CONFIG, PROFILES } from './storage';
import { deleteAccount, getCurrentAccount, getCurrentProfile, hasAccount, updateAccount } from '../../utils/auth';
import { IpcMainEvent } from 'electron';
import { ERROR_CODES, errorResponse } from '../../libs/response';

export class AuthenticateService {
    private signedIn: boolean;
    private clientToken: string;
    private client: YggdrasilThirdPartyClient;

    async login(_: IpcMainEvent, { username, password }: {
        username: string;
        password: string;
    }) {
        try {
            const result = await this.client.login({
                username,
                password,
                clientToken: this.clientToken,
                requestUser: true
            });
            await this.validateAccount();
            updateAccount(result);
        } catch(error) {
            throw errorResponse(ERROR_CODES.BAD_REQUEST);
        }
    }

    async lookup(_: IpcMainEvent, uuid: string) {
        try {
            return await this.client.lookup(uuid);
        } catch (error) {
            throw errorResponse(ERROR_CODES.BAD_REQUEST);
        }
    }

    async session() {
        this.signedIn = hasAccount() ? await this.validateAccount() : false;
        return {
            signedIn: this.signedIn,
            clientToken: this.clientToken,
            account: this.signedIn ? getCurrentAccount() : null,
            profile: this.signedIn ? getCurrentProfile() : null,
        };
    }

    async invalidate() {
        try {
            await this.client.invalidate(getCurrentAccount().accessToken, this.clientToken);
            deleteAccount();
        } catch (error) {
            throw errorResponse(ERROR_CODES.BAD_REQUEST);
        }
    }

    async setTexture(_: IpcMainEvent, option: SetTextureOption) {
        // 默认调用此方法前界面已拿到 session 数据
        try {
            await this.client.setTexture({
                accessToken: option.accessToken,
                uuid: option.uuid,
                type: option.type,
                texture: option.texture
            });
        } catch (error) {
            throw errorResponse(ERROR_CODES.BAD_REQUEST);
        }
    }

    constructor() {
        this.initialize();
    }

    private async initialize() {
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
}
