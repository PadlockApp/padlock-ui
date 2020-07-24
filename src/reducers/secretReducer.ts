import { SECRET_CONNECTED, SecretConnected } from '../actions/types';
import { SecretState } from './types';

const dbReducer = (state: SecretState = null, action: SecretConnected) => {
  switch (action.type) {
    case SECRET_CONNECTED:
      return action.secretPair;
    default:
      return state;
  }
};

export default dbReducer;
