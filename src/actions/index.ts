import './types';
import {
  ETH_CONNECTED,
  SPACE_CONNECTED,
  DB_CONNECTED,
  FFS_CONNECTED,
  FAILURE,
  DbConnected,
  FfsConnected,
  Failure,
  Web3,
  Contract,
  Db,
  ThreadID,
  Ffs,
  SecretConnected,
  SECRET_CONNECTED,
  SpaceConnected,
  EthConnected,
  ApolloConnected,
  APOLLO_CONNECTED,
  Apollo,
} from './types';

export const ethConnected = (
  web3: Web3,
  contract: Contract
): EthConnected => ({
  type: ETH_CONNECTED,
  web3,
  contract,
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

export const apolloConnected = (client: Apollo): ApolloConnected => ({
  type: APOLLO_CONNECTED,
  client,
});

export const failure = (error: Error): Failure => ({
  type: FAILURE,
  error,
});
