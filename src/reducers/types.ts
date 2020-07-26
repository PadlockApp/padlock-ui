import { Db, ThreadID, Ffs, Web3, Contract } from '../actions/types';

export type EthState = { web3: Web3; contract: Contract } | null;
export type SpaceState = any | null;
export type DbState = Db | null;
export type SecretState = any | null;
export type ThreadState = ThreadID | null;
export type FfsState = Ffs | null;
export type ErrorState = string;

export type State = {
  eth: EthState;
  space: SpaceState;
  db: DbState;
  secretPair: SecretState;
  thread: ThreadState;
  ffs: FfsState;
  error: ErrorState;
};
