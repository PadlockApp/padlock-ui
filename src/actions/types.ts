// initializing
export const INIT = 'INIT';

// ThreadDB instance connected
export const DB_CONNECTED = 'DB_CONNECTED';

// Powergate FFS instance connected
export const FFS_CONNECTED = 'FFS_CONNECTED';

// encountered error
export const FAILURE = 'FAILURE';

export interface Init {
    type: typeof INIT
}

export interface DbConnected {
    type: typeof DB_CONNECTED
    db: any
}

export interface FfsConnected {
    type: typeof FFS_CONNECTED
    ffs: any
}

export interface Failure {
    type: typeof FAILURE
    error: Error
}
