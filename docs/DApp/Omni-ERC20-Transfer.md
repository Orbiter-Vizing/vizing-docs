---
sidebar_position: 4
---
#  Omni-ERC20-Transfer
First, merge the Vising core contract as well as the IExpertHook interface contract into your Omni-DApp

```solidity
import {VizingOmniUpgradeable} from "../../VizingOmni-upgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IExpertHook, ExpertHookTransfer} from "../../interface/IExpertHook.sol";

contract SimultaneousTokenTransfer is
    Ownable,
    VizingOmniUpgradeable,
    ExpertHookTransfer
{
    // Don't forget to allow contracts to accept ETH to transfer from ETH to WETH.
    receive() external payable {}

    constructor(address _vizingPad) Ownable(msg.sender) {
        __VizingOmniInit(_vizingPad);
    }
}
```

Next, the user request is formatted on the source chain Omni-DApp and sent to the Vzing core contract. The following code demonstrates the transfer of ERC20 tokens at the same time as the destination contract interaction.

We divide the main process into 5 steps

```solidity
    // Step 1: config Omni-Message
    uint24 private constant GAS_LIMIT = 80000;

    bytes1 constant ERC20_HANDLER = 0x03;
    bytes1 constant BRIDGE_MODE = 0x01;

    uint64 public immutable override minArrivalTime;
    uint64 public immutable override maxArrivalTime;
    address public immutable override selectedRelayer;

    mapping(uint64 => address) public mirrorMessage;
    
    function bridgeMessageWithTokenTransfer(
        uint64 destChainId,
        address token,
        uint256 amount,
        string memory sendMessage
    ) external payable {
        // Used to calculate the total amount including fee
        // The user should transfer this amount
        uint256 totalAmount = computeTotalAmont(destChainid, token, amount);
        // Start when interchanging eth and weth
        bool isETH = IExpertHook(LaunchPad.expertLaunchHook(ERC20_HANDLER))
            .isETH(token);
        _tokenHandlingStrategy(
            token,
            msg.sender,
            address(this),
            totalAmount,
            isETH
        );

        // Step 2: encode args of AdditionParams (Token transfer details)
        bytes memory additionParams = PacketAdditionParams(
            ERC20_HANDLER,
            IExpertHook(LaunchPad.expertLaunchHook(ERC20_HANDLER))
                .getTokenInfoBase(token)
                .symbol,
            msg.sender,
            address(this),
            amount
        );

        // Step 3: encode args of dest-chain contract interface, 
        // and fetch dest-chain reciever signature
        bytes memory encodeMessage = abi.encode(sendMessage);
        
        
        // Step 4: finalize Omni-Message
        // PacketMessage is Inheritance from VizingOmni
        bytes memory message = PacketMessage(
            BRIDGE_MODE,
            mirrorMessage[destChainId],
            GAS_LIMIT,
            _fetchPrice(destChainId),
            encodeMessage
        );
				
        // Step 5: send Omni-Message 2 Vizing
        _bridgeTransferHandler(
            destChainId,
            message,
            additionParams,
            totalAmount,
            isETH
        );
    }
    
    // Need to calculate the tradefee of tokens  
    function computeTotalAmont(uint64 destChainid, address token, uint256 amount)
        public
        view
        returns (uint256 totalAmount)
    {
        totalAmount =
            IExpertHook(LaunchPad.expertLaunchHook(ERC20_HANDLER)).computeTotalAmont(destChainid, token, amount);
    }
    
    function _bridgeTransferHandler(
        uint64 destChainid,
        bytes memory message,
        bytes memory additionParams,
        uint256 totalAmount,
        bool isETH
    ) internal {
        uint256 padValue;
        if (isETH) {
            // When ETH is passed in, msg.value contains the amount 
            // that the user needs to convert into WETH, 
            // so the corresponding value needs to be subtracted here.
            padValue = msg.value - totalAmount;
        } else {
            padValue = msg.value;
        }

        this.emit2LaunchPad{value: padValue}(0, 0, selectedRelayer, msg.sender, 0, destChainid, additionParams, message);
    }
```

At the same time, in order to make the LaunchHook better handle the transfer logic, please implement the following functions

```solidity
    // _tokenTransferByHook is Inheritance from ExpertHookTransfer
    function _tokenTransferByHook(
        address token,
        address reveiver,
        uint256 amount
    ) internal virtual override {
        require(
            msg.sender == LaunchPad.expertLaunchHook(ERC20_HANDLER),
            "expertLaunchHook"
        );
        if (
            IExpertHook(LaunchPad.expertLaunchHook(ERC20_HANDLER)).isETH(token)
        ) {
            (bool sent, ) = payable(reveiver).call{value: amount}("");
            if (!sent) {
                revert Transfer_To_Hook();
            }
        } else {
            IERC20(token).safeTransfer(reveiver, amount);
        }
    }
```

Please wait, the gas fee will be charged for vizing to send full chain messages. You can call the `_estimateVizingGasFee` method before starting the message. When you inherit VizingOmni contract, this method is already free to use.

In our example, many parameters are written in the function for the convenience of testing. Please develop them according to the actual situation in the specific business. Developers can get Vising GasFee `fetchTransferFee` calling this method on-chain or off-chain

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

If you need a deeper understanding of how to integrate Vizing Core Contracts, you can refer to the Demo we implemented: [vizing-core/contracts/DApps/SimultaneousErc20TokenTransfer](https://github.com/Orbiter-Vizing/vizing-core/blob/main/contracts/DApps/SimultaneousErc20TokenTransfer/SimultaneousTokenTransfer.sol)