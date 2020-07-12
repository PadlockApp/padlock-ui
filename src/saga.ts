import { fork, put } from 'redux-saga/effects';
import { ffsConnected, dbConnected } from './actions';
import { createPow } from "@textile/powergate-client";
import { Client, KeyInfo, ThreadID } from '@textile/hub';
import { Libp2pCryptoIdentity } from '@textile/threads-core';

const {
    REACT_APP_POW_HOST,
    REACT_APP_POW_TOKEN,
    REACT_APP_DB_USER_API_KEY,
    REACT_APP_DB_USER_API_SECRET,
} = process.env;

function* init() {
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
    }
    const client: Client = yield Client.withKeyInfo(keyInfo);
    // // const identity: Libp2pCryptoIdentity = yield Libp2pCryptoIdentity.fromRandom();
    const id = 'bbaareyefldfqmbbvfd6es53zfrby2mtz2mjeney5xl3geme2oftvcjedsxw6abny3yywb73vyjtqigwkz53dqqnxizq3rm2uuncjqv4saez4n3paaw4n4mla7524ezyedlfm65ryig3umynywnkkgreyk6jacm6g';
    // TODO: use MetaMask to generate identity
    const identity: Libp2pCryptoIdentity = yield Libp2pCryptoIdentity.fromString(id);
    // TODO: persist token in local storage
    const token: string = yield client.getToken(identity);
    // const token: string = 'eyJhbGciOiJFZDI1NTE5IiwidHlwIjoiSldUIn0.eyJpYXQiOjE1OTQ1NTA2MDksImlzcyI6ImJiYWFyZWlnd2pvYXd1ZWc1a3ZobWMzNjI3Z3Zja2htZTd6emZlbnVqYXVqcHRodGd6Y21odHRvYTZ1Iiwic3ViIjoiYmJhYXJlaWhuNGFjM3J4cnJtZDd4bHF0aGFxbm12dDN3aGJhM29ydGJ4Y3p2amkyZXRibHplYWp0eXkifQ.EG3xEGUx8hulX7Gp17u0pFVutrekT_j58N-QTRWMcJaALail5H_aFxXzIkTAlO4xM571QkMOZBSrTch4GUuKBA';
    yield put(dbConnected(client));
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