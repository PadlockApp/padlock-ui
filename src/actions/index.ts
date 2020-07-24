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
  Db,
  ThreadID,
  Ffs,
  SecretConnected,
  SECRET_CONNECTED,
} from './types';

export const dbConnected = (db: Db, thread: ThreadID): DbConnected => ({
  type: DB_CONNECTED,
  db,
  thread,
});

export const secretConnected = (secretPubKey: string): SecretConnected => ({
  type: SECRET_CONNECTED,
  secretPubKey,
});

export const ffsConnected = (ffs: Ffs): FfsConnected => ({
  type: FFS_CONNECTED,
  ffs,
});

export const spaceDaemonConnected = (
  spaceDaemon: object
): SpaceDaemonConnected => ({
  type: SPACEDAEMON_CONNECTED,
  spaceDaemon,
});

export const failure = (error: Error): Failure => ({
  type: FAILURE,
  error,
});
