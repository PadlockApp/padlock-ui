import './types';
import { INIT, DB_CONNECTED, FFS_CONNECTED, FAILURE, DbConnected, FfsConnected, Failure } from './types';

export const init = () => ({
    type: INIT
});

export const dbConnected = (db: any): DbConnected => ({
    type: DB_CONNECTED,
    db
});

export const ffsConnected = (ffs: any): FfsConnected => ({
    type: FFS_CONNECTED,
    ffs
});

export const failure = (error: Error): Failure => ({
    type: FAILURE,
    error
});
