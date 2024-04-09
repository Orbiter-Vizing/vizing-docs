---
sidebar_position: 2
---
# Omni-Fungible-Token

Through our Orbiter REST API, you can easily discover the best routes for cross-chain and bridges. Our comprehensive solution enables you to seamlessly swap or bridge assets between different blockchains. Additionally, our API support ERC20 tokens bridge, which are commonly known as Fungible tokens.

Our API is free to use, but there are rate limits. If you need more requests per second, request an API key.

## Obtaining support chains

```
var myHeaders = new Headers();
myHeaders.append("X-Channel-Identifier", "");
myHeaders.append("api-key", "");
var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

fetch("https://api.orbiter.finance/sdk/chains", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
```

### Results
```
{
  "status": "success",
  "message": "success",
  "params": {
    "url": "/sdk/chains",
    "method": "GET",
    "routes": {
      
    }
  },
  "result": [
    {
      "chainId": "1",
      "networkId": "1",
      "internalId": 1, // 内部ID
      "name": "Ethereum",
      "contract": { // 官方合约
        "0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc": "OBSource",
        "0x3be8b60ddf9feff6b2426e47a7619d7cbc786d97": "OrbiterRouterV1",
        "0xc741900276cd598060b0fe6594fbe977392928f4": "OrbiterRouterV3"
      },
      "nativeCurrency": {
        "name": "Ether",
        "symbol": "ETH",
        "decimals": 18,
        "coinKey": "ETH",
        "address": "0x0000000000000000000000000000000000000000"
      },
      "tokens": [
        {
          "name": "Ether",
          "symbol": "ETH",
          "decimals": 18,
          "coinKey": "ETH",
          "address": "0x0000000000000000000000000000000000000000",
          "isNative": true
        },
        {
          "name": "Dai Stablecoin",
          "symbol": "DAI",
          "decimals": 18,
          "coinKey": "DAI",
          "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
          "isNative": false
        },
        {
          "name": "USD Coin",
          "symbol": "USDC",
          "coinKey": "USDC",
          "decimals": 6,
          "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          "isNative": false
        },
        {
          "name": "Tether USD",
          "symbol": "USDT",
          "coinKey": "USDT",
          "decimals": 6,
          "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          "isNative": false
        },
        {
          "name": "Wrapped BTC",
          "symbol": "BTC",
          "coinKey": "BTC",
          "decimals": 8,
          "address": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
          "isNative": false
        }
      ],
      "contracts": [ 
        {
          "name": "OBSource",
          "address": "0xd9d74a29307cc6fc8bf424ee4217f1a587fbc8dc"
        },
        {
          "name": "OrbiterRouterV1",
          "address": "0x3be8b60ddf9feff6b2426e47a7619d7cbc786d97"
        },
        {
          "name": "OrbiterRouterV3",
          "address": "0xc741900276cd598060b0fe6594fbe977392928f4"
        },
        {
          "name": "TransitFinanceRouterV5",
          "address": "0x00000047bb99ea4d791bb749d970de71ee0b1a34"
        },
        {
          "name": "XBridge",
          "address": "0xfc99f58a8974a4bc36e60e2d490bb8d72899ee9f"
        },
        {
          "name": "Rubic",
          "address": "0x3335733c454805df6a77f825f266e136fb4a3333"
        }
      ]
    }
  ],
  ..........
}
```
## Request all supported routers
```
var myHeaders = new Headers();
myHeaders.append("X-Channel-Identifier", "");
myHeaders.append("api-key", "");
var requestOptions = {
   method: 'GET',
   headers: myHeaders,
   redirect: 'follow'
};

fetch("https://api.orbiter.finance/sdk/routers", requestOptions)
   .then(response => response.text())
   .then(result => console.log(result))
   .catch(error => console.log('error', error));
```
### Results
```
{
    "status": "success",
    "message": "success",
    "params": {
        "url": "/sdk/routers?dealerId=0xd2c68ad0a5d719e0ad2c602d5e879b8d9cdbb37b",
        "method": "GET",
        "routes": {}
    },
    "result": [
        {
            "line": "10/534352-ETH/ETH", // route
            "endpoint": "0x8086061cf07c03559fbb4aa58f191f9c4a5df2b2", // Maker endpoint
            "endpointContract": null, 
            "srcChain": "10", 
            "tgtChain": "534352", 
            "srcToken": "0x0000000000000000000000000000000000000000", // from token
            "tgtToken": "0x0000000000000000000000000000000000000000", // target token
            "maxAmt": "5", 
            "minAmt": "0.0062", 
            "tradeFee": "0.000000", 
            "withholdingFee": "0.0012", 
            "vc": "19105", // safecode
            "state": "available", // available or disabled
            "compRatio": 300000,
            "spentTime": 86399
        },
        ,
        .........
    ]


}
```
## Check Transaction Status
```
var myHeaders = new Headers();
myHeaders.append("X-Channel-Identifier", "2222");
myHeaders.append("api-key", "");

var requestOptions = {
   method: 'GET',
   headers: myHeaders,
   redirect: 'follow'
};
const hash = '0x1ee8b17a41a44872fb38f7708a44f37d96cb82b2ce3e160fdd2602298e88ba8e' // tx hash
fetch(`https://api.orbiter.finance/sdk/transaction/status/${hash}`, requestOptions)
   .then(response => response.text())
   .then(result => console.log(result))
   .catch(error => console.log('error', error));
