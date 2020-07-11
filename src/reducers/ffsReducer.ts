import { FFS_CONNECTED, FfsConnected } from '../actions/types'
import { FfsState } from './types';

const ffsReducer = (state: FfsState = null, action: FfsConnected) => {
    switch (action.type) {
        case FFS_CONNECTED:
            return action.ffs;
        default:
            return state;
    }
};

export default ffsReducer;
