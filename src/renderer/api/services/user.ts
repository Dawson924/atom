import { GameProfile, GameProfileWithProperties, SetTextureOption } from '@xmcl/user';
import { invokeHandler } from '../invoke';
import { AccountSession } from '@common/types/auth';

type LoginOptions = { username: string; password: string };

export const UserService = {
    login: (options: LoginOptions) => invokeHandler<Tentative>('auth:login', options),
    lookup: (id: string) => invokeHandler<GameProfileWithProperties>('auth:lookup', id),
    session: () => invokeHandler<AccountSession>('auth:session'),
    setTexture: (options: SetTextureOption) => invokeHandler<void>('auth:set-texture', options),
    invalidate: () => invokeHandler<void>('auth:invalidate'),
    addProfile: (name: string) => invokeHandler<void>('auth:add-profile', name),
    getProfile: (id: string) => invokeHandler<GameProfile>('auth:get-profile', id),
    getProfiles: () => invokeHandler<GameProfile[]>('auth:get-profiles'),
    getSelectedProfile: () => invokeHandler<string>('auth:get-selected-profile'),
    setSelectedProfile: (id: string) => invokeHandler<void>('auth:set-selected-profile', id),
    deleteProfile: (id: string) => invokeHandler<void>('auth:del-profile', id)
};
