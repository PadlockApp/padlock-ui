import { takeEvery, put } from 'redux-saga/effects';
import { INIT } from './actions/types';
import { ffsConnected } from './actions';
import { createPow } from "@textile/powergate-client";

const {
    REACT_APP_POW_HOST,
    REACT_APP_POW_TOKEN,
    REACT_APP_DB_USER_API_KEY,
} = process.env;

function* init() {
    const pow = createPow({ host: REACT_APP_POW_HOST });
    pow.setToken(REACT_APP_POW_TOKEN as string);
    const { ffs } = pow;
    yield put(ffsConnected(ffs));
}

function* saga() {
    yield takeEvery(INIT, init);
}

export default saga;
