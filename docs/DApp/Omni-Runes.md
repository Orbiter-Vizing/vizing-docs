---
sidebar_position: 3
---
# Omni-Runes

## 01 / Overview

Building upon the existing cross-rollup communication, we've extended functionalities to encompass runes minting and crossing.

The fundamental principle involves users submitting transactions containing basic runes information and the identification code for the target network to the Vizing's Relayer, These transactions are processed by the Vizing. On the target network, the Vizing's Relayer utilizes mint and cross functions to send runes to the user's address, completing the entire runes cross-rollup process.

Currently, this protocol early supports networks including Arbitrum One, Optimism, zkSync Era, Base, Linea, Scroll, and Polygon zkEVM. The Vizing collects a certain fee on the source network as the Runes Cross-rollup Protocol fee.

	
### Runes Minting

#### Deploy
> The rune contract can be deployed on any network. The `to` address of the recipient of the deployed contract transaction is the owner of the contract. With ownership of the contract, you can help anyone deploy the contract and set the owner to his address.

> Note: The protocol + tick will form a unique identifier in the entire network. If the contract protocol and tick you are not familiar with already exist, your deployment will be invalid.

```
{"r": "runes", "op": "deploy", "lim": "10000", "max": "xxxxx", "tick": "NAME"}
```
|  Field   | Required  | Remark  |
|  ----  | ----  | ---- |
| r  | YES | Ex:runes Supported Protocol |
| op  | YES | deploy|
| lim  | YES | Maximum casting amount for a single transaction |
| max  | YES | Maximum casting number times |
| tick  | YES | EX:GOOD•LUCK Runes' Name |
| symbol | YES | Rune's currency symbol |
| pre | YES | Premined quantity |
| end | YES | Mint end timestamp(ms) |
- Tick
  - Names consist of the letters A through Z and are between one and twenty-eight letters long. For example GOODLUCK is a rune name.
  - Names may contain spacers, represented as bullets, to aid readability. GOODLUCK might be etched as GOOD•LUCK.
  - The uniqueness of a name does not depend on spacers. Thus, a rune may not be etched with the same sequence of letters as an existing rune, even if it has different spacers.
  - Spacers can only be placed between two letters. Finally, spacers do not count towards the letter count.

#### Claim
> You can choose any network to select the target network, use the rune contract protocol information to initiate a claim transaction, and cast the rune contract you want on the target network simply and conveniently. The main method is to send fixed rune contract through the following rune protocol JSON data + The handling fee amount + security code are used as transaction data and are executed on the target network. This process does not require you to operate on the target network, and there is no handling fee.

> Note: When the Claim transaction is initiated, the `to` field of the on-chain transaction receiving address is the owner when the rune contract is deployed. For the rune protocol and tick you want to mint, the maximum minting amount for a single transaction must be within the parameters set by the deployment contract, otherwise your creation will not take effect.

- Basic data
```
{"r": "runes", "op": "claim", "amt": "1000", "tick": "NAME"}
```
|  Field   | Required  | Remark  |
|  ----  | ----  | ---- |
| r  | YES | Ex:runes Supported Protocol |
| op  | YES | claim Initiate Cross-Rollup Mint Action |
| tick  | YES | EX:GOOD•LUCK Runes' Name |
| amt  | YES | Ex:1000 Mint Amount |
- Casting fee and Identification Code
  - The casting fee is a fixed value, currently 0.00023ETH (or equivalent amount)
  - The identification code is determined internally by the protocol, and each network has a unique identification code identifier. The identification code identifier is consistent with the Vizing.
- Then the casting fee is 0.00023 + the identification code is 9001, then the value amount of the sent transaction should be set to: 0.0002300000000009001. As long as the casting fee is higher than the protocol casting fee and the last 4 digits of the protocol identification code are guaranteed, then the casting will go smoothly at the target network execution.


#### Mint
> This process does not require user participation. After the source network initiates a claim, the protocol node will automatically execute casting on the target network after the transaction is confirmed.

```
{"r": "runes", "fc": 9521, "op": "mint", "amt": "1000", "tick": "NAME"}
```
|  Field   | Required  | Remark  |
|  ----  | ----  | ---- |
| r  | YES | Ex:runes Supported Protocol |
| op  | YES | mint Complete Cross-Rollup Mint Action |
| tick  | YES | EX:GOOD•LUCK Runes' Name |
| amt  | YES | Ex:1000 Mint Amount |
| fc  | YES | Ex:1 InternalID of the Source Network|



