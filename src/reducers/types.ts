import { Ffs, Web3, Contract } from '../actions/types';

export type EthState = { web3: Web3; contract: Contract; paymentContract: Contract } | null;
export type SpaceState = any | null;
export type SecretState = any | null;
export type FfsState = Ffs | null;
export type ErrorState = string;

export type State = {
  eth: EthState;
  space: SpaceState;
  secretPair: SecretState;
  ffs: FfsState;
  error: ErrorState;
};
