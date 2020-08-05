import './types';
import {
  ETH_CONNECTED,
  SPACE_CONNECTED,
  FFS_CONNECTED,
  FAILURE,
  FfsConnected,
  Failure,
  Web3,
  Contract,
  Ffs,
  SecretConnected,
  SECRET_CONNECTED,
  SpaceConnected,
  EthConnected,
} from './types';

export const ethConnected = (web3: Web3, contract: Contract, nftContract: Contract): EthConnected => ({
  type: ETH_CONNECTED,
  web3,
  contract,
  nftContract,
});

export const spaceConnected = (space: any): SpaceConnected => ({
  type: SPACE_CONNECTED,
  space,
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
