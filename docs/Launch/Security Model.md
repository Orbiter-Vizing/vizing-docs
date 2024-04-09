---
sidebar_position: 2
---
# Security Model

## 01 / Ethereum Equivalent Security

The security of Vizing is rooted in Ethereum Layer 1 (L1). All user transactions (Tx) are ultimately recorded on the Ethereum L1, and the validity of these transactions on L2s can be efficiently verified on L1 through data availability.

## 02 / Margin Mechanism

To ensure the integrity and security of the protocol, both relayers and validators are required to stake significant amounts of margin. These funds are deposited into smart contracts and cannot be withdrawn arbitrarily during node operation. Instead, they serve as a safeguard for the protocol's security.

## 03 / Punishment Mechanism

- **Arbitration**: The protocol employs a stringent punishment mechanism. In cases of malicious behavior, all staked margins of the involved relayers and validators are confiscated to compensate for user losses.
    
- **Non-Responsiveness Penalty**: Relayers are required to promptly respond to requests for omni-Chain information forwarding. Failure to do so results in Vizing deducting the corresponding margin as a penalty.
    
## 04 / Relayer - Validator Separation

Users have the autonomy to select relayers for transmitting omni-Chain information by simply adding relayer address information on the original chain. This separation empowers users with flexibility and control over their omni-Chain interactions.
