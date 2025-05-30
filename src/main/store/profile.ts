import { randomUUID } from 'node:crypto';
import Store from 'electron-store';
import type { AccountProfile, AuthenticatedAccount, UserSelect } from '@common/types/auth';
import { findStoreDir } from '@common/utils';

const store = new Store<{
    profiles: Record<string, AccountProfile>;
    selectedProfile?: string;
    authenticationDatabase: Record<string, AuthenticatedAccount>;
    selectedUser?: UserSelect;
    clientToken: string;
}>({
    defaults: {
        profiles: {},
        selectedProfile: null,
        authenticationDatabase: {},
        selectedUser: {
            account: null,
            profile: null
        },
        clientToken: randomUUID()
    },
    cwd: findStoreDir(),
    name: 'profiles'
});

export { store as PROFILES };
