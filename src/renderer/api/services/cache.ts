import { invokeHandler } from '../invoke';

export const CacheService = {
    get: <T = any>(key: string) => invokeHandler<T>('cache:get', key),
    set: <T = any>(key: string, value: T) => invokeHandler<void>('cache:set', key, value),
    delete: (key: string) => invokeHandler<void>('cache:delete', key),
};
