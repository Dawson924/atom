import Store from 'electron-store';
import { findStoreDir } from '@common/utils/path';

type ValueType = string | number | boolean;

const store = new Store<Record<string, ValueType | ValueType[]>>({
    defaults: {},
    cwd: findStoreDir(),
    name: 'cache'
});

export { store as CACHE };
