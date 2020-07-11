import { DB_CONNECTED, DbConnected } from '../actions/types'
import { ReducedState } from './types';

const dbReducer = (state: ReducedState = null, action: DbConnected) => {
    switch (action.type) {
        case DB_CONNECTED:
            return action.db;
        default:
            return state;
    }
};

export default dbReducer;
