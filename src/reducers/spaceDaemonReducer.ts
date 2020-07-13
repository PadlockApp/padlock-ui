import { SPACEDAEMON_CONNECTED, SpaceDaemonConnected } from '../actions/types'
import { SpaceDaemonState } from './types';

const ffsReducer = (state: SpaceDaemonState = null, action: SpaceDaemonConnected) => {
    switch (action.type) {
        case SPACEDAEMON_CONNECTED:
            return action.spaceDaemon;
        default:
            return state;
    }
};

export default ffsReducer;
