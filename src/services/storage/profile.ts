import { randomUUID } from 'node:crypto';
import Store from 'electron-store';
import { CONFIG } from './config';
import { AuthenticatedAccount, UserSelect } from '../../libs/auth';

const store = new Store<{
    profiles: Record<string, Tentative>;
    selectedProfile: string;
    authenticationDatabase: Record<string, AuthenticatedAccount>;
    selectedUser?: UserSelect;
    clientToken: string;
}>({
    defaults: {
        profiles: {},
        selectedProfile: null,
        authenticationDatabase: {},
        selectedUser: null,
        clientToken: randomUUID()
    },
    cwd: CONFIG.get('launch.minecraftFolder'),
    name: 'launcher_profiles'
});

export { store as PROFILES };
