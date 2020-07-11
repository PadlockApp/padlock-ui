import { combineReducers } from 'redux';
import dbReducer from './dbReducer';
import ffsReducer from './ffsReducer';
import errorReducer from './errorReducer';
import { Reducer } from 'react';
import { State } from './types';
import {Action} from '../actions/types';

const rootReducer: Reducer<State ,Action> = combineReducers({
    db: dbReducer,
    ffs: ffsReducer,
    error: errorReducer,
});

export default rootReducer;
