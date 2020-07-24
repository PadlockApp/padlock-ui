import { ffsTypes, ffsOptions } from '@textile/powergate-client';
import { Client, ThreadID } from '@textile/hub';

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

// ThreadDB instance connected
export const DB_CONNECTED = 'DB_CONNECTED';

// Secret wallet connected
export const SECRET_CONNECTED = 'SECRET_CONNECTED';

// Powergate FFS instance connected
export const FFS_CONNECTED = 'FFS_CONNECTED';

// Space Daemon connected
export const SPACEDAEMON_CONNECTED = 'SPACEDAEMON_CONNECTED';

// encountered error
export const FAILURE = 'FAILURE';

// DbConnected type
export interface DbConnected {
  type: typeof DB_CONNECTED;
  db: Db;
  thread: ThreadID;
}

// SecretConnected type
export interface SecretConnected {
  type: typeof SECRET_CONNECTED;
  secretPubKey: string;
}

// FfsConnected type
export interface FfsConnected {
  type: typeof FFS_CONNECTED;
  ffs: Ffs;
}

// spaceDaemonConnected type
export interface SpaceDaemonConnected {
  type: typeof SPACEDAEMON_CONNECTED;
  spaceDaemon: object;
}

// Failure type
export interface Failure {
  type: typeof FAILURE;
  error: Error;
}

// Generic state-changing Action type
export type Action = DbConnected | FfsConnected | Failure;
