import { DB_CONNECTED, DbConnected } from '../actions/types'
import { ThreadState } from './types';

const dbReducer = (state: ThreadState = null, action: DbConnected) => {
    switch (action.type) {
        case DB_CONNECTED:
            return action.thread;
        default:
            return state;
    }
};

export default dbReducer;
