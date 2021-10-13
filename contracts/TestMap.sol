pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestMap is VRFConsumerBase, Ownable{
    // Custom 
    mapping (uint8 => 
        mapping (uint8 => 
            mapping (uint8 => 
                mapping (uint8 => 
                    mapping (uint8 => 
                        mapping (uint8 => 
                            address[]
                        )
                    )
                )
            )
        )
    ) players;
    address immutable ownerWallet = 0xD132d3bdA60ed9Edc4ca9F998D8b9B89ccd2AfC1;
    uint8[6] internal lastResult;
    
    event NewLotery(uint8[6] lastResult, bool vacancy, address[] winners);
    
    // Random
    address internal LinkAddress;
    bytes32 internal keyHash;
    uint256 internal fee;
    
    constructor(address _linkAddress, address _vrfCoordinator) 
        VRFConsumerBase(
            _vrfCoordinator, // 0xa555fC018435bef5A13C6c6870a9d4C11DEC329C, // VRF Coordinator BSC TESTNET
            _linkAddress  // LINK Token
        ) 
    {
        keyHash = 0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
        LinkAddress = _linkAddress;
    }
    
    /** 
     * Requests randomness 
     */
    function getRandomNumber() internal returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint8[6] memory randomNumbers;
        for(uint256 i = 0; i < 6; i++) {
            randomNumbers[i] = getResultFromRandomness(randomness, i);
        }
        lastResult = sortNumbers(randomNumbers);
        // Here we must verify if someone has win
        address[] memory winners = verifyIfWinners(
            lastResult[0],
            lastResult[1],
            lastResult[2],
            lastResult[3],
            lastResult[4],
            lastResult[5]
        );
        emit NewLotery(lastResult, winners.length>0, winners);
    }
    
    
    function withdrawLink() external onlyOwner {
        uint256 totalLinkBalance = IERC20(LinkAddress).balanceOf(address(this));
        IERC20(LinkAddress).transfer(ownerWallet, totalLinkBalance);
    }
    //-----------------------------------------------------
    
    
    function verifyIfWinners(
        uint8 first, 
        uint8 second, 
        uint8 third,
        uint8 forth,
        uint8 fifth,
        uint8 sixth
    ) internal view returns (address [] memory) {
        return players[first][second][third][forth][fifth][sixth];
    }
    
    function buyTicket(uint8[6] memory numbers) public returns(bool) {
        // TODO: prevent that an address cannot be duplicated
        numbers = sortNumbers(numbers);
        players[numbers[0]][numbers[1]][numbers[2]][numbers[3]][numbers[4]][numbers[5]].push(msg.sender);
        return true;
    }
    
    function getLastResult() public view returns(uint8[6] memory) {
        return lastResult;
    }
    
    function sortNumbers(uint8[6] memory numbers) internal pure returns(uint8[6] memory) {
        for (uint i = 0; i < 6; i++) {
            for (uint j = i+1; j < 6; j++) {
                if(numbers[i] > numbers[j]) {
                    uint8 temp = numbers[i];
                    numbers[i] = numbers[j];
                    numbers[j] = temp;
                }
            }
        }
        return numbers;
    }
    
    function getResultFromRandomness(uint256 randomness, uint256 i) internal pure returns (uint8){
        uint8 temp = uint8(uint256(keccak256(abi.encode(randomness, i))));
        if (temp > 45) {
            temp = temp % 45;
        }
        return temp;
        
    }
    
    function runLottery() public onlyOwner {
        getRandomNumber();
    }
}