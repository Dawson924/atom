import type { GameProfile } from '@xmcl/user';

type OfflineProfile = { id: string; name: string };
type AccountProfile = Pick<GameProfile, 'id' | 'name'>;
type AuthenticatedAccount = {
    accessToken: string;
    profiles: Record<string, AccountProfile>
};
type UserSelect = {
    account: string;
    profile: string;
};
type UserSession = {
    mode: 'xbox' | 'yggdrasil' | 'offline';
    signedIn: boolean;
    clientToken: string;
    account?: AuthenticatedAccount;
    profile?: AccountProfile;
};
export type {
    OfflineProfile,
    AccountProfile,
    AuthenticatedAccount,
    UserSelect,
    UserSession,
};
