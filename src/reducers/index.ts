import { combineReducers } from 'redux';
import ethReducer from './ethReducer';
import spaceReducer from './spaceReducer';
import secretReducer from './secretReducer';
import ffsReducer from './ffsReducer';
import errorReducer from './errorReducer';
import { Reducer } from 'react';
import { State } from './types';
import { Action } from '../actions/types';

const rootReducer: Reducer<State, Action> = combineReducers({
  eth: ethReducer,
  space: spaceReducer,
  secretPair: secretReducer,
  ffs: ffsReducer,
  error: errorReducer,
});

export default rootReducer;
