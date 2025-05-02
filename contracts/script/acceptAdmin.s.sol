// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {DesignClub} from "../src/DesignClub.sol";

contract AcceptAdminScript is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address clubAddr = vm.envAddress("DESIGN_CLUB_ADDRESS");

        vm.startBroadcast(pk);
        DesignClub(clubAddr).acceptAdmin();
        vm.stopBroadcast();
    }
}
