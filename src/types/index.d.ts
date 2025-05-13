import type { ContextWindow } from './preload';
import type { TentativeType } from './tentative';

declare global {
    interface Window extends ContextWindow {}
    type Tentative = any;
    interface T extends TentativeType {}
}
