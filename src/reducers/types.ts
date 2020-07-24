import { Db, ThreadID, Ffs } from '../actions/types';

export type SpaceState = any | null;
export type DbState = Db | null;
export type SecretState = any | null;
export type ThreadState = ThreadID | null;
export type FfsState = Ffs | null;
export type ErrorState = string;

export type State = {
  space: SpaceState;
  db: DbState;
  secretPair: SecretState;
  thread: ThreadState;
  ffs: FfsState;
  error: ErrorState;
};
