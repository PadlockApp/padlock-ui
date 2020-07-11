// initializing
export const INIT = 'INIT';

// ThreadDB instance connected
export const DB_CONNECTED = 'DB_CONNECTED';

// Powergate FFS instance connected
export const FFS_CONNECTED = 'FFS_CONNECTED';

// encountered error
export const FAILURE = 'FAILURE';

// Init type
export interface Init {
    type: typeof INIT
}

// DbConnected type
export interface DbConnected {
    type: typeof DB_CONNECTED
    db: any
}

// FfsConnected type
export interface FfsConnected {
    type: typeof FFS_CONNECTED
    ffs: any
}

// Failure type
export interface Failure {
    type: typeof FAILURE
    error: Error
}

// Generic state-changing Action type
export type Action = DbConnected | FfsConnected | Failure;
