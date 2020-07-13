import { combineReducers } from 'redux';
import dbReducer from './dbReducer';
import threadReducer from './threadReducer';
import ffsReducer from './ffsReducer';
import spaceDaemonReducer from './spaceDaemonReducer';
import errorReducer from './errorReducer';
import { Reducer } from 'react';
import { State } from './types';
import { Action } from '../actions/types';

const rootReducer: Reducer<State, Action> = combineReducers({
    db: dbReducer,
    thread: threadReducer,
    ffs: ffsReducer,
    spaceDaemon: spaceDaemonReducer,
    error: errorReducer,
});

export default rootReducer;
