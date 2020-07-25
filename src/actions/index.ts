import './types';
import {
  WEB3_CONNECTED,
  SPACE_CONNECTED,
  DB_CONNECTED,
  FFS_CONNECTED,
  FAILURE,
  DbConnected,
  FfsConnected,
  Failure,
  Web3,
  Db,
  ThreadID,
  Ffs,
  SecretConnected,
  SECRET_CONNECTED,
  SpaceConnected,
  Web3Connected,
} from './types';

export const web3Connected = (web3: Web3): Web3Connected => ({
  type: WEB3_CONNECTED,
  web3,
});

export const spaceConnected = (space: any): SpaceConnected => ({
  type: SPACE_CONNECTED,
  space,
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
