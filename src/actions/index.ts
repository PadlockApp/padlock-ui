import './types';
import {
    INIT,
    DB_CONNECTED,
    FFS_CONNECTED,
    FAILURE,
    DbConnected,
    FfsConnected,
    Failure,
    Ffs
} from './types';

export const init = () => ({
    type: INIT
});

export const dbConnected = (db: object): DbConnected => ({
    type: DB_CONNECTED,
    db
});

export const ffsConnected = (ffs: Ffs): FfsConnected => ({
    type: FFS_CONNECTED,
    ffs
});

export const failure = (error: Error): Failure => ({
    type: FAILURE,
    error
});
