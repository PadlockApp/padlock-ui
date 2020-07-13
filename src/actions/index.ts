import './types';
import {
    DB_CONNECTED,
    FFS_CONNECTED,
    SPACEDAEMON_CONNECTED,
    FAILURE,
    DbConnected,
    FfsConnected,
    SpaceDaemonConnected,
    Failure,
    Ffs
} from './types';

export const dbConnected = (db: object): DbConnected => ({
    type: DB_CONNECTED,
    db
});

export const ffsConnected = (ffs: Ffs): FfsConnected => ({
    type: FFS_CONNECTED,
    ffs
});

export const spaceDaemonConnected = (spaceDaemon: object): SpaceDaemonConnected => ({
    type: SPACEDAEMON_CONNECTED,
    spaceDaemon
});

export const failure = (error: Error): Failure => ({
    type: FAILURE,
    error
});
