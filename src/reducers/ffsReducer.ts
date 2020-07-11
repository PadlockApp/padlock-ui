import { FFS_CONNECTED, FfsConnected } from '../actions/types'
import { ReducedState } from './types';

const ffsReducer = (state: ReducedState, action: FfsConnected) => {
    switch (action.type) {
        case FFS_CONNECTED:
            return action.ffs;
        default:
            return state;
    }
};

export default ffsReducer;
