---
sidebar_position: 2
---
#  Integrating Vizing Core Contracts

Install the Vizing standard core contract package:

```cmd
npm install @vizing/contracts
```

Incorporate Vizing core contracts into your Omni-DApp:

```solidity
import {VizingOmni} from "@Vizing/contracts/VizingStation.sol";
contract MyOmniChainDApp is VizingOmni {
    constructor(address _vizingPad) VizingOmni(_vizingPad) {
	    // Logic
    }
}
```

When interacting with Vizing core contracts in your Omni-DApp, ensure that the Omni Message format is correct. You can refer to the table below to find the correct message format defined by Vizing.

```solidity
// code path:`@vizing/contracts/interface/IMessageChannel.sol` 

function Launch(
	uint64 earliestArrivalTimestamp,
	uint64 latestArrivalTimestamp,
	address relayer,
	address sender,
	uint256 value,
	uint64 destChainid,
	bytes calldata additionParams,
	bytes calldata message
) external payable;
```

| baseParams | Type | Parameter Definition |
| ---- | ---- | ---- |
| earliestArrivalTimestamp | uint64 | the earliest arrival time of the message, set 0 to process this message ASAP |
| latestArrivalTimestamp | uint64 | the latest arrival time of the message, set 0 to process this message ASAP |
| relayer | uint256 | message relayer, forwards the message to the target chain |
| sender | uint256 | the message sender |
| value | uint256 | native token amount, will be sent to the target contract |
| destChainid | uint64 | Destination chain ID |
| additionalParams | bytes | Additional parameters for omni-chain protocols |
| ==usrMessage== | bytes | Arbitrary information  **(details in next chart)** |

In the above table, the format of usrMessage is crucial. You can use custom formats for information without any issues, but you can also utilize the recommended Message format by Vizing to efficiently identify information and execute corresponding operations.

| ==usrMessage== | Parameter Definition |
| ---- | ---- |
| messageType | Omni-Message mode |
| activeContract | Target contract address |
| executeGasLimit | Prepaid gas fee for executing the signature |
| maxFeePerGas | EIP1559 standard, gasPrice reference for executing the signature |
| signature | Function signature to be executed |
``` solidity
///
///    bytes                         
///   message  = abi.encodePacked(
///         byte1           uint256         uint24        uint64        bytes
///     messageType, activateContract, executeGasLimit, maxFeePerGas, signature
///   )
///
```

choose your Omni-message send mode
```
// code path:`@vizing/contracts/library/MessageTypeLib.sol` 

bytes1 constant DEFAULT = 0x00;
bytes1 constant SDK_ACTIVATE_V1 = 0x01;
bytes1 constant ARBITRARY_ACTIVATE = 0x02;
bytes1 constant MESSAGE_POST = 0x03;
bytes1 constant MAX_MODE = 0xFF;
```

| item | Parameter Definition |
| ---- | ---- |
| DEFAULT | 🚧🚧under construction🚧🚧 |
| SDK_ACTIVATE_V1 | 🚧🚧under construction🚧🚧 |
| ARBITRARY_ACTIVATE | interact with destination contract |
| MESSAGE_POST | post message in destination chain |

Next, format the user request on the source chain Omni-DApp and send it to the Vizing core contract. The following code demonstrates minting tokens as an example.

**We split the main process into 5 steps**
```solidity
// example: mint token in other chain
function sendOmniMessage(
	address receiver
    uint256 amount, 
    uint64 destChainld, 
    uint256 contractAddr
) public {
	// step 1: config Omni-Message
	bytes1 messageMode = "0x02";
	uint24 gasLimit = 30000;
	uint64 gasPrice = 50 gwei;
	uint64 earliestArrivalTimestamp = (uint64(block.timestamp) + 3 minutes);
	uint64 latestArrivalTimestamp = (uint64(block.timestamp) + 1000 minutes);
	address selectedRelayer = address(0);
	bytes additionParams = new bytes(0);
	uint256 transferValue = 0.001 ethers;
	

	// step 2: encode args of dest-chain contract interface
	// in destination chain, **receiver** will get **amount** token
	bytes memory message = abi.encode(
		receiver,
		amount
	);

	// step 3: fetch dest-chain reciever signature
	// _fetchSignature is Inheritance from VizingOmni
	bytes memory signature =  _fetchSignature(message);

	// step 4: finalize Omni-Message
	// PacketMessage is Inheritance from VizingOmni
    bytes memory encodedMessage = PacketMessage(
	    messageMode,
	    gasLimit,
	    gasPrice,
        contractAddr, 
        signature
    );

	// step 4.1 (Optional) obtain Vizing GasFee
	// explained in next section
	uint256 gasFee = fetchOmniMessageFee(
		transferValue,
		destChainId,
		additionParams,
		encodedMessage
	)
	require(msg.value >= gasFee + transferValue);
    
	// step 5: send Omni-Message 2 Vizing
	// emit2LaunchPad is Inheritance from VizingOmni
	emit2LaunchPad(
		earliestArrivalTimestamp,
		latestArrivalTimestamp,
		selectedRelayer,
		msg.sender,
		transferValue,
		destChainId,
		additionParams,
		encodedMessage
	);
}
```

Please wait, vizing will charge gas fees for sending omni-chain messages. Before launching the message, you can call the `estimateGas` method. This method can already be used freely when you inherit the VizingOmni contract.

in our case, `encodedMessage` is generated by step 4 of the code above.Developers can call the `fetchOmniMessageFee` method on or off the chain to obtain Vizing GasFee
```solidity
function fetchOmniMessageFee(
    uint256 value,
	uint64 destChainid,
	bytes calldata additionParams,
	bytes calldata encodedMessage
) public view virtual override returns (uint256) {
    return
        LaunchPad.estimateGas(
            value,
            destChainid,
            additionParams,
            encodedMessage
        );
}
```

Receive the message on the target chain. Note that on the target chain DApp, you need to grant permissions to the Vizing LandingPad to call this function.

**only take 1 setp to recieve the message from source chain.**
```solidty
// _receiveMessage is Inheritance from VizingOmni
function _receiveMessage(
	uint64 srcChainId,
	uint24 nonce,
	address sender,
	bytes calldata message
) internal virtual  {
	(srcChainId, nonce, sender);
	// decode the message, args is for mint(address toAddress, uint256 amount)
	(address receiver, uint256 amount) = abi.decode(
		message,
		(address, uint256)
	);
	mint(receiver, amount);
}
```

If you need a deeper understanding of how to integrate Vizing Core Contracts, you can refer to the Demo we implemented: [vizing-core/contracts/DApps/OminiToken](https://github.com/Orbiter-Vizing/vizing-core/blob/main/contracts/DApps/OminiToken/OmniTokenCore.sol)

Congratulations! With the completion of these simple steps, you now have an Omni-DApp. Great job!