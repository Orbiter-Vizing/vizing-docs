---
sidebar_position: 2
---
# Cook Book

## Bridge Assets Cook Book

EOA Method (Native Token): Transfer your assets to a maker address and the value end with security code.

Contract Method: Call the Vizing Bridge Router Contract with target parameters.

:::info TIPS

- More about bridge router contract: [Bridge Router Contract](/docs/BridgeOnVizing/router-contract)
- Get the value of parameters from: [Bridge API](/docs/BridgeOnVizing/api)
- Function stringToHex: [Utils](/docs/API/utils)

:::

### EOA Method

#### Native Token From EVM Chain

```typescript
import { JsonRpcProvider, TransactionLike, Wallet, parseEther } from 'ethers';
const provider = new JsonRpcProvider('https://arb1.arbitrum.io/rpc');
const wallet = new Wallet('YOUR WALLET PRIVATE KEY', provider);
const maker = '0x454d5dc8956c468111e3e31315ac2b38b03bf576'; // get from API
const securityCode = '9561'; // get from API
const value = parseEther(`0.12340000000${securityCode}`);
const req: TransactionLike = {
    from: wallet.address,
    to: maker,
    value,
};
const transactionRequest = await wallet.populateTransaction(req);
const result = await wallet.sendTransaction(transactionRequest);
console.log(result.hash);
```

#### Native Token From TON Chain

```typescript
import TonWeb from 'tonweb';
import { mnemonicToPrivateKey } from '@ton/crypto';

const tonweb = new TonWeb(
    new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {
        apiKey: 'YOUR toncenter API KEY',
    }),
);
const maker = '0QAiG3F5if_eAoyp8B_w6tQoDZ8LBqPPdk5NGybavLeGfJrG'; // get from API
const securityCode = '9561'; // get from API
const receiver = 'YOUR RECEIVER ADDRESS FROM TARGET CHAIN';

const destinationAddress = new TonWeb.Address(maker);
const comment = `c=${securityCode}&t=${receiver}`;

const keyPair = await mnemonicToPrivateKey(privateKey.split(' '));
const wallet = new tonweb.wallet.all['v4R2'](tonweb.provider, {
    publicKey: keyPair.publicKey,
    wc: 0, // work chain
});
const seqno = await wallet.methods.seqno().call();
const rs = await wallet.methods
    .transfer({
        secretKey: keyPair.secretKey,
        toAddress: destinationAddress,
        amount: tonweb.utils.toNano('1.234'),
        seqno,
        payload: comment,
        sendMode: 3,
    })
    .send();
console.log('r', rs);
```

### Contract Method

#### Contract From EVM Chain

```typescript
import { JsonRpcProvider, TransactionLike, Wallet, parseEther } from 'ethers';
import * as VizingRouterAbi from '../abis/VizingRouterAbi.json';
import * as ERC20Abi from '../abis/ERC20Abi.json';

const provider = new JsonRpcProvider('https://arb1.arbitrum.io/rpc');
const wallet = new Wallet('YOUR WALLET PRIVATE KEY', provider);
await wallet.connect(provider);

const router = '0x78606Ea26275F6180745480FaF74E311586EB652'; // get from API
const maker = '0x454d5dc8956c468111e3e31315ac2b38b03bf576'; // get from API
const securityCode = '9556'; // get from API
const usdt = '0x5da066443180476e8f113546a0d112517d0d4915'; // get from API or official information

const value = 1234n;
const receiver = wallet.address;

const erc20 = new Contract(usdt, ERC20Abi, wallet);
const auth = await erc20.approve(router, value);
await auth.wait();

const ifa = new Interface(VizingRouterAbi);
const str = `c=${securityCode}&t=${receiver}`;
const strHex = stringToHex(str);
const parameters = [usdt, maker, value, strHex];
const data = ifa.encodeFunctionData('transferToken', parameters);
const req: TransactionLike = {
    from: wallet.address,
    to: router,
    value: 0n,
    data,
};
const transactionRequest = await wallet.populateTransaction(req);
const result = await wallet.sendTransaction(transactionRequest);
console.log(result.hash);
```

#### Contract From TON

```typescript
import TonWeb from 'tonweb';
import { mnemonicToPrivateKey } from '@ton/crypto';

const tonweb = new TonWeb(
    new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {
        apiKey: 'YOUR toncenter API KEY',
    }),
);
const maker = '0QAiG3F5if_eAoyp8B_w6tQoDZ8LBqPPdk5NGybavLeGfJrG'; // get from API
const securityCode = '9561'; // get from API
const usdt = '0QBZgTayvLA-8MfIWmHbx5gQ6U5TUNhU43UXiYF1wzf6WJSf'; // get from API or official information
const receiver = 'YOUR RECEIVER ADDRESS FROM TARGET CHAIN';

const destinationAddress = new TonWeb.Address(maker);
const comment = `c=${securityCode}&t=${receiver}`;
const nonce = 1;

const forwardPayload = new TonWeb.boc.Cell();
forwardPayload.bits.writeUint(0, 32);
forwardPayload.bits.writeString(comment);

const jettonTransferBody = new TonWeb.boc.Cell();
jettonTransferBody.bits.writeUint(0xf8a7ea5, 32);
jettonTransferBody.bits.writeUint(randomId, 64);
jettonTransferBody.bits.writeCoins(new TonWeb.utils.BN('1.234'));
jettonTransferBody.bits.writeAddress(destinationAddress);
jettonTransferBody.bits.writeAddress(destinationAddress);
jettonTransferBody.bits.writeBit(false);
jettonTransferBody.bits.writeCoins(TonWeb.utils.toNano('0'));
jettonTransferBody.bits.writeBit(true);
jettonTransferBody.refs.push(forwardPayload);

const keyPair = await mnemonicToPrivateKey('YOUR TON PRIVATE KEY'.split(' '));
const wallet = new tonweb.wallet.all['v4R2'](tonweb.provider, {
publicKey: keyPair.publicKey,
wc: 0, // work chain
});
const walletAddress = await wallet.getAddress();

const jettonMinter = new TonWeb.token.jetton.JettonMinter(
tonweb.provider,
{
    address: usdt,
} as any,
);
const jettonWalletAddr = await jettonMinter.getJettonWalletAddress(walletAddress);
const jettonWallet = new TonWeb.token.ft.JettonWallet(tonweb.provider, {
address: jettonWalletAddr,
});

const seqno = await wallet.methods.seqno().call();
const rs = await wallet.methods
.transfer({
    secretKey: keyPair.secretKey,
    toAddress: jettonWallet.address,
    amount: tonweb.utils.toNano('0.1'),
    seqno,
    payload: jettonTransferBody,
    sendMode: 3,
})
.send();
console.log('r', rs);
return JSON.stringify(rs);
```
