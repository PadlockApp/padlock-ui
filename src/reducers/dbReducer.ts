import { DB_CONNECTED, DbConnected } from '../actions/types'
import { DbState } from './types';

const dbReducer = (state: DbState = null, action: DbConnected) => {
    switch (action.type) {
        case DB_CONNECTED:
            return action.db;
        default:
            return state;
    }
};

export default dbReducer;
