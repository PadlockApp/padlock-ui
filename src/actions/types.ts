import { ffsTypes, ffsOptions } from '@textile/powergate-client';
import { Client, ThreadID } from '@textile/hub';
import Web3Type from 'web3';

// Web3 type
export type Web3 = Web3Type;

// Db type
export type Db = Client;

// Thread ID type
export { ThreadID } from '@textile/hub';

// FFS type
export type Ffs = {
  create: () => Promise<ffsTypes.CreateResponse.AsObject>;
  list: () => Promise<ffsTypes.ListAPIResponse.AsObject>;
  id: () => Promise<ffsTypes.IDResponse.AsObject>;
  addrs: () => Promise<ffsTypes.AddrsResponse.AsObject>;
  defaultConfig: () => Promise<ffsTypes.DefaultConfigResponse.AsObject>;
  newAddr: (
    name: string,
    type?: 'bls' | 'secp256k1' | undefined,
    makeDefault?: boolean | undefined
  ) => Promise<ffsTypes.NewAddrResponse.AsObject>;
  getDefaultCidConfig: (
    cid: string
  ) => Promise<ffsTypes.GetDefaultCidConfigResponse.AsObject>;
  getCidConfig: (
    cid: string
  ) => Promise<ffsTypes.GetCidConfigResponse.AsObject>;
  setDefaultConfig: (config: ffsTypes.DefaultConfig.AsObject) => Promise<void>;
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
  pushConfig: (
    cid: string,
    ...opts: ffsOptions.PushConfigOption[]
  ) => Promise<ffsTypes.PushConfigResponse.AsObject>;
  remove: (cid: string) => Promise<void>;
  get: (cid: string) => Promise<Uint8Array>;
  sendFil: (from: string, to: string, amount: number) => Promise<void>;
  close: () => Promise<void>;
  addToHot: (input: Uint8Array) => Promise<ffsTypes.AddToHotResponse.AsObject>;
  listPayChannels: () => Promise<ffsTypes.PaychInfo.AsObject[]>;
  createPayChannel: (
    from: string,
    to: string,
    amt: number
  ) => Promise<ffsTypes.CreatePayChannelResponse.AsObject>;
  redeemPayChannel: (payChannelAddr: string) => Promise<void>;
  showAll: () => Promise<ffsTypes.CidInfo.AsObject[]>;
};

// Web3 provider connected
export const WEB3_CONNECTED = 'WEB3_CONNECTED';

// 3Box space connected
export const SPACE_CONNECTED = 'SPACE_CONNECTED';

// ThreadDB instance connected
export const DB_CONNECTED = 'DB_CONNECTED';

// Secret wallet connected
export const SECRET_CONNECTED = 'SECRET_CONNECTED';

// Powergate FFS instance connected
export const FFS_CONNECTED = 'FFS_CONNECTED';

// encountered error
export const FAILURE = 'FAILURE';

// Web3Connected type
export interface Web3Connected {
  type: typeof WEB3_CONNECTED;
  web3: Web3;
}

// SpaceConnected type
export interface SpaceConnected {
  type: typeof SPACE_CONNECTED;
  space: any;
}

// DbConnected type
export interface DbConnected {
  type: typeof DB_CONNECTED;
  db: Db;
  thread: ThreadID;
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
export type Action = DbConnected | FfsConnected | Failure;
