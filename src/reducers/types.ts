import { Db, ThreadID, Ffs, Web3, Contract, Apollo } from '../actions/types';

export type EthState = { web3: Web3; contract: Contract } | null;
export type SpaceState = any | null;
export type DbState = Db | null;
export type SecretState = any | null;
export type ThreadState = ThreadID | null;
export type FfsState = Ffs | null;
export type ErrorState = string;
export type ApolloState = Apollo | null;

export type State = {
  eth: EthState;
  apolloClient: ApolloState;
  space: SpaceState;
  db: DbState;
  secretPair: SecretState;
  thread: ThreadState;
  ffs: FfsState;
  error: ErrorState;
};
