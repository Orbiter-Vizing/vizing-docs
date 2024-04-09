---
sidebar_position: 2
---
#  Integrating Vizing Core Contracts

Install the Vizing standard core contract package:

```cmd
npm install @Vizing/contracts
```

Incorporate Vizing core contracts into your Omni-DApp:

```solidity
import {VizingOmni} from "@Vizing/contracts/VizingStation.sol";
contract MyOmniChainDApp is VizingStation {
    constructor(address _vizingPad) VizingOmni(__vizingPad) {
	    // Logic
    }
}
```

When interacting with Vizing core contracts in your Omni-DApp, ensure that the Omni Message format is correct. You can refer to the table below to find the correct message format defined by Vizing.

| baseParams               | Type    | Parameter Definition                           |
| ------------------------ | ------- | ---------------------------------------------- |
| destChainId              | uint64  | Destination chain ID                           |
| earliestArrivalTimestamp | uint64  | Earliest arrival timestamp                     |
| latestArrivalTimestamp   | uint64  | Latest arrival timestamp                       |
| sender                   | uint256 | Sender address                                 |
| relayer                  | uint256 | Relayer address                                |
| additionalParams         | bytes   | Additional parameters for omni-chain protocols |
| usrMessage               | bytes   | Arbitrary information                          |

In the above table, the format of usrMessage is crucial. You can use custom formats for information without any issues, but you can also utilize the recommended Message format by Vizing to efficiently identify information and execute corresponding operations.

| usrMessage      | Type    | Parameter Definition                                             |
| --------------- | ------- | ---------------------------------------------------------------- |
| messageType     | bytes1  | Omni-Message mode                                                |
| activeContract  | uint256 | Target contract address                                          |
| executeGasLimit | uint24  | Prepaid gas fee for executing the signature                      |
| maxFeePerGas    | uint64  | EIP1559 standard, gasPrice reference for executing the signature |
| signature       | bytes   | Function signature to be executed                                |

Next, format the user request on the source chain Omni-DApp and send it to the Vizing core contract. The following code demonstrates minting tokens as an example:
```solidity
// example: mint token in other chain
function sendOmniMessage(
    uint256 amount, 
    uint64 destChainld, 
    uint256 contractAddr
) public {

    bytes memory encodeMessage = abi.encodePacked(
	    MESSSAGE_MODE,
	    DEFAULT_GASLIMIT,
	    DEFAULT_GASPRICE,
        contractAddr, 
        signature
    );
    
	bytes memory signature = abi.encodeCall(
		IMessageReceiver.receiveMessage,
		(LaunchPad.ChainId(), _fetchNonce(), msg.sender, encodeMessage)
	);
	
    IMessageStruct.launchSingleMsgParams memory Message = 
		earlistArrivalTimestamp: uint64(block.timestamp + minArrivalTime),
		latestArrivalTimestamp: uint64(block.timestamp + maxArrivalTime),
		relayer: DEFAULT_RELAYER,
		sender: msg.sender,
		value: 0,
		destChainld: destChainld,
		aditionParams: new bytes(0)
        message: signature
	});
    LaunchPad.Launch{value: msg.value}(Message);
}
```

Receive the message on the target chain. Note that on the target chain DApp, you need to grant permissions to the Vizing LandingPad to call this function.

```solidty
function receiveMessage(
	uint64 srcChainId,
	uint24 nonce,
	address sender,
	bytes calldata message
) internal virtual onlyLandingPad {
	(srcChainId, nonce, sender);
	// decode the message, args is for mint(address toAddress, uint256 amount)
	(address toAddress, uint256 amount) = abi.decode(
		message,
		(address, uint256)
	);
	mint(toAddress, amount);
}
```

Congratulations! With the completion of these simple steps, you now have an Omni-DApp. Great job!