import { fork, put } from 'redux-saga/effects';
import {
  ffsConnected,
  dbConnected,
  secretConnected,
  spaceConnected,
  ethConnected,
} from './actions';
import { createPow } from '@textile/powergate-client';
import { Client, KeyInfo, ThreadID } from '@textile/hub';
import { Libp2pCryptoIdentity } from '@textile/threads-core';
import { FileSchema } from './schemas';
import { StdSignature } from 'secretjs/types/types';
import { Bip39, Random } from '@iov/crypto';
//@ts-ignore
import * as Box from '3box';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import abi from './abis/Contract.json';
import { config } from "./config";
const { EnigmaUtils, Secp256k1Pen, SigningCosmWasmClient, pubkeyToAddress, encodeSecp256k1Pubkey } = require("secretjs");

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

const {
  REACT_APP_POW_HOST,
  REACT_APP_POW_TOKEN,
  REACT_APP_DB_USER_API_KEY,
  REACT_APP_DB_USER_API_SECRET,
} = process.env;

async function getIdentity(space: any) {
  const cachedIdentity = await space.private.get('user-private-identity');
  if (cachedIdentity !== null) {
    return Libp2pCryptoIdentity.fromString(cachedIdentity);
  }
  const identity = await Libp2pCryptoIdentity.fromRandom();
  await space.private.set('user-private-identity', identity.toString());
  return identity;
}

async function getSecretWallet(space: any) {
  const cachedWallet = await space.private.get('user-secret-wallet');
  let mnemonic;
  if (cachedWallet !== null) {
    mnemonic = cachedWallet;
  } else {
    mnemonic = Bip39.encode(Random.getBytes(16)).toString();
  }
  const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic);
  const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
  const address = pubkeyToAddress(pubkey, 'secret');
  const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();
  
  const client = new SigningCosmWasmClient(
        config.httpUrl,
        address,
        (signBytes) => signingPen.sign(signBytes),
        txEncryptionSeed, config.fees
    );

  const codeId = 1;
  const contractData = await client.getContracts(codeId);

  // Query the account, see if it has funds etc
  const accountData = await client.getAccount(address);
  console.log(`accountData=${JSON.stringify(accountData)}`)

  // query the contract
  const itemId = 1;
  const contractAddress = contractData[0].address;
  const isWhitelistedMsg = {"IsWhitelisted": {"address": address, "id": itemId}}
  let result = await client.queryContractSmart(contractAddress, isWhitelistedMsg);
  console.log(`IsWhitelisted ${address}: ${result.whitelisted}`);


  if (result.whitelisted) {
    // get the private key
    const keyRequestMsg = {"RequestSharedKey": {"id": itemId}}
    result = await client.execute(contractAddress, keyRequestMsg);
    console.log(`SharedKey result: ${JSON.stringify(result)}`);
  }

  
  // return the client
  const wallet = { address, client };
  await space.private.set('user-secret-wallet', mnemonic);
  return wallet;
}

function* init() {
  // pow client
  const pow = createPow({ host: REACT_APP_POW_HOST });
  pow.setToken(REACT_APP_POW_TOKEN as string);
  const { ffs } = pow;
  yield put(ffsConnected(ffs));

  const keyInfo: KeyInfo = {
    // Using insecure keys
    key: REACT_APP_DB_USER_API_KEY as string,
    secret: REACT_APP_DB_USER_API_SECRET as string,
    // @ts-ignore
    type: 1,
  };
  const db: Client = yield Client.withKeyInfo(keyInfo);

  // web3 client
  const web3 = (yield getWeb3()) as Web3;
  const contract = new web3.eth.Contract(
    abi as AbiItem[],
    '0x8D1eD3DaB2dE4622b7eD38baB4A9918256CF7B30'
  );
  yield put(ethConnected(web3, contract));

  // 3box
  const box = yield Box.create(web3.currentProvider);
  const address = (web3.currentProvider as any).selectedAddress;
  yield box.auth(['Padlock'], { address });
  // Note: sometimes, openSpace returns early... caution
  const space = yield box.openSpace('Padlock');
  yield box.syncDone;
  yield put(spaceConnected(space));

  // get secret wallet
  const secretWallet = yield getSecretWallet(space);
  yield put(secretConnected(secretWallet));

  // TODO: use MetaMask to generate identity instead of Libp2pCryptoIdentity
  const identity: Libp2pCryptoIdentity = yield getIdentity(space);
  yield db.getToken(identity);
  const { listList: threads } = yield db.listThreads();
  if (threads.length === 0) {
    yield db.newDB();
  }
  const threadId = (yield db.listThreads()).listList[0].id;
  const thread: ThreadID = yield ThreadID.fromString(threadId as string);
  try {
    yield db?.getCollectionIndexes(thread, 'files');
  } catch (e) {
    yield db?.newCollection(thread, 'files', FileSchema);
  }
  yield put(dbConnected(db, thread));
}

function* saga() {
  yield fork(init);
}

export default saga;

// Snippets:
// // Generate new thread
// const thread: ThreadID = yield client.newDB()

// // Delete all threads
// for (const thread of (yield client.listThreads()).listList) {
//     client.deleteDB(ThreadID.fromString(thread.id))
// }
