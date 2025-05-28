import type { GameProfileWithProperties, SetTextureOption } from '@xmcl/user';
import { invokeHandler } from '../invoke';
import type { AccountProfile, UserSession } from '@common/types/auth';

type LoginOptions = { username: string; password: string };

export const UserService = {
    addProfile: (name: string) => invokeHandler<void>('user:add-profile', name),
    getCurrentProfile: () => invokeHandler<AccountProfile>('user:get-current-profile'),
    getProfile: (id: string) => invokeHandler<AccountProfile>('user:get-profile', id),
    getProfiles: () => invokeHandler<AccountProfile[]>('user:get-profiles'),
    getSelectedProfile: () => invokeHandler<string>('user:get-selected-profile'),
    setSelectedProfile: (id: string) => invokeHandler<void>('user:set-selected-profile', id),
    deleteProfile: (id: string) => invokeHandler<void>('user:del-profile', id),
    login: (options: LoginOptions) => invokeHandler<Tentative>('user:login', options),
    lookup: (id: string) => invokeHandler<GameProfileWithProperties>('user:lookup', id),
    session: () => invokeHandler<UserSession>('user:session'),
    setUser: (user: { account?: string; profile?: string; }) => invokeHandler('user:set-user', user),
    setTexture: (options: SetTextureOption) => invokeHandler<void>('user:set-texture', options),
    invalidate: () => invokeHandler<void>('user:invalidate'),
};
