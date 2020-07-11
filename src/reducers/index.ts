import { combineReducers } from 'redux';

import dbReducer from './dbReducer';
import ffsReducer from './ffsReducer';
import errorReducer from './errorReducer';

const rootReducer = combineReducers({
    db: dbReducer,
    ffs: ffsReducer,
    error: errorReducer,
});

export default rootReducer;
