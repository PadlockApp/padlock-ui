import { takeEvery } from 'redux-saga/effects';
import { INIT } from './actions/types';

function* init() {
    return;
}

function* saga() {
    yield takeEvery(INIT, init);
}

export default saga;
