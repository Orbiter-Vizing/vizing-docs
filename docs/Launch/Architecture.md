---
sidebar_position: 1
---

# Architecture
![Architecture](../images/Architecture.png)
## 01 / On-Chain Components

**Vizing Network** is a decentralized and efficient information Omni-Chain transfer network composed of various components. Let's dive into the key components in detail to help you understand how Vizing achieves efficient Omni-Chain communication.

**LaunchPad**: The LaunchPad serves as the central hub for sending Omni-Chain information. It can receive information in any format and facilitates its seamless Omni-Chain forwarding.

**LandingPad**: The LandingPad acts as the receiving center for Omni-Chain information. Here, the received Omni-Chain information undergoes final verification before being forwarded to the designated DApp.

**ValidationPad**: The ValidationPad functions as the validation center for Omni-Chain information. It acts as an intermediary for all Omni-Chain information, ensuring its integrity and authenticity. Eventually, the validated information becomes part of the Layer2 Rollup and gets confirmed on the Ethereum mainnet.

## 02 / Off-Chain Components

Vizing places significant importance on off-chain components. Unlike on-chain components, the focus here is on the decentralized nature of these components, which makes a valuable contribution to the decentralized network.

**Validator**: Validators play a crucial role in ensuring the security of Omni-Chain information. Obtaining the Validator status requires staking, granting validators access to all Omni-Chain information and the authority to sign the information. Omni-Chain information from any chain must be signed by Validators and published on the Vizing Layer2 to enable its Omni-Chain transfer capability.

**Relayer**: Relayers act as messengers for transmitting Omni-Chain information. Once you acquire the Validator status, consider obtaining the Relayer status as well. Vizing grants Relayers the permission to forward Omni-Chain information, allowing them to actively participate in the interaction among the on-chain components.

**Validators Network**: In Vizing, Omni-Chain information requests go through multiple Validators for validation and signature before being confirmed and forwarded by Relayers to the target network. The confirmation of message delivery is determined by obtaining the majority of signatures from Validators, typically using a 2/3 consensus mechanism.

**API**: The API provides detailed information on using Vizing for Omni-Chain communication, allowing developers to integrate and utilize Vizing's capabilities effectively.

## 03 / Vizing Rollup

Vizing is built on top of Layer2 Rollup, enhancing it's security and providing exceptional advantages.

**Vizing Rollup**: Vizing introduces it's own Layer2 network called Vizing Rollup, which is driven by zk technology. Serving as an entry point for the Vizing protocol, Vizing Rollup acts as a hub for validator staking, ensuring enhanced decentralization and security. All omni-chain message transmitted through the Vizing protocol is routed to Vizing Rollup, where it undergoes Validum proof and ultimately receives confirmation on the Ethereum mainnet. This seamless integration with Layer2 Rollup guarantees scalability, efficiency, and robust security for the Vizing protocol.

With its comprehensive architecture and components, Vizing empowers developers to build robust and efficient web3 Omni-Chain protocols, enabling seamless interoperability across different blockchain networks.

you can [find more Vizing resources here.](/docs/BuildOnVizing/DevelopmentEnvironment)