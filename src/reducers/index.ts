import { combineReducers } from 'redux';
import web3Reducer from './web3Reducer';
import spaceReducer from './spaceReducer';
import dbReducer from './dbReducer';
import secretReducer from './secretReducer';
import threadReducer from './threadReducer';
import ffsReducer from './ffsReducer';
import errorReducer from './errorReducer';
import { Reducer } from 'react';
import { State } from './types';
import { Action } from '../actions/types';

const rootReducer: Reducer<State, Action> = combineReducers({
  web3: web3Reducer,
  space: spaceReducer,
  db: dbReducer,
  secretPair: secretReducer,
  thread: threadReducer,
  ffs: ffsReducer,
  error: errorReducer,
});

export default rootReducer;
