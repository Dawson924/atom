import { randomUUID } from 'node:crypto';
import Store from 'electron-store';
import { CONFIG } from './config';
import type { AccountProfile, AuthenticatedAccount, UserSelect } from '@common/types/auth';

const store = new Store<{
    profiles: Record<string, AccountProfile>;
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
