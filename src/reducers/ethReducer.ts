import { ETH_CONNECTED, EthConnected } from '../actions/types';
import { EthState } from './types';

const ethReducer = (state: EthState = null, action: EthConnected) => {
  switch (action.type) {
    case ETH_CONNECTED:
      const { web3, contract, paymentContract } = action;
      return { web3, contract, paymentContract };
    default:
      return state;
  }
};

export default ethReducer;
