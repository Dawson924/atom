import { getOfflineUUID, SetTextureOption, YggdrasilError, YggdrasilThirdPartyClient } from '@xmcl/user';
import { CONFIG, PROFILES } from './store';
import { deleteAccount, getCurrentAccount, getCurrentProfile, hasAccount, updateAccount } from '../utils/profile.util';
import { IpcMainEvent } from 'electron';
import { data, error, ERROR_CODES } from '../libs/response';

declare function getOfflineUUID(username: string): string;

export class UserService {
    private signedIn: boolean;
    private clientToken: string;
    private client: YggdrasilThirdPartyClient;

    async addProfile(_: IpcMainEvent, name: string) {
        const profile = Object.values(PROFILES.get('profiles')).find(i => i.name === name);
        if (!profile) {
            const id = getOfflineUUID(name).replaceAll(/-/g, '');
            PROFILES.set('profiles.' + id, {
                id,
                name
            });
            return data();
        }
        else {
            return error(ERROR_CODES.INVALID_ARGUMENT, 'Profile already exists');
        }
    }

    async getProfile(_: IpcMainEvent, id: string) {
        return data(Object.values(PROFILES.get('profiles')).find(i => i.id === id));
    }

    async getProfiles() {
        return data(Object.values(PROFILES.get('profiles')) || []);
    }

    async getSelectedProfile() {
        return data(PROFILES.get('selectedProfile'));
    }

    async setSelectedProfile(_: IpcMainEvent, id: string) {
        return data(PROFILES.set('selectedProfile', id));
    }

    async deleteProfile(_: IpcMainEvent, id: string) {
        if (PROFILES.get('selectedProfile') === id)
            PROFILES.set('selectedProfile', null);

        const profiles = PROFILES.get('profiles');
        delete profiles[id];
        PROFILES.set('profiles', profiles);
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
            updateAccount(result);
            return data(result);
        } catch(err) {
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
        this.signedIn = hasAccount() ? await this.validateAccount() : false;
        return data({
            signedIn: this.signedIn,
            clientToken: this.clientToken,
            account: this.signedIn ? getCurrentAccount() : null,
            profile: this.signedIn ? getCurrentProfile() : null,
        });
    }

    async invalidate() {
        try {
            await this.client.invalidate(getCurrentAccount().accessToken, this.clientToken);
            deleteAccount();
            return data();
        } catch (err) {
            return error(ERROR_CODES.BAD_REQUEST);
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
