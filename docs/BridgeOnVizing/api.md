---
sidebar_position: 3
---

# OPEN API

## Hosts

| network | host |
| ---- | ----|
| Mainnet | https://openapi.vizing.com |
| Testnet | https://testnet-openapi.vizing.com |

## APIs

| description | method | path |
| ---- | ----| ---- |
| Enabled Chains & Tokens | GET | /sdk/chains |
| Bridge Routers | GET | /sdk/routers/v2 |

### Enabled Chains & Tokens

```typescript
// result interfaces

export interface EnabledChainsAndTokens {
  chainId: string; // chain id
  networkId: string; // chain id from https://chainlist.org/, e.g. 8453
  internalId: number; // id from vizing, e.g. 21
  name: string; // chain name, e.g. Base
  nativeCurrency: Token; // chain native token, e.g. ETH
  tokens: Token[]; // support tokens
}

export interface Token {
  name: string; // token name, e.g. USD Base Coin
  symbol: string; // token symbol, e.g. USDC
  decimals: number; // token decimals, e.g. 6
  coinKey: string; // token key, e.g. USDC
  address: string; // token address, e.g. 0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA
  isNative: boolean; // this token is native token, e.g. false
}

```

### Bridge Routers

```typescript
// result interfaces

export interface Router {
  line: string; // router key, format string of `${sourceChainId}/${targetChainId}-${sourceTokenSymbol}/${targetTokenSymbol}`
  endpoint: string; // maker address
  endpointContract: any; // vizing router contract address
  srcChain: string; // source chain id
  tgtChain: string; // target chain id
  srcToken: string; // source token address
  tgtToken: string; // target token address
  maxAmt: string; // max amount pre bridge
  minAmt: string; // min amount pre bridge
  tradeFee: string; // bridge fee pre bridge
  withholdingFee: string; // withholding fee pre bridge
  vc: string; // security code
  state: string; // disabled / enabled
  compRatio: number;
  spentTime: number;
  tieredFee: any[];
}


```
