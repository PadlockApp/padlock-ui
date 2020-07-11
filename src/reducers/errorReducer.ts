import { FAILURE, Failure } from '../actions/types'
import { ReducedState } from './types';

const errorReducer = (state: ReducedState, action: Failure) => {
    switch (action.type) {
        case FAILURE:
            return action.error.message;
        default:
            return '';
    }
};

export default errorReducer;
