export interface AppConfig {
  readonly httpUrl: string;
  readonly faucetUrl?: string;
  // codeId is the wasm codeId for the service contract on the given chain
  readonly codeId: number;
  readonly fees: {};
}

const customFees = {
  upload: {
    amount: [{ amount: "25000", denom: "uscrt" }],
    gas: "2000000",
  },
  init: {
    amount: [{ amount: "0", denom: "uscrt" }],
    gas: "500000",
  },
  exec: {
    amount: [{ amount: "0", denom: "uscrt" }],
    gas: "500000",
  },
  send: {
    amount: [{ amount: "2000", denom: "uscrt" }],
    gas: "80000",
  },
}

const local: AppConfig = {
  httpUrl: "http://localhost:1317",
  faucetUrl: "http://localhost:8000/credit",
  codeId: 1,
  fees: customFees,
};

// todo demo config
const demo: AppConfig = {
  httpUrl: "http://localhost:1317",
  faucetUrl: "http://localhost:8000/credit",
  codeId: 1,
  fees: customFees,
};

// REACT_APP_LOCAL is set via `yarn start:local`
const isLocal = process.env.NODE_ENV !== "production" && !!process.env.REACT_APP_LOCAL;

export const config = isLocal ? local : demo;