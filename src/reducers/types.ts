import { Db, ThreadID, Ffs, Web3 } from '../actions/types';

export type Web3State = Web3 | null;
export type SpaceState = any | null;
export type DbState = Db | null;
export type SecretState = any | null;
export type ThreadState = ThreadID | null;
export type FfsState = Ffs | null;
export type ErrorState = string;

export type State = {
  web3: Web3State;
  space: SpaceState;
  db: DbState;
  secretPair: SecretState;
  thread: ThreadState;
  ffs: FfsState;
  error: ErrorState;
};