### Runes Crossing

#### Cross
```
{"r": "runes", "op": "cross", "amt": "1000", "tick": "NAME"}
```
|  Field   | Required  | Remark  |
|  ----  | ----  | ---- |
| r  | YES | Ex:runes Supported Protocol |
| op  | YES | cross Initiate Cross Action |
| tick  | YES | EX:GOOD•LUCK Runes' Name |
| amt  | YES | Ex:1000 Cross Amount |

#### Crossover
```
{"r": "runes", "fc": 9521, "op": "crossover", "amt": "1000", "tick": "NAME"}
```
|  Field   | Required  | Remark  |
|  ----  | ----  | ---- |
| r  | YES | Ex:runes Supported Protocol |
| op  | YES | crossover Complete Cross Action |
| tick  | YES | EX:GOOD•LUCK Runes' Name|
| amt  | YES | Ex:1000 Cross Amount |
| fc  | YES | Ex:1 InternalID of the Source Network |


### Omni Runes API


#### 1. Runes deploy list

`GET` /runes/deploys

##### Request: `Object`

|  Field   | Required  | Remark  |
|  ----  | ----  | ---- |
| r  | NO | Ex:runes Supported Protocol |

##### Response: `Array[Object]`

|  Field   | Required  | Remark  |
|  ----  | ----  | ---- |
| r | YES | Ex:runes Supported Protocol |
| tick | YES | EX:GOOD•LUCK Runes' Name |
| lim  | YES | Maximum casting amount for a single transaction |
| max  | YES | Maximum circulation |
| c | YES | Deploy chain InternalID |
| t | YES | Deploy timestamp(UNIX) |
| accounts | YES | accounts mined all chain |
| mined | YES | Ex:`{1: {amount: 2000000, accounts: 100}}`, amount & accounts mined per chain |

#### 2. Runes transactions

`GET` /runes/transactions

##### Request: `Object`

|  Field   | Required  | Remark  |
|  ----  | ----  | ---- |
| r | YES | Ex:runes Supported Protocol |
| tick | YES | EX:GOOD•LUCK Runes' Name |
| account | NO | Account's address |
| t0 | NO | Start timestamp |
| t1 | NO | End timestamp |
| page | NO | Page index. Default: 1 |
| size | NO | Page size. Default: 10, max: 1000 |

##### Response: `Array[Object]`

|  Field   | Required  | Remark  |
|  ----  | ----  | ---- |
| r | YES | Ex:runes Supported Protocol |
| tick | YES | EX:GOOD•LUCK Runes' Name |
| op | YES | `mint` `transfer` `cross` |
| account | YES | Account's address |
| amt | YES | Ex:1000 Mint Amount. |
| fc | YES | Ex:1 InternalID of the Source Network |
| fh | YES | Hash of source network |
| tc | YES | Ex:2 InternalID of the Dest Network |
| th | YES | Hash of dest network |
| t | YES | Transaction timestamp |

#### 3. Runes ranks

`GET` /runes/ranks

##### Request: `Object`

|  Field   | Required  | Remark  |
|  ----  | ----  | ---- |
| r | YES | Ex:runes Supported Protocol |
| tick | YES | EX:GOOD•LUCK Runes' Name |
| page | NO | Page index. Default: 1 |
| size | NO | Page size. Default: 10, max: 1000 |

##### Response: `Array[Object]`

|  Field   | Required  | Remark  |
|  ----  | ----  | ---- |
| r | YES | Ex:runes Supported Protocol |
| tick | YES | EX:GOOD•LUCK Runes' Name |
| account | YES | Account's address |
| percentage | YES | Percentage of total amount |
| amount | YES | Amount of account |

#### 4. My mined Runes

`GET` /runes/account/mined

##### Request: `Object`

|  Field   | Required  | Remark  |
|  ----  | ----  | ---- |
| r | YES | Ex:runes Supported Protocol |
| tick | YES | EX:GOOD•LUCK Runes' Name |
| account | YES | Account's address |

##### Response: `Array[Object]`

|  Field   | Required  | Remark  |
|  ----  | ----  | ---- |
| r | YES | Ex:runes Supported Protocol |
| tick | YES | EX:GOOD•LUCK Runes' Name |
| account | YES | Account's address |
| mined | YES | Ex:`{1: 2000000,2: 300000}`, amount mined per chain |



### Supported Rollups
	Arbitrum One, Optimism, zkSync Era, Base, Linea, Scroll and Polygon zkEVM

