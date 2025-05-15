import type { GameProfile } from '@xmcl/user';

type AccountProfile = Pick<GameProfile, 'id' | 'name'>;
type AuthenticatedAccount = {
    accessToken: string;
    profiles: Record<string, AccountProfile>
};
type UserSelect = {
    account: string;
    profile: string;
};
type AccountSession = {
    signedIn: boolean;
    clientToken: string;
    account?: AuthenticatedAccount;
    profile?: AccountProfile;
};
export type {
    AccountProfile,
    AuthenticatedAccount,
    UserSelect,
    AccountSession
};
