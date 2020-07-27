import { APOLLO_CONNECTED, ApolloConnected } from '../actions/types'
import { ApolloState } from './types';

const apolloReducer = (state: ApolloState = null, action: ApolloConnected) => {
    switch (action.type) {
        case APOLLO_CONNECTED:
            return action.client;
        default:
            return state;
    }
};

export default apolloReducer;
