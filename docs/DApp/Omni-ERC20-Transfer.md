---
sidebar_position: 4
---
#  Omni-ERC20-Transfer
notice: update your Vizing Package as least @vizing v1.1.5

First, merge the Vizing core contract as well as the IExpertHook interface contract into your Omni-DApp

```solidity
import {VizingOmniUpgradeable} from "@vizing/contracts/VizingOmni-upgradeable.sol";
import {VizingERC20HandlerUpgradeable} from "@vizing/contracts/extensions/VizingERC20Handler-upgradeable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SimultaneousTokenTransfer is
    Ownable,
    VizingOmniUpgradeable,
    VizingERC20HandlerUpgradeable
{
    constructor(address _vizingPad) Ownable(msg.sender) {
        __VizingOmniInit(_vizingPad);
        __VizingERC20HandlerInit(_vizingPad);
    }
}
```

Next, the user request is formatted on the source chain Omni-DApp and sent to the Vzing core contract. The following code demonstrates the transfer of ERC20 tokens at the same time as the destination contract interaction.

We divide the main process into 4 steps

```solidity
function bridgeMessageWithTokenTransfer(
	uint64 destChainId,
	address token,
	uint256 amount,
	string memory sendMessage
) external payable {
	address tokenSender = address(this);
	{
		// step 1: Approve ERC20 token to VizingERC20Receiver
		// Warming: please confirm the amount of approvement, **DO NOT USE** uint256 MAX
		if (token != NATIVE_ADDRESS) {
			IERC20(token).safeTransferFrom(msg.sender, tokenSender, amount);
			IERC20(token).approve(_vizingERC20Receiver(), amount);
		}
	}

	// step 2: Encode ERC20 transfer params
	bytes memory additionParams = _packetAdditionParams(
		token,
		tokenSender,
		amount
	);

	// setp 3: Encode message, basicly your business logic
	bytes memory message = _packetMessage(
		BRIDGE_MODE,
		mirrorMessage[destChainId],
		GAS_LIMIT,
		_fetchPrice(destChainId),
		abi.encode(sendMessage)
	);

	uint256 valueOut = token == NATIVE_ADDRESS ? amount : 0;

	// step 4: Send Omni-chain message to Vizing LaunchPad
	LaunchPad.Launch{value: msg.value}(
		minArrivalTime,
		maxArrivalTime,
		selectedRelayer,
		msg.sender,
		valueOut,
		destChainId,
		additionParams,
		message
	);
}
```


Please wait, the gas fee will be charged for vizing to send full chain messages. You can call the `_estimateVizingGasFee` method before starting the message. When you inherit VizingOmni contract, this method is already free to use.

In our example, many parameters are written in the function for the convenience of testing. Please develop them according to the actual situation in the specific business. Developers can get Vizing GasFee `fetchTransferFee` calling this method on-chain or off-chain

```solidity
    function fetchTransferFee(
        uint64 destChainid,
        address token,
        uint256 amount,
        string memory sendMessage
    ) public view returns (uint256) {
        bytes memory additionParams = PacketAdditionParams(
            ERC20_HANDLER,
            IExpertHook(LaunchPad.expertLaunchHook(ERC20_HANDLER))
                .getTokenInfoBase(token)
                .symbol,
            msg.sender,
            address(this),
            amount
        );
        bytes memory encodeMessage = abi.encode(sendMessage);
        bytes memory message = PacketMessage(
            BRIDGE_MODE,
            mirrorMessage[destChainid],
            GAS_LIMIT,
            _fetchPrice(destChainid),
            encodeMessage
        );
        return _estimateVizingGasFee(0, destChainid, additionParams, message);
    }
```

Receives messages on the destination chain. Note that on the target chain DApp, you need to grant the Vzing LandingPad permission to call the function.

**Just 1 setp to receive messages from the source chain**

```solidity
    // _receiveMessage is Inheritance from VizingOmni
    function _receiveMessage(
        uint64,
        /*srcChainId*/ uint256,
        /*srcContract*/ bytes calldata message
    ) internal virtual override {
        string memory m = abi.decode(message, (string));
        console.logString(m);
    }
```

After receiving the message, the LandingHook is triggered to execute. The hook obtains the current Landing status. The correct status triggers the ERC20 Transfer.

Please note that at present, the LandingHook event can only be triggered after receiving the message, that is, the token transfer can be completed at this moment.

If you need a deeper understanding of how to integrate Vizing Core Contracts, you can refer to the Demo we implemented: [vizing-core/contracts/DApps/SimultaneousErc20TokenTransfer]([vizing_npm_package/DApps/SimultaneousErc20TokenTransfer/SimultaneousTokenTransfer.sol at main · Orbiter-Vizing/vizing_npm_package (github.com)](https://github.com/Orbiter-Vizing/vizing_npm_package/blob/main/DApps/SimultaneousErc20TokenTransfer/SimultaneousTokenTransfer.sol))