import { FAILURE, Failure } from '../actions/types'
import { ErrorState } from './types';

const errorReducer = (state: ErrorState = '', action: Failure) => {
    switch (action.type) {
        case FAILURE:
            return action.error.message;
        default:
            return '';
    }
};

export default errorReducer;
