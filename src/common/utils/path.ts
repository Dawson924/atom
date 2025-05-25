import { homedir } from 'node:os';

const findStoreDir = () => {
    return `${homedir()}/.config/AtomLauncher`;
};

export { findStoreDir };
