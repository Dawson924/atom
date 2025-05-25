import { invokeHandler } from '../invoke';

export const ConfigService = {
    get: <T = any>(key: string) => invokeHandler<T>('config:get', key),
    set: <T = any>(key: string, value: T) => invokeHandler<void>('config:set', key, value),
    delete: (key: string) => invokeHandler<void>('config:delete', key),
};
