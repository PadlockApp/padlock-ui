import { WEB3_CONNECTED, Web3Connected } from '../actions/types';
import { Web3State } from './types';

const web3Reducer = (state: Web3State = null, action: Web3Connected) => {
  switch (action.type) {
    case WEB3_CONNECTED:
      return action.web3;
    default:
      return state;
  }
};

export default web3Reducer;
