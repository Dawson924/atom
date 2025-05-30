import { SetTextureOption, YggdrasilError, YggdrasilThirdPartyClient } from '@xmcl/user';
import { CONFIG, PROFILES } from '../store';
import {
    addProfile,
    deleteAccount,
    deleteProfile,
    getCurrentProfile,
    getProfile,
    getProfiles,
    getSelectedProfile,
    getUserAccount,
    getUserProfile,
    hasAccount,
    setSelectedProfile,
    setSelectedUser,
    updateAccount
} from '../utils/profile.util';
import { IpcMainEvent } from 'electron';
import { data, error, ERROR_CODES } from '../libs/response';

export class UserService {
    private mode: string;
    private signedIn: boolean;
    private clientToken: string;
    private client: YggdrasilThirdPartyClient;

    async addProfile(_: IpcMainEvent, name: string) {
        try {
            addProfile(name);
            return data();
        } catch (err) {
            return error(ERROR_CODES.BAD_REQUEST, err.message);
        }
    }

    async getCurrentProfile() {
        return data(getCurrentProfile());
    }

    async getProfile(_: IpcMainEvent, id: string) {
        return data(getProfile(id));
    }

    async getProfiles() {
        return data(getProfiles());
    }

    async getSelectedProfile() {
        return data(getSelectedProfile());
    }

    async setSelectedProfile(_: IpcMainEvent, id: string) {
        return data(setSelectedProfile(id));
    }

    async deleteProfile(_: IpcMainEvent, id: string) {
        deleteProfile(id);
        return data();
    }

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
            return data(updateAccount(result));
        } catch (err) {
            if (err instanceof YggdrasilError) {
                return error(ERROR_CODES.BAD_REQUEST, `${err.error}: ${err.errorMessage}`);
            }
            return error(ERROR_CODES.TIMEOUT, 'Yggdrasil Service Unavailable');
        }
    }

    async lookup(_: IpcMainEvent, uuid: string) {
        try {
            return data(await this.client.lookup(uuid));
        } catch (err) {
            return error(ERROR_CODES.BAD_REQUEST);
        }
    }

    async session() {
        this.mode = CONFIG.get('authentication').mode;
        this.signedIn = hasAccount() ? await this.validateAccount() : false;
        return data({
            mode: this.mode,
            signedIn: this.signedIn,
            clientToken: this.clientToken,
            account: this.signedIn ? getUserAccount() : null,
            profile: (this.signedIn && this.mode !== 'offline') ? getUserProfile() : getCurrentProfile() || null,
        });
    }

    async invalidate() {
        try {
            await this.client.invalidate(getUserAccount().accessToken, this.clientToken);
            deleteAccount();
            return data();
        } catch (err) {
            return error(ERROR_CODES.BAD_REQUEST);
        }
    }

    async setUser(_: IpcMainEvent, user: { account?: string; profile?: string; }) {
        setSelectedUser(user);
        return data();
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
            return data();
        } catch (err) {
            return error(ERROR_CODES.BAD_REQUEST, err.errorMessage);
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
            const userAccount = getUserAccount();
            this.client.validate(userAccount.accessToken, this.clientToken)
                .then(valid => {
                    if (valid) ok(true);
                    else {
                        this.client.refresh({
                            accessToken: userAccount.accessToken,
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
