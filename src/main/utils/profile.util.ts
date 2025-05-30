import { GameProfile, getOfflineUUID, YggdrasilError, YggrasilAuthentication } from '@xmcl/user';
import type { AccountProfile, AuthenticatedAccount } from '@common/types/auth';
import { PROFILES } from '../store';
import { Maybe } from '@common/types/utils';

const addProfile = (name: string) => {
    const profile = getProfileByName(name);
    if (!profile) {
        const id = getOfflineUUID(name).replaceAll(/-/g, '');
        PROFILES.set('profiles.' + id, {
            id,
            name
        });
    }
    else {
        throw new Error('Profile already exists');
    }
};

const getGameProfile = (mode: string): Maybe<AccountProfile> => {
    return mode === 'offline'
        ? getCurrentProfile()
        : getUserProfile();
};

const getCurrentProfile = () => {
    return getProfile(getSelectedProfile());
};

const getProfile = (value: string) => {
    return getProfileByID(value) || getProfileByName(value);
};

const getProfileByID = (id: string) => {
    return getProfiles().find(i => i.id === id);
};

const getProfileByName = (name: string) => {
    return getProfiles().find(i => i.name === name);
};

const getProfiles = () => {
    return Object.values(PROFILES.get('profiles')) || [];
};

const getSelectedProfile = () => {
    return PROFILES.get('selectedProfile');
};

const setSelectedProfile = (value: string) => {
    return PROFILES.set('selectedProfile', getProfile(value)?.id || null);
};

const deleteProfile = (id: string) => {
    if (PROFILES.get('selectedProfile') === id)
        PROFILES.set('selectedProfile', null);

    const profiles = PROFILES.get('profiles');
    delete profiles[id];
    PROFILES.set('profiles', profiles);
};

const hasAccount = () => {
    const select = getSelectedUser();
    if (!select?.account || !select?.profile) {
        return false;
    }
    if (!getUserAccount()) {
        return false;
    }
    return true;
};

const getUserAccount = () => {
    const select = getSelectedUser();
    return PROFILES.get('authenticationDatabase.' + select.account) as AuthenticatedAccount;
};

const getUserProfile = () => {
    const select = getSelectedUser();
    const Account = getUserAccount();
    return Account.profiles[select.profile] as AccountProfile;
};

const getUserProfiles = () => {
    return Object.values(getUserAccount().profiles);
};

const getSelectedUser = () => {
    return PROFILES.get('selectedUser');
};

const setSelectedUser = (user: { account?: string, profile?: string }) => {
    user.account && PROFILES.set('selectedUser.account', user.account);
    user.profile && PROFILES.set('selectedUser.profile', user.profile);
};

const updateAccount = (auth: YggrasilAuthentication) => {
    if (!auth.selectedProfile &&
        (!auth.availableProfiles || auth.availableProfiles.length === 0))
        throw new YggdrasilError(400, 'No available profiles');

    let selectedProfile: GameProfile = auth.selectedProfile;
    let hasMultipleProfiles: boolean = false;
    if (!selectedProfile && auth.availableProfiles?.length > 0) {
        selectedProfile = auth.availableProfiles[0];
        hasMultipleProfiles = true;
    }

    const allProfiles = auth.availableProfiles?.reduce((acc: any, profile: GameProfile) => {
        acc[profile.id] = profile;
        return acc;
    }, {}) || {};

    PROFILES.set(`authenticationDatabase.${auth.user.id}`, {
        accessToken: auth.accessToken,
        username: auth.user.username,
        profiles: allProfiles // 存储所有配置文件
    });

    setSelectedUser({ account: auth.user.id, profile: selectedProfile.id });

    return {
        user: auth.user,
        hasMultipleProfiles,
        availableProfiles: auth.availableProfiles
    };
};

const deleteAccount = () => {
    PROFILES.delete('authenticationDatabase');
    PROFILES.set('selectedUser', {});
};

export {
    // Offline
    addProfile,
    getGameProfile,
    getCurrentProfile,
    getProfile,
    getProfileByID,
    getProfileByName,
    getProfiles,
    getSelectedProfile,
    setSelectedProfile,
    deleteProfile,
    // Authenticated
    hasAccount,
    getUserAccount,
    getUserProfile,
    getUserProfiles,
    getSelectedUser,
    setSelectedUser,
    updateAccount,
    deleteAccount,
};
