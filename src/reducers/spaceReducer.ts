import { SPACE_CONNECTED, SpaceConnected } from '../actions/types'
import { SpaceState } from './types';

const dbReducer = (state: SpaceState = null, action: SpaceConnected) => {
    switch (action.type) {
        case SPACE_CONNECTED:
            return action.space;
        default:
            return state;
    }
};

export default dbReducer;
