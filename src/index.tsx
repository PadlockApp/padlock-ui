import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { AccountProvider, BurnerWalletProvider, ErrorProvider } from "./service";

import App from './App';
import { initStore } from './store';
import { config } from "./config";

const store = initStore();

// graphql client
const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'https://api.thegraph.com/subgraphs/name/padlockapp/padlock',
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
});

ReactDOM.render(
  <Provider store={store}>
  <ErrorProvider>
    <BurnerWalletProvider config={config}>
        <AccountProvider>
          <ApolloProvider client={client as any}>
            <App />
          </ApolloProvider>
        </AccountProvider>
      </BurnerWalletProvider>
    </ErrorProvider>
  </Provider>,
  document.getElementById('root')
);