```
### Results
```
{
    "status": "success",
    "message": "success",
    "params": {
        "url": "/sdk/transaction/status/0x1ee8b17a41a44872fb38f7708a44f37d96cb82b2ce3e160fdd2602298e88ba8e",
        "method": "GET",
        "routes": {
            "hash": "0x1ee8b17a41a44872fb38f7708a44f37d96cb82b2ce3e160fdd2602298e88ba8e"
        }
    },
    "result": {
        "chainId": "10", 
        "hash": "0x1ee8b17a41a44872fb38f7708a44f37d96cb82b2ce3e160fdd2602298e88ba8e",
        "sender": "0x8f69a8fc152a50ff575ee8676cd5ce685c56af0c", 
        "receiver": "0x80c67432656d59144ceff962e8faf8926599bcf8", 
        "amount": "0.019050000000009019", 
        "symbol": "ETH", 
        "timestamp": "2024-04-08T16:01:31.000Z", 
        "status": 2, // 2 = success， 3= fail
        "opStatus": 99, // 0 = Waiting for payment, SOURCE_CHAIN_OR_TOKEN_NOT_FOUND = 2, TARGET_CHAIN_OR_TOKEN_NOT_FOUND = 3,RULE_NOT_FOUND = 4,NONCE_EXCEED_MAXIMUM = 5,AMOUNT_TOO_SMALL = 6,BALANCED_LIQUIDITY = 10,REFUND = 80,REFUND_TOCHECK = 81, 96 = Entering payment, 97 = Return waiting for recovery, 98 = Payment successful, pending confirmation, 99 = Payment confirmation successful.
        "targetId": "0x9a8a8f4ea12dc03e5838d4d1a53329b47167bd51558d716f2bb97a8ddcdc5314", 
        "targetAmount": "0.017850000000000132", 
        "targetSymbol": "ETH", 
        "targetChain": "534352" 
    }
}
```

## Simulation the amount of the target chain
```
var myHeaders = new Headers();
myHeaders.append("X-Channel-Identifier", "");
myHeaders.append("api-key", "");

var requestOptions = {
   method: 'GET',
   headers: myHeaders,
   redirect: 'follow'
};
const line = 1/42161-ETH/ETH;
const nonce = 5000; 
const value = 45120000000009002;

fetch(`https://api.orbiter.finance/sdk/routers/simulation/receiveAmount?line=${line}&value=${value}&nonce=${nonce}`, requestOptions)
   .then(response => response.text())
   .then(result => console.log(result))
   .catch(error => console.log('error', error));
```
### Results
```
{
    "status": "success",
    "message": "success",
    "params": {
        "url": "/sdk/routers/simulation/receiveAmount?line=1/42161-ETH/ETH&value=45120000000009002&nonce=5000",
        "method": "GET",
        "routes": {}
    },
    "result": {
        "receiveAmount": "43910000000005000", 
        "router": { 
            "line": "1/42161-ETH/ETH",
            "endpoint": "0x80C67432656d59144cEFf962E8fAF8926599bCF8",
            "endpointContract": null,
            "srcChain": "1",
            "tgtChain": "42161",
            "srcToken": "0x0000000000000000000000000000000000000000",
            "tgtToken": "0x0000000000000000000000000000000000000000",
            "maxAmt": "10",
            "minAmt": "0.00125",
            "tradeFee": "150",
            "withholdingFee": "0.0012",
            "vc": "9002",
            "state": "available",
            "compRatio": 1,
            "spentTime": 60
        }
    }
}
```
