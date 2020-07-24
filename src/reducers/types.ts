import { Db, ThreadID, Ffs } from '../actions/types';

export type DbState = Db | null;
export type SecretState = string | null;
export type ThreadState = ThreadID | null;
export type FfsState = Ffs | null;
export type ErrorState = string;

export type State = {
  db: DbState;
  secretWallet: SecretState;
  thread: ThreadState;
  ffs: FfsState;
  error: ErrorState;
};
