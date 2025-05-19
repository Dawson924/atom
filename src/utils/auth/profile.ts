import { GameProfile, YggrasilAuthentication } from '@xmcl/user';
import type { AuthenticatedAccount } from '../../types/auth';
import { PROFILES } from '../../main/services/storage';

const hasAccount = () => {
    const select = loadUserSelect();
    if (!select.account || !select.profile) {
        return false;
    }
    if (!getCurrentAccount()) {
        return false;
    }
    return true;
};

const getCurrentAccount = () => {
    const select = loadUserSelect();
    return PROFILES.get('authenticationDatabase.' + select.account) as AuthenticatedAccount;
};

const getCurrentProfile = () => {
    const select = loadUserSelect();
    const Account = getCurrentAccount();
    return Account.profiles[select.profile] as Pick<GameProfile, 'id' | 'name'>;
};

const loadUserSelect = () => {
    return PROFILES.get('selectedUser');
};

const updateAccount = (authenticateion: YggrasilAuthentication) => {
    if (authenticateion.selectedProfile) {
        PROFILES.set(`authenticationDatabase.${authenticateion.user.id}`, {
            accessToken: authenticateion.accessToken,
            username: authenticateion.user.username,
            profiles: {
                [authenticateion.selectedProfile.id]: authenticateion.selectedProfile
            }
        });
        PROFILES.set('selectedUser', {
            account: authenticateion.user.id,
            profile: authenticateion.selectedProfile.id
        });
    }
    else if (authenticateion.availableProfiles.length === 0) {
        throw new Error('');
    }
};

const deleteAccount = () => {
    PROFILES.delete('authenticationDatabase');
    PROFILES.set('selectedUser', {});
};

export {
    hasAccount,
    getCurrentAccount,
    getCurrentProfile,
    loadUserSelect,
    updateAccount,
    deleteAccount,
};
