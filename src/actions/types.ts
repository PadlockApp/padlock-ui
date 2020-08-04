import { ffsTypes, ffsOptions } from '@textile/powergate-client';
import Web3Type from 'web3';
import { Contract as ContractType } from 'web3-eth-contract';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';

// Web3 type
export type Web3 = Web3Type;

// Contract type
export type Contract = ContractType;

// FFS type
export type Ffs = {
  create: () => Promise<ffsTypes.CreateResponse.AsObject>;
  list: () => Promise<ffsTypes.ListAPIResponse.AsObject>;
  id: () => Promise<ffsTypes.IDResponse.AsObject>;
  addrs: () => Promise<ffsTypes.AddrsResponse.AsObject>;
  defaultStorageConfig: () => Promise<
    ffsTypes.DefaultStorageConfigResponse.AsObject
  >;
  newAddr: (
    name: string,
    type?: 'bls' | 'secp256k1' | undefined,
    makeDefault?: boolean | undefined
  ) => Promise<ffsTypes.NewAddrResponse.AsObject>;
  getStorageConfig: (
    cid: string
  ) => Promise<ffsTypes.GetStorageConfigResponse.AsObject>;
  setDefaultStorageConfig: (
    config: ffsTypes.StorageConfig.AsObject
  ) => Promise<void>;
  show: (cid: string) => Promise<ffsTypes.ShowResponse.AsObject>;
  info: () => Promise<ffsTypes.InfoResponse.AsObject>;
  watchJobs: (
    handler: (event: ffsTypes.Job.AsObject) => void,
    ...jobs: string[]
  ) => () => void;
  cancelJob: (jobId: string) => Promise<void>;
  watchLogs: (
    handler: (event: ffsTypes.LogEntry.AsObject) => void,
    cid: string,
    ...opts: ffsOptions.WatchLogsOption[]
  ) => () => void;
  replace: (
    cid1: string,
    cid2: string
  ) => Promise<ffsTypes.ReplaceResponse.AsObject>;
  pushStorageConfig: (
    cid: string,
    ...opts: ffsOptions.PushStorageConfigOption[]
  ) => Promise<ffsTypes.PushStorageConfigResponse.AsObject>;
  remove: (cid: string) => Promise<void>;
  get: (cid: string) => Promise<Uint8Array>;
  sendFil: (from: string, to: string, amount: number) => Promise<void>;
  close: () => Promise<void>;
  stage: (input: Uint8Array) => Promise<ffsTypes.StageResponse.AsObject>;
  listPayChannels: () => Promise<ffsTypes.ListPayChannelsResponse.AsObject>;
  createPayChannel: (
    from: string,
    to: string,
    amt: number
  ) => Promise<ffsTypes.CreatePayChannelResponse.AsObject>;
  redeemPayChannel: (payChannelAddr: string) => Promise<void>;
  listStorageDealRecords: (
    ...opts: ffsOptions.ListDealRecordsOption[]
  ) => Promise<ffsTypes.ListStorageDealRecordsResponse.AsObject>;
  listRetrievalDealRecords: (
    ...opts: ffsOptions.ListDealRecordsOption[]
  ) => Promise<ffsTypes.ListRetrievalDealRecordsResponse.AsObject>;
  showAll: () => Promise<ffsTypes.ShowAllResponse.AsObject>;
};

// Apollo Client type
export type Apollo = ApolloClient<NormalizedCacheObject>;

// Web3 provider connected
export const ETH_CONNECTED = 'ETH_CONNECTED';

// 3Box space connected
export const SPACE_CONNECTED = 'SPACE_CONNECTED';

// Secret wallet connected
export const SECRET_CONNECTED = 'SECRET_CONNECTED';

// Powergate FFS instance connected
export const FFS_CONNECTED = 'FFS_CONNECTED';

// encountered error
export const FAILURE = 'FAILURE';

// EthConnected type
export interface EthConnected {
  type: typeof ETH_CONNECTED;
  web3: Web3;
  contract: Contract;
}

// SpaceConnected type
export interface SpaceConnected {
  type: typeof SPACE_CONNECTED;
  space: any;
}

// SecretConnected type
export interface SecretConnected {
  type: typeof SECRET_CONNECTED;
  secretPair: any;
}

// FfsConnected type
export interface FfsConnected {
  type: typeof FFS_CONNECTED;
  ffs: Ffs;
}

// Failure type
export interface Failure {
  type: typeof FAILURE;
  error: Error;
}

// Generic state-changing Action type
export type Action = FfsConnected | Failure;
