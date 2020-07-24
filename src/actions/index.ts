import './types';
import {
  SPACE_CONNECTED,
  DB_CONNECTED,
  FFS_CONNECTED,
  FAILURE,
  DbConnected,
  FfsConnected,
  Failure,
  Db,
  ThreadID,
  Ffs,
  SecretConnected,
  SECRET_CONNECTED,
  SpaceConnected,
} from './types';

export const spaceConnected = (space: any): SpaceConnected => ({
  type: SPACE_CONNECTED,
  space
});

export const dbConnected = (db: Db, thread: ThreadID): DbConnected => ({
  type: DB_CONNECTED,
  db,
  thread,
});

export const secretConnected = (secretPair: any): SecretConnected => ({
  type: SECRET_CONNECTED,
  secretPair,
});

export const ffsConnected = (ffs: Ffs): FfsConnected => ({
  type: FFS_CONNECTED,
  ffs,
});

export const failure = (error: Error): Failure => ({
  type: FAILURE,
  error,
});
