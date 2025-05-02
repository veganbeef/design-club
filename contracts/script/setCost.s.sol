// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {DesignClub} from "../src/DesignClub.sol";

contract SetCostScript is Script {
    function run() external {
        // expects PRIVATE_KEY, DESIGN_CLUB_ADDRESS and NEW_COST in env
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address clubAddr = vm.envAddress("DESIGN_CLUB_ADDRESS");
        uint256 newCost = vm.envUint("NEW_COST");

        vm.startBroadcast(pk);
        DesignClub(clubAddr).setCost(newCost);
        vm.stopBroadcast();
    }
}
