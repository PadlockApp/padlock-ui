import {
  encodeSecp256k1Pubkey,
  pubkeyToAddress,
  Secp256k1Pen,
  SigningCallback,
  SigningCosmWasmClient,
} from "secretjs";
import {FeeTable} from "secretjs/types/signingcosmwasmclient";
import { StdSignature } from "secretjs/types/types";
import { Bip39, Random } from "@iov/crypto";
import Web3 from 'web3';
//@ts-ignore
import * as Box from '3box';

// generateMnemonic will give you a fresh mnemonic
// it is up to the app to store this somewhere
export function generateMnemonic(): string {
  return Bip39.encode(Random.getBytes(16)).toString();
}

// some code that will only work in a browser...
export async function loadOrCreateMnemonic(space: any): Promise<string> {
  const key = "burner-wallet";
  const loaded = await space.private.get(key);
  if (loaded) {
    return loaded;
  }
  const generated = generateMnemonic();
  await space.private.set(key, generated);
  return generated;
}

export interface ConnectResult {
  readonly address: string;
  readonly client: SigningCosmWasmClient;
}

export interface Wallet {
  readonly address: string;
  readonly signer: SigningCallback;
}

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Modern dapp browsers...
    if ((window as any).ethereum) {
      let web3 = new Web3((window as any).ethereum);
      (window as any).ethereum
        .enable()
        .then(() => resolve(web3))
        .catch(reject);
    }
    // Legacy dapp browsers...
    else if ((window as any).web3) {
      // Use browser's provider.
      const provider = (window as any).web3.currentProvider;
      const web3 = new Web3(provider);
      resolve(web3);
    }
    // Fallback to localhost; use dev console port by default...
    else {
      const provider = new Web3.providers.HttpProvider('http://localhost:8545');
      const web3 = new Web3(provider);
      resolve(web3);
    }
  });

export async function burnerWallet(): Promise<Wallet> {
  const web3: any = await getWeb3();
  const box = await Box.create(web3.currentProvider);
  const ethAddress = (web3.currentProvider as any).selectedAddress;
  await box.auth(['Padlock'], { address: ethAddress });
  // Note: sometimes, openSpace returns early... caution
  const space = await box.openSpace('Padlock');
  await box.syncDone;

  const mnemonic = await loadOrCreateMnemonic(space);
  const pen = await Secp256k1Pen.fromMnemonic(mnemonic);
  const pubkey = encodeSecp256k1Pubkey(pen.pubkey);
  const address = pubkeyToAddress(pubkey, "secret");
  const signer = (signBytes: Uint8Array): Promise<StdSignature> => pen.sign(signBytes);
  return { address, signer };
}

const buildFeeTable = (feeToken: string, gasPrice: number): FeeTable => {
  const stdFee = (gas: number, denom: string, price: number) => {
    const amount = Math.floor(gas * price);
    return {
      amount: [{ amount: amount.toString(), denom: denom }],
      gas: gas.toString(),
    }
  };

  return {
    upload: stdFee(1000000, feeToken, gasPrice),
    init: stdFee(500000, feeToken, gasPrice),
    exec: stdFee(200000, feeToken, gasPrice),
    send: stdFee(80000, feeToken, gasPrice),
  }
};

// this creates a new connection to a server at URL,
// using a signing keyring generated from the given mnemonic
export async function connect(httpUrl: string, { address, signer }: Wallet): Promise<ConnectResult> {
  const client = new SigningCosmWasmClient(httpUrl, address, signer, 
    undefined, buildFeeTable("uscrt", 1));
  return { address, client };
}
